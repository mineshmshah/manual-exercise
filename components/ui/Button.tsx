import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  type = "button",
  ...props
}: ButtonProps) {
  const baseClasses =
    "font-bold tracking-[0.15em] leading-[15px] transition-all uppercase rounded-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-(--color-son) text-white hover:brightness-90 focus:ring-(--color-son)",
    secondary:
      "bg-(--color-grandfather-light) text-(--color-father) hover:brightness-90 focus:ring-(--color-grandfather)",
    outline:
      "bg-transparent text-(--color-father) border border-(--color-father) hover:bg-(--color-father) hover:text-white focus:ring-(--color-father)",
  };

  const sizeClasses = {
    small: "px-[30px] py-[15px] text-[10px]",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={combinedClasses}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
