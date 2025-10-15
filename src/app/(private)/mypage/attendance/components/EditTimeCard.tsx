import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { attendanceFields } from "./AttendanceCard";
import { DailyAttendanceData, DailyWork, DailyWorkType } from "@/types/attendance";
import { addDays, format } from "date-fns";
import { ja } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { useAtom } from "jotai";
import { eventsAtom } from "@/atoms/attendance";
import { calcWorkAndOvertime } from "@/utils/attendanceCalculations";
import { timeToMinutes } from "@/utils/timeUtils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditTimeCardProps {
  data?: DailyAttendanceData;
}

interface EditFormData {
  workType: DailyWorkType | null;
  workStart: string;
  workEnd: string;
  restStart: string;
  restEnd: string;
}

const EditTimeCard = ({ data }: EditTimeCardProps) => {
  const [attendanceData, setAttendanceData] = useAtom(eventsAtom);
  const [editingDialogOpen, setEditingDialogOpen] = useState(false);

  // react-hook-form
  const { register, handleSubmit, reset, formState, control, watch } =
    useForm<EditFormData>({
      defaultValues: {
        workType: null,
        workStart: "",
        workEnd: "",
        restStart: "",
        restEnd: "",
      },
    });
  // dataが変わったらフォームをリセット
  useEffect(() => {
    if (data) {
      reset({
        workType: data.workType || null,
        workStart: data.workStart || "",
        workEnd: data.workEnd || "",
        restStart: data.restStart || "",
        restEnd: data.restEnd || "",
      });
    }
  }, [data, reset]);

  const selectedWorkType = watch("workType");

  const editableFields = attendanceFields.filter(
    (field) => field.key !== "date" && field.key !== "overtimeMinutes"
  );
  const selectedDate =
    data && data.date
      ? format(new Date(data.date), "yyyy/MM/dd (EEE)", { locale: ja })
      : "未設定";

  // フォームの送信処理
  const onSubmit = (formData: EditFormData) => {
    if (!data?.date) return;

    const updatedData: DailyAttendanceData = {
      ...data,
      workType: formData.workType,
      workStart: formData.workStart,
      workEnd: formData.workEnd,
      restStart: formData.restStart,
      restEnd: formData.restEnd,
    };

    const { overtimeMinutes, workStartType, workEndType } = calcWorkAndOvertime(
      updatedData.workType as string,
      updatedData
    );

    // 夜勤の日付またぎ対応
    const workStartMinutes = timeToMinutes(updatedData.workStart);
    const workEndMinutes = timeToMinutes(updatedData.workEnd);

    const isNextDay = workEndMinutes < workStartMinutes;

    const endDate = isNextDay
      ? format(addDays(new Date(data.date), 1), "yyyy-MM-dd")
      : data.date;

    console.log(data)

    // 既存のイベントがあるか確認
    const existingEvent = attendanceData.find(
      (event) => event.extendedProps.date === data.date
    );

    if (existingEvent) {
      //  =============== 既存イベントがある場合 ===============
      setAttendanceData((prev) =>
        prev.map((event) => {
          if (event.extendedProps.date === data.date) {
            // 有給、欠勤、休日の場合は終日イベントにする
            if (
              updatedData.workType === "paid" ||
              updatedData.workType === "paid_pending" ||
              updatedData.workType === "absenteeism" ||
              updatedData.workType === "day_off"
            ) {
              return {
                ...event,
                title:
                  DailyWork.find((work) => work.value === updatedData.workType)
                    ?.label || "",
                start: data.date,
                end: data.date,
                allDay: true,
                extendedProps: {
                  ...updatedData,
                  overtimeMinutes: 0,
                  workStartType: null,
                  workEndType: null,
                },
              };
            } else {
              // 日勤、夜勤の場合
              return {
                ...event,
                title:
                  DailyWork.find((work) => work.value === updatedData.workType)
                    ?.label || "",
                start: `${data.date}T${updatedData.workStart}`,
                end: `${endDate}T${updatedData.workEnd}`,
                allDay: false,
                extendedProps: {
                  ...updatedData,
                  overtimeMinutes,
                  workStartType,
                  workEndType,
                },
              };
            }
          }
          return event;
        })
      );
    } else {
      //  =============== 新規イベントの追加 ===============
      // 有給・欠勤・休日の場合は終日イベントにする
      if (
        updatedData.workType === "paid" ||
        updatedData.workType === "paid_pending" ||
        updatedData.workType === "absenteeism" ||
        updatedData.workType === "day_off"
      ) {
        setAttendanceData((prev) => [
          ...prev,
          {
            title:
              DailyWork.find((work) => work.value === updatedData.workType)
                ?.label || "",
            start: data.date,
            end: data.date,
            allDay: true,
            extendedProps: {
              ...updatedData,
              overtimeMinutes: 0,
              workStartType: null,
              workEndType: null,
            },
          },
        ]);
      } else {
        // 日勤、夜勤の場合
        setAttendanceData((prev) => [
          ...prev,
          {
            title:
              DailyWork.find((work) => work.value === updatedData.workType)
                ?.label || "",
            start: `${data.date}T${updatedData.workStart}`,
            end: `${endDate}T${updatedData.workEnd}`,
            allDay: false,
            extendedProps: {
              ...updatedData,
              overtimeMinutes,
              workStartType,
              workEndType,
            },
          },
        ]);
      }
    }

    setEditingDialogOpen(false);
  };

  // キャンセル時の処理
  const handleCancel = () => {
    if (formState.isDirty) {
      // 変更されている場合、確認ダイアログを表示
      const confirmed = window.confirm(
        "変更内容が保存されていません。キャンセルしてもよろしいですか?"
      );

      if (confirmed) {
        reset(); // フォームをリセット
        setEditingDialogOpen(false);
      }
    } else {
      // 変更されていない場合、そのまま閉じる
      setEditingDialogOpen(false);
    }
  };

  return (
    <Dialog open={editingDialogOpen} onOpenChange={setEditingDialogOpen}>
      <DialogTrigger
        className={`bg-amber-300 rounded-md w-[100px] py-1 ml-auto disabled:bg-gray-300 disabled:opacity-70`}
        disabled={!data || !data.date || data.date === "未設定"}
      >
        勤怠を編集
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedDate}の勤怠を編集する</DialogTitle>
          <DialogDescription>
            出勤時間、退勤時間、休憩時間、残業時間を編集します。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 w-full">
            <Label>勤務タイプ:</Label>
            <Controller
              control={control}
              name="workType"
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={"勤務タイプを選択"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>勤務タイプ</SelectLabel>
                      {DailyWork.map((work) => (
                        <SelectItem key={work.value} value={work.value}>
                          {work.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {(selectedWorkType === "day_working" ||
            selectedWorkType === "night_working") && (
            <>
              {editableFields.map(({ label, key }) => {
                return (
                  <div key={key} className="flex flex-col gap-1">
                    <Label>{label}:</Label>
                    <Input
                      type="time"
                      {...register(key as keyof EditFormData)}
                    />
                  </div>
                );
              })}
            </>
          )}
          <DialogFooter>
            <Button
              variant={"secondary"}
              type="submit"
              className="bg-green-500 text-white hover:bg-green-600"
            >
              登録する
            </Button>
            <Button
              type="button"
              onClick={() => handleCancel()}
              variant={"outline"}
            >
              キャンセル
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTimeCard;
