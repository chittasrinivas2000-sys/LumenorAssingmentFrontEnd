export type UserRole = "super_admin" | "company_admin" | "employee";

export interface Company {
  _id: string;
  name: string;
  adminEmail: string;
  plan: "Basic" | "Pro" | "Enterprise";
  isActive: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  company: Company | string | null;
  isActive: boolean;
  profilePicture: string;
  lastLogin: string | null;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  totalPages: number;
  companies?: T[];
  users?: T[];
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalCompanies?: number;
  recentLogins: User[];
}

export interface InviteUserRequest {
  email: string;
  name: string;
  role: UserRole;
}

export interface CreateCompanyRequest {
  name: string;
  adminEmail: string;
  plan: "Basic" | "Pro" | "Enterprise";
}

export interface ApiError {
  status: number;
  data: { message: string };
}
