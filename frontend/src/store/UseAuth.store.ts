import { create } from 'zustand';
import type { User } from '../features/user/types';
import { devtools, persist } from 'zustand/middleware';
import { AuthService } from '../services/auth.service'; // ⭐ וודא שיש לך את האימפורט הזה

interface AuthState {
    user: User | null
    token: string | null
    isLoading: boolean
    setAuth: (user: User, token: string) => void
    logout: () => void
    // ⭐ הפונקציה החדשה שתטפל בכניסה עם גוגל
    loginWithGoogleToken: (token: string) => Promise<void>
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                token: null,
                isLoading: false,

                setAuth: (user, token) => set(
                    { user, token },
                    false,
                    'setAuth'
                ),

                logout: () => set(
                    { user: null, token: null },
                    false,
                    'logout'
                ),

                // ⭐ המימוש של הפונקציה החדשה
                loginWithGoogleToken: async (token: string) => {
                    set({ isLoading: true, token }, false, 'googleLoginStart'); // שמור טוקן זמנית והתחל טעינה

                    try {
                        // 1. בקש מהשרת את פרטי המשתמש (מסתמך על הטוקן שכבר שמרנו או שלחנו)
                        // וודא ש-AuthService.getMe() קיים ושולח את הטוקן ב-Header
                        const user = await AuthService.getMe();

                        // 2. עדכן את המשתמש בסטור
                        set({ user, isLoading: false }, false, 'googleLoginSuccess');
                    } catch (error) {
                        console.error("Google login failed inside store:", error);
                        
                        // במקרה של כישלון - ננקה את הטוקן
                        set({ user: null, token: null, isLoading: false }, false, 'googleLoginFail');
                        throw error; // זרוק שגיאה כדי שהקומפוננטה תדע להציג הודעה
                    }
                }
            }),
            {
                name: 'auth-storage',
            }
        ),
        { name: 'Auth Store' }
    )
)