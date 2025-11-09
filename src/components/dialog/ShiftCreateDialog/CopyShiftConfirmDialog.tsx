import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface AlertShiftProps {
    baseUserId: string;
    targetuserIds: string[];
    baseUserName: string;
    copyShiftData: () => void;
}

const CopyShiftConfirmDialog  = ({baseUserId,targetuserIds,baseUserName,copyShiftData}:AlertShiftProps) => {
  return (
    <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        type="button"
        className="bg-green-500 hover:bg-green-400 hover:cursor-pointer"
        disabled={!baseUserId || targetuserIds.length === 0}
      >
        対象のユーザーにシフトをコピー
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {baseUserName}のシフトをコピーします
        </AlertDialogTitle>
        <AlertDialogDescription>
          選択されているユーザーに対して、{baseUserName}
          のシフトをコピーします。よろしいですか？
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={copyShiftData}>
          OK
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}

export default CopyShiftConfirmDialog 