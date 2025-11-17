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
import { allUsers } from "@/atoms/user";
import EmployeeSearchArea from "@/components/common/EmployeeSearchArea";
import { DEPARTMENTS, POSITIONS } from "@/constants/employee";
import { SHIFT_HEADER } from "@/constants/shift";
import { useEmployeeFilter } from "@/hooks/user/useEmployeeFilter";
import {
  convertToJapanese,
  convertWorkTypeToJapanese,
  getDepartmentCounts,
} from "@/lib/convertToJapanese";
import { DailyWorkType } from "@/types/attendance";
import { useAtomValue } from "jotai";
import React, { useState } from "react";
import ShiftCreateDialog from "@/components/dialog/ShiftCreateDialog";
import { ShiftType } from "@/constants/calendarColor";
import { useShiftListData } from "@/hooks/shift/useShiftListData";
import DataTable from "@/components/common/DataTable";
import AdminUser from "@/components/AdminUser";

const ShiftCreatePage = () => {
  const users = useAtomValue(allUsers);
  const [searchEmployee, setSearchEmployee] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());


   const {loading,userShiftData,refetch,setUserShiftData} = useShiftListData(date);

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
    <div className="w-full h-full flex flex-col">
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
            onSaveSuccess={refetch}
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
      <div className="overflow-y-auto flex-1">
        <DataTable
        headers={SHIFT_HEADER}
        rows={filteredUsers.map((user) => ({
          id: user.id,
          isSelected: user.select,
          data: [
            <AdminUser key={user.id} user={user} />,
            convertToJapanese(user.department, DEPARTMENTS),
            convertToJapanese(user.position, POSITIONS),
            convertWorkTypeToJapanese(user.shift_type as ShiftType),
            convertWorkTypeToJapanese(user.work_status as DailyWorkType),
          ]
        }))}
        onRowClick={(id) => handleSelect(id)}
        loading={loading}
        />
      </div>
    </div>
  );
};

export default ShiftCreatePage;
