import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { useGetDashboardStatsQuery } from "../features/dashboard/dashboardApi";
import { useAppSelector } from "../hooks/redux";
import { Card, Skeleton, ErrorMessage } from "../components/ui";
import AppLayout from "../components/layout/AppLayout";

const StatCard = ({
  label,
  value,
  loading,
  color = "text-white",
}: {
  label: string;
  value: number | string;
  loading: boolean;
  color?: string;
}) => (
  <Card className="flex flex-col gap-2">
    {loading ? (
      <>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-16" />
      </>
    ) : (
      <>
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider">{label}</p>
        <p className={`text-3xl font-semibold ${color}`}>{value}</p>
      </>
    )}
  </Card>
);

const DashboardPage = () => {
  const { user } = useAppSelector((s) => s.auth);
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  const chartData = data
    ? [
        { name: "Active", value: data.activeUsers, fill: "#2d5aff" },
        { name: "Inactive", value: data.inactiveUsers, fill: "#253347" },
      ]
    : [];

  const barData = data
    ? [
        { name: "Active", count: data.activeUsers },
        { name: "Inactive", count: data.inactiveUsers },
      ]
    : [];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-white">
            Good morning, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-0.5 text-sm text-white/40">Here's what's happening across your workspace</p>
        </div>

        {isError && (
          <div className="mb-6">
            <ErrorMessage message="Failed to load dashboard data. Please refresh." />
          </div>
        )}

        {/* Stat cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value={data?.totalUsers ?? 0} loading={isLoading} />
          <StatCard label="Active Users" value={data?.activeUsers ?? 0} loading={isLoading} color="text-emerald-400" />
          <StatCard label="Inactive Users" value={data?.inactiveUsers ?? 0} loading={isLoading} color="text-red-400" />
          {user?.role === "super_admin" && (
            <StatCard label="Companies" value={data?.totalCompanies ?? 0} loading={isLoading} color="text-brand-300" />
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pie chart */}
          <Card>
            <h2 className="mb-5 text-sm font-semibold text-white/70">User Status Distribution</h2>
            {isLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Skeleton className="h-40 w-40 rounded-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1a2236",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="mt-2 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
                <span className="text-xs text-white/50">Active ({data?.activeUsers ?? 0})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-surface-400" />
                <span className="text-xs text-white/50">Inactive ({data?.inactiveUsers ?? 0})</span>
              </div>
            </div>
          </Card>

          {/* Bar chart */}
          <Card>
            <h2 className="mb-5 text-sm font-semibold text-white/70">User Overview</h2>
            {isLoading ? (
              <div className="flex h-48 items-end gap-4 justify-center">
                <Skeleton className="h-32 w-16" />
                <Skeleton className="h-16 w-16" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} barSize={40}>
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#1a2236",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="count" fill="#2d5aff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>

        {/* Recent logins */}
        <Card className="mt-6">
          <h2 className="mb-5 text-sm font-semibold text-white/70">Recent Login Activity</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2.5 w-24" />
                  </div>
                  <Skeleton className="h-3 w-28" />
                </div>
              ))}
            </div>
          ) : (data?.recentLogins?.length ?? 0) === 0 ? (
            <p className="text-sm text-white/30">No recent logins found.</p>
          ) : (
            <div className="divide-y divide-white/5">
              {data?.recentLogins.map((loginUser) => (
                <div key={loginUser._id} className="flex items-center gap-3 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold">
                    {loginUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-white">{loginUser.name}</p>
                    <p className="truncate text-xs text-white/40">{loginUser.email}</p>
                  </div>
                  <p className="shrink-0 text-xs text-white/30">
                    {loginUser.lastLogin
                      ? new Date(loginUser.lastLogin).toLocaleString()
                      : "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
