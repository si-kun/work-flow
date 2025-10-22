"use client";

import Calendar from "@/components/calendar/Calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEvent, DailyAttendanceData } from "@/types/attendance";
import { determineClockInType } from "@/utils/attendanceUtils";
import {
  formatTime,
  minutesToTime,
  restOneHour,
  timeToMinutes,
} from "@/utils/timeUtils";
import React, { useEffect, useState } from "react";
import AttendanceCard from "./components/AttendanceCard";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { getDailyAttendance } from "@/actions/attendance/summary/getDailyAttendance";
import { useAtom } from "jotai";
import { eventsAtom } from "@/atoms/attendance";
import { isSameDate } from "@/utils/dateUtils";

type WorkStatus = "day_working" | "night_working" | "rest" | "leave";

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

  // 選択されたシフトタイプ
  const [currentShiftType, setCurrentShiftType] = useState<
    "day_working" | "night_working" | null
  >(null);

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

  const [workStatus, setWorkStatus] = useState<WorkStatus>("leave");
  const [previousWorkStatus, setPreviousWorkStatus] =
    useState<WorkStatus>("leave");

  const [todayAttendance, setTodayAttendance] = useState<DailyAttendanceData>({
    date: now,
    workType: "day_working",
    workStart: "",
    workStartType: null,
    workEnd: "",
    workEndType: null,
    restStart: "",
    restEnd: "",
    overtimeMinutes: 0,
  });

  const [events, setEvents] = useAtom<CalendarEvent[]>(eventsAtom);

  useEffect(() => {
    const eventsData = async () => {
      try {
        const response = await getDailyAttendance("dummy-user-1", year, month);
        if (response.success) {
          setEvents(
            response.data.map((att) => ({
              title: att.workType,
              start: format(att.date, "yyyy-MM-dd"),
              end: format(att.date, "yyyy-MM-dd"),
              extendedProps: att,
            }))
          );
        } else {
          return [];
        }
      } catch (error) {
        console.log("Error fetching events:", error);
        return [];
      }
    };
    eventsData();
  }, [year, month, setEvents]);

  console.log(events);

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

  // 現在のステータスによってカラーを変える
  const nowStatusColor = () => {
    switch (workStatus) {
      case "day_working":
        return "bg-green-300 text-black";
      case "night_working":
        return "bg-purple-300 text-black";
      case "rest":
        return "bg-orange-300 text-black";
      case "leave":
        return "bg-red-300 text-white";
    }
  };

  const handleWorking = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonText = (e.target as HTMLButtonElement).textContent;
    const currentTime = format(now, "HH:mm");
    // 日勤時の処理
    if (buttonText === "出勤") {
      const result = determineClockInType(currentTime, "day_working");
      setWorkStatus("day_working");
      setCurrentShiftType("day_working");
      setTodayAttendance((prev) => ({
        ...prev,
        workStatus: "day_working",
        workStart: currentTime,
        workStartType: result.type,
        calculationStart: result.calculationTime,
      }));
    }
    // 夜勤時の処理
    else if (buttonText === "夜勤") {
      const result = determineClockInType(currentTime, "night_working");
      setWorkStatus("night_working");
      setCurrentShiftType("night_working");
      setTodayAttendance((prev) => ({
        ...prev,
        workStatus: "night_working",
        workStart: currentTime,
        workStartType: result.type,
        calculationStart: result.calculationTime,
      }));
    }
    // 休憩時の処理
    else if (buttonText === "休憩") {
      setWorkStatus("rest");
      setPreviousWorkStatus(workStatus);
      setTodayAttendance((prev) => ({
        ...prev,
        workStatus: "rest",
        restStart: currentTime,
        restEnd: restOneHour(currentTime),
      }));
    }
    // 退勤時の処理
    else if (buttonText === "退勤") {
      setWorkStatus("leave");
      setTodayAttendance((prev) => ({
        ...prev,
        workStatus: "leave",
        workEnd: currentTime,
      }));
    }
  };

  // 休憩時間の自動終了チェック
  useEffect(() => {
    if (workStatus !== "rest" || !todayAttendance.restEnd) {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      const currentTime = formatTime(hours, minutes);
      const currentMinutes = timeToMinutes(currentTime);
      const restEndMinutes = timeToMinutes(todayAttendance.restEnd as string);

      if (currentMinutes >= restEndMinutes) {
        setWorkStatus(previousWorkStatus);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workStatus, todayAttendance.restEnd, previousWorkStatus]);

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
              disabled={workStatus !== "leave"}
            >
              出勤
            </Button>
            <Button
              variant={"outline"}
              className="w-[70px] h-[70px] rounded-full bg-purple-400 hover:bg-purple-300"
              onClick={(e) => handleWorking(e)}
              disabled={workStatus !== "leave"}
            >
              夜勤
            </Button>
            <Button
              variant={"outline"}
              className="w-[70px] h-[70px] rounded-full bg-orange-400 hover:bg-orange-300 text-white hover:text-white"
              onClick={(e) => handleWorking(e)}
              disabled={
                !(
                  workStatus === "day_working" || workStatus === "night_working"
                ) || todayAttendance.restStart !== ""
              }
            >
              休憩
            </Button>
            <Button
              variant={"outline"}
              className="w-[70px] h-[70px] rounded-full bg-red-400 hover:bg-red-300 text-white hover:text-white"
              onClick={(e) => handleWorking(e)}
              disabled={
                workStatus !== "day_working" &&
                workStatus !== "night_working" &&
                workStatus !== "rest"
              }
            >
              退勤
            </Button>
          </div>
          <div
            className={`flex flex-col ${nowStatusColor()} p-4 rounded-lg ml-auto`}
          >
            <span className={`${workStatus ? "text-black" : "text-white"}`}>
              現在のステータス:
              <span className="font-bold">
                {workStatus === "day_working"
                  ? "勤務中"
                  : workStatus === "night_working"
                  ? "夜勤中"
                  : workStatus === "rest"
                  ? "休憩中"
                  : workStatus === "leave"
                  ? "退勤中"
                  : "退勤中"}
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
