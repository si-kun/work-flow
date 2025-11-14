import { UserRoundCheck } from "lucide-react";
import React from "react";

interface AdminUserProps {
  user: {
    name: string;
    role: string;
  };
}

const AdminUser = ({ user }: AdminUserProps) => {
  return (
    <div className="flex items-center gap-2">
      {user.name}
      {user.role === "ADMIN" && (
        <UserRoundCheck className="bg-blue-500 text-white p-1 rounded-full" />
      )}
    </div>
  );
};

export default AdminUser;
