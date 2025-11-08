import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { YearMonthData } from '@/types/attendance';

  

const SelectYearMonth = ({handleYearChange,handleMonthChange,year,month}:YearMonthData) => {
  return (
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
  )
}

export default SelectYearMonth