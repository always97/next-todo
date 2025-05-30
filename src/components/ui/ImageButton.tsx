type ImageButtonProps = {
  src: string;
  alt: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // 여기 수정
  className?: string;
};

export default function ImageButton({
  src,
  alt,
  onClick,
  className = "",
}: ImageButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-0 focus:outline-none ${className}`}
      type="button"
    >
      <img src={src} alt={alt} />
    </button>
  );
}
