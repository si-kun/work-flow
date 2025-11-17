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
import { ShiftType } from "@/constants/calendarColor";
import ShiftListDialog from "./components";
import { useShiftListData } from "@/hooks/shift/useShiftListData";
import AdminUser from "@/components/AdminUser";
import DataTable from "@/components/common/DataTable";

const ShiftListPage = () => {
  const users = useAtomValue(allUsers);
  const [searchEmployee, setSearchEmployee] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  // dialog用
  const [isOpen, setIsOpen] = useState(false);

  const { loading, userShiftData } = useShiftListData(date);

  const filteredUsers = useEmployeeFilter({
    data: userShiftData,
    searchEmployee,
    selectedDepartment,
  });

  const departmentCounts = getDepartmentCounts(users);

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsOpen(true);
  };

  return (
    <div className="w-full flex flex-col h-full">
      <ShiftListDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        userId={selectedUserId}
        userShiftData={userShiftData}
      />
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
      <div className="flex-1 overflow-y-auto">
        <DataTable
          headers={SHIFT_HEADER}
          rows={filteredUsers.map((user) => ({
            id: user.id,
            data: [
              <AdminUser key={user.id} user={user} />,
              convertToJapanese(user.department, DEPARTMENTS),
              convertToJapanese(user.position, POSITIONS),
              convertWorkTypeToJapanese(user.shift_type as ShiftType),
              convertWorkTypeToJapanese(user.work_status as DailyWorkType),
            ],
          }))}
          onRowClick={handleUserClick}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ShiftListPage;
