import z from "zod";

export const employeeSchema = z.object({
    name: z.string().min(1, "名前は必須です"),
    email: z.email("有効なメールアドレスを入力してください"),
    department: z.string().min(1, "部署は必須です"),
    position: z.string().min(1, "役職は必須です"),
    joinDate: z.date("有効な日付を入力してください"),
    isActive: z.enum(["Employment", "Leave", "Retirement", "PlannedJoining"])
})

export type EmployeeFormData = z.infer<typeof employeeSchema>;