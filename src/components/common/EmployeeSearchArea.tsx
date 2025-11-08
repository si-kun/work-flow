import React, { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DEPARTMENTS } from "@/constants/employee";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { User } from "@prisma/client";

interface EmployeeSearchAreaProps {
  users: User[];
  setSelectedDepartment: Dispatch<SetStateAction<string>>;
  departmentCounts: Record<string, number>;
  searchEmployee: string;
  setSearchEmployee: Dispatch<SetStateAction<string>>;
}

const EmployeeSearchArea = ({
  users,
  setSelectedDepartment,
  departmentCounts,
  searchEmployee,
  setSearchEmployee,
}: EmployeeSearchAreaProps) => {
  return (
    <div className="flex items-center space-x-2">
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
                    ? users.length
                    : departmentCounts[option.value] ?? 0
                })`}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="relative">
        <Search className="absolute top-[50%] left-2 transform -translate-y-[50%]  text-gray-400" />
        <Input
          className="pl-10"
          name="nameSearch"
          placeholder="従業員名を検索"
          value={searchEmployee}
          onChange={(e) => setSearchEmployee(e.target.value)}
        />
      </div>
    </div>
  );
};

export default EmployeeSearchArea;
