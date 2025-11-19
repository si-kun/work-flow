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

import { EmployeeFormData, employeeSchema } from "@/types/employee/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addEmployee } from "@/actions/auth/addEmployee";
import { useSetAtom } from "jotai";
import { User } from "@prisma/client";
import { updateEmployee } from "@/actions/auth/updateEmployee";
import { deleteEmployee } from "@/actions/auth/deleteEmployee";
import { allUsers } from "@/atoms/user";
import { toast } from "sonner";
import EmployeeDeleteDialog from "./EmployeeDeleteDialog";
import EmployeeFormField from "./EmployeeFormField";

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
  console.log(editEmployee);
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const setAllUser = useSetAtom(allUsers);

  const {
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
        joinDate: new Date(),
        isActive: "Employment",
      });
    }
  }, [editEmployee, mode, reset]);

  const buttonText = () => {
    if (mode === "add") {
      return isSubmitting ? "登録中..." : "登録する";
    }
    return isSubmitting ? "更新中..." : "更新する";
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
          toast.success(`更新完了:${result.message}`);
        } else {
          toast.error(`更新失敗:${result.message}`);
        }
      } else {
        const result = await addEmployee(data);

        if (result.success) {
          setAllUser((prev) => [...prev, result.data!]);
          toast.success(`登録完了:${result.message}`);
        } else {
          toast.error(`登録失敗:${result.message}`);
        }
      }
    } catch (error) {
      console.error("予期しないエラー:", error);
    } finally {
      reset();
      setOpenEmployeeDialog(false);
      if(setEditEmployeeId) {
        setEditEmployeeId(null);
      }
    }
  };

  // デリート処理
  const handleDelete = async () => {
    try {
      const result = await deleteEmployee(editEmployee!.id);

      if (result.success) {
        setAllUser((prev) =>
          prev.filter((user) => user.id !== editEmployee!.id)
        );
      }
      setDeleteConfirmOpen(false);
      setOpenEmployeeDialog(false);
    } catch (error) {
      console.error("予期しないエラー:", error);
    }
  };

  return (
    <Dialog
      open={openEmployeeDialog}
      onOpenChange={(isOpen) => {
        if(isSubmitting) return;
        setOpenEmployeeDialog(isOpen);
        if (!isOpen && setEditEmployeeId) {
          setEditEmployeeId(null);
        }
      }}
    >
      <DialogTrigger className="bg-green-300 p-2 rounded-lg">
        {mode === "add" ? "従業員を追加" : "従業員情報を編集"}
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            {mode === "add"
              ? "新規従業員を追加"
              : `${editEmployee?.name}を編集`}
          </DialogTitle>
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
          {EMPLOYEE_INPUT_FIELDS.map((inputField) => (
            <EmployeeFormField
              key={inputField.name}
              control={control}
              errors={errors}
              fieldKey={inputField.name as keyof EmployeeFormData}
              inputField={inputField}
              open={open}
              setOpen={setOpen}
            />
          ))}
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
              <EmployeeDeleteDialog
                deleteConfirmOpen={deleteConfirmOpen}
                setDeleteConfirmOpen={setDeleteConfirmOpen}
                onClickDelete={handleDelete}
                name={editEmployee.name}
              />
            )}
            {/* close button */}
            <DialogClose asChild>
              <Button type="button" variant={"secondary"} disabled={isSubmitting}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeDialog;
