import Image from "next/image";

interface LogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function Logo({ size = "medium", className = "" }: LogoProps) {
  const sizeClasses = {
    small: "h-10 w-10", // 40px
    medium: "h-16 w-16", // 64px
    large: "h-24 w-24", // 96px
  };

  const sizeValues = {
    small: { width: 48, height: 48 },
    medium: { width: 64, height: 64 },
    large: { width: 96, height: 96 },
  };

  return (
    <Image
      src="/logo/Symbol.svg"
      alt="Manual Logo"
      width={sizeValues[size].width}
      height={sizeValues[size].height}
      className={`${sizeClasses[size]} ${className}`}
    />
  );
}
