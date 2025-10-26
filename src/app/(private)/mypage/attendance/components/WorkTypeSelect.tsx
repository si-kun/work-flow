import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import { Control, Controller } from 'react-hook-form'
import { EditFormData } from './EditTimeCard'
import { DAILY_WORK } from '@/types/attendance'

interface WorkTypeSelect {
    control: Control<EditFormData>
}

const WorkTypeSelect = ({control}: WorkTypeSelect) => {
  return (
    <div className="flex flex-col gap-1 w-full">
    <Label>勤務タイプ:</Label>
    <Controller
      control={control}
      name="workType"
      render={({ field }) => (
        <Select
          value={field.value || ""}
          onValueChange={field.onChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={"勤務タイプを選択"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>勤務タイプ</SelectLabel>
              {DAILY_WORK.map((work) => (
                <SelectItem key={work.value} value={work.value}>
                  {work.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  </div>
  )
}

export default WorkTypeSelect