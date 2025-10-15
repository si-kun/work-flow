import { User } from "@prisma/client";
import { atom } from "jotai";

export const user = atom<User | null>(null);
export const allUsers = atom<User[]>([]);