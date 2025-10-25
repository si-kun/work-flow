"use client";

import Calendar from "@/components/calendar/Calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEvent, DailyAttendanceData } from "@/types/attendance";
import {
  minutesToTime,
} from "@/utils/timeUtils";
import React, { useEffect, useState } from "react";
import AttendanceCard from "./components/AttendanceCard";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useAtomValue } from "jotai";
import { eventsAtom } from "@/atoms/attendance";
import { isSameDate } from "@/utils/dateUtils";
import { useFetchAttendance } from "@/hooks/useFetchAttendance";
import { ClockIn } from "@/actions/attendance/clockIn";
import { StartBreak } from "@/actions/attendance/startBreak";
import { ClockOut } from "@/actions/attendance/clockOut";
import { useFetchTodayAttendance } from "@/hooks/useFetchTodayAttendance";

export type WorkStatus = "day_working" | "night_working" | "rest" | "leave";

export interface MonthlyStatistics {
  paidLeaveDays: number;
  acquiredPaidLeaveDays: number;
  workingMinutes: number;
  nightShiftMinutes: number;
  overtimeMinutes: number;
  absentDays: number;
}

const Attendance = () => {
  const [stats, setStats] = useState<MonthlyStatistics>({
    paidLeaveDays: 0,
    acquiredPaidLeaveDays: 0,
    workingMinutes: 0,
    nightShiftMinutes: 0,
    overtimeMinutes: 0,
    absentDays: 0,
  });
  const {
    paidLeaveDays,
    acquiredPaidLeaveDays,
    workingMinutes,
    nightShiftMinutes,
    overtimeMinutes,
    absentDays,
  } = stats;

  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());

  const paidLeaveCards = [
    {
      title: "残りの有給日数",
      value: paidLeaveDays - acquiredPaidLeaveDays,
      unit: "日",
    },
    {
      title: "申請中の有給日数",
      value: 0,
      unit: "日",
    },
    {
      title: "今月の有給日数",
      value: acquiredPaidLeaveDays,
      unit: "日",
    },
  ];

  const workDetailCards = [
    {
      title: "出勤時間",
      value: `${minutesToTime(workingMinutes)} (夜勤:${minutesToTime(
        nightShiftMinutes
      )})`,
    },
    {
      title: "残業時間",
      value: minutesToTime(overtimeMinutes),
    },
    {
      title: "欠勤日数",
      value: absentDays,
    },
  ];

  // 現在の日時
  const now = new Date();
  const nowDisplay = format(now, "HH:mm:ss");
  const year = displayMonth.getFullYear();
  const month = displayMonth.getMonth() + 1;

  useFetchAttendance("dummy-user-1", year, month);

  const { todayAttendance, setTodayAttendance } =
    useFetchTodayAttendance("dummy-user-1");

  console.log(todayAttendance);

  const events = useAtomValue<CalendarEvent[]>(eventsAtom);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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
  // 出勤可能かどうか
  const canClockIn = () => {
    if(!todayAttendance) return true;

    const isWorking = !todayAttendance.workStart && !todayAttendance.workEnd;
    return isWorking;
  };
  // 休憩可能かどうか
  const canStartBreak = () => {
    if (!todayAttendance) return false;

    const isWorking = todayAttendance.workStart && !todayAttendance.workEnd;
    const hasNotStartedBreak = !todayAttendance.restStart;

    return isWorking && hasNotStartedBreak;
  };

  // 退勤可能かどうか
  const canClockOut = () => {
    if (!todayAttendance) return false;

    return todayAttendance.workStart && !todayAttendance.workEnd;
  };

  // 現在の状態（表示用）
  const getCurrentStatus = () => {
    if (!todayAttendance || todayAttendance.workEnd) {
      return "退勤中";
    }

    if (todayAttendance.restStart && !todayAttendance.restEnd) {
      return "休憩中";
    }

    if (
      todayAttendance.workStart &&
      todayAttendance.workType === "night_working"
    ) {
      return "夜勤中";
    }

    if (
      todayAttendance.workStart &&
      todayAttendance.workType === "day_working"
    ) {
      return "勤務中";
    }
  };

  // 現在のステータスによってカラーを変える
  const nowStatusColor = () => {
    const status = getCurrentStatus();

    switch (status) {
      case "勤務中":
        return "bg-green-300 text-black";
      case "夜勤中":
        return "bg-purple-300 text-black";
      case "休憩中":
        return "bg-orange-300 text-black";
      case "退勤中":
        return "bg-red-300 text-white";
    }
  };

  const handleWorking = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonText = (e.target as HTMLButtonElement).textContent;
    // const currentTime = format(now, "HH:mm");
    // 日勤時の処理
    if (buttonText === "出勤") {
      const response = await ClockIn("dummy-user-1", "day_working");

      if (response.success && response.data) {
        setTodayAttendance(response.data);
      } else {
        alert(response.message);
      }
    }
    // 夜勤時の処理
    else if (buttonText === "夜勤") {
      const response = await ClockIn("dummy-user-1", "night_working");
      if (response.success && response.data) {
        setTodayAttendance(response.data);
      } else {
        alert(response.message);
      }
    }
    // 休憩時の処理
    else if (buttonText === "休憩") {
      const response = await StartBreak("dummy-user-1");
      if (response.success && response.data) {
        setTodayAttendance(response.data);
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
      } else {
        alert(response.message);
        return;
      }
    }
  };

  return (
    <div className="p-10 grid grid-cols-2 gap-10 h-screen overflow-hidden">
      {/* ======== 左側のエリア ======== */}
      <div className="flex flex-col">
        {/* ======== 出退勤ボタンなどのエリア ======== */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span>今日は{format(now, `yyyy年MM月dd日(eee)`)}</span>
            <span>現在の時刻は{nowDisplay}です。</span>
          </div>

          <div className="flex gap-5">
            <Button
              variant={"outline"}
              className="w-[70px] h-[70px] rounded-full bg-green-400 hover:bg-green-300"
              onClick={(e) => handleWorking(e)}
              disabled={!canClockIn()}
            >
              出勤
            </Button>
            <Button
              variant={"outline"}
              className="w-[70px] h-[70px] rounded-full bg-purple-400 hover:bg-purple-300"
              onClick={(e) => handleWorking(e)}
              disabled={!canClockIn()}
            >
              夜勤
            </Button>
            <Button
              variant={"outline"}
              className="w-[70px] h-[70px] rounded-full bg-orange-400 hover:bg-orange-300 text-white hover:text-white"
              onClick={(e) => handleWorking(e)}
              disabled={!canStartBreak()}
            >
              休憩
            </Button>
            <Button
              variant={"outline"}
              className="w-[70px] h-[70px] rounded-full bg-red-400 hover:bg-red-300 text-white hover:text-white"
              onClick={(e) => handleWorking(e)}
              disabled={!canClockOut()}
            >
              退勤
            </Button>
          </div>
          <div
            className={`flex flex-col ${nowStatusColor()} p-4 rounded-lg ml-auto`}
          >
            <span className={`${nowStatusColor() ? "text-black" : "text-white"}`}>
              現在のステータス:
              <span className="font-bold">
                {getCurrentStatus()}
              </span>
            </span>
          </div>
        </div>
        {/* ======== 出退勤ボタンなどのエリア ======== */}
        {/* ======== 表示するカレンダーのエリア ======== */}
        <Calendar
          setStats={setStats}
          setSelectedDate={setSelectedDate}
          displayMonth={displayMonth}
          setDisplayMonth={setDisplayMonth}
        />
        {/* ======== 表示するカレンダーのエリア ======== */}
      </div>
      {/* ======== 左側のエリア ======== */}
      {/* ======== 右側のエリア ======== */}
      <div>
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold mb-4">
            勤怠管理 - {format(displayMonth, "yyyy年MM月", { locale: ja })}
          </h2>
          {/* カード群 */}
          <div>
            <span>有給日数</span>
            <div className="flex gap-4">
              {paidLeaveCards.map((card) => (
                <Card key={card.title} className="flex-1">
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {card.value} {card.unit}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <span>勤務詳細</span>
            <div className="flex gap-4">
              {workDetailCards.map((card) => (
                <Card key={card.title} className="flex-1">
                  <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent>{card.value}</CardContent>
                </Card>
              ))}
            </div>
          </div>
          {/* カード群 */}

          {/* 勤怠データ */}
          <div className="flex gap-4">
            <AttendanceCard todayAttendance={todayAttendance} />
            <AttendanceCard selectedAttendance={selectedAttendance} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
