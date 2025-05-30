interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  size?: number; // 스피너 크기 (px)
}

export default function LoadingOverlay({
  show,
  message = "로딩 중...",
  size = 32,
}: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-4">
      <svg
        className="animate-spin text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        style={{ width: size, height: size }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}
