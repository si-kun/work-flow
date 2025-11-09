"use client";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getTodayAllAttendance } from "@/actions/attendance/getTodayAllAttendance";
import { allUsers } from "@/atoms/user";
import EmployeeSearchArea from "@/components/common/EmployeeSearchArea";
import { DEPARTMENTS, POSITIONS } from "@/constants/employee";
import { SHIFT_HEADER } from "@/constants/shift";
import { useEmployeeFilter } from "@/hooks/useEmployeeFilter";
import {
  convertToJapanese,
  convertWorkTypeToJapanese,
  getDepartmentCounts,
} from "@/lib/convertToJapanese";
import { DailyWorkType } from "@/types/attendance";
import { Attendance, Shift } from "@prisma/client";
import { useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import ShiftCreateDialog from "@/components/dialog/ShiftCreateDialog";
import { getShiftsToday } from "@/actions/shifts/getShiftsToday";
import { ShiftType } from "@/constants/calendarColor";

export interface ShiftTargetUser {
  id: string;
  name: string;
  department: string;
  position: string;
  shift_type: string;
  work_status: string;
  select: boolean;
}

const ShiftCreatePage = () => {
  const users = useAtomValue(allUsers);
  const [searchEmployee, setSearchEmployee] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [allAttendanceData, setAllAttendanceData] = useState<Attendance[]>([]);
  const [userShiftData, setUserShiftData] = useState<Array<ShiftTargetUser>>(
    []
  );

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const [allShiftData, setAllShiftData] = useState<Shift[]>([]);

  const fetchData = async () => {
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
        shift_type: shift?.shiftType || "未設定",
        work_status: attendance?.workType || "未設定",
        select: false,
      };
    });
    setUserShiftData(mergedData);
  }, [users, allAttendanceData, allShiftData]);

  const filteredUsers = useEmployeeFilter({
    data: userShiftData,
    searchEmployee,
    selectedDepartment,
  });

  const departmentCounts = getDepartmentCounts(users);

  const handleSelect = (id: string) => {
    if (!users) return;

    setUserShiftData((prev) => {
      return prev.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            select: !user.select,
          };
        }
        return user;
      });
    });
  };

  return (
    <div className="w-full">
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Label htmlFor="date" className="px-1">
              表示する日付を選択
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date"
                  className="w-48 justify-between font-normal"
                >
                  {date ? date.toLocaleDateString() : "Select date"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setDate(date!);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <ShiftCreateDialog
            userShiftData={userShiftData}
            setUserShiftData={setUserShiftData}
            onSaveSuccess={fetchData}
          />
        </div>

        {/* 検索フィールド */}
        <EmployeeSearchArea
          users={users}
          setSelectedDepartment={setSelectedDepartment}
          departmentCounts={departmentCounts}
          searchEmployee={searchEmployee}
          setSearchEmployee={setSearchEmployee}
        />
      </header>
      <div className="">
        <ul className="grid grid-cols-5 border border-slate-300 bg-slate-100 font-semibold sticky top-0 z-10">
          {SHIFT_HEADER.map((status) => {
            return (
              <li
                key={status.value}
                className="p-2 border-r border-slate-300 last:border-r-0"
              >
                {status.label}
              </li>
            );
          })}
        </ul>
        <ul className="grid grid-cols-5 border-slate-300 border-l border-r">
          {filteredUsers.map((user) => {
            const userCellData = [
              user.name,
              convertToJapanese(user.department, DEPARTMENTS),
              convertToJapanese(user.position, POSITIONS),
              convertWorkTypeToJapanese(user.shift_type as ShiftType),
              convertWorkTypeToJapanese(user.work_status as DailyWorkType),
            ];

            return (
              <li
                key={user.id}
                className="contents group cursor-pointer"
                onClick={() => handleSelect(user.id)}
              >
                {userCellData.map((data, index) => (
                  <div
                    key={`${user.id}-${index}`}
                    className={`p-2 border-b border-r border-slate-300 group-hover:bg-slate-50 ${
                      user.select ? "bg-amber-200" : ""
                    }`}
                  >
                    {data}
                  </div>
                ))}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ShiftCreatePage;
