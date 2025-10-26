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
import {
  DailyAttendanceData,
  DailyWorkType,
} from "@/types/attendance";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import EditTimeCardButton from "./EditTimeCardButton";
import WorkTypeSelect from "./WorkTypeSelect";
import { useAttendanceSubmit } from "@/hooks/useAttendanceSubmit";
import { useFormCancel } from "@/hooks/useFormCancel";

interface EditTimeCardProps {
  data?: DailyAttendanceData;
}

export interface EditFormData {
  workType: DailyWorkType | null;
  workStart: string;
  workEnd: string;
  restStart: string;
  restEnd: string;
}

const EditTimeCard = ({ data }: EditTimeCardProps) => {
  const [editingDialogOpen, setEditingDialogOpen] = useState(false);
  const {onSubmit} = useAttendanceSubmit({data, setEditingDialogOpen});


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

  const {handleCancel} = useFormCancel({formState,reset,setEditingDialogOpen});

  const selectedWorkType = watch("workType");

  const editableFields = attendanceFields.filter(
    (field) => field.key !== "date" && field.key !== "overtimeMinutes"
  );
  const selectedDate =
    data && data.date
      ? format(new Date(data.date), "yyyy/MM/dd (EEE)", { locale: ja })
      : "未設定";

  const isWorkingType = (type: DailyWorkType | null) => {
    return type === "day_working" || type === "night_working"
  }

  return (
    <Dialog open={editingDialogOpen} onOpenChange={setEditingDialogOpen}>
      <DialogTrigger
        className={`bg-amber-300 rounded-md w-[100px] py-1 ml-auto disabled:bg-gray-300 disabled:opacity-70`}
        disabled={
          !data || !data.date || format(data.date, "yyyy-MM-dd") === "未設定"
        }
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

          <WorkTypeSelect control={control} />
          {isWorkingType(selectedWorkType) && (
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
            <EditTimeCardButton variant="secondary" type="submit" buttonText="登録する" />
            <EditTimeCardButton variant="outline" type="button" buttonText="キャンセル" onClick={handleCancel} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTimeCard;
