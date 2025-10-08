import React, { useEffect } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { attendanceFields } from "./AttendanceCard";
import { AttendanceData } from "@/types/attendance";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useSetAtom } from "jotai";
import { eventsAtom } from "@/atoms/attendance";

interface EditTimeCardProps {
  data?: AttendanceData;
}

interface EditFormData {
  workStart: string;
  workEnd: string;
  restStart: string;
  restEnd: string;
}

const EditTimeCard = ({ data }: EditTimeCardProps) => {
  const setAttendanceData = useSetAtom(eventsAtom);

  // react-hook-form
  const { register, handleSubmit, reset } = useForm<EditFormData>({
    defaultValues: {
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
        workStart: data.workStart || "",
        workEnd: data.workEnd || "",
        restStart: data.restStart || "",
        restEnd: data.restEnd || "",
      });
    }
  }, [data, reset]);

  const editableFields = attendanceFields.filter(
    (field) => field.key !== "date" && field.key !== "overtimeMinutes"
  );
  const selectedDate =
    data && data.date
      ? format(new Date(data.date), "yyyy/MM/dd (EEE)", { locale: ja })
      : "未設定";

  // フォームの送信処理
  const onSubmit = (formData: EditFormData) => {
    console.log("Submitted data:", formData);

    setAttendanceData((prev) =>
      prev.map((event) => {
        if (event.extendedProps.date === data?.date) {
          return {
            ...event,
            start: `${data.date}T${formData.workStart}:00`,
            end: `${data.date}T${formData.workEnd}:00`,
            extendedProps: {
              ...event.extendedProps,
              workStart: formData.workStart,
              workEnd: formData.workEnd,
              restStart: formData.restStart,
              restEnd: formData.restEnd,
            },
          };
        }
        return event;
      })
    );
  };

  return (
    <Dialog>
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
          {editableFields.map(({ label, key }) => {
            return (
              <div key={key} className="flex flex-col gap-1">
                <Label>{label}:</Label>
                <Input type="time" {...register(key as keyof EditFormData)} />
              </div>
            );
          })}
          <DialogFooter>
            <Button
              variant={"secondary"}
              type="submit"
              className="bg-green-500 text-white hover:bg-green-600"
            >
              登録する
            </Button>
            <DialogClose asChild>
              <Button variant={"outline"}>キャンセル</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTimeCard;
