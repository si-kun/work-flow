import { ClockIn, ClockInType, ClockOut, ClockOutType, DAILY_WORK, DailyWorkType } from "@/types/attendance";
import { User } from "@prisma/client";

export const convertToJapanese = (
  value: string,
  items: readonly { value: string; label: string}[],
): string => {
  const found = items.find((item) => item.value === value);
  return found ? found.label : value;
}


  // それぞれの部署の人数をカウント
  export const getDepartmentCounts = (users: User[]) => {
    const counts: { [key: string]: number} = {};

    users.forEach((user) => {
      if(counts[user.department]) {
        counts[user.department] ++;
      } else {
        counts[user.department] = 1;
      }
    })
    return counts;
  };

  // workTypeを日本語に変換
  export const convertWorkTypeToJapanese = (workType: DailyWorkType | null): string => {
    if(!workType) return "-";

    const found = DAILY_WORK.find((work) => work.value === workType);
    return found ? found.label : workType;
  }

  // workStartTypeを日本語に変換
  export const convertWorkStartTypeToJapanese = (workStartType: ClockInType | null): string => {
    if(!workStartType) return "-";

    const found = ClockIn.find((work) => work.value === workStartType);
    return found ? found.label === "時間通り" ? "-" : found.label : workStartType;
  }

  // workEndTypeを日本語に変換
  export const convertWorkEndTypeToJapanese = (workEndType: ClockOutType | null): string => {
    if(!workEndType) return "-";

    const found = ClockOut.find((work) => work.value === workEndType);
    return found ? found.label === "時間通り" ? "-" : found.label : workEndType;
  }