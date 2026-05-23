import { useState } from "react";
import {
  useGetCompanyUsersQuery,
  useInviteUserMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
} from "../features/users/usersApi";
import {
  Button,
  Badge,
  Modal,
  Input,
  Select,
  Skeleton,
  ErrorMessage,
  PageHeader,
  Card,
} from "../components/ui";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useGetAllUsersQuery } from "../features/users/usersApi";
import AppLayout from "../components/layout/AppLayout";
import type { ApiError, UserRole } from "../types";

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  company_admin: "Company Admin",
  employee: "Employee",
};

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", role: "employee" as UserRole });

const user = useSelector(
  (state: RootState) => state.auth.user
);

const isSuperAdmin = user?.role === "super_admin";

const companyUsersQuery = useGetCompanyUsersQuery(
  {
    page,
    search,
    role: roleFilter,
    status: statusFilter,
  },
  {
    skip: isSuperAdmin,
  }
);

const allUsersQuery = useGetAllUsersQuery(
  {
    page,
    search,
    role: roleFilter,
    status: statusFilter,
  },
  {
    skip: !isSuperAdmin,
  }
);

const data = isSuperAdmin
  ? allUsersQuery.data
  : companyUsersQuery.data;

const isLoading = isSuperAdmin
  ? allUsersQuery.isLoading
  : companyUsersQuery.isLoading;

const isError = isSuperAdmin
  ? allUsersQuery.isError
  : companyUsersQuery.isError;
  const [inviteUser, { isLoading: inviting }] = useInviteUserMutation();
  const [deactivate] = useDeactivateUserMutation();
  const [activate] = useActivateUserMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setInviteSuccess("");
    try {
      const result = await inviteUser(form).unwrap();
      setInviteSuccess(`User invited! Temporary password: ${result.tempPassword}`);
      setForm({ name: "", email: "", role: "employee" });
    } catch (err) {
      const apiErr = err as ApiError;
      setFormError(apiErr.data?.message || "Failed to invite user");
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Team Members"
          description="Manage users in your organisation"
          action={
            <Button onClick={() => setModalOpen(true)}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Invite User
            </Button>
          }
        />

        {isError && <ErrorMessage message="Failed to load users." />}

        {/* Filters */}
        <Card className="mb-5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <form onSubmit={handleSearch} className="flex flex-1 gap-3">
              <Input
                placeholder="Search by name or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="secondary">Search</Button>
            </form>
            <div className="flex gap-3">
              <Select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              >
                <option value="">All Roles</option>
                <option value="company_admin">Company Admin</option>
                <option value="employee">Employee</option>
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-white/40 uppercase tracking-wider">User</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Last Login</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(5)].map((__, j) => (
                          <td key={j} className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                        ))}
                      </tr>
                    ))
                  : data?.users?.map((u) => (
                      <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{u.name}</p>
                              <p className="text-xs text-white/40">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={u.role === "company_admin" ? "info" : "default"}>
                            {roleLabels[u.role]}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant={u.isActive ? "success" : "error"}>
                            {u.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-xs text-white/40">
                          {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}
                        </td>
                        <td className="px-5 py-4">
                          {u.isActive ? (
                            <Button variant="danger" size="sm" onClick={() => deactivate(u._id)}>
                              Deactivate
                            </Button>
                          ) : (
                            <Button variant="secondary" size="sm" onClick={() => activate(u._id)}>
                              Activate
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>

            {!isLoading && (data?.users?.length ?? 0) === 0 && (
              <div className="py-12 text-center text-sm text-white/30">No users found.</div>
            )}
          </div>

          {(data?.totalPages ?? 0) > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 px-5 py-3">
              <p className="text-xs text-white/30">Page {data?.page} of {data?.totalPages}</p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button variant="secondary" size="sm" disabled={page >= (data?.totalPages ?? 1)} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </Card>

        {/* Invite modal */}
        <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setInviteSuccess(""); setFormError(""); }} title="Invite Team Member">
          {formError && <div className="mb-4"><ErrorMessage message={formError} /></div>}
          {inviteSuccess && (
            <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              {inviteSuccess}
            </div>
          )}
          <form onSubmit={handleInvite} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Jane Smith"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="jane@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Select
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
            >
              <option value="employee">Employee</option>
              <option value="company_admin">Company Admin</option>
            </Select>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" loading={inviting} className="flex-1">Send Invite</Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default UsersPage;
