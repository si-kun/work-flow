"use client"

import { getAllUsers } from "@/actions/auth/getAllUsers"
import { allUsers } from "@/atoms/user"
import { useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { toast } from "sonner"


export const useFetchAllUsers = () => {
    const [loading, setLoading] = useState(true)
    const setUsers = useSetAtom(allUsers)

    useEffect(() => {
        const fetchAllUsers = async () => {
            setLoading(true)
            try {
                const result = await getAllUsers();
    
                if(result.success) {
                    setUsers(result.data)
                    toast.success("ユーザーを取得しました")
                }
    
            } catch(error) {
                console.error("ユーザーの取得に失敗しました:", error);
                toast.error("ユーザーの取得に失敗しました")
            } finally {
                setLoading(false)
            }
        }
        fetchAllUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return {loading}
}
