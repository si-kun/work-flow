"use server";

import { ApiResponse } from "@/types/api/api";
import { prisma } from "@/utils/prisma/prisma";
import { User } from "@prisma/client";

export const getAllUsers = async () :Promise<ApiResponse<User[]>> => {

    try {

        const response = await prisma.user.findMany();

        return {
            success: true,
            message: "ユーザーの取得に成功しました。",
            data: response
        }
    } catch(error) {
        console.error("ユーザーの取得に失敗しました:", error);
        return {
            success: false,
            message: "ユーザーの取得に失敗しました。時間をおいて再度お試しください。",
            data: []
        }
    }
}