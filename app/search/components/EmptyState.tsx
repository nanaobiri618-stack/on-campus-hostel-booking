// app/search/components/EmptyState.tsx
export function EmptyState() {
  return (
    <div className="text-center text-gray-600 border rounded-lg p-10">
      <p className="font-medium mb-2">No hostels match these filters.</p>
      <p className="text-sm">Try broadening your budget or changing campus.</p>
    </div>
  );
}