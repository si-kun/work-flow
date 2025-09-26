"use client";

import { useAtomValue } from "jotai";
import EmployeeDialog from "../components/dialog/EmployeeDialog";
import { EMPLOYEES_TABLE_HEADER } from "../constants/employee";
import { useMemo, useState } from "react";
import { allUsers } from "@/atom/userAtom";
import { useFetchAllUsers } from "@/lib/fetchAllUser";

export default function Home() {
  useFetchAllUsers();
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);

  const allUser = useAtomValue(allUsers);

  const editEmployee = useMemo(
    () => allUser.find((user) => user.id === editEmployeeId) || null,
    [allUser, editEmployeeId]
  );

  const handeleEditTarget = (id: string) => {
    setEditEmployeeId((prev) => (prev === id ? null : id));
    setOpenEmployeeDialog(true);
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <header className="flex items-center p-5">
        <h1 className="text-lg font-bold">社員一覧</h1>
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
        <div className="bg-slate-50 border-b border-slate-300 flex sticky top-0 z-10">
          {EMPLOYEES_TABLE_HEADER.map((header) => (
            <span
              key={header.id}
              className="flex-1 px-4 py-3 text-left font-semibold text-slate-700 border-r border-slate-300"
            >
              {header.label}
            </span>
          ))}
        </div>

        {/* データ部分 */}
        <div className=" h-full">
          {allUser.map((employee) => {
            const cellData = [
              employee.name,
              employee.department,
              employee.position,
              employee.email,
              employee.joinDate.toLocaleDateString(),
              employee.isActive,
            ];

            return (
              <div
                className="flex border-b border-slate-300  hover:bg-slate-100 hover:cursor-pointer"
                key={employee.name}
                onClick={() => handeleEditTarget(employee.id)}
              >
                {cellData.map((data, index) => (
                  <span
                    key={index}
                    className="flex-1 px-3 py-2.5 text-slate-900 border-r border-slate-300"
                  >
                    {data}
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
