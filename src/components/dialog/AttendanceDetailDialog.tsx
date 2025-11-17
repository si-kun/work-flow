"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ATTENDANCE_DIALOG_HEADER } from "@/constants/attendance";
import {
  convertWorkEndTypeToJapanese,
  convertWorkStartTypeToJapanese,
  convertWorkTypeToJapanese,
} from "@/lib/convertToJapanese";
import { addMonths, format, subMonths } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getDailyAttendance } from "@/actions/attendance/summary/getDailyAttendance";
import { DailyAttendanceData } from "@/types/attendance";
import DataTable from "../common/DataTable";

interface AttendanceDetailDialogProps {
  userId: string;
  userName: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AttendanceDetailDialog = ({
  userId,
  userName,
  open,
  setOpen,
}: AttendanceDetailDialogProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevMonth = () => {
    setSelectedDate((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate((prev) => addMonths(prev, 1));
  };

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  const [attendanceDayData, setAttendanceDayData] = useState<
    DailyAttendanceData[]
  >([]);

  // サーバーアクションで指定月の勤怠データを取得
  useEffect(() => {
    try {
      const fetchAttendanceDayData = async () => {
        const response = await getDailyAttendance(userId, year, month);
        if (response.success) {
          setAttendanceDayData(response.data);
        }
      };
      fetchAttendanceDayData();
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  }, [year, month, userId]);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="min-w-[70vw] h-[80vh]  flex flex-col items-center">
        <DialogHeader className="relative w-full flex items-center justify-center">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
              type="button"
              variant={"secondary"}
              onClick={handlePrevMonth}
            >
              <ArrowLeft />
            </Button>
            <div>
              <span>
                {year}年{month}月
              </span>
            </div>
            <Button
              type="button"
              variant={"secondary"}
              onClick={handleNextMonth}
            >
              <ArrowRight />
            </Button>
          </div>
          <DialogTitle>{`${userName}の勤怠詳細`}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="w-full overflow-y-auto">
          <DataTable
            headers={ATTENDANCE_DIALOG_HEADER}
            rows={attendanceDayData.map((attendance) => ({
              id: attendance.date.toISOString(),
              data: [
                format(attendance.date, "yyyy-MM-dd"),
                convertWorkTypeToJapanese(attendance.workType),
                attendance.workStart || "-",
                convertWorkStartTypeToJapanese(attendance.workStartType),
                attendance.workEnd || "-",
                convertWorkEndTypeToJapanese(attendance.workEndType),
                attendance.restStart || "-",
                attendance.restEnd || "-",
                attendance.overtimeMinutes + "分",
              ],
            }))}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDetailDialog;
