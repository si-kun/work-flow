"use server";

import { ApiResponse } from "@/types/api/api";
import { prisma } from "@/utils/prisma/prisma";
import { createAdminClient } from "@/utils/supabase/admin";

export const deleteEmployee = async (
  id: string
): Promise<ApiResponse<null>> => {
  const supabase = createAdminClient();

  try {
    // supabase からユーザーを削除
    const supabaseResponse = await supabase.auth.admin.deleteUser(id);

    if (supabaseResponse.error) {
      return {
        success: false,
        message: "社員の削除に失敗しました",
        data: null,
      };
    }

    // prisma からユーザーを削除
    await prisma.user.delete({
      where: { id },
    });

    return {
      success: true,
      message: "社員が削除されました",
      data: null,
    };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return {
      success: false,
      message: "社員の削除に失敗しました",
      data: null,
    };
  }
};
