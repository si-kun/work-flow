import { getShiftsByUserAndMonth } from "@/actions/shifts/getShiftsByUserAndMonth";
import { ShiftSettingEvent, ShiftType } from "@/constants/calendarColor";
import { useEffect, useRef, useState } from "react";
import { useYearMonth } from "../useYearMonth";
import { DateClickArg } from "@fullcalendar/interaction/index.js";
import { EventClickArg } from "@fullcalendar/core/index.js";
import { createShift } from "@/actions/shifts/createShift";
import { toast } from "sonner";
import { ShiftTargetUser } from "./useShiftListData";


interface UseShiftDialogProps {
  userShiftData: ShiftTargetUser[];
  setUserShiftData: React.Dispatch<React.SetStateAction<ShiftTargetUser[]>>;
  onSaveSuccess?: () => Promise<void>;
}

export const useShiftDialog = ({
  userShiftData,
  setUserShiftData,
  onSaveSuccess,
}: UseShiftDialogProps) => {
  const { year, month, handleYearChange, handleMonthChange } = useYearMonth();
  // =============== 状態管理 =============== //
  const [workType, setWorkType] = useState<ShiftType | null>(null);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [calendarKey, setCalendarKey] = useState<number>(0); // カレンダーの再レンダリング用キー

  // カレンダーのイベント
  const [events, setEvents] = useState<ShiftSettingEvent[]>([]);

  // シフトの基準となるユーザーを選択
  const [baseUserId, setBaseUserId] = useState<string>("");

  // 各ユーザーの編集中のシフトを保存
  const [editingShifts, setEditingShifts] = useState<
    Map<string, ShiftSettingEvent[]>
  >(new Map());

  const [targetuserIds, setTargetUserIds] = useState<string[]>([]);

  // =============== ref =============== //
  const isUpdatingFromCalendar = useRef(false);

  // =============== 派生値 =============== //
  // 選択されているユーザーを表示
  const selectedUsers = userShiftData.filter((user) => user.select);

  // 選択されているユーザーのID配列
  const ids = selectedUsers.map((user) => user.id);

  const baseUserName =
    selectedUsers.find((user) => user.id === baseUserId)?.name ?? "";

  const triggerDisabled = selectedUsers.length === 0;

  // =============== 関数 =============== //
  // リセット処理をまとめる
  const resetDialog = () => {
    setLoading(false);
    setWorkType(null);
    setDeleteMode(false);
    setHasChanges(false);
    setEvents([]);
    setBaseUserId("");
    setTargetUserIds([]);
    setEditingShifts(new Map());
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // 未保存の変更がある場合は確認
      if (hasChanges) {
        const confirmed = window.confirm(
          "保存されていない変更があります。閉じてもよろしいですか？"
        );

        if (!confirmed) {
          return; // キャンセルされたら何もしない（ダイアログは開いたまま）
        }
      }

      resetDialog();
    }
    setIsOpen(open);
  };

  // ボタンを押して選択した勤怠タイプをセット
  const handleWorkTypeSelect = (type: ShiftType) => {
    // 削除モードが有効の場合は無効にしてからtypeをセット
    if (deleteMode) {
      setDeleteMode(false);
      setWorkType(type);
    } else {
      setWorkType(type);
    }
  };

  // 削除モードの切り替え
  const handleDeleteModeToggle = () => {
    setDeleteMode((prev) => !prev);
    setWorkType(null);
  };

  // 日付をクリックして選択した勤怠タイプでイベントを追加
  const handleClickDate = (info: DateClickArg) => {
    if (!workType) {
      alert("先に勤怠タイプを選択してください。");
      return;
    }

    // イベントが既に存在しているかどうか
    const eventExists = events.findIndex(
      (event) => event.start === info.dateStr
    );

    if (eventExists !== -1) {
      // 既存のイベントを更新
      setEvents((prev) => {
        const updatedEvents = [...prev];
        updatedEvents[eventExists] = {
          title: workType,
          start: info.dateStr,
          end: info.dateStr,
          allDay: true,
        };
        console.log("Updated event:", updatedEvents[eventExists]);
        return updatedEvents;
      });
      setHasChanges(true);
    } else {
      // 新規イベントを追加
      const newEvent: ShiftSettingEvent = {
        title: workType,
        start: info.dateStr,
        end: info.dateStr,
        allDay: true,
      };
      setEvents((prev) => [...prev, newEvent]);
      setHasChanges(true);
    }
  };

  // eventをクリックしたら削除
  const handleEventClick = (info: EventClickArg) => {
    if (deleteMode) {
      setEvents((prev) =>
        prev.filter((event) => event.start !== info.event.startStr)
      );
    }
  };

  const copyShiftData = () => {
    const baseShifts = editingShifts.get(baseUserId);
    if (!baseShifts) return;

    setEditingShifts((prev) => {
      const newMap = new Map(prev);

      // ループ内で全部セット
      for (const userId of targetuserIds) {
        if (userId === baseUserId) continue;
        newMap.set(userId, baseShifts);
      }

      return newMap; // 最後に一度だけ返す
    });
  };

  const submitShiftData = async () => {

    setLoading(true);

    try {
      for (const userId of ids) {
        const userShifts = editingShifts.get(userId);

        // ユーザーがなければスキップ
        if (!userShifts || userShifts.length === 0) continue;

        const submitData = {
          shifts: userShifts.map((event) => ({
            shiftType: event.title as ShiftType,
            dates: [event.start],
          })),
        };

        // 一人ずつ保存
        const result = await createShift({
          userIds: [userId],
          shifts: submitData.shifts,
          year,
          month,
        });

        if (!result.success) {
          toast.error(result.message || "シフトの保存に失敗しました。");
          return;
        }
      }

      if(onSaveSuccess) {
        await onSaveSuccess();
      }
      setUserShiftData((prev) =>
        prev.map((user) => ({
          ...user,
          select: false,
        }))
      );
      setIsOpen(false);
      setBaseUserId("");
      setTargetUserIds([])
      setEvents([])
      setEditingShifts(new Map());
      toast.success("シフトを保存しました。");
    } catch (error) {
      toast.error("シフトの保存中にエラーが発生しました。");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =============== useEffect =============== //
  //基準のユーザーが変わったらDBから対象のシフトを取得、setEditingShiftsにも保存
  useEffect(() => {
    const fetchBaseUserShift = async () => {
      try {
        if (!baseUserId) return;

        // editingShiftsに既にデータがあればそれを使う
        const savedShifts = editingShifts.get(baseUserId);
        if (savedShifts) {
          setEvents(savedShifts);
          return;
        }

        // サーバーアクションを呼び出す
        const result = await getShiftsByUserAndMonth({
          userId: baseUserId,
          year,
          month,
        });

        if (result.success) {
          // 取得したシフトデータをカレンダーイベントに変換してセットする
          console.log("Fetched shifts:", result.data);
          const formattedShifts = result.data.map((shift) => ({
            title: shift.shiftType,
            start: shift.date.toISOString().split("T")[0],
            end: shift.date.toISOString().split("T")[0],
            allDay: true,
          }));
          setEvents(formattedShifts);
        }
      } catch (error) {
        console.error("Error fetching base user shifts:", error);
      }
    };
    fetchBaseUserShift();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUserId, year, month]);

  // eventsが変更されたら、editingShiftsも更新
  useEffect(() => {
    if (!baseUserId) return;

    setEditingShifts((prev) => {
      const newMap = new Map(prev);
      newMap.set(baseUserId, events);
      return newMap;
    });
  }, [events, baseUserId]);

  // ダイアログが開いた時にカレンダーを再描画、idsをセット
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setTargetUserIds(ids);

      // 少し遅延させて再描画
      const timer = setTimeout(() => {
        setLoading(false);
        setCalendarKey((prev) => prev + 1);
      }, 300);

      return () => clearInterval(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return {
    workType,
    setWorkType,
    deleteMode,
    setDeleteMode,
    hasChanges,
    setHasChanges,
    loading,
    setLoading,
    isOpen,
    handleOpenChange,
    calendarKey,
    events,
    handleClickDate,
    handleEventClick,
    baseUserId,
    setBaseUserId,
    selectedUsers,
    baseUserName,
    triggerDisabled,
    handleWorkTypeSelect,
    handleDeleteModeToggle,
    copyShiftData,
    submitShiftData,
    targetuserIds,
    setTargetUserIds,
    year,
    month,
    handleYearChange,
    handleMonthChange,
    isUpdatingFromCalendar,
  };
};
