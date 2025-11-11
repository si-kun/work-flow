"use server";

import { ApiResponse } from "@/types/api/api";
import { prisma } from "@/utils/prisma/prisma";
import { Role, User } from "@prisma/client";

export const updateRole = async (
  userId: string,
  newRole: Role
): Promise<ApiResponse<User | null>> => {
  try {
    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return {
      success: true,
      message: "役割が正常に更新されました。",
      data: updateUser,
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      message: "役割の更新中にエラーが発生しました。",
      data: null,
    };
  }
};
