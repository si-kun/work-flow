export const SHIFT_CREATE_STATUS = ["day_working", "night_working", "day_off","paid"] as const;

export const SHIFT_HEADER = [
    { label: "名前", value: "name"},
    { label: "部署", value: "department"},
    { label: "役職", value: "position"},
    { label: "シフトタイプ", value: "shift_type"},
    { label: "勤務状況", value: "work_status"},
] as const
