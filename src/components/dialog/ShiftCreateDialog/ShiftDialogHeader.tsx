import SelectYearMonth from "@/components/common/SelectYearMonth";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EVENT_COLORS_BUTTON, ShiftType } from "@/constants/calendarColor";
import { convertWorkTypeToJapanese } from "@/lib/convertToJapanese";

interface ShiftDialogHeaderProps {
  workType: ShiftType | null;
  handleWorkTypeSelect: (type: ShiftType) => void;
  deleteMode: boolean;
  handleDeleteModeToggle: () => void;
  year: number;
  month: number;
  handleYearChange:(year: string) => void;
  handleMonthChange:(month: string) => void
  baseUserId:string;
}

const ShiftDialogHeader = ({
  workType,
  handleWorkTypeSelect,
  deleteMode,
  handleDeleteModeToggle,
  year,
  month,
  handleYearChange,
  handleMonthChange,
  baseUserId,

}: ShiftDialogHeaderProps) => {

  const disabledButton = baseUserId === "";

  return (
    <DialogHeader className="flex flex-col gap-2">
      <DialogTitle>シフト設定</DialogTitle>
      <DialogDescription className="">シフト作成ページです。</DialogDescription>
      <div className="flex items-center">
        <SelectYearMonth
          year={year}
          month={month}
          handleYearChange={handleYearChange}
          handleMonthChange={handleMonthChange}
        />
      </div>
      {/* 勤怠のそれぞれのカラーボタン */}
      <div className="flex items-center gap-2">
        {Object.entries(EVENT_COLORS_BUTTON).map(([type, colors]) => (
          <Button
            type="button"
            variant={"outline"}
            disabled={disabledButton}
            key={type}
            className={`${colors.className} hover:cursor-pointer ${
              workType === type ? "ring-2 ring-offset-2 ring-green-500" : ""
            }`}
            onClick={() => handleWorkTypeSelect(type as ShiftType)}
          >
            {convertWorkTypeToJapanese(type as ShiftType)}
          </Button>
        ))}
        {/* 削除ボタン */}
        <Button
          type="button"
          variant={"destructive"}
          disabled={disabledButton}
          className={`hover:cursor-pointer ${
            deleteMode ? "ring-2 ring-offset-2 ring-red-500" : ""
          }`}
          onClick={handleDeleteModeToggle}
        >
          削除
        </Button>
      </div>
    </DialogHeader>
  );
};

export default ShiftDialogHeader;
