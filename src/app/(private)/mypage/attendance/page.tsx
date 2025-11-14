"use client";

import Calendar from "@/components/calendar/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEvent, DailyAttendanceData } from "@/types/attendance";
import React, { useEffect, useState } from "react";
import AttendanceCard from "./components/AttendanceCard";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useAtomValue } from "jotai";
import { eventsAtom } from "@/atoms/attendance";
import { isSameDate } from "@/utils/dateUtils";
import { useFetchAttendance } from "@/hooks/attendance/useFetchAttendance";
import { ClockIn } from "@/actions/attendance/clockIn";
import { StartBreak } from "@/actions/attendance/startBreak";
import { ClockOut } from "@/actions/attendance/clockOut";
import { useFetchTodayAttendance } from "@/hooks/attendance/useFetchTodayAttendance";
import { useAttendanceCards } from "@/hooks/attendance/useAttendanceCards";
import ClockButton, { CLOCK_BUTTON_TEXT } from "./components/ClockButton";
import { useAttendanceStatus } from "@/hooks/attendance/useAttendanceStatus";
import { toast } from "sonner";
import Loading from "@/components/loading/Loading";

export type WorkStatus = "day_working" | "night_working" | "rest" | "leave";

const Attendance = () => {
  const { ATTENDANCE_CARDS } = useAttendanceCards();

  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());

  // 現在の日時
  const now = new Date();
  const nowDisplay = format(now, "HH:mm:ss");
  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth() + 1;

  const {refetch,loading} = useFetchAttendance("dummy-user-1", year, month);

  const { todayAttendance, setTodayAttendance } =
    useFetchTodayAttendance("dummy-user-1");

  const events = useAtomValue<CalendarEvent[]>(eventsAtom);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAttendance, setSelectedAttendance] = useState<
    DailyAttendanceData | undefined
  >(undefined);

  useEffect(() => {
    if (!selectedDate) {
      setSelectedAttendance(undefined);
      return;
    }

    const foundAttendance = events.find((ev) =>
      isSameDate(ev.extendedProps.date, selectedDate)
    );
    setSelectedAttendance(foundAttendance?.extendedProps);
  }, [selectedDate, events]);

  //現在のステータス
 const { canClockIn,canClockOut,canStartBreak,getCurrentStatus,getCurrentStatusColor} =  useAttendanceStatus(todayAttendance)

  const disabledClockButtons = {
    出勤: !canClockIn(),
    夜勤: !canClockIn(),
    休憩開始: !canStartBreak(),
    退勤: !canClockOut(),
  };

  const handleWorking = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonText = (e.target as HTMLButtonElement).textContent;
    // 日勤時の処理
    if (buttonText === "出勤") {
      const response = await ClockIn("dummy-user-1", "day_working");

      if (response.success && response.data) {
        setTodayAttendance(response.data);
        refetch();
        toast.success("出勤しました");
      } else {
        toast.error(response.message);
        return;
      }
    }
    // 夜勤時の処理
    else if (buttonText === "夜勤") {
      const response = await ClockIn("dummy-user-1", "night_working");
      if (response.success && response.data) {
        setTodayAttendance(response.data);
        refetch();
        toast.success("出勤しました");
      } else {
        toast.error(response.message);
        return;
      }
    }
    // 休憩時の処理
    else if (buttonText === "休憩開始") {
      const response = await StartBreak("dummy-user-1");
      if (response.success && response.data) {
        setTodayAttendance(response.data);
        toast.success("休憩を開始しました");
      } else {
        alert(response.message);
        return;
      }
    }
    // 退勤時の処理
    else if (buttonText === "退勤") {
      const response = await ClockOut("dummy-user-1");
      if (response.success && response.data) {
        setTodayAttendance(response.data);
        refetch();
        toast.success("退勤しました");
      } else {
        toast.error(response.message);
        return;
      }
    }
  };

  if(loading){
    return <div><Loading /></div>
  }

  return (
    <div className="grid grid-cols-2 gap-10 h-screen overflow-hidden">
      {/* ======== 左側のエリア ======== */}
      <div className="flex flex-col">
        {/* ======== 出退勤ボタンなどのエリア ======== */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span>今日は{format(now, `yyyy年MM月dd日(eee)`)}</span>
            <span>現在の時刻は{nowDisplay}です。</span>
          </div>

          <div className="flex gap-5">
            {CLOCK_BUTTON_TEXT.map((text) => (
              <ClockButton
                key={text}
                onClick={(e) => handleWorking(e)}
                buttonText={text}
                disabled={disabledClockButtons[text]}
              />
            ))}
          </div>
          <div
            className={`flex flex-col ${getCurrentStatusColor()} p-4 rounded-lg ml-auto`}
          >
            <span
              className={`${getCurrentStatusColor() ? "text-black" : "text-white"}`}
            >
              現在のステータス:
              <span className="font-bold">{getCurrentStatus()}</span>
            </span>
          </div>
        </div>
        {/* ======== 表示するカレンダーのエリア ======== */}
        <Calendar
          setSelectedDate={setSelectedDate}
          displayMonth={displayMonth}
          setDisplayMonth={setDisplayMonth}
        />
      </div>
      {/* ======== 右側のエリア ======== */}
      <div>
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold mb-4">
            勤怠管理 - {format(displayMonth, "yyyy年MM月", { locale: ja })}
          </h2>
          {/* カード群 */}
          <div className="grid grid-cols-3 gap-4">
            {ATTENDANCE_CARDS.map((card) => (
              <Card key={card.title}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <span>
                    {card.displayValue ?? `${card.value}${card.unit}`}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 勤怠データ */}
          <div className="flex gap-4">
            <AttendanceCard todayAttendance={todayAttendance} selectedDate={new Date()} title={"今日の勤怠"} />
            <AttendanceCard selectedAttendance={selectedAttendance} selectedDate={selectedDate} title={"選択した勤怠"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
