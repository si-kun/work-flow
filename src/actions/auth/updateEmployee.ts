"use server";

import { ApiResponse } from "@/types/api/api";
import { EmployeeFormData } from "@/types/employee/schema";
import { prisma } from "@/utils/prisma/prisma";

export const updateEmployee = async (id:string,data: EmployeeFormData): Promise<ApiResponse<null>> => {

  try {
    await prisma.user.update({
      where: { id, },
      data: {
        name: data.name,
        email: data.email,
        department: data.department,
        position: data.position,
        joinDate: data.joinDate,
        isActive: data.isActive,
      },
    });

    return {
      success: true,
      message: "社員情報が更新されました",
      data: null,
    };
  } catch (error) {
    console.error("Error updating employee:", error);
    return {
      success: false,
      message: "社員情報の更新に失敗しました",
      data: null,
    };
  }
};
