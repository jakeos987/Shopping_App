import {create } from 'zustand';
import type { User } from '../features/user/types';
import { devtools, persist } from 'zustand/middleware';

interface AuthState{
    user:User|null
    token: string | null
    setAuth: (user:User,token:string)=> void
    logout: ()=> void
}
export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set)=>({
                user:null,
                token:null,
                setAuth:(user,token)=> set(
                    {user,token},
                    false,// הוא היה שומר רק את היוזר והטוקן החדשים וזורק את כל הדברים האחרים שנשמרו TRUE אם היה
                    'setAuth'
                ),
                logout:()=> set(
                    {user:null,token:null},
                    false,
                    'logout'
                )
            }),
            {
                name:'auth-storage',
            }
        ),
        {name:'Auth Store'}
    )
)