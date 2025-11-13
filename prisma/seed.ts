import { DAILY_WORK } from "@/types/attendance";
import { prisma } from "@/utils/prisma/prisma";

const getRandomElement = <T>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const getRandomOvertime = () => {
  const values = [0, 10, 20, 30, 40, 50, 60];
  return values[Math.floor(Math.random() * values.length)];
};

// 勤務時間をランダム生成
const generateWorkTimes = (workType: string) => {
  if (workType === "day_working") {
    const startHour = 8 + Math.floor(Math.random() * 2);
    const startMinute = Math.random() < 0.5 ? "00" : "15";
    const endHour = 17 + Math.floor(Math.random() * 2);
    return {
      workStart: `${startHour.toString().padStart(2, "0")}:${startMinute}`,
      workStartType:
        startHour > 9 || (startHour === 9 && startMinute !== "00")
          ? "late"
          : "on_time",
      workEnd: `${endHour.toString().padStart(2, "0")}:00`,
      workEndType: endHour > 18 ? "over_time" : "on_time",
      restStart: "12:00",
      restEnd: "13:00",
    };
  }

  if (workType === "night_working") {
    return {
      workStart: "22:00",
      workStartType: "on_time",
      workEnd: "06:00",
      workEndType: "on_time",
      restStart: "02:00",
      restEnd: "03:00",
    };
  }

  return {
    workStart: null,
    workStartType: null,
    workEnd: null,
    workEndType: null,
    restStart: null,
    restEnd: null,
  };
};

async function main() {
  console.log("🌱 シード開始...");

  // 既存のデータを削除
  await prisma.shift.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.user.deleteMany();

  // ユーザー1: ReoNa
  const users = [
    {
      id: "dummy-user-1",
      email: "reona123@gmail.com",
      name: "ReoNa",
      department: "Sales",
      position: "Designer",
      joinDate: new Date("2023-10-20"),
      paidLeaveTotal: 20,
      paidLeaveUsed: 5,
    },
    {
      id: "dummy-user-2",
      email: "aimer123@gmail.com",
      name: "Aimer",
      department: "Engineering",
      position: "Engineer",
      joinDate: new Date("2025-09-22"),
      paidLeaveTotal: 20,
      paidLeaveUsed: 3,
    },
    {
      id: "dummy-user-3",
      email: "milet123@gmail.com",
      name: "milet",
      department: "Marketing",
      position: "Manager",
      joinDate: new Date("2024-04-15"),
      paidLeaveTotal: 20,
      paidLeaveUsed: 8,
    },
    {
      id: "dummy-user-4",
      email: "raden123@gmail.com",
      name: "らでん",
      department: "Finance",
      position: "Analyst",
      joinDate: new Date("2024-07-01"),
      paidLeaveTotal: 20,
      paidLeaveUsed: 2,
    },
    {
      id: "dummy-user-5",
      email: "azki123@gmail.com",
      name: "AZKi",
      department: "Sales",
      position: "Senior Staff",
      joinDate: new Date("2023-01-10"),
      paidLeaveTotal: 20,
      paidLeaveUsed: 12,
    },
  ];

  const targetMonths = [
    "2025-01",
    "2025-02",
    "2025-03",
    "2025-04",
    "2025-05",
    "2025-06",
    "2025-07",
    "2025-08",
    "2025-09",
    "2025-10",
    "2025-11",
    "2025-12",
  ];

  // 各ユーザーに対してデータ作成
  for (const userData of users) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        isActive: "Employment",
        role: "EMPLOYEE",
      },
    });

    console.log(`👤 ${user.name} を作成しました`);

    for (const month of targetMonths) {
      const attendanceRecords = [];

      // 重複しない日付を生成(Setを使用)
      const uniqueDays = new Set<number>();
      while (uniqueDays.size < 15) {
        uniqueDays.add(Math.floor(Math.random() * 28) + 1);
      }
      const days = Array.from(uniqueDays);

      for (const day of days) {
        const workType = getRandomElement(DAILY_WORK).value;
        const workTimes = generateWorkTimes(workType);
        const overtimeMinutes = getRandomOvertime();

        attendanceRecords.push({
          userId: user.id,
          date: new Date(`${month}-${day.toString().padStart(2, "0")}`),
          workType,
          workStart: workTimes.workStart,
          workStartType: workTimes.workStartType,
          workEnd: workTimes.workEnd,
          workEndType: workTimes.workEndType,
          restStart: workTimes.restStart,
          restEnd: workTimes.restEnd,
          overtimeMinutes,
        });
      }

      await prisma.attendance.createMany({
        data: attendanceRecords,
      });

      console.log(`✅ ${month} の勤怠データを作成しました`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
