"use client";

import { allUsers } from "@/atoms/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DEPARTMENTS, EMPLOYMENT_ROLES, POSITIONS } from "@/constants/employee";
import { convertToJapanese } from "@/lib/convertToJapanese";
import { useAtom } from "jotai";
import { PencilLine } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateEmail } from "@/actions/users/updateEmail";
import Loading from "@/components/loading/Loading";

const ProfilePage = () => {
  const [users, setUsers] = useAtom(allUsers);

  const [loading, setLoading] = useState<boolean>(false);

  const currentUser = users.find((u) => u.id === "dummy-user-1");
  const [changedEmail, setChangedEmail] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setChangedEmail(currentUser.email);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  console.log(changedEmail);

  const displayFields = [
    { key: "name", label: "名前" },
    { key: "email", label: "メールアドレス" },
    { key: "department", label: "部署" },
    { key: "position", label: "役職" },
    { key: "role", label: "権限" },
    { key: "joinDate", label: "入社日" },
  ];
  if (!currentUser) {
    return <div>ユーザーが見つかりません。</div>;
  }

  const formatValue = (key: string, value: string | Date | number) => {
    if (!currentUser) return;

    if (key === "department") {
      return convertToJapanese(String(value), DEPARTMENTS);
    }
    if (key === "position") {
      return convertToJapanese(String(value), POSITIONS);
    }
    if (key === "role") {
      return convertToJapanese(String(value), EMPLOYMENT_ROLES);
    }
    if (value instanceof Date) {
      return new Date(value).toLocaleDateString("ja-JP");
    }
    return String(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangedEmail(e.target.value);
  };

  const handleUpdateEmail = async () => {
    if (!currentUser) return;
    setLoading(true);

    try {
      const response = await updateEmail(currentUser.id, changedEmail);
      if (response.success) {
        console.log("Email updated successfully");
        setUsers((prevUser) =>
          prevUser.map((user) =>
            user.id === currentUser.id ? { ...user, email: changedEmail } : user
          )
        );
        setOpen(false);
      } else {
        console.error("Failed to update email:", response.message);
      }
    } catch (error) {
      console.error("Error updating email:", error);
    } finally {
        setLoading(false);
        }
  };

  return (
    <div className="relative flex flex-col h-screen p-4">
      {loading && <Loading />}
      <Card className="max-w-[600px] w-full mx-auto my-auto">
        <CardHeader className="font-bold text-center">プロフィール</CardHeader>
        <CardContent className="flex flex-col items-center">
          {displayFields.map((field) => {
            const value = currentUser[field.key as keyof typeof currentUser];

            return (
              <div
                key={field.key}
                className="w-full max-w-md flex items-center py-2.5 border-b"
              >
                <span className="font-medium w-[30%]">{field.label}:</span>
                <div className="flex items-center justify-between flex-1">
                  <span>
                    {formatValue(field.key, value as string | Date | number)}
                  </span>
                  {field.key === "email" && (
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant={"ghost"}
                          size="icon"
                          className="hover:cursor-pointer"
                        >
                          <PencilLine className="" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>メールアドレス変更</DialogTitle>
                          <DialogDescription>
                            変更するメールアドレスを入力してください
                          </DialogDescription>
                        </DialogHeader>
                        <form className="flex flex-col gap-4">
                          <Input
                            value={changedEmail}
                            type="email"
                            placeholder={"example@gmail.com"}
                            onChange={(e) => handleEmailChange(e)}
                          />
                          <Button
                            onClick={handleUpdateEmail}
                            type="button"
                            className="bg-green-600 hover:bg-green-500 hover:cursor-pointer"
                          >
                            更新
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
