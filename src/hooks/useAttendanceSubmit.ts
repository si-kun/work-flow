"use client";

import { upsertDailyAttendance } from "@/actions/attendance/summary/upsertDailyAttendance";
import { EditFormData } from "@/app/(private)/mypage/attendance/components/EditTimeCard";
import { eventsAtom } from "@/atoms/attendance";
import { DailyAttendanceData, DailyWorkType } from "@/types/attendance";
import {
  calcWorkAndOvertime,
  WorkShiftType,
} from "@/utils/attendanceCalculations";
import { convertToCalendarEvent } from "@/utils/convertToCalendarEvent";
import { isSameDate } from "@/utils/dateUtils";
import { useAtom } from "jotai";

interface UseAttendanceSubmitProps {
  data: DailyAttendanceData | undefined;
  setEditingDialogOpen: (open: boolean) => void;
}

export const useAttendanceSubmit = ({
  data,
  setEditingDialogOpen,
}: UseAttendanceSubmitProps) => {
  const [attendanceData, setAttendanceData] = useAtom(eventsAtom);
  const onSubmit = async (formData: EditFormData) => {
    try {
      // 送信するデータを準備
      if (!data?.date) return;

      const updatedData: DailyAttendanceData = {
        ...data,
        workType: formData.workType as DailyWorkType,
        workStart: formData.workStart,
        workEnd: formData.workEnd,
        restStart: formData.restStart,
        restEnd: formData.restEnd,
      };

      const { overtimeMinutes, workStartType, workEndType } =
        calcWorkAndOvertime(updatedData.workType as WorkShiftType, updatedData);

      const finalData: DailyAttendanceData = {
        ...updatedData,
        overtimeMinutes,
        workStartType,
        workEndType,
      };

      const response = await upsertDailyAttendance("dummy-user-1", finalData);

      console.log("Response", response);

      if (response.success) {
        setEditingDialogOpen(false);
      } else {
        alert("勤怠データの更新に失敗しました。");
        return;
      }

      const newEvent = convertToCalendarEvent(finalData);

      // 既存イベントがあるか確認
      const existingEventIndex = attendanceData.findIndex((event) => {
        return isSameDate(event.extendedProps.date, finalData.date);
      });

      if (existingEventIndex !== -1) {
        //既存イベントを更新
        setAttendanceData((prev) => {
          const updated = [...prev];
          updated[existingEventIndex] = newEvent;
          return updated;
        });
      } else {
        setAttendanceData((prev) => [...prev, newEvent]);
      }
    } catch (error) {
      console.error("Error updating attendance data:", error);
    }
  };

  return { onSubmit };
};
