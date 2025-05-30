interface StatusDisplayProps {
  isLoading: boolean;
  error: string | null;
  loadingText?: string;
}

export default function StatusDisplay({
  isLoading,
  error,
  loadingText = "로딩중...",
}: StatusDisplayProps) {
  if (isLoading) {
    return <p className="text-center text-blue-500 my-4">{loadingText}</p>;
  }
  if (error) {
    return (
      <div className="text-red-500 my-4 p-3 bg-red-100 border border-red-400 rounded">
        {error}
      </div>
    );
  }
  return null;
}
