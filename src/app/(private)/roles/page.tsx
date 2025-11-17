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
import DataTable from "@/components/common/DataTable";

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
    <div className="w-full h-full flex flex-col gap-4">
      <h2 className="text-2xl font-bold">権限管理ページ</h2>
      <EmployeeSearchArea
        users={users}
        setSelectedDepartment={setSelectedDepartment}
        departmentCounts={departmentCounts}
        searchEmployee={searchEmployee}
        setSearchEmployee={setSearchEmployee}
      />

      <div className="overflow-y-auto flex-1">
        <DataTable
          headers={ROLES_HEADER}
          rows={searchedAndFilteredEmployees.map((user) => ({
            id: user.id,
            data: [
              <AdminUser key={user.id} user={user} />,
              convertToJapanese(user.position, POSITIONS),
              convertToJapanese(user.department, DEPARTMENTS),
            ],
          }))}
          renderLastCell={(rowId) => {
            const user = users.find((u) => u.id === rowId);
            if (!user) return null;

            return (
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
            );
          }}
        />
      </div>
    </div>
  );
};

export default RolesPage;
