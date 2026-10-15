export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="inline-block animate-spin rounded-full border-b-2 border-blue-600"
      style={{ width: size, height: size }}
    />
  );
}