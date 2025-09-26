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

export const EMPLOYEES: EmployeeFormData[] = [
    { name: "山田 太郎", email: "yamada.taro@example.com", department: "営業部", position: "主任", joinDate: new Date("2020-01-15"), isActive: "Employment" },
    { name: "佐藤 花子", email: "sato.hanako@example.com", department: "人事部", position: "スタッフ", joinDate: new Date("2021-03-10"), isActive: "Employment" },
    { name: "鈴木 一郎", email: "suzuki.ichiro@example.com", department: "技術部", position: "エンジニア", joinDate: new Date("2019-07-22"), isActive: "Leave" },
    { name: "高橋 美咲", email: "takahashi.misaki@example.com", department: "経理部", position: "主任", joinDate: new Date("2018-11-05"), isActive: "Employment" },
    { name: "田中 健", email: "tanaka.ken@example.com", department: "マーケティング部", position: "マネージャー", joinDate: new Date("2022-01-18"), isActive: "PlannedJoining" },
    { name: "小林 直樹", email: "kobayashi.naoki@example.com", department: "総務部", position: "スタッフ", joinDate: new Date("2020-04-01"), isActive: "Employment" },
    { name: "加藤 由美", email: "kato.yumi@example.com", department: "デザイン部", position: "デザイナー", joinDate: new Date("2021-09-15"), isActive: "Retirement" },
    { name: "渡辺 亮", email: "watanabe.ryo@example.com", department: "営業部", position: "課長", joinDate: new Date("2017-06-12"), isActive: "Employment" },
    { name: "伊藤 彩", email: "ito.aya@example.com", department: "人事部", position: "スタッフ", joinDate: new Date("2023-02-01"), isActive: "PlannedJoining" },
    { name: "中村 拓也", email: "nakamura.takuya@example.com", department: "技術部", position: "シニアエンジニア", joinDate: new Date("2016-10-20"), isActive: "Employment" },
    { name: "山本 真由美", email: "yamamoto.mayumi@example.com", department: "経理部", position: "スタッフ", joinDate: new Date("2019-12-25"), isActive: "Leave" },
    { name: "森田 剛", email: "morita.tsuyoshi@example.com", department: "マーケティング部", position: "アナリスト", joinDate: new Date("2020-08-30"), isActive: "Employment" },
    { name: "石井 さくら", email: "ishii.sakura@example.com", department: "総務部", position: "主任", joinDate: new Date("2018-05-14"), isActive: "Retirement" },
    { name: "松本 大輔", email: "matsumoto.daisuke@example.com", department: "デザイン部", position: "シニアデザイナー", joinDate: new Date("2021-07-19"), isActive: "Employment" },
    { name: "清水 里奈", email: "shimizu.rina@example.com", department: "営業部", position: "スタッフ", joinDate: new Date("2022-03-11"), isActive: "Employment" },
    { name: "斎藤 直人", email: "saito.naoto@example.com", department: "人事部", position: "課長", joinDate: new Date("2017-09-08"), isActive: "Retirement" },
    { name: "山口 恵", email: "yamaguchi.megumi@example.com", department: "技術部", position: "テックリード", joinDate: new Date("2015-04-23"), isActive: "Employment" },
    { name: "池田 翔", email: "ikeda.sho@example.com", department: "経理部", position: "スタッフ", joinDate: new Date("2020-10-02"), isActive: "Leave" },
    { name: "橋本 由紀", email: "hashimoto.yuki@example.com", department: "マーケティング部", position: "スタッフ", joinDate: new Date("2021-12-17"), isActive: "Employment" },
    { name: "阿部 剛志", email: "abe.tsuyoshi@example.com", department: "総務部", position: "マネージャー", joinDate: new Date("2019-01-29"), isActive: "Employment" },
    { name: "村上 直子", email: "murakami.naoko@example.com", department: "デザイン部", position: "デザイナー", joinDate: new Date("2022-05-10"), isActive: "PlannedJoining" },
    { name: "藤田 亮介", email: "fujita.ryosuke@example.com", department: "営業部", position: "主任", joinDate: new Date("2018-08-21"), isActive: "Employment" },
    { name: "西村 美穂", email: "nishimura.miho@example.com", department: "人事部", position: "スタッフ", joinDate: new Date("2020-11-30"), isActive: "Employment" },
    { name: "大野 剛", email: "ono.tsuyoshi@example.com", department: "技術部", position: "エンジニア", joinDate: new Date("2017-04-18"), isActive: "Retirement" },
    { name: "三浦 由紀", email: "miura.yuki@example.com", department: "経理部", position: "スタッフ", joinDate: new Date("2019-06-25"), isActive: "Employment" },
    { name: "岡田 拓也", email: "okada.takuya@example.com", department: "マーケティング部", position: "アナリスト", joinDate: new Date("2021-10-12"), isActive: "Leave" },
    { name: "竹内 さくら", email: "takeuchi.sakura@example.com", department: "総務部", position: "主任", joinDate: new Date("2018-03-14"), isActive: "Employment" },
    { name: "金子 大輔", email: "kaneko.daisuke@example.com", department: "デザイン部", position: "シニアデザイナー", joinDate: new Date("2020-09-19"), isActive: "Employment" },
    { name: "柴田 里奈", email: "shibata.rina@example.com", department: "営業部", position: "スタッフ", joinDate: new Date("2022-02-11"), isActive: "PlannedJoining" },
    { name: "内田 直人", email: "uchida.naoto@example.com", department: "人事部", position: "課長", joinDate: new Date("2016-07-08"), isActive: "Employment" },
    { name: "原田 恵", email: "harada.megumi@example.com", department: "技術部", position: "テックリード", joinDate: new Date("2015-12-23"), isActive: "Employment" },
  ];

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
