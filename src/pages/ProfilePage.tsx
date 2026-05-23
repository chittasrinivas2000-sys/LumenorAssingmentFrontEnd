import { useState, useEffect } from "react";
import { useAppSelector } from "../hooks/redux";
import { useUpdateProfileMutation } from "../features/users/usersApi";
import { Button, Input, Card, PageHeader, Badge } from "../components/ui";
import AppLayout from "../components/layout/AppLayout";

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  company_admin: "Company Admin",
  employee: "Employee",
};

const ProfilePage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    profilePicture: user?.profilePicture ?? "",
  });

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, profilePicture: user.profilePicture });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateProfile({ id: user._id ?? user.id ?? "", ...form }).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // error handled silently
    }
  };

  const companyName =
    user?.company && typeof user.company === "object"
      ? user.company.name
      : "N/A";

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <PageHeader title="My Profile" description="View and edit your profile information" />

        <div className="max-w-lg">
          <Card>
            {/* Avatar */}
            <div className="mb-6 flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300 text-2xl font-semibold">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <p className="text-base font-semibold text-white">{user?.name}</p>
                <p className="text-sm text-white/40">{user?.email}</p>
                <div className="mt-1.5 flex gap-2">
                  <Badge variant="info">{roleLabels[user?.role ?? ""]}</Badge>
                  {user?.company && <Badge variant="default">{companyName}</Badge>}
                </div>
              </div>
            </div>

            {success && (
              <div className="mb-5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Profile Picture URL"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={form.profilePicture}
                onChange={(e) => setForm({ ...form, profilePicture: e.target.value })}
              />
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/40">Email</label>
                <input
                  value={user?.email}
                  disabled
                  className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm text-white/30 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-white/25">Email cannot be changed</p>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/40">Role</label>
                <input
                  value={roleLabels[user?.role ?? ""]}
                  disabled
                  className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5 text-sm text-white/30 cursor-not-allowed"
                />
              </div>
              <Button type="submit" loading={isLoading} className="w-full">
                Save Changes
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
