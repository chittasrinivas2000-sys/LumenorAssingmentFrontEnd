import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { setCredentials } from "../features/auth/authSlice";
import { useRegisterMutation } from "../features/auth/authApi";
import { Button, Input, Select } from "../components/ui";
import type { ApiError, UserRole } from "../types";

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee" as UserRole,
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const result = await register(form).unwrap();
      dispatch(setCredentials({ accessToken: result.accessToken, user: result.user }));
      navigate("/dashboard");
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface bg-mesh-1 px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-brand-700/10 blur-3xl" />
      </div>

      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500">
            <span className="text-lg font-bold text-white">L</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Create account</h1>
          <p className="mt-1 text-sm text-white/40">Get started with Lumenor</p>
        </div>

        <div className="rounded-2xl glass border border-white/8 p-7">
          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
            />
            <Select
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
            >
              <option value="employee">Employee</option>
              <option value="company_admin">Company Admin</option>
              <option value="super_admin">Super Admin (first only)</option>
            </Select>
            <Button type="submit" loading={isLoading} className="mt-2 w-full" size="lg">
              Create account
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-white/30">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
