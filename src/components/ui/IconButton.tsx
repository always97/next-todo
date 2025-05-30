import Image from "next/image";
import { ButtonHTMLAttributes } from "react";

type IconButtonProps = {
  src: string;
  alt: string;
  size?: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({
  src,
  alt,
  size = 32,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={`p-1 rounded-full ${className}`}
    >
      <Image src={src} alt={alt} width={size} height={size} />
    </button>
  );
}
