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
import { Dispatch, SetStateAction } from "react";

interface EmployeeDeleteDialogProps {
  deleteConfirmOpen: boolean;
  setDeleteConfirmOpen: Dispatch<SetStateAction<boolean>>;
  onClickDelete: () => Promise<void>;
  name: string;
}

const EmployeeDeleteDialog = ({
  deleteConfirmOpen,
  setDeleteConfirmOpen,
  onClickDelete,
  name,
}: EmployeeDeleteDialogProps) => {
  return (
    <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"}>削除</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`本当に${name}を削除しますか？`}</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は元に戻せません。削除すると、関連するすべてのデータが失われます。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-700" onClick={onClickDelete}>
            削除する
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmployeeDeleteDialog;
