import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { convertWorkTypeToJapanese } from "@/lib/convertToJapanese";
import SelectYearMonth from "../common/SelectYearMonth";
import { useYearMonth } from "@/hooks/useYearMonth";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import jaLocale from "@fullcalendar/core/locales/ja";
import {
  EVENT_COLORS_BUTTON,
  ShiftType,
  ShiftSettingEvent,
} from "@/constants/calendarColor";
import { Spinner } from "../ui/spinner";
import { createShift } from "@/actions/attendance/shift/createShift";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getShiftsByUserAndMonth } from "@/actions/shifts/getShiftsByUserAndMonth";

interface ShiftCreateDialogProps {
  userShiftData: {
    id: string;
    name: string;
    department: string;
    position: string;
    shift_type: string;
    work_status: string;
    select: boolean;
  }[];
  setUserShiftData: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        name: string;
        department: string;
        position: string;
        shift_type: string;
        work_status: string;
        select: boolean;
      }[]
    >
  >;
}

const ShiftCreateDialog = ({
  userShiftData,
  setUserShiftData,
}: ShiftCreateDialogProps) => {
  const { year, month, handleYearChange, handleMonthChange } = useYearMonth();

  const [workType, setWorkType] = useState<ShiftType | null>(null);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [calendarKey, setCalendarKey] = useState<number>(0); // カレンダーの再レンダリング用キー

  // カレンダーのイベント
  const [events, setEvents] = useState<ShiftSettingEvent[]>([]);

  // 選択されているユーザーを表示
  const selectedUsers = userShiftData.filter((user) => user.select);

  // 選択されているユーザーのID配列
  const ids = selectedUsers.map((user) => user.id);

  // シフトの基準となるユーザーを選択
  const [baseUserId, setBaseUserId] = useState<string>("");
  // シフトの基準となるユーザー
  const [baseUser, setBaseUser] = useState<string>("");

  const baseUserName = selectedUsers.find(
    (user) => user.id === baseUserId
  )?.name;

  // 対象のユーザーを選択
  const [targetuserIds, setTargetUserIds] = useState<string[]>([]);

  // 各ユーザーの編中シフトを保存
  const [editingShifts, setEditingShifts] = useState<
    Map<string, ShiftSettingEvent[]>
  >(new Map());

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
        // ユーザーをセット
        setBaseUser(
          selectedUsers.find((user) => user.id === baseUserId)?.name || ""
        );
      } catch (error) {
        console.error("Error fetching base user shifts:", error);
      }
    };
    fetchBaseUserShift();
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

  // 読み込み時の対象のユーザー

  // リセット処理をまとめる
  const resetDialog = () => {
    setLoading(true);
    setWorkType(null);
    setDeleteMode(false);
    setHasChanges(false);
    setEvents([]);
    setBaseUserId("");
    setTargetUserIds([]);
    setEditingShifts(new Map());
  };

  const triggerDisabled = selectedUsers.length === 0;

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

  // ダイアログが開いた時にカレンダーを再描画、idsをセット
  useEffect(() => {
    if (isOpen) {
      setTargetUserIds(ids);

      // 少し遅延させて再描画
      setTimeout(() => {
        setLoading(false);
        setCalendarKey((prev) => prev + 1);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
  const handleEventClick = (info) => {
    if (deleteMode) {
      setEvents((prev) =>
        prev.filter((event) => event.start !== info.event.startStr)
      );
    }
  };

  // 読み込み時とシフトの変更がない場合はボタンを無効
  const submitDisable = () => {
    return !hasChanges || events.length === 0; // returnを追加
  };

  const submitShiftData = async () => {
    try {
      console.log("保存開始");
      console.log("対象ユーザー(ids):", ids);
      console.log("editingShifts全体:", editingShifts);
      for (const userId of ids) {
        const userShifts = editingShifts.get(userId);

        console.log(`${userId}のシフト:`, userShifts);

        // ユーザーがなければスキップ
        if (!userShifts || userShifts.length === 0) continue;

        const submitData = {
          shifts: userShifts.map((event) => ({
            shiftType: event.title as ShiftType,
            dates: [event.start],
          })),
        };

        console.log(`${userId}の送信データ:`, submitData);

        // 一人ずつ保存
        const result = await createShift({
          userIds: [userId],
          shifts: submitData.shifts,
          year,
          month,
        });

        console.log(`${userId}の保存結果:`, result);

        if (!result.success) {
          alert(result.message);
          return;
        }
      }

      alert("シフトを保存しました。");
      setUserShiftData((prev) => (
        prev.map((user) => ({
          ...user,
          select: false,
        }))
      ))
      setIsOpen(false);
    } catch (error) {
      console.error(error);
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className="hover:cursor-pointer hover:bg-green-100"
          disabled={triggerDisabled}
        >
          {triggerDisabled ? "ユーザーを選択してください" : "シフト作成"}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80vw] min-h-[90vh] flex gap-4 overflow-y-auto p-8">
        <div className="flex flex-col flex-1">
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle>シフト設定</DialogTitle>
            <DialogDescription className="">
              シフト作成ページです。
            </DialogDescription>
            <div className="flex items-center">
              <SelectYearMonth
                year={year}
                month={month}
                handleYearChange={handleYearChange}
                handleMonthChange={handleMonthChange}
              />
            </div>
            {/* 勤怠のそれぞれのカラーボタン */}
            <div className="flex items-center gap-2">
              {Object.entries(EVENT_COLORS_BUTTON).map(([type, colors]) => (
                <Button
                  type="button"
                  variant={"outline"}
                  key={type}
                  className={`${colors.className} hover:cursor-pointer ${
                    workType === type
                      ? "ring-2 ring-offset-2 ring-green-500"
                      : ""
                  }`}
                  onClick={() => handleWorkTypeSelect(type as ShiftType)}
                >
                  {convertWorkTypeToJapanese(type as ShiftType)}
                </Button>
              ))}
              {/* 削除ボタン */}
              <Button
                type="button"
                variant={"destructive"}
                className={`hover:cursor-pointer ${
                  deleteMode ? "ring-2 ring-offset-2 ring-red-500" : ""
                }`}
                onClick={handleDeleteModeToggle}
              >
                削除
              </Button>
            </div>
          </DialogHeader>

          <form className="flex flex-col gap-4 flex-1 w-full relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner className="" />
              </div>
            )}
            <div
              className={`flex-1 min-h-0 overflow-hidden transition-opacity duration-500 ${
                loading ? "opacity-0" : "opacity-100"
              } `}
            >
              <FullCalendar
                key={calendarKey}
                aspectRatio={2}
                height="auto"
                plugins={[dayGridPlugin, interactionPlugin]}
                locale={jaLocale}
                events={events}
                dateClick={(info) => handleClickDate(info)}
                eventClick={(info) => handleEventClick(info)}
                fixedWeekCount={false}
                initialView="dayGridMonth"
                eventContent={(arg) => {
                  const type = arg.event.title as ShiftType;
                  const colors = EVENT_COLORS_BUTTON[type];

                  return (
                    <div
                      className={`${colors.className} p-1 rounded text-xs flex justify-center hover:cursor-pointer`}
                    >
                      {convertWorkTypeToJapanese(type)}
                    </div>
                  );
                }}
              />
            </div>
            {/* 保存ボタン */}
            <div className="ml-auto">
              <Button
                // disabled={submitDisable()}
                type="button"
                variant={"default"}
                className="bg-green-600 hover:bg-green-500 hover:cursor-pointer disabled:bg-gray-500"
                onClick={submitShiftData}
              >
                シフトを保存する
              </Button>
            </div>
          </form>
        </div>
        {/* 対象のユーザーを選択するラジオボタン */}
        <div className="flex flex-col min-w-[20%] gap-2">
          <Card>
            <CardHeader>
              <CardTitle>ベースとなるユーザーを選択</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={baseUserId} onValueChange={setBaseUserId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="メンバーを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>メンバーリスト</SelectLabel>
                    {selectedUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>対象のユーザーを選択</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {selectedUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2">
                  <Checkbox
                    id={user.id}
                    defaultChecked={true}
                    checked={targetuserIds.includes(user.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setTargetUserIds((prev) => [...prev, user.id]);
                      } else {
                        setTargetUserIds((prev) =>
                          prev.filter((id) => id !== user.id)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={user.id}>{user.name}</Label>
                </div>
              ))}
            </CardContent>
          </Card>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                className="bg-green-500 hover:bg-green-400 hover:cursor-pointer"
                disabled={!baseUserId || targetuserIds.length === 0}
              >
                対象のユーザーにシフトをコピー
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {baseUserName}のシフトをコピーします
                </AlertDialogTitle>
                <AlertDialogDescription>
                  選択されているユーザーに対して、{baseUserName}
                  のシフトをコピーします。よろしいですか？
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={copyShiftData}>
                  OK
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftCreateDialog;
