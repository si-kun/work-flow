import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ShiftTargetUser } from "@/app/(private)/shifts/create/page";
import { Dispatch, SetStateAction } from "react";

interface TargetUserSelectProps {
  selectedUsers: ShiftTargetUser[];
  targetuserIds: string[];
  setTargetUserIds: Dispatch<SetStateAction<string[]>>;
}

const TargetUserSelect = ({
  selectedUsers,
  targetuserIds,
  setTargetUserIds,
}: TargetUserSelectProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>対象のユーザーを選択</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {selectedUsers.map((user) => (
          <div key={user.id} className="flex items-center gap-2">
            <Checkbox
              id={user.id}
              defaultChecked={true}
              checked={targetuserIds.includes(user.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setTargetUserIds((prev) => [...prev, user.id]);
                } else {
                  setTargetUserIds((prev) =>
                    prev.filter((id) => id !== user.id)
                  );
                }
              }}
            />
            <Label htmlFor={user.id}>{user.name}</Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TargetUserSelect;
