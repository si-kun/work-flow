import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ATTENDANCE_TABLE_HEADER,
  MonthlySummaryData,
} from "@/constants/attendance";
import { DEPARTMENTS, POSITIONS } from "@/constants/employee";
import { convertToJapanese } from "@/lib/convertToJapanese";
import { minutesToTime } from "@/utils/timeUtils";

interface DepartmentDetailModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: MonthlySummaryData[];
}

const DepartmentDetailModal = ({
  isOpen,
  setIsOpen,
  user,
}: DepartmentDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
      <DialogTrigger></DialogTrigger>
      <DialogContent className="min-w-[70%] h-[60%] flex flex-col">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex-1 border border-gray-300 border-2 overflow-y-auto">
          <div className="grid grid-cols-8 p-2 font-semibold bg-gray-200 border-b-2 border-gray-300 sticky top-0 z-10">
            {ATTENDANCE_TABLE_HEADER.map((header) => (
              <span key={header.id}>{header.label}</span>
            ))}
          </div>
          <div>
            {user.map((userData) => {
              // cellDataを作る
              const cellData = [
                userData.name,
                convertToJapanese(userData.department, DEPARTMENTS),
                convertToJapanese(userData.position, POSITIONS),
                minutesToTime(userData.totalWorkHours),
                minutesToTime(userData.nightWorkHours),
                minutesToTime(userData.overtimeHours),
                `${userData.paidLeaveUsed}/${userData.paidLeaveRemaining}日`,
                userData.absentDays + "日",
              ];

              return (
                <div
                  key={userData.userId}
                  className="grid grid-cols-8 p-2 even:bg-white odd:bg-gray-100 overflow-y-auto"
                >
                  {cellData.map((data,index) => (
                    <span key={index}>{data}</span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentDetailModal;
