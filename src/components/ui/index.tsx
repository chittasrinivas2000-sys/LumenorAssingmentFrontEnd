import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";

// Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface";
  const variants = {
    primary: "bg-brand-500 hover:bg-brand-600 text-white focus:ring-brand-500",
    secondary: "bg-white/10 hover:bg-white/15 text-white border border-white/10 focus:ring-white/20",
    danger: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 focus:ring-red-500",
    ghost: "hover:bg-white/5 text-white/60 hover:text-white focus:ring-white/20",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
};

// Input
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = "", ...props }: InputProps) => (
  <div className="w-full">
    {label && (
      <label className="mb-1.5 block text-xs font-medium text-white/60">{label}</label>
    )}
    <input
      {...props}
      className={`w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/25 transition-all focus:border-brand-500/50 focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
        error ? "border-red-500/50" : ""
      } ${className}`}
    />
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export const Select = ({ label, error, className = "", children, ...props }: SelectProps) => (
  <div className="w-full">
    {label && (
      <label className="mb-1.5 block text-xs font-medium text-white/60">{label}</label>
    )}
    <select
      {...props}
      className={`w-full rounded-lg border border-white/10 bg-surface-200 px-3 py-2.5 text-sm text-white transition-all focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
        error ? "border-red-500/50" : ""
      } ${className}`}
    >
      {children}
    </select>
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

// Card
export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-xl glass p-6 ${className}`}>{children}</div>
);

// Badge
interface BadgeProps {
  variant?: "success" | "error" | "warning" | "info" | "default";
  children: ReactNode;
}

export const Badge = ({ variant = "default", children }: BadgeProps) => {
  const variants = {
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    error: "bg-red-500/15 text-red-400 border-red-500/20",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    info: "bg-brand-500/15 text-brand-300 border-brand-500/20",
    default: "bg-white/10 text-white/60 border-white/10",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Skeleton
export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-lg bg-white/5 ${className}`} />
);

// Error message
export const ErrorMessage = ({ message }: { message: string }) => (
  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
    {message}
  </div>
);

// Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl glass border border-white/10 p-6 animate-slide-up">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Page header
export const PageHeader = ({ title, description, action }: { title: string; description?: string; action?: ReactNode }) => (
  <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      {description && <p className="mt-0.5 text-sm text-white/40">{description}</p>}
    </div>
    {action && <div className="mt-3 sm:mt-0">{action}</div>}
  </div>
);
