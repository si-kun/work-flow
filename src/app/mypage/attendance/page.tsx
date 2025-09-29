"use client";

import Calendar from "@/components/calendar/Calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";

const Attendance = () => {
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

  const [isWorking, setIsWorking] = useState(false);

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
              onClick={() => setIsWorking(true)}
              disabled={isWorking}
            >
              出勤
            </Button>
            <Button
              variant={"outline"}
              className="w-[70px] h-[70px] rounded-full bg-red-400 hover:bg-red-300 text-white hover:text-white"
              onClick={() => setIsWorking(false)}
              disabled={!isWorking}
            >
              退勤
            </Button>
          </div>
          <div
            className={`flex flex-col ${
              isWorking ? "bg-green-300" : "bg-red-300"
            } p-4 rounded-lg`}
          >
            <span className={`${isWorking ? "text-black" : "text-white"}`}>
              現在のステータス:
              <span className="font-bold">
                {isWorking ? "勤務中" : "退勤中"}
              </span>
            </span>
            <span className={`${isWorking ? "text-black" : "text-white"}`}>
              タイムカード時間:{" "}
              <span className="font-bold">
                {nowDisplay}に {isWorking ? "出勤" : "退勤"}
              </span>
            </span>
          </div>
        </div>
        {/* ======== 出退勤ボタンなどのエリア ======== */}
        {/* ======== 表示するカレンダーのエリア ======== */}
        <Calendar />
        {/* ======== 表示するカレンダーのエリア ======== */}
      </div>
      {/* ======== 左側のエリア ======== */}
      {/* ======== 右側のエリア ======== */}
      <div>
        <div>
          <h2 className="text-2xl font-bold mb-4">勤怠管理</h2>
          <div>
            <span>有給日数</span>
            <div className="flex gap-4">
              <Card  className="flex-1">
                <CardHeader>
                  <CardTitle>残りの有給日数</CardTitle>
                </CardHeader>
                <CardContent>10日</CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>申請中の有給日数</CardTitle>
                </CardHeader>
                <CardContent>1日</CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>今月の有給日数</CardTitle>
                </CardHeader>
                <CardContent>1日</CardContent>
              </Card>
            </div>
          </div>
          <div>
            <span>勤務詳細</span>
            <div className="flex gap-4">
              <Card  className="flex-1">
                <CardHeader>
                  <CardTitle>出勤時間</CardTitle>
                </CardHeader>
                <CardContent>168時間</CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>残業時間</CardTitle>
                </CardHeader>
                <CardContent>20時間</CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>欠勤日数</CardTitle>
                </CardHeader>
                <CardContent>1日</CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
