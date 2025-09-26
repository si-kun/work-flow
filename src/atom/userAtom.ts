import { User } from '@prisma/client';
import { atom} from 'jotai';

export const allUsers= atom<User[]>([])