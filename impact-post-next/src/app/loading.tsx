export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
        <p className="font-bold text-gray-600 uppercase tracking-widest text-sm">
          Loading...
        </p>
      </div>
    </div>
  );
}
