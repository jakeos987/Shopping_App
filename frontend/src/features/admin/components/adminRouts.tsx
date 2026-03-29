import { Navigate, Outlet } from  'react-router-dom';
import { useAuthStore } from '../../../store/UseAuth.store';
import { UserRole } from '../../user/types';

export const AdminRouts = ()=>{
    const { user, isLoading } = useAuthStore()
    if(isLoading) return <div>...טוען</div>
    if(user && user.role === UserRole.ADMIN){
        return <Outlet />//
    }
    return <Navigate to={'/'} replace/>//replace מחליף את ההיסטוריה של הדפדפן
}