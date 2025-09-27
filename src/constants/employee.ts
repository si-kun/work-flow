import { EmployeeFormData } from "@/types/employee/schema";

interface EmployeeTableHeader {
  id: string;
  label: string;
}

interface EmployeeInputField {
  name: keyof EmployeeFormData;
  label: string;
  placeholder: string;
  type?: "text" | "date" | "email";
  departmentOptions?: {
    label: string;
    value: string;
  }[];
  positionOptions?: {
    id: string;
    label: string;
    value: string;
  }[];
  isActive?: "就業中" | "休職" | "退職" | "入社予定";
  isActiveOptions?: {
    label: string;
    value: "就業中" | "休職" | "退職" | "入社予定";
  }[];
}

export const EMPLOYEES_TABLE_HEADER = [
  {
    id: "name",
    label: "名前",
  },
  {
    id: "department",
    label: "部署",
  },
  {
    id: "position",
    label: "役職",
  },
  {
    id: "email",
    label: "メールアドレス",
  },
  {
    id: "joinDate",
    label: "入社日",
  },
  {
    id: "isActive",
    label: "在籍状況",
  },
] as EmployeeTableHeader[];

export const EMPLOYEE_INPUT_FIELDS = [
  {
    name: "name",
    label: "名前",
    placeholder: "例）山田 太郎",
    type: "text",
  },
  {
    name: "email",
    label: "メールアドレス",
    placeholder: "例 ) ○○〇@company.co.jp",
    type: "email",
  },
  {
    name: "department",
    label: "部署",
    placeholder: "例）営業部",
    departmentOptions: [
      { label: "全部署", value: "All" },
      { label: "人事部", value: "Human Resources" },
      { label: "営業部", value: "Sales" },
      { label: "技術部", value: "Engineering" },
      { label: "経理部", value: "Finance" },
      { label: "マーケティング部", value: "Marketing" },
      { label: "総務部", value: "General Affairs" },
      { label: "デザイン部", value: "Design" },
      { label: "未配属", value: "Unassigned" },
      { label: "その他", value: "Other" },
    ],
  },
  {
    name: "position",
    label: "役職",
    placeholder: "例）主任",
    positionOptions: [
      { id: "1", label: "スタッフ", value: "Staff" },
      { id: "2", label: "主任", value: "Senior Staff" },
      { id: "3", label: "係長", value: "Assistant Manager" },
      { id: "4", label: "課長", value: "Section chief" },
      { id: "5", label: "部長", value: "General Manager" },
      { id: "6", label: "役員", value: "Director" },
      { id: "7", label: "一般社員", value: "Regular Employee" },
      { id: "8", label: "エンジニア", value: "Engineer" },
      { id: "9", label: "シニアエンジニア", value: "Senior Engineer" },
      { id: "10", label: "テックリード", value: "Tech Lead" },
      { id: "11", label: "マネージャー", value: "Manager" },
      { id: "12", label: "プロジェクトマネージャー", value: "Project Manager" },
      { id: "13", label: "デザイナー", value: "Designer" },
      { id: "14", label: "シニアデザイナー", value: "Senior Designer" },
      { id: "15", label: "アナリスト", value: "Analyst" },
    ],
  },

  {
    name: "joinDate",
    label: "入社日",
    placeholder: "例）2023/01/01",
    type: "date",
  },
  {
    name: "isActive",
    label: "在籍状況",
    isActiveOptions: [
      { label: "就業中", value: "Employment" },
      { label: "休職", value: "Leave" },
      { label: "退職", value: "Retirement" },
      { label: "入社予定", value: "PlannedJoining" },
    ],
  },
] as EmployeeInputField[];
