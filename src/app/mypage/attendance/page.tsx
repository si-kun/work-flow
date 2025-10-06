"use client";

import Calendar from "@/components/calendar/Calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceData } from "@/types/attendance";
import { determineClockInType } from "@/utils/attendanceUtils";
import { formatTime, minutesToTime, restOneHour, timeToMinutes } from "@/utils/timeUtils";
import React, { useEffect, useState } from "react";
import AttendanceCard from "./components/AttendanceCard";
import { format } from "date-fns";

type WorkStatus = "day_working" | "night_working" | "rest" | "leave";

const Attendance = () => {
  // 有給日数
  const [paidLeaveDays, setPaidLeaveDays] = useState(10);
  // 取得有給日数
  const [acquiredPaidLeaveDays, setAcquiredPaidLeaveDays] = useState(0);
  // 出勤時間
  const [workingHours, setWorkingHours] = useState(0);
  // 夜勤時間
  const [nightShiftHours, setNightShiftHours] = useState(0);
  // 残業時間
  const [overtimeHours, setOvertimeHours] = useState(0);
  // 欠勤日数
  const [absentDays, setAbsentDays] = useState(0);
  // 選択されたシフトタイプ
  const [currentShiftType, setCurrentShiftType] = useState<
    "day_working" | "night_working" | null
  >(null);

  // 現在の日時
  const now = new Date();
  const nowDisplay = format(now, "HH:mm:ss");

  const [workStatus, setWorkStatus] = useState<WorkStatus>("leave");
  const [previousWorkStatus, setPreviousWorkStatus] =
    useState<WorkStatus>("leave");

  const [todayAttendance, setTodayAttendance] = useState<AttendanceData>({
    date: format(now, "yyyy-MM-dd"),
    workType: null,
    workStart: "",
    workStartType: null,
    calculationStart: "",
    workEnd: "",
    workEndType: null,
    restStart: "",
    restEnd: "",
    overtimeMinutes: 0,
  });

  const [selectedAttendance, setSelectedAttendance] = useState<AttendanceData>({
    date: "",
    workType: null,
    workStart: "",
    workStartType: null,
    calculationStart: "",
    workEnd: "",
    workEndType: null,
    restStart: "",
    restEnd: "",
    overtimeMinutes: 0,
  });

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
      const restEndMinutes = timeToMinutes(todayAttendance.restEnd);

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
            <span>
              今日は{format(now, `yyyy年MM月dd日(eee)`)}
            </span>
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
          setAcquiredPaidLeaveDays={setAcquiredPaidLeaveDays}
          setWorkingHours={setWorkingHours}
          setOvertimeHours={setOvertimeHours}
          setAbsentDays={setAbsentDays}
          setNightShiftHours={setNightShiftHours}
          setSelectedAttendance={setSelectedAttendance}
        />
        {/* ======== 表示するカレンダーのエリア ======== */}
      </div>
      {/* ======== 左側のエリア ======== */}
      {/* ======== 右側のエリア ======== */}
      <div>
        <div>
          <h2 className="text-2xl font-bold mb-4">勤怠管理</h2>
          {/* カード群 */}
          <div>
            <span>有給日数</span>
            <div className="flex gap-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>残りの有給日数</CardTitle>
                </CardHeader>
                <CardContent>
                  {paidLeaveDays - acquiredPaidLeaveDays}日
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>申請中の有給日数</CardTitle>
                </CardHeader>
                <CardContent>日</CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>今月の有給日数</CardTitle>
                </CardHeader>
                <CardContent>{acquiredPaidLeaveDays}日</CardContent>
              </Card>
            </div>
          </div>
          <div>
            <span>勤務詳細</span>
            <div className="flex gap-4">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>出勤時間</CardTitle>
                </CardHeader>
                <CardContent>
                  {minutesToTime(workingHours)} (夜勤:{minutesToTime(nightShiftHours)})
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>残業時間</CardTitle>
                </CardHeader>
                <CardContent>{minutesToTime(overtimeHours)}</CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>欠勤日数</CardTitle>
                </CardHeader>
                <CardContent>{absentDays}日</CardContent>
              </Card>
            </div>
          </div>
          {/* カード群 */}

          {/* 勤怠データ */}
          <div className="flex gap-4">
            <AttendanceCard todayAttendance={todayAttendance} />
            <AttendanceCard todayAttendance={selectedAttendance} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
