"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ATTENDANCE_DIALOG_HEADER,
  ATTENDANCE_DUMMY_BY_MONTH,
} from "@/constants/attendance";
import {
  convertWorkEndTypeToJapanese,
  convertWorkStartTypeToJapanese,
  convertWorkTypeToJapanese,
} from "@/lib/convertToJapanese";
import { addMonths, subMonths } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface AttendanceDetailDialogProps {
  cellData: string[];
  userId: string;
  userName: string;
}

const AttendanceDetailDialog = ({
  cellData,
  userId,
  userName,
}: AttendanceDetailDialogProps) => {

  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevMonth = () => {
    setSelectedDate((prev) => subMonths(prev, 1));
  }

  const handleNextMonth = () => {
    setSelectedDate((prev) => addMonths(prev, 1));
  }

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1

  const yearMonthKey = `${year}-${month.toString().padStart(2, '0')}`;

  const attendanceData = ATTENDANCE_DUMMY_BY_MONTH[userId]?.[yearMonthKey] || []

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center border-b border-slate-300 last:border-b-0 hover:bg-slate-100 hover:cursor-pointer">
          {cellData.map((cell, index) => (
            <span
              key={index}
              className="w-[300px] px-3 py-2.5 border-r border-slate-300 last:border-r-0"
            >
              {cell}
            </span>
          ))}
        </div>
      </DialogTrigger>
      <DialogContent className="min-w-[70%] min-h-[70%] flex flex-col items-center overflow-hidden">
        <DialogHeader className="relative w-full flex items-center justify-center">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button type="button" variant={"secondary"} onClick={handlePrevMonth}>
              <ArrowLeft />
            </Button>
            <div>
              <span>{year}年{month}月</span>
            </div>
            <Button type="button" variant={"secondary"} onClick={handleNextMonth}>
              <ArrowRight />
            </Button>
          </div>
          <DialogTitle>{`${userName}の勤怠詳細`}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto w-full">
          {/* ヘッダー */}
          <div className="bg-slate-50 flex sticky top-0 z-10 border border-slate-300">
            {ATTENDANCE_DIALOG_HEADER.map((header) => (
              <span
                key={header}
                className="w-[300px] px-3 py-2.5 text-slate-900 border-r border-slate-300 last:border-r-0"
              >
                {header}
              </span>
            ))}
          </div>
          <div className="flex flex-col flex-1 border border-slate-300 border-t-0">
            {attendanceData.map((attendance) => {
              const cellData = [
                attendance.date,
                convertWorkTypeToJapanese(attendance.workType),
                attendance.workStart +
                  convertWorkStartTypeToJapanese(attendance.workStartType),
                attendance.workEnd +
                  convertWorkEndTypeToJapanese(attendance.workEndType),
                attendance.restStart,
                attendance.restEnd,
                attendance.overtimeMinutes + "分",
              ];

              return (
                <div
                  key={attendance.date}
                  className="flex border-b border-slate-300 hover:bg-slate-100 last:border-b-0"
                >
                  {cellData.map((data, index) => (
                    <span
                      key={index}
                      className="w-[300px] px-3 py-2.5 text-slate-900 border-r border-slate-300 last:border-r-0"
                    >
                      {data}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDetailDialog;
