"use client";

export default function Loading({
  size = 5,
  label = "Loading...",
}: {
  size?: number;
  label?: string;
}) {
  return (
    <div className="bg-dark-foreground/90 flex items-center space-x-3 px-3 py-2 shadow">
      <div
        className={`h-${size} w-${size} animate-spin rounded-full border-2 border-gray-300 border-t-gray-700`}
        aria-hidden
      />
      <div className="text-muted-foreground text-sm">{label}</div>
    </div>
  );
}
