"use client";

import { upsertDailyAttendance } from "@/actions/attendance/summary/upsertDailyAttendance";
import { EditFormData } from "@/app/(private)/mypage/attendance/components/EditTimeCard";
import { DailyAttendanceData, DailyWorkType } from "@/types/attendance";
import { toast } from "sonner";

interface UseAttendanceSubmitProps {
  data: DailyAttendanceData | undefined;
  selectedDate?: Date | null;
  setEditingDialogOpen: (open: boolean) => void;
  refetchAttendance: () => Promise<void>
}

export const useAttendanceSubmit = ({
  data,
  selectedDate,
  setEditingDialogOpen,
  refetchAttendance,
}: UseAttendanceSubmitProps) => {
  const onSubmit = async (formData: EditFormData) => {
    try {
      // 送信するデータを準備
      const targetDate = data?.date || selectedDate;
      if (!targetDate) return;

      const submitData: DailyAttendanceData = {
            date: targetDate,
            workType: formData.workType as DailyWorkType,
            workStart: formData.workStart,
            workEnd: formData.workEnd,
            restStart: formData.restStart,
            restEnd: formData.restEnd,
            workStartType: null,
            workEndType: null,
            overtimeMinutes: 0,
          };

      const response = await upsertDailyAttendance("dummy-user-1", submitData);

      if (response.success) {
        toast.success("勤怠データを更新しました。");
        setEditingDialogOpen(false);
        await refetchAttendance();
      } else {
        toast.error("勤怠データの更新に失敗しました。");
        return;
      }

    } catch (error) {
      console.error("Error updating attendance data:", error);
    }
  };

  return { onSubmit };
};
