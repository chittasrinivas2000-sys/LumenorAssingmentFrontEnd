import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import type { UserRole } from "../types";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  redirectTo?: string;
}

const RoleGuard = ({
  allowedRoles,
  children,
  redirectTo = "/dashboard",
}: RoleGuardProps) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
