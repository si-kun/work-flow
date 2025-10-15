import { ClockIn, ClockInType, ClockOut, ClockOutType, DailyWork, DailyWorkType } from "@/types/attendance";
import { User } from "@prisma/client";

// 部署を英語から日本語に変換する関数
export const convertDepartmentToJapanese = (englishDepartment: string): string => {
    const departmentMap: { [key: string]: string } = {
      "Human Resources": "人事部",
      "Sales": "営業部", 
      "Engineering": "技術部",
      "Finance": "経理部",
      "Marketing": "マーケティング部",
      "General Affairs": "総務部",
      "Design": "デザイン部",
      "Unassigned": "未配属",
      "Other": "その他",
    };
  
    return departmentMap[englishDepartment] || englishDepartment;
  };

  // 役職を英語から日本語に変換する関数
export const convertPositionToJapanese = (englishPosition: string): string => {
  const positionMap: { [key: string]: string } = {
    "Staff": "スタッフ",
    "Senior Staff": "主任",
    "Assistant Manager": "係長",
    "Section chief": "課長",
    "General Manager": "部長",
    "Director": "役員",
    "Regular Employee": "一般社員",
    "Engineer": "エンジニア",
    "Senior Engineer": "シニアエンジニア",
    "Tech Lead": "テックリード",
    "Manager": "マネージャー",
    "Project Manager": "プロジェクトマネージャー",
    "Designer": "デザイナー",
    "Senior Designer": "シニアデザイナー",
    "Analyst": "アナリスト",
  };

  return positionMap[englishPosition] || englishPosition;
};

// 在籍状況を英語から日本語に変換する関数
export const convertStatusToJapanese = (englishStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    "Employment": "就業中",
    "Leave": "休職",
    "Retirement": "退職",
    "PlannedJoining": "入社予定",
  };

  return statusMap[englishStatus] || englishStatus;
};


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

    const found = DailyWork.find((work) => work.value === workType);
    return found ? found.label : workType;
  }

  // workStartTypeを日本語に変換
  export const convertWorkStartTypeToJapanese = (workStartType: ClockInType | null): string => {
    if(!workStartType) return "-";

    const found = ClockIn.find((work) => work.value === workStartType);
    return found ? found.label === "時間通り" ? "" : found.label : workStartType;
  }

  // workEndTypeを日本語に変換
  export const convertWorkEndTypeToJapanese = (workEndType: ClockOutType | null): string => {
    if(!workEndType) return "-";

    const found = ClockOut.find((work) => work.value === workEndType);
    return found ? found.label === "時間通り" ? "" : found.label : workEndType;
  }