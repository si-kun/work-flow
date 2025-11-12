"use server";

import { ApiResponse } from "@/types/api/api";
import { prisma } from "@/utils/prisma/prisma";
// import { createClient } from "@/utils/supabase/server";

export const updateEmail = async (userId: string, newEmail: string): Promise<ApiResponse<null>> => {
    try {

        // const supabase = await createClient();

        // const supabaseEmail = await supabase.auth.updateUser({
        //     email: newEmail,
        // })

        // if(supabaseEmail.error) {
        //     console.error("Supabase error updating email:", supabaseEmail.error);
        //     return {
        //         success: false,
        //         message: "メールアドレスの更新中にエラーが発生しました。",
        //         data: null,
        //     };
        // }

        const prismaEmail = await prisma.user.update({
            where: { id: userId },
            data: { email: newEmail },
        })

        if(!prismaEmail) {
            console.error("Prisma error updating email: No user found");
            return {
                success: false,
                message: "メールアドレスの更新中にエラーが発生しました。",
                data: null,
            };
        }

        return {
            success: true,
            message: "メールアドレスが正常に更新されました。",
            data: null,
        }

    } catch(error) {
        console.error("Error updating user email:", error);
        return {
            success: false,
            message: "メールアドレスの更新中にエラーが発生しました。",
            data: null,
        };
    }
}