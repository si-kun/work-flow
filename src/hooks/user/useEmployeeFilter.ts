"use client";

import { useMemo } from "react";

interface Employee {
  name: string;
  department: string;
}

interface UseEmployeeFilterProps<T extends Employee> {
  data: T[];
  searchEmployee: string;
  selectedDepartment: string;
}

export const useEmployeeFilter = <T extends Employee>({
  data,
  searchEmployee,
  selectedDepartment,
}: UseEmployeeFilterProps<T>) => {
  // 検索機能
  const searchedAndFilteredEmployees = useMemo(() => {
    let filtered = data;

    // 名前での絞り込み
    if (searchEmployee !== "") {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchEmployee.toLowerCase())
      );
    }

    // 部署での絞り込み
    if (selectedDepartment !== "" && selectedDepartment !== "All") {
      filtered = filtered.filter(
        (item) => item.department === selectedDepartment
      );
    }
    return filtered;
  }, [data, searchEmployee, selectedDepartment]);

  return  searchedAndFilteredEmployees ;
};
