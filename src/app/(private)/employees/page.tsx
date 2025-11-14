"use client";

import { useAtomValue } from "jotai";
import EmployeeDialog from "../../../components/dialog/EmployeeDialog";
import {
  DEPARTMENTS,
  EMPLOYEES_TABLE_HEADER,
  EMPLOYMENT_STATUS,
  POSITIONS,
} from "../../../constants/employee";
import { useMemo, useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  convertToJapanese,
  getDepartmentCounts,
} from "@/lib/convertToJapanese";
import { allUsers } from "@/atoms/user";
import { ATTENDANCE_TABLE_HEADER } from "@/constants/attendance";
import AttendanceDetailDialog from "@/components/dialog/AttendanceDetailDialog";
import { minutesToTime } from "@/utils/timeUtils";
import { useAttendanceData } from "@/hooks/attendance/useAttendanceData";
import EmployeeSearchArea from "@/components/common/EmployeeSearchArea";
import SelectYearMonth from "@/components/common/SelectYearMonth";
import { useYearMonth } from "@/hooks/useYearMonth";
import { useEmployeeFilter } from "@/hooks/user/useEmployeeFilter";
import AdminUser from "@/components/AdminUser";

export default function Home() {
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
  const [searchEmployee, setSearchEmployee] = useState<string>("");

  // 期間フィルター
  const { year, month, handleYearChange, handleMonthChange } = useYearMonth();

  const { attendanceData } = useAttendanceData({ year, month });

  const [selectedDepartment, setSelectedDepartment] = useState<string>("");



  const allUser = useAtomValue(allUsers);

  const editEmployee = useMemo(
    () => allUser.find((user) => user.id === editEmployeeId) || null,
    [allUser, editEmployeeId]
  );

  const handeleEditTarget = (id: string) => {
    setEditEmployeeId((prev) => (prev === id ? null : id));
    setOpenEmployeeDialog(true);
    console.log(editEmployeeId);
  };

  // 検索機能
  const searchedAndFilteredEmployees = useEmployeeFilter({
    data: allUser,
    searchEmployee,
    selectedDepartment,
  });

  const filteredAttendanceData = useEmployeeFilter({
    data: attendanceData,
    searchEmployee,
    selectedDepartment,
  });

  const departmentCounts = getDepartmentCounts(allUser);

  const frameClass = EMPLOYEES_TABLE_HEADER.map((header) =>
    header.label === "名前" || header.label === "メールアドレス"
      ? "flex-1"
      : "w-[200px]"
  ).join(" ");

  return (
    <div className=" flex flex-col">
      <Tabs defaultValue="basic" className="flex flex-1 flex-col h-full">
        <header className="flex items-center gap-4 p-5">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold">社員一覧</h1>
            <TabsList>
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="attendance">勤怠データ</TabsTrigger>
            </TabsList>
          </div>

          <div className="ml-auto flex items-center gap-4">
            {/*======================= 検索エリア =======================  */}
            <EmployeeSearchArea
              users={allUser}
              setSelectedDepartment={setSelectedDepartment}
              departmentCounts={departmentCounts}
              searchEmployee={searchEmployee}
              setSearchEmployee={setSearchEmployee}
            />
            {/*======================= 従業員追加ボタン =======================  */}
            <EmployeeDialog
              openEmployeeDialog={openEmployeeDialog}
              setOpenEmployeeDialog={setOpenEmployeeDialog}
              mode={editEmployeeId ? "edit" : "add"}
              editEmployee={editEmployee}
              setEditEmployeeId={setEditEmployeeId}
            />
          </div>
        </header>

        <TabsContent value="basic" className="flex-1 h-full  overflow-y-auto">
          {/* ヘッダーナビ */}
          <div className="flex-1 h-full">
            {/* ヘッダー部分 */}
            <div className="bg-slate-50 border border-slate-300 flex sticky top-0 z-10">
              {EMPLOYEES_TABLE_HEADER.map((header, idx) => (
                <span
                  key={header.id}
                  className={`${
                    frameClass.split(" ")[idx]
                  } px-3 py-2.5 text-slate-900 border-r border-slate-300 last:border-0 font-medium`}
                >
                  {header.label}
                </span>
              ))}
            </div>

            {/* データ部分 */}
            <div className="flex-1 border border-t-0">
              {searchedAndFilteredEmployees.map((employee) => {
                const cellData = [
                  <AdminUser key={employee.id} user={employee} />,
                  convertToJapanese(employee.department, DEPARTMENTS),
                  convertToJapanese(employee.position, POSITIONS),
                  employee.email,
                  employee.joinDate.toLocaleDateString(),
                  convertToJapanese(employee.isActive, EMPLOYMENT_STATUS),
                ];

                return (
                  <div
                    className="flex border-b border-slate-300  hover:bg-slate-100 hover:cursor-pointer"
                    key={employee.name}
                    onClick={() => handeleEditTarget(employee.id)}
                  >
                    {cellData.map((data, index) => {
                      const cellClass =
                        index === 0 || index === 3 ? "flex-1" : "w-[200px]";
                      return (
                        <span
                          key={index}
                          className={`${cellClass} px-3 py-2.5 text-slate-900 border-r border-slate-300 last:border-r-0`}
                        >
                          {data}
                        </span>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="attendance"
          className="flex-1 h-full  overflow-y-auto"
        >
          {/* 期間選択 */}
          <SelectYearMonth
            handleYearChange={handleYearChange}
            handleMonthChange={handleMonthChange}
            year={year}
            month={month}
          />
          <div className="bg-slate-50 border border-slate-300 flex sticky top-0 z-10">
            {/* ヘッダー部分 */}
            {ATTENDANCE_TABLE_HEADER.map((header) => (
              <span
                key={header.id}
                className="w-[300px] px-3 py-2.5 text-slate-900 border-r border-slate-300 last:border-0 font-medium"
              >
                {header.label}
              </span>
            ))}
          </div>
          {/* テーブル部分 */}
          <div className="flex flex-col border border-slate-300 border-t-0">
            {filteredAttendanceData.map((data) => {
              const cellData = [
                <AdminUser key={data.userId} user={data} />,
                convertToJapanese(data.department, DEPARTMENTS),
                convertToJapanese(data.position, POSITIONS),
                minutesToTime(data.totalWorkHours),
                minutesToTime(data.nightWorkHours),
                minutesToTime(data.overtimeHours),
                `${data.paidLeaveUsed}日 / ${data.paidLeaveRemaining}日`,
                data.absentDays + "日",
              ];

              return (
                <AttendanceDetailDialog
                  key={data.userId}
                  cellData={cellData}
                  userId={data.userId}
                  userName={data.name}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
