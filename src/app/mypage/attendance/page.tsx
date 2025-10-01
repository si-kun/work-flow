"use client";

import Calendar from "@/components/calendar/Calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { determineClockInType } from "@/utils/attendanceUtils";
import React, { useEffect, useState } from "react";

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

  // 現在の日時
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const day = now.getDay();

  // 時間
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // 曜日の配列
  const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
  const dayOfWeek = daysOfWeek[day];

  // 時間表示の定数
  const nowDisplay = `${hours}時${minutes}分${seconds}秒`;

  const [workStatus, setWorkStatus] = useState<WorkStatus>("leave");

  const [todayAttendance, setTodayAttendance] = useState({
    workStatus: "",
    workStart: "",
    workStartType: "" as "early_arrival" | "on_time" | "late" | "",
    calculationStart: "",
    workEnd: "",
    restStart: "",
    overTime: "",
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
    const currentTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    if (buttonText === "出勤") {
      const result = determineClockInType(currentTime, "day_working");
      setWorkStatus("day_working");
      setTodayAttendance((prev) => ({
        ...prev,
        workStatus: "day_working",
        workStart: currentTime,
        workStartType: result.type,
        calculationStart: result.calculationTime,
      }));
    } else if (buttonText === "夜勤") {
      const result = determineClockInType(currentTime, "night_working");
      setWorkStatus("night_working");
      setTodayAttendance((prev) => ({
        ...prev,
        workStatus: "night_working",
        workStart: currentTime,
        workStartType: result.type,
        calculationStart: result.calculationTime,
      }));
    } else if ((e.target as HTMLButtonElement).textContent === "休憩") {
      setWorkStatus("rest");
      setTodayAttendance((prev) => ({
        ...prev,
        workStatus: "rest",
        restStart: `${hours}:${minutes}`,
      }));
    } else if ((e.target as HTMLButtonElement).textContent === "退勤") {
      setWorkStatus("leave");
      setTodayAttendance((prev) => ({
        ...prev,
        workStatus: "leave",
        workEnd: currentTime,
      }));
    }
  };

  // デバッグuseEffect
  useEffect(() => {
    console.log(workStatus);
  }, [workStatus]);

  return (
    <div className="p-10 grid grid-cols-2 gap-10 h-screen overflow-hidden">
      {/* ======== 左側のエリア ======== */}
      <div className="flex flex-col">
        {/* ======== 出退勤ボタンなどのエリア ======== */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span>
              今日は{year}年{month + 1}月{date}日{dayOfWeek}曜日
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
                workStatus !== "day_working" && workStatus !== "night_working"
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
          setPaidLeaveDays={setPaidLeaveDays}
          setAcquiredPaidLeaveDays={setAcquiredPaidLeaveDays}
          setWorkingHours={setWorkingHours}
          setOvertimeHours={setOvertimeHours}
          setAbsentDays={setAbsentDays}
          setNightShiftHours={setNightShiftHours}
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
                  {workingHours}時間 (夜勤:{nightShiftHours}時間)
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>残業時間</CardTitle>
                </CardHeader>
                <CardContent>{overtimeHours}時間</CardContent>
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

          {/* 当日の勤怠データ */}
          <div>
            <Card className="w-[200px] flex flex-col gap-2">
              <CardHeader>
                <span>当日の勤怠データ</span>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div>
                  <span>出勤:</span>
                  <span>{todayAttendance.workStart}</span>
                  {todayAttendance.workStartType === "early_arrival" && (
                    <span>(早出)</span>
                  )}
                  {todayAttendance.workStartType === "late" && (
                    <span>(遅刻)</span>
                  )}
                </div>
                <div>
                  <span>退勤:</span>
                  <span>{todayAttendance.workEnd}</span>
                </div>

                <div>
                  <span>休憩:</span>
                  <span>{todayAttendance.restStart}</span>
                </div>
                <div>
                  <span>残業:</span>
                  <span>{todayAttendance.overTime}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
