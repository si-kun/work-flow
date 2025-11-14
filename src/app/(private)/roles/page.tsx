"use client";

import { allUsers } from "@/atoms/user";
import { DEPARTMENTS, EMPLOYMENT_ROLES, POSITIONS } from "@/constants/employee";
import { ROLES_HEADER } from "@/constants/roles";
import {
  convertToJapanese,
  getDepartmentCounts,
} from "@/lib/convertToJapanese";
import { useAtom } from "jotai";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import EmployeeSearchArea from "@/components/common/EmployeeSearchArea";
import { useState } from "react";
import { useEmployeeFilter } from "@/hooks/user/useEmployeeFilter";
import { Role } from "@prisma/client";
import { updateRole } from "@/actions/users/updateRole";
import { toast } from "sonner";
import AdminUser from "@/components/AdminUser";

const RolesPage = () => {
  const [users, setUsers] = useAtom(allUsers);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [searchEmployee, setSearchEmployee] = useState<string>("");

  const [changedUserIds, setChangedUserIds] = useState<Set<string>>(new Set());

  const departmentCounts = getDepartmentCounts(users);

  const searchedAndFilteredEmployees = useEmployeeFilter({
    data: users,
    searchEmployee,
    selectedDepartment,
  });

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsers((prev) => {
      return prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      );
    });

    setChangedUserIds((prev) => new Set(prev.add(userId)));
    console.log(changedUserIds);
  };

  const submitRoleUpdates = async (userId: string, newRole: Role) => {
    try {
      const response = await updateRole(userId, newRole);

      if (response.success) {
        setChangedUserIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        toast.success("権限を更新しました。");
      }
    } catch (error) {
      console.error("Error updating roles:", error);
      toast.error("権限の更新中にエラーが発生しました。");
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-2xl font-bold">権限管理ページ</h2>
      <EmployeeSearchArea
        users={users}
        setSelectedDepartment={setSelectedDepartment}
        departmentCounts={departmentCounts}
        searchEmployee={searchEmployee}
        setSearchEmployee={setSearchEmployee}
      />

      <div>
        {/* ヘッダー */}
        <div className="grid grid-cols-4 items-center border border-gray-300 bg-gray-200 font-bold sticky top-0 z-10">
          {ROLES_HEADER.map((header, index) => (
            <span key={index} className="px-3 py-2.5 border-r border-gray-300">
              {header}
            </span>
          ))}
        </div>

        {/* データ部分 */}
        <div className="border-b border-slate-300 border-l border-r">
          {searchedAndFilteredEmployees.map((user) => {
            const cellData = [
              <AdminUser key={user.id} user={user} />,
              convertToJapanese(user.position, POSITIONS),
              convertToJapanese(user.department, DEPARTMENTS),
            ];

            return (
              <div
                key={user.id}
                className="grid grid-cols-4 items-center border-b border-slate-300 last:border-b-0"
              >
                {cellData.map((data, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-2.5 border-r border-slate-300 last:border-r-0"
                  >
                    {data}
                  </span>
                ))}
                {/* 権限部分 */}
                <div className="flex items-center gap-2 ml-3">
                  <Select
                    defaultValue={user.role}
                    onValueChange={(newRole: Role) =>
                      handleRoleChange(user.id, newRole)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYMENT_ROLES.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* valueが変わったら更新ボタンを表示 */}
                  {changedUserIds.has(user.id) && (
                    <Button
                      onClick={() => submitRoleUpdates(user.id, user.role)}
                      type="button"
                      className="bg-green-600 hover:bg-green-500 hover:cursor-pointer"
                    >
                      更新
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
