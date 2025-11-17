"use client";

import { getTodayAllAttendance } from "@/actions/attendance/getTodayAllAttendance";
import { getShiftsToday } from "@/actions/shifts/getShiftsToday";
import { allUsers } from "@/atoms/user";
import { Attendance, Shift } from "@prisma/client";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export interface ShiftTargetUser {
  id: string;
  name: string;
  department: string;
  position: string;
  shift_type: string;
  work_status: string;
  role: string;
  select?: boolean;
}

export const useShiftListData = (date: Date) => {
  const users = useAtomValue(allUsers);
  const [userShiftData, setUserShiftData] = useState<Array<ShiftTargetUser>>(
    []
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [allShiftData, setAllShiftData] = useState<Shift[]>([]);
  const [allAttendanceData, setAllAttendanceData] = useState<Attendance[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const attendanceResponse = await getTodayAllAttendance(date);

      if (attendanceResponse.success) {
        setAllAttendanceData(attendanceResponse.data);
      }

      const shiftResponse = await getShiftsToday(date);

      if (shiftResponse.success) {
        setAllShiftData(shiftResponse.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    // userShiftにusersとallAttendanceDataをマージしてセットする
    if (!users) return;

    const mergedData = users.map((user) => {
      const attendance = allAttendanceData.find(
        (att) => att.userId === user.id
      );

      const shift = allShiftData.find((sft) => sft.userId === user.id);

      return {
        id: user.id,
        name: user.name,
        department: user.department,
        position: user.position,
        role: user.role,
        shift_type: shift?.shiftType || "未設定",
        work_status: attendance?.workType || "未設定",
      };
    });
    setUserShiftData(mergedData);
  }, [users, allAttendanceData, allShiftData]);

  return {
    loading,
    userShiftData,

    // createのみ
    refetch: fetchData,
    setUserShiftData,
  };
};
