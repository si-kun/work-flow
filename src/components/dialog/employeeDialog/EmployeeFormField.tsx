import ErrorText from "@/components/errorText/ErrorText";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EmployeeFormData } from "@/types/employee/schema";
import React, { Dispatch, SetStateAction } from "react";
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldErrors,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";

interface EmployeeFormFieldProps {
  control: Control<EmployeeFormData>;
  errors: FieldErrors<EmployeeFormData>;
  fieldKey: keyof EmployeeFormData;
  inputField: {
    name: keyof EmployeeFormData;
    label: string;
    type?: string;
    placeholder?: string;
    options?: readonly { label: string; value: string }[];
  };

  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const EmployeeFormField = ({
  control,
  errors,
  fieldKey,
  inputField,
  open,
  setOpen,
}: EmployeeFormFieldProps) => {
  const renderField = (field: ControllerRenderProps<EmployeeFormData>) => {
    switch (inputField.type) {
      case "select":
        return (
          <Select
            value={String(field.value)}
            onValueChange={field.onChange}
            name={field.name}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={inputField.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{inputField.label}を選択</SelectLabel>
                {inputField.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );

      case "text":
      case "email":
        return (
          <Input
            type={inputField.type}
            placeholder={inputField.placeholder}
            className="w-full"
            value={String(field.value)}
            onChange={field.onChange}
          />
        );

      case "date":
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
              >
                {field.value
                  ? format(field.value, "yyyy年MM月dd日")
                  : "入社日を選択"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={new Date(field.value)}
                captionLayout="dropdown"
                onSelect={(date) => {
                  field.onChange(date);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        );

      case "radio":
        return (
          <RadioGroup
            defaultValue="option-one"
            className="flex"
            value={String(field.value)}
            onValueChange={field.onChange}
          >
            {inputField.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.label} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      default:
        return <div>Unsupported field type</div>;
    }
  };

  return (
    <Controller
      key={inputField.name}
      control={control}
      name={fieldKey}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Label htmlFor={inputField.name}>{inputField.label}</Label>
            {errors[fieldKey] && <ErrorText text={errors[fieldKey]?.message} />}
          </div>
          {renderField(field)}
        </div>
      )}
    />
  );
};

export default EmployeeFormField;
