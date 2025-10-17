import { ClockInType, ClockOutType, DailyWorkType } from "@/types/attendance";
import { prisma } from "@/utils/prisma/prisma";

async function main() {
  console.log("シードデータの投入を開始します...");

  // 既存のデータを削除(開発環境のみ)
  await prisma.attendance.deleteMany();
  await prisma.user.deleteMany();

  // ユーザー1: ReoNa
  const user1 = await prisma.user.create({
    data: {
      id: "dummy-user-1",
      email: "reona123@gmail.com",
      name: "ReoNa",
      department: "営業部",
      position: "デザイナー",
      joinDate: new Date("2023-10-20"),
      isActive: "Employment",
      role: "EMPLOYEE",
      paidLeaveTotal: 20,
      paidLeaveUsed: 5,
    },
  });

  // ReoNaの9月の勤怠データ(5日分)
  const reonaSeptemberData = [
    {
      day: 1,
      workType: "day_working",
      workStart: "09:15",
      workStartType: "late",
      workEnd: "18:00",
      workEndType: "on_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 0,
    },
    {
      day: 2,
      workType: "day_working",
      workStart: "09:00",
      workStartType: "on_time",
      workEnd: "17:30",
      workEndType: "early_leave",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 0,
    },
    {
      day: 3,
      workType: "day_working",
      workStart: "08:45",
      workStartType: "early_arrival",
      workEnd: "19:00",
      workEndType: "over_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 60,
    },
    {
      day: 4,
      workType: "paid",
      workStart: null,
      workStartType: null,
      workEnd: null,
      workEndType: null,
      restStart: null,
      restEnd: null,
      overtimeMinutes: 0,
    },
    {
      day: 5,
      workType: "day_working",
      workStart: "09:30",
      workStartType: "late",
      workEnd: "18:00",
      workEndType: "on_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 0,
    },
  ];

  for (const dayData of reonaSeptemberData) {
    await prisma.attendance.create({
      data: {
        userId: user1.id,
        date: new Date(`2025-09-${dayData.day.toString().padStart(2, "0")}`),
        workType: dayData.workType as DailyWorkType,
        workStart: dayData.workStart,
        workStartType: dayData.workStartType as ClockInType | null,
        workEnd: dayData.workEnd,
        workEndType: dayData.workEndType as ClockOutType | null,
        restStart: dayData.restStart,
        restEnd: dayData.restEnd,
        overtimeMinutes: dayData.overtimeMinutes,
      },
    });
  }

  console.log("ReoNaの9月データを作成しました");

  console.log("シード完了!");

  const reonaOctoberData = [
    {
      day: 1,
      workType: "day_working",
      workStart: "09:00",
      workStartType: "on_time",
      workEnd: "18:00",
      workEndType: "on_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 0,
    },
    {
      day: 2,
      workType: "day_working",
      workStart: "09:00",
      workStartType: "on_time",
      workEnd: "18:00",
      workEndType: "on_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 0,
    },
    {
      day: 3,
      workType: "paid",
      workStart: null,
      workStartType: null,
      workEnd: null,
      workEndType: null,
      restStart: null,
      restEnd: null,
      overtimeMinutes: 0,
    },
    {
      day: 4,
      workType: "day_off",
      workStart: null,
      workStartType: null,
      workEnd: null,
      workEndType: null,
      restStart: null,
      restEnd: null,
      overtimeMinutes: 0,
    },
    {
      day: 5,
      workType: "day_off",
      workStart: null,
      workStartType: null,
      workEnd: null,
      workEndType: null,
      restStart: null,
      restEnd: null,
      overtimeMinutes: 0,
    },
  ];

  for (const dayData of reonaOctoberData) {
    await prisma.attendance.create({
      data: {
        userId: user1.id,
        date: new Date(`2025-10-${dayData.day.toString().padStart(2, "0")}`),
        workType: dayData.workType as DailyWorkType,
        workStart: dayData.workStart,
        workStartType: dayData.workStartType as ClockInType | null,
        workEnd: dayData.workEnd,
        workEndType: dayData.workEndType as ClockOutType | null,
        restStart: dayData.restStart,
        restEnd: dayData.restEnd,
        overtimeMinutes: dayData.overtimeMinutes,
      },
    });
  }

  console.log("ReoNaの10月データを作成しました");

  // ユーザー2: Aimer
  const user2 = await prisma.user.create({
    data: {
      id: "dummy-user-2",
      email: "aimer123@gmail.com",
      name: "Aimer",
      department: "技術部",
      position: "エンジニア",
      joinDate: new Date("2025-09-22"),
      isActive: "Employment",
      role: "EMPLOYEE",
      paidLeaveTotal: 20,
      paidLeaveUsed: 3,
    },
  });

  console.log("ユーザーデータを作成しました");

  // Aimerの9月の勤怠データ(5日分)
  const aimerSeptemberData = [
    {
      day: 1,
      workType: "night_working",
      workStart: "20:45",
      workStartType: "early_arrival",
      workEnd: "06:30",
      workEndType: "over_time",
      restStart: "00:00",
      restEnd: "01:00",
      overtimeMinutes: 30,
    },
    {
      day: 2,
      workType: "day_working",
      workStart: "09:20",
      workStartType: "late",
      workEnd: "18:00",
      workEndType: "on_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 0,
    },
    {
      day: 3,
      workType: "absenteeism",
      workStart: null,
      workStartType: null,
      workEnd: null,
      workEndType: null,
      restStart: null,
      restEnd: null,
      overtimeMinutes: 0,
    },
    {
      day: 4,
      workType: "day_working",
      workStart: "09:00",
      workStartType: "on_time",
      workEnd: "22:00",
      workEndType: "over_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 240,
    },
    {
      day: 5,
      workType: "paid_pending",
      workStart: null,
      workStartType: null,
      workEnd: null,
      workEndType: null,
      restStart: null,
      restEnd: null,
      overtimeMinutes: 0,
    },
  ];

  // ループで9月のデータを作成
  for (const dayData of aimerSeptemberData) {
    await prisma.attendance.create({
      data: {
        userId: user2.id,
        date: new Date(`2025-09-${dayData.day.toString().padStart(2, "0")}`),
        workType: dayData.workType as DailyWorkType,
        workStart: dayData.workStart,
        workStartType: dayData.workStartType as ClockInType | null,
        workEnd: dayData.workEnd,
        workEndType: dayData.workEndType as ClockOutType | null,
        restStart: dayData.restStart,
        restEnd: dayData.restEnd,
        overtimeMinutes: dayData.overtimeMinutes,
      },
    });
  }

  console.log("Aimerの9月データを作成しました");

  // Aimerの10月の勤怠データ(3日分)
  const aimerOctoberData = [
    {
      day: 1,
      workType: "night_working",
      workStart: "21:00",
      workStartType: "on_time",
      workEnd: "06:00",
      workEndType: "on_time",
      restStart: "00:00",
      restEnd: "01:00",
      overtimeMinutes: 0,
    },
    {
      day: 2,
      workType: "absenteeism",
      workStart: null,
      workStartType: null,
      workEnd: null,
      workEndType: null,
      restStart: null,
      restEnd: null,
      overtimeMinutes: 0,
    },
    {
      day: 3,
      workType: "day_working",
      workStart: "09:00",
      workStartType: "on_time",
      workEnd: "20:00",
      workEndType: "over_time",
      restStart: "12:00",
      restEnd: "13:00",
      overtimeMinutes: 120,
    },
  ];

  // ループで10月のデータを作成
  for (const dayData of aimerOctoberData) {
    await prisma.attendance.create({
      data: {
        userId: user2.id,
        date: new Date(`2025-10-${dayData.day.toString().padStart(2, "0")}`),
        workType: dayData.workType as DailyWorkType,
        workStart: dayData.workStart,
        workStartType: dayData.workStartType as ClockInType | null,
        workEnd: dayData.workEnd,
        workEndType: dayData.workEndType as ClockOutType | null,
        restStart: dayData.restStart,
        restEnd: dayData.restEnd,
        overtimeMinutes: dayData.overtimeMinutes,
      },
    });
  }

  console.log("Aimerの10月データを作成しました");
  console.log("シード完了!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
