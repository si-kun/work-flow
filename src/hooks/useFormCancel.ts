import { EditFormData } from "@/app/(private)/mypage/attendance/components/EditTimeCard";
import { FormState, UseFormReset } from "react-hook-form";

interface useFormCancel {
    formState :FormState<EditFormData>
    reset: UseFormReset<EditFormData>
    setEditingDialogOpen: (open: boolean) => void
}

export const useFormCancel = ({formState,reset,setEditingDialogOpen}: useFormCancel) => {
      // キャンセル時の処理
  const handleCancel = () => {
    if (formState.isDirty) {
      // 変更されている場合、確認ダイアログを表示
      const confirmed = window.confirm(
        "変更内容が保存されていません。キャンセルしてもよろしいですか?"
      );

      if (confirmed) {
        reset(); // フォームをリセット
        setEditingDialogOpen(false);
      }
    } else {
      // 変更されていない場合、そのまま閉じる
      setEditingDialogOpen(false);
    }
  };
    return {handleCancel};
}