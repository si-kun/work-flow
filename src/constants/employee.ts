import { EmployeeFormData } from "@/types/employee/schema";

export interface TableHeader {
  id: string;
  label: string;
  width: string;
}

interface EmployeeInputField {
  name: keyof EmployeeFormData;
  label: string;
  placeholder: string;
  type?: "text" | "date" | "email" | "select" | "radio";
  options?: readonly {
    label: string;
    value: string;
  }[];
}

interface SelectOption {
  label: string;
  value: string;
}

export const EMPLOYEES_TABLE_HEADER:TableHeader[] = [
  {
    id: "name",
    label: "名前",
    width: "300px"
  },
  {
    id: "department",
    label: "部署",
    width: "200px"
  },
  {
    id: "position",
    label: "役職",
    width: "200px"
  },
  {
    id: "email",
    label: "メールアドレス",
    width: "400px"
  },
  {
    id: "joinDate",
    label: "入社日",
    width: "200px"
  },
  {
    id: "isActive",
    label: "在籍状況",
    width: "200px"
  },
] 

export const DEPARTMENTS: readonly SelectOption[] = [
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
]

export const POSITIONS: readonly SelectOption[] = [
  { label: "スタッフ", value: "Staff" },
  { label: "主任", value: "Senior Staff" },
  { label: "係長", value: "Assistant Manager" },
  { label: "課長", value: "Section chief" },
  { label: "部長", value: "General Manager" },
  { label: "役員", value: "Director" },
  { label: "一般社員", value: "Regular Employee" },
  { label: "エンジニア", value: "Engineer" },
  { label: "シニアエンジニア", value: "Senior Engineer" },
  { label: "テックリード", value: "Tech Lead" },
  { label: "マネージャー", value: "Manager" },
  { label: "プロジェクトマネージャー", value: "Project Manager" },
  { label: "デザイナー", value: "Designer" },
  { label: "シニアデザイナー", value: "Senior Designer" },
  { label: "アナリスト", value: "Analyst" },
]
export const EMPLOYMENT_STATUS: readonly SelectOption[] = [
  { label: "就業中", value: "Employment" },
  { label: "休職", value: "Leave" },
  { label: "退職", value: "Retirement" },
  { label: "入社予定", value: "PlannedJoining" },
]

export const EMPLOYMENT_ROLES: readonly SelectOption[] = [
  { label: "管理者", value: "ADMIN" },
  { label: "一般ユーザー", value: "EMPLOYEE" },
]

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
    type: "select",
    options: DEPARTMENTS,
  },
  {
    name: "position",
    label: "役職",
    placeholder: "例）主任",
    type: "select",
    options: POSITIONS,
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
    type: "radio",
    placeholder: "在籍状況を選択してください",
    options: EMPLOYMENT_STATUS,
  },
] as const satisfies readonly EmployeeInputField[];
