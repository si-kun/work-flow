import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Dispatch, SetStateAction } from "react";
import { ShiftTargetUser } from "@/app/(private)/shifts/create/page";

interface BaseUserSelectProps {
  baseUserId: string;
  setBaseUserId: Dispatch<SetStateAction<string>>;
  selectedUsers: ShiftTargetUser[];
}

const BaseUserSelect = ({
  baseUserId,
  setBaseUserId,
  selectedUsers,
}: BaseUserSelectProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ベースとなるユーザーを選択</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={baseUserId} onValueChange={setBaseUserId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="メンバーを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>メンバーリスト</SelectLabel>
              {selectedUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default BaseUserSelect;
