"use client";

import { useAtomValue } from "jotai";
import EmployeeDialog from "../../../components/dialog/EmployeeDialog";
import {
  DEPARTMENTS,
  EMPLOYEES_TABLE_HEADER,
  EMPLOYMENT_STATUS,
  POSITIONS,
} from "../../../constants/employee";
import { useEffect, useMemo, useState } from "react";
import { useFetchAllUsers } from "@/lib/fetchAllUser";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import {
  convertToJapanese,
  getDepartmentCounts,
} from "@/lib/convertToJapanese";
import { allUsers } from "@/atoms/user";
import {
  ATTENDANCE_TABLE_HEADER,
  MonthlySummaryData,
} from "@/constants/attendance";
import AttendanceDetailDialog from "@/components/dialog/AttendanceDetailDialog";
import { getMonthlySummary } from "@/actions/attendance/summary/getMonthlySummary";
import { minutesToTime } from "@/utils/timeUtils";

export default function Home() {
  useFetchAllUsers(); // 初回レンダリング時に全ユーザーを取得
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
  const [searchEmployee, setSearchEmployee] = useState<string>("");

  // 期間フィルター
  const [selectedDate, setSelectedDate] = useState(new Date());
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  const handleYearChange = (year: string) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(parseInt(year));
      return newDate;
    });
  };
  const handleMonthChange = (month: string) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(parseInt(month) - 1);
      return newDate;
    });
  };

  const [fetchedAttendanceMonthData, setFetchedAttendanceMonthData] = useState<
    MonthlySummaryData[]
  >([]);

  // ユーザーの情報をサーバーアクションで取得
  useEffect(() => {
    const getAllAttendanceData = async () => {
      try {
        const response = await getMonthlySummary(year, month);

        if (response.success) {
          setFetchedAttendanceMonthData(response.data);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };
    getAllAttendanceData();
  }, [year, month]);

  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const allUser = useAtomValue(allUsers);

  const editEmployee = useMemo(
    () => allUser.find((user) => user.id === editEmployeeId) || null,
    [allUser, editEmployeeId]
  );

  const handeleEditTarget = (id: string) => {
    setEditEmployeeId((prev) => (prev === id ? null : id));
    setOpenEmployeeDialog(true);
    console.log(editEmployeeId)
  };

  // 検索機能
  const searchedAndFilteredEmployees = useMemo(() => {
    let filtered = allUser;

    // 名前での絞り込み
    if (searchEmployee !== "") {
      filtered = filtered.filter((data) =>
        data.name.toLowerCase().includes(searchEmployee.toLowerCase())
      );
    }

    // 部署での絞り込み
    if (selectedDepartment !== "" && selectedDepartment !== "All") {
      filtered = filtered.filter(
        (data) => data.department === selectedDepartment
      );
    }
    return filtered;
  }, [allUser, searchEmployee, selectedDepartment]);

  // 勤怠用のフィルタリング
  const filteredAttendanceData = useMemo(() => {
    let filtered = fetchedAttendanceMonthData;

    // 名前での絞り込み
    if (searchEmployee !== "") {
      filtered = filtered.filter((data) =>
        data.name.toLowerCase().includes(searchEmployee.toLowerCase())
      );
    }

    // 部署での絞り込み
    if (selectedDepartment !== "" && selectedDepartment !== "All") {
      filtered = filtered.filter(
        (data) => data.department === selectedDepartment
      );
    }

    return filtered;
  }, [fetchedAttendanceMonthData, searchEmployee, selectedDepartment]);

  const departmentCounts = getDepartmentCounts(allUser);
  console.log(departmentCounts);

  const frameClass = EMPLOYEES_TABLE_HEADER.map((header) =>
    header.label === "名前" || header.label === "メールアドレス"
      ? "flex-1"
      : "w-[200px]"
  ).join(" ");

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col p-4">
      <Tabs defaultValue="basic" className="flex flex-1 flex-col h-full">
        <header className="flex items-center gap-4 p-5">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold">社員一覧</h1>
            <TabsList>
              <TabsTrigger value="basic">基本情報</TabsTrigger>
              <TabsTrigger value="attendance">勤怠データ</TabsTrigger>
            </TabsList>
          </div>

          {/*======================= 検索エリア =======================  */}
          <div className="flex items-center ml-auto space-x-2">
            <Select onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={"部署を選択"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>部署</SelectLabel>
                  {DEPARTMENTS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {`${option.label} (${
                        option.value === "All"
                          ? allUser.length
                          : departmentCounts[option.value] ?? 0
                      })`}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="ml-auto relative">
              <Search className="absolute top-[50%] left-2 transform -translate-y-[50%]  text-gray-400" />
              <Input
                className="pl-10"
                placeholder="従業員名を検索"
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
              />
            </div>
          </div>
          {/*======================= 検索エリア =======================  */}
          <EmployeeDialog
            openEmployeeDialog={openEmployeeDialog}
            setOpenEmployeeDialog={setOpenEmployeeDialog}
            mode={editEmployeeId ? "edit" : "add"}
            editEmployee={editEmployee}
            setEditEmployeeId={setEditEmployeeId}
          />
        </header>

        <TabsContent value="basic" className="flex-1 h-full  overflow-y-auto">
          {/* ヘッダーナビ */}
          <div className="flex-1 h-full">
            {/* ヘッダー部分 */}
            <div className="bg-slate-50 border border-slate-300 flex sticky top-0 z-10">
              <span></span>
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
                  employee.name,
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
          <div className="flex items-center gap-2 mb-4">
            <Select onValueChange={handleYearChange} value={year.toString()}>
              <SelectTrigger>
                <SelectValue placeholder={year} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>年</SelectLabel>
                  {[...Array(6)].map((_, i) => (
                    <SelectItem key={i} value={(2020 + i).toString()}>
                      {2020 + i}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={handleMonthChange} value={month.toString()}>
              <SelectTrigger>
                <SelectValue placeholder={month} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>月</SelectLabel>
                  {[...Array(12)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
                data.name,
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
