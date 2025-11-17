import { Dialog, DialogContent } from "@/components/ui/dialog";

import ShiftCalendar from "@/components/dialog/ShiftCreateDialog/ShiftCalendar";
import { useEffect, useState } from "react";
import { ShiftSettingEvent } from "@/constants/calendarColor";
import { getShiftsByUserAndMonth } from "@/actions/shifts/getShiftsByUserAndMonth";
import ShiftListDialogHeader from "./ShiftListDialogHeader";
import { useYearMonth } from "@/hooks/useYearMonth";
import Loading from "@/components/loading/Loading";
import { toast } from "sonner";
import { ShiftTargetUser } from "@/hooks/shift/useShiftListData";

interface ShiftCreateDialogProps {
  userShiftData: ShiftTargetUser[];
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ShiftListDialog = ({
  userShiftData,
  isOpen,
  onClose,
  userId,
}: ShiftCreateDialogProps) => {
  const { year, month, handleYearChange, handleMonthChange } = useYearMonth();

  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<ShiftSettingEvent[]>([]);
  const [calendarKey, setCalendarKey] = useState(0);

  useEffect(() => {
    setCalendarKey((prev) => prev + 1);
  }, [year, month]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //     setCalendarKey((prev) => prev + 1);
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, [isOpen]);

  useEffect(() => {
    // シフトを取得
    const fetchShifts = async () => {
      if(!isOpen || !userId) return;

      try {
        if (!userId) return;
        setLoading(true);

        const response = await getShiftsByUserAndMonth({
          userId,
          year,
          month,
        });

        if (response.success) {
          const newEvents = response.data.map((shift) => ({
            title: shift.shiftType,
            start: shift.date.toISOString().split("T")[0],
            end: shift.date.toISOString().split("T")[0],
            allDay: true,
          }));

          setEvents(newEvents);
        }
      } catch (error) {
        console.error("シフトの取得に失敗しました:", error);
        toast.error("シフトの取得に失敗しました");
      } finally {
        setTimeout(() => {
          setLoading(false);
          setCalendarKey((prev) => prev + 1);
        }, 300);
      }
    };
    fetchShifts();
  }, [isOpen,userId, year, month]);

  const userName = userShiftData.find((user) => user.id === userId)?.name || "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[80vw] min-h-[90vh] flex gap-4 overflow-y-auto p-8">
        <div className="flex flex-col flex-1">
          <ShiftListDialogHeader
            year={year}
            month={month}
            userName={userName}
            handleYearChange={handleYearChange}
            handleMonthChange={handleMonthChange}
          />

          <div className="flex flex-col gap-4 flex-1 w-full relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loading />
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
                year={year}
                month={month}
                isUpdatingFromCalendar={{ current: false }}
                handleYearChange={handleYearChange}
                handleMonthChange={handleMonthChange}
                handleClickDate={() => {}}
                handleEventClick={() => {}}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftListDialog;
