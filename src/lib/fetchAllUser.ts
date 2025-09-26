"use client"

import { getAllUsers } from "@/actions/auth/getAllUsers"
import { allUsers } from "@/atom/userAtom"
import { useSetAtom } from "jotai"
import { useEffect } from "react"


export const useFetchAllUsers = () => {
    const setAllUser = useSetAtom(allUsers)

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const result = await getAllUsers();
    
                if(result.success) {
                    setAllUser(result.data)
                }
    
            } catch(error) {
                console.error("ユーザーの取得に失敗しました:", error);
            }
        }
        fetchAllUsers()
    },[])
}
