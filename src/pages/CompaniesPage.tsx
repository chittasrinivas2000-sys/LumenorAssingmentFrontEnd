import { useState } from "react";
import {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useDeactivateCompanyMutation,
  useActivateCompanyMutation,
} from "../features/companies/companiesApi";
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
import AppLayout from "../components/layout/AppLayout";
import type { CreateCompanyRequest } from "../types";
import type { ApiError } from "../types";

const CompaniesPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<CreateCompanyRequest>({
    name: "",
    adminEmail: "",
    plan: "Basic",
  });

  const { data, isLoading, isError } = useGetCompaniesQuery({ page, search });
  const [createCompany, { isLoading: creating }] = useCreateCompanyMutation();
  const [deactivate] = useDeactivateCompanyMutation();
  const [activate] = useActivateCompanyMutation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    try {
      await createCompany(form).unwrap();
      setModalOpen(false);
      setForm({ name: "", adminEmail: "", plan: "Basic" });
    } catch (err) {
      const apiErr = err as ApiError;
      setFormError(apiErr.data?.message || "Failed to create company");
    }
  };

  const planColors: Record<string, "info" | "warning" | "success"> = {
    Basic: "info",
    Pro: "warning",
    Enterprise: "success",
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Companies"
          description="Manage all companies in the platform"
          action={
            <Button onClick={() => setModalOpen(true)}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Company
            </Button>
          }
        />

        {isError && <ErrorMessage message="Failed to load companies." />}

        {/* Search */}
        <Card className="mb-5 p-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              placeholder="Search companies..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="secondary">Search</Button>
          </form>
        </Card>

        {/* Table */}
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Company</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Admin Email</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Plan</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Users</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(6)].map((__, j) => (
                          <td key={j} className="px-5 py-4">
                            <Skeleton className="h-4 w-24" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : data?.companies?.map((company) => (
                      <tr key={company._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-300 text-xs font-semibold">
                              {company.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-white">{company.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-white/50">{company.adminEmail}</td>
                        <td className="px-5 py-4">
                          <Badge variant={planColors[company.plan]}>{company.plan}</Badge>
                        </td>
                        <td className="px-5 py-4 text-sm text-white/50">{company.userCount}</td>
                        <td className="px-5 py-4">
                          <Badge variant={company.isActive ? "success" : "error"}>
                            {company.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          {company.isActive ? (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => deactivate(company._id)}
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => activate(company._id)}
                            >
                              Activate
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>

            {!isLoading && (data?.companies?.length ?? 0) === 0 && (
              <div className="py-12 text-center text-sm text-white/30">
                No companies found.
              </div>
            )}
          </div>

          {/* Pagination */}
          {(data?.totalPages ?? 0) > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 px-5 py-3">
              <p className="text-xs text-white/30">
                Page {data?.page} of {data?.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= (data?.totalPages ?? 1)}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Create modal */}
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Company">
          {formError && <ErrorMessage message={formError} />}
          <form onSubmit={handleCreate} className="mt-4 space-y-4">
            <Input
              label="Company Name"
              placeholder="Acme Inc."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Admin Email"
              type="email"
              placeholder="admin@acme.com"
              value={form.adminEmail}
              onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
              required
            />
            <Select
              label="Plan"
              value={form.plan}
              onChange={(e) =>
                setForm({ ...form, plan: e.target.value as "Basic" | "Pro" | "Enterprise" })
              }
            >
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
            </Select>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={creating} className="flex-1">
                Create Company
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
};

export default CompaniesPage;
