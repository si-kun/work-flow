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
import DataTable from "@/components/common/DataTable";

export default function Home() {
  const users = useAtomValue(allUsers);

  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
  const [searchEmployee, setSearchEmployee] = useState<string>("");

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  // 期間フィルター
  const { year, month, handleYearChange, handleMonthChange } = useYearMonth();

  const { attendanceData } = useAttendanceData({ year, month });

  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const editEmployee = useMemo(
    () => users.find((user) => user.id === editEmployeeId) || null,
    [users, editEmployeeId]
  );

  const handeleEditTarget = (id: string) => {
    setEditEmployeeId((prev) => (prev === id ? null : id));
    setOpenEmployeeDialog(true);
  };

  const handleDetailDialog = (id: string) => {
    setOpenDetailDialog(true);
    setSelectedUserId(id);
  };

  // 検索機能
  const searchedAndFilteredEmployees = useEmployeeFilter({
    data: users,
    searchEmployee,
    selectedDepartment,
  });

  const filteredAttendanceData = useEmployeeFilter({
    data: attendanceData,
    searchEmployee,
    selectedDepartment,
  });

  const departmentCounts = getDepartmentCounts(users);

  return (
    <div className="flex flex-col h-full">
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
              users={users}
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

        <TabsContent value="basic" className="flex-1 h-full overflow-y-auto">
          <DataTable
            headers={EMPLOYEES_TABLE_HEADER}
            rows={searchedAndFilteredEmployees.map((employee) => ({
              id: employee.id,
              data: [
                <AdminUser key={employee.id} user={employee} />,
                convertToJapanese(employee.department, DEPARTMENTS),
                convertToJapanese(employee.position, POSITIONS),
                employee.email,
                employee.joinDate.toLocaleDateString(),
                convertToJapanese(employee.isActive, EMPLOYMENT_STATUS),
              ],
            }))}
            onRowClick={(id) => handeleEditTarget(id)}
          />
        </TabsContent>

        <TabsContent
          value="attendance"
          className="flex-1 flex flex-col h-full gap-4 overflow-y-auto"
        >
          {/* 期間選択 */}
          <SelectYearMonth
            handleYearChange={handleYearChange}
            handleMonthChange={handleMonthChange}
            year={year}
            month={month}
          />
          <div className="flex-1 w-full h-full overflow-y-auto">
            <DataTable
              headers={ATTENDANCE_TABLE_HEADER}
              rows={filteredAttendanceData.map((data) => ({
                id: data.userId,
                data: [
                  <AdminUser key={data.userId} user={data} />,
                  convertToJapanese(data.department, DEPARTMENTS),
                  convertToJapanese(data.position, POSITIONS),
                  minutesToTime(data.totalWorkHours),
                  minutesToTime(data.nightWorkHours),
                  minutesToTime(data.overtimeHours),
                  `${data.paidLeaveUsed}日 / ${data.paidLeaveRemaining}日`,
                  data.absentDays + "日",
                ],
              }))}
              onRowClick={(id) => handleDetailDialog(id)}
            />
          </div>
          {selectedUser && (
            <AttendanceDetailDialog
              open={openDetailDialog}
              setOpen={setOpenDetailDialog}
              userId={selectedUser.id}
              userName={selectedUser.name}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
