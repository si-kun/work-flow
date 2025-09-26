"use server";

import { ApiResponse } from "@/types/api/api";
import { EmployeeFormData } from "@/types/employee/schema";
import { prisma } from "@/utils/prisma/prisma";
import { createClient } from "@/utils/supabase/server";
import { User } from "@prisma/client";

export const addEmployee = async (
  formData: EmployeeFormData
): Promise<ApiResponse<User | null>> => {
  const defaultPassword = "DefaultPass123!";
  const supabase = await createClient();

  try {
    const supabaseAuth = await supabase.auth.signUp({
      email: formData.email,
      password: defaultPassword,
    });


    if(supabaseAuth.error || !supabaseAuth.data.user) {
        return {
            data: null,
            message: "登録に失敗しました",
            success: false,
        }
    }

    const prismaUser= await prisma.user.create({
        data: {
            id: supabaseAuth.data.user.id,
            name: formData.name,
            email: formData.email,
            department: formData.department,
            position: formData.position,
            joinDate: formData.joinDate,
            isActive: formData.isActive,
            role: "EMPLOYEE"
        }
    })

    if(!prismaUser) {
        return {
            data: prismaUser,
            message: "登録に失敗しました",
            success: false,
        }
    }

    return {
      data: prismaUser,
      message: "登録に成功しました",
      success: true,
    };
  } catch (error) {
    console.error("登録エラー:", error);
    return {
      data: null,
      message: "登録に失敗しました",
      success: false,
    };
  }
};
