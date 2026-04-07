export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFFFFF]">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#C9940A] rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <span className="text-white font-bold text-2xl">CC</span>
        </div>
        <div className="text-[#777777]">Loading...</div>
      </div>
    </div>
  );
}
