"use client";

import { EMPLOYEE_INPUT_FIELDS } from "@/constants/employee";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EmployeeFormData, employeeSchema } from "@/types/employee/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ErrorText from "../errorText/ErrorText";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { addEmployee } from "@/actions/auth/addEmployee";
import { useSetAtom } from "jotai";
import { allUsers } from "@/atom/userAtom";
import { User } from "@prisma/client";
import { updateEmployee } from "@/actions/auth/updateEmployee";
import { deleteEmployee } from "@/actions/auth/deleteEmployee";

interface EmployeeDialogProps {
  openEmployeeDialog: boolean;
  setOpenEmployeeDialog: Dispatch<SetStateAction<boolean>>;
  mode: "add" | "edit";
  editEmployee: User | null;
  setEditEmployeeId?: Dispatch<SetStateAction<string | null>>;
}

const EmployeeDialog = ({
  openEmployeeDialog,
  setOpenEmployeeDialog,
  mode,
  editEmployee,
  setEditEmployeeId,
}: EmployeeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const setAllUser = useSetAtom(allUsers);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (mode === "edit" && editEmployee) {
      reset({
        name: editEmployee.name,
        email: editEmployee.email,
        department: editEmployee.department,
        position: editEmployee.position,
        joinDate: editEmployee.joinDate
          ? new Date(editEmployee.joinDate)
          : undefined,
        isActive: editEmployee.isActive as
          | "Employment"
          | "Leave"
          | "Retirement"
          | "PlannedJoining",
      });
    } else if (mode === "add") {
      reset({
        name: "",
        email: "",
        department: "",
        position: "",
        joinDate: undefined,
        isActive: "Employment",
      });
    }
  }, [editEmployee, mode, reset]);

  const buttonText = () => {
    switch (mode) {
      case "add":
        switch (isSubmitting) {
          case true:
            return "登録中...";
          case false:
            return "登録する";
        }
      case "edit":
        switch (isSubmitting) {
          case true:
            return "更新中...";
          case false:
            return "更新する";
        }
    }
  };

  // フォーム送信時の処理
  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (mode === "edit" && editEmployee) {
        const result = await updateEmployee(editEmployee.id, data);

        if (result.success) {
          setAllUser((prev) =>
            prev.map((user) =>
              user.id === editEmployee.id ? { ...user, ...data } : user
            )
          );
          console.log("更新完了:", result.message);
          reset();
          setOpenEmployeeDialog(false);
        } else {
          console.error("更新失敗:", result.message);
        }
      } else {
        const result = await addEmployee(data);

        if (result.success) {
          setAllUser((prev) => [...prev, result.data!]);
          console.log("登録完了:", result.message);
          reset();
          setOpenEmployeeDialog(false);
        } else {
          console.error("登録失敗:", result.message);
        }
      }

      // reset();
      // setOpenEmployeeDialog(false);
    } catch (error) {
      console.error("予期しないエラー:", error);
    }
  };

  // デリート処理
  const handleDelete = async() => {
    try {

      const result = await deleteEmployee(editEmployee!.id);

      if (result.success) {
        setAllUser((prev) => prev.filter((user) => user.id !== editEmployee!.id));
        if (setEditEmployeeId) {
          setEditEmployeeId(null);
        }
      }
      setDeleteConfirmOpen(false);
      setOpenEmployeeDialog(false);
    } catch(error) {
      console.error("予期しないエラー:", error);
    }
  }

  return (
    <Dialog open={openEmployeeDialog} onOpenChange={setOpenEmployeeDialog}>
      <DialogTrigger className="bg-green-300 p-2 rounded-lg">
        {mode === "add" ? "従業員を追加" : "従業員情報を編集"}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>新規従業員を登録する</DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "新規従業員を登録します。必要な情報を入力してください。"
              : "従業員情報を編集します。必要な情報を入力してください。"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          {EMPLOYEE_INPUT_FIELDS.map((inputField) =>
            inputField.label === "部署" ? (
              <Controller
                key={inputField.name}
                control={control}
                name="department"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Label>{inputField.label}</Label>
                      {errors.department && (
                        <ErrorText text={errors.department?.message} />
                      )}
                    </div>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      name={field.name}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="部署名を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>部署名を選択</SelectLabel>
                          {inputField.departmentOptions?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            ) : inputField.label === "役職" ? (
              <Controller
                key={inputField.name}
                control={control}
                name="position"
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <Label>{inputField.label}</Label>
                      {errors.position && (
                        <ErrorText text={errors.position?.message} />
                      )}
                    </div>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="flex-1 w-full">
                        <SelectValue placeholder="役職を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>役職を選択</SelectLabel>
                          {inputField.positionOptions?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            ) : inputField.label === "在籍状況" ? (
              <Controller
                key={inputField.name}
                control={control}
                name="isActive"
                render={({ field }) => (
                  <RadioGroup
                    defaultValue="option-one"
                    className="flex"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    {inputField.isActiveOptions?.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.label}
                        />
                        <Label htmlFor={option.label}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            ) : inputField.label === "入社日" ? (
              <Controller
                key={inputField.name}
                control={control}
                name="joinDate"
                render={({ field }) => (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Label htmlFor="date" className="px-1">
                        {inputField.label}
                      </Label>
                      {errors.joinDate && (
                        <ErrorText text={errors.joinDate?.message} />
                      )}
                    </div>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-full justify-between font-normal"
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              />
            ) : (
              <div key={inputField.name} className="flex flex-col gap-2 w-full">
                <div className="flex items-center gap-3">
                  <Label>{inputField.label}</Label>
                  {errors[inputField.name] && (
                    <ErrorText
                      text={
                        errors[inputField.name as keyof EmployeeFormData]
                          ?.message
                      }
                    />
                  )}
                </div>
                <Input
                  type={inputField.type}
                  placeholder={inputField.placeholder}
                  className="w-full"
                  {...register(inputField.name)}
                />
              </div>
            )
          )}
          <DialogFooter>
            {/* submit button */}
            <Button
              disabled={!isValid}
              variant={"outline"}
              className="bg-green-400"
              type="submit"
            >
              {buttonText()}
            </Button>
            {/* delete button */}
            {mode === "edit" && editEmployee && (
              <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant={"destructive"}>削除</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {`本当に${editEmployee.name}を削除しますか？`}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      この操作は元に戻せません。削除すると、関連するすべてのデータが失われます。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setDeleteConfirmOpen(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-700" onClick={() => handleDelete()}>削除する</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {/* close button */}
            <DialogClose
              asChild
              onClick={() => {
                setOpenEmployeeDialog(false);
                if (setEditEmployeeId) {
                  setEditEmployeeId(null);
                }
              }}
            >
              <Button variant={"secondary"}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
