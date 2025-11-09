import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "../../ui/button";
import { Spinner } from "../../ui/spinner";
import BaseUserSelect from "./BaseUserSelect";
import { ShiftTargetUser } from "@/app/(private)/shifts/create/page";
import TargetUserSelect from "./TargetUserSelect";
import CopyShiftConfirmDialog from "./CopyShiftConfirmDialog";
import ShiftDialogHeader from "./ShiftDialogHeader";
import ShiftCalendar from "./ShiftCalendar";
import { useShiftDialog } from "@/hooks/useShiftDialog";

interface ShiftCreateDialogProps {
  userShiftData: ShiftTargetUser[];
  setUserShiftData: React.Dispatch<React.SetStateAction<ShiftTargetUser[]>>;
  onSaveSuccess?: () => Promise<void>;

}

const ShiftCreateDialog = ({
  userShiftData,
  setUserShiftData,
  onSaveSuccess,
}: ShiftCreateDialogProps) => {
  const {    workType,
    deleteMode,
    loading,
    isOpen,
    handleOpenChange,
    calendarKey,
    events,
    handleClickDate,
    handleEventClick,
    baseUserId,
    setBaseUserId,
    selectedUsers,
    baseUserName,
    triggerDisabled,
    handleWorkTypeSelect,
    handleDeleteModeToggle,
    copyShiftData,
    submitShiftData,
    targetuserIds,
    setTargetUserIds,
    year,
    month,
    handleYearChange,
    handleMonthChange,
    isUpdatingFromCalendar,} = useShiftDialog({
    userShiftData,
    setUserShiftData,
    onSaveSuccess
  })

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className="hover:cursor-pointer hover:bg-green-100"
          disabled={triggerDisabled}
        >
          {triggerDisabled ? "ユーザーを選択してください" : "シフト作成"}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[80vw] min-h-[90vh] flex gap-4 overflow-y-auto p-8">
        <div className="flex flex-col flex-1">
          <ShiftDialogHeader
            workType={workType}
            handleWorkTypeSelect={handleWorkTypeSelect}
            deleteMode={deleteMode}
            handleDeleteModeToggle={handleDeleteModeToggle}
            year={year}
            month={month}
            handleYearChange={handleYearChange}
            handleMonthChange={handleMonthChange}
          />

          <form className="flex flex-col gap-4 flex-1 w-full relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner className="" />
              </div>
            )}
            <div
              className={`flex-1 min-h-0 overflow-hidden transition-opacity duration-500 ${
                loading ? "opacity-0" : "opacity-100"
              } `}
            >
              <ShiftCalendar
                calendarKey={calendarKey}
                events={events}
                handleClickDate={handleClickDate}
                handleEventClick={handleEventClick}
                year={year}
                month={month}
                isUpdatingFromCalendar={isUpdatingFromCalendar}
                handleYearChange={handleYearChange}
                handleMonthChange={handleMonthChange}
              />
            </div>
            {/* 保存ボタン */}
            <div className="ml-auto">
              <Button
                disabled={events.length === 0}
                type="button"
                variant={"default"}
                className="bg-green-600 hover:bg-green-500 hover:cursor-pointer disabled:bg-gray-500"
                onClick={submitShiftData}
              >
                シフトを保存する
              </Button>
            </div>
          </form>
        </div>
        {/* 対象のユーザーを選択するラジオボタン */}
        <div className="flex flex-col min-w-[20%] gap-2">
          <BaseUserSelect
            baseUserId={baseUserId}
            setBaseUserId={setBaseUserId}
            selectedUsers={selectedUsers}
          />
          <TargetUserSelect
            selectedUsers={selectedUsers}
            targetuserIds={targetuserIds}
            setTargetUserIds={setTargetUserIds}
          />
          <CopyShiftConfirmDialog
            baseUserId={baseUserId}
            targetuserIds={targetuserIds}
            baseUserName={baseUserName}
            copyShiftData={copyShiftData}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftCreateDialog;
