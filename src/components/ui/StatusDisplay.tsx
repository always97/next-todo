interface StatusDisplayProps {
  isLoading: boolean;
  error?: string | null;
  loadingText?: string;
}

export default function StatusDisplay({
  isLoading,
  error,
  loadingText = "로딩 중입니다...",
}: StatusDisplayProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="flex flex-col items-center gap-3 text-blue-600 animate-pulse">
          <svg
            className="h-8 w-8 animate-spin text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
          <p className="text-lg font-medium">{loadingText}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="text-red-600 bg-red-100 border border-red-400 rounded px-4 py-3 max-w-md text-center">
          <p className="font-semibold">에러가 발생했습니다</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return null;
}
