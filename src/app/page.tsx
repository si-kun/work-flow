"use client";

import { useAtomValue } from "jotai";
import EmployeeDialog from "../components/dialog/EmployeeDialog";
import {
  EMPLOYEE_INPUT_FIELDS,
  EMPLOYEES_TABLE_HEADER,
} from "../constants/employee";
import { useEffect, useMemo, useState } from "react";
import { allUsers } from "@/atom/userAtom";
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
import { Search } from "lucide-react";
import { User } from "@prisma/client";
import {
  convertDepartmentToJapanese,
  convertPositionToJapanese,
  convertStatusToJapanese,
  getDepartmentCounts,
} from "@/lib/convertToJapanese";

export default function Home() {
  useFetchAllUsers(); // 初回レンダリング時に全ユーザーを取得
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
  const [searchEmployee, setSearchEmployee] = useState<string>("");
  const [targetEmployee, setTargetEmployee] = useState<User[]>([]);

  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const allUser = useAtomValue(allUsers);

  const editEmployee = useMemo(
    () => allUser.find((user) => user.id === editEmployeeId) || null,
    [allUser, editEmployeeId]
  );

  const handeleEditTarget = (id: string) => {
    setEditEmployeeId((prev) => (prev === id ? null : id));
    setOpenEmployeeDialog(true);
  };

  // 検索機能
  useEffect(() => {
    let filteredEmployees = allUser;

    // 名前での絞り込み
    if (searchEmployee !== "") {
      filteredEmployees = filteredEmployees.filter((user) =>
        user.name.toLowerCase().includes(searchEmployee.toLowerCase())
      );
    }

    // 部署での絞り込み
    if (selectedDepartment !== "" && selectedDepartment !== "All") {
      filteredEmployees = filteredEmployees.filter(
        (user) => user.department === selectedDepartment
      );
    }
    setTargetEmployee(filteredEmployees);
  }, [searchEmployee, selectedDepartment, allUser]);


  const departmentCounts = getDepartmentCounts(allUser);
  console.log(departmentCounts);

  const frameClass = EMPLOYEES_TABLE_HEADER.map((header) =>
    header.label === "名前" || header.label === "メールアドレス"
      ? "flex-1"
      : "w-[200px]"
  ).join(" ");

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col p-4">
      <header className="flex items-center gap-4 p-5">
        <h1 className="text-lg font-bold">社員一覧</h1>

        {/*======================= 検索エリア =======================  */}
        <div className="flex items-center ml-auto space-x-2">
          <Select onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={EMPLOYEE_INPUT_FIELDS[2].label} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{EMPLOYEE_INPUT_FIELDS[2].name}</SelectLabel>
                {EMPLOYEE_INPUT_FIELDS[2].departmentOptions?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {`${option.label} (${option.value === "All" ? allUser.length : departmentCounts[option.value] ?? 0})`}
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
      {/* ヘッダーナビ */}
      <div className="flex-1 h-full overflow-y-auto">
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
          {targetEmployee.map((employee) => {
            const cellData = [
              employee.name,
              convertDepartmentToJapanese(employee.department),
              convertPositionToJapanese(employee.position),
              employee.email,
              employee.joinDate.toLocaleDateString(),
              convertStatusToJapanese(employee.isActive),
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
    </div>
  );
}
