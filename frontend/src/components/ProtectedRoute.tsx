import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/UseAuth.store";
import { UserRole } from "../features/user/types";
import Page404 from "../pages/Page404";

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { user, token } = useAuthStore();

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If user is logged in but doesn't have permission -> 404
        return <Page404 />;
    }

    return <Outlet />;
};
