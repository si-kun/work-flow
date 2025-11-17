import { TableHeader } from "./employee";

export const SHIFT_CREATE_STATUS = ["day_working", "night_working", "day_off","paid"] as const;

export const SHIFT_HEADER: TableHeader[] = [
    { id: "name", label: "名前", width: "350px"},
    { id: "department", label: "部署", width: "250px"},
    { id: "position", label: "役職", width: "250px"},
    { id: "shift_type", label: "シフトタイプ", width: "250px"},
    { id: "work_status", label: "勤務状況", width: "250px"},
]
