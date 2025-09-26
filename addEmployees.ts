"use server";

import { ApiResponse } from "@/types/api/api";
import { EmployeeFormData } from "@/types/employee/schema";
import { prisma } from "@/utils/prisma/prisma";
import { createAdminClient } from "@/utils/supabase/admin";
import { User } from "@prisma/client";

export const addEmployee = async (data: EmployeeFormData):Promise<ApiResponse<User | null>> => {

    const supabaseAdmin = createAdminClient();

    try {

        const {data: authUser, error} = await supabaseAdmin.auth.admin.inviteUserByEmail(
            data.email,
        )

        if(error) throw error;

        if(!authUser.user) {
            return {
                success: false,
                message: "ユーザーの招待に失敗しました。時間をおいて再度お試しください。",
                data: null
            }
        }

        const employee = await prisma.user.create({
            data: {
                id: authUser.user.id,
                name: data.name,
                email: data.email,
                department: data.department,
                position: data.position,
                joinDate: data.joinDate,
                isActive: data.isActive,
                role: "EMPLOYEE"
            }
        })

        return {
            success: true,
            message: "社員を招待しました。招待メールを確認してもらってください。",
            data: employee
        }

    } catch(error) {
        console.error("社員の追加に失敗しました:", error);
        return {
            success: false,
            message: "社員の追加に失敗しました。時間をおいて再度お試しください。",
            data: null
        }
    }
}