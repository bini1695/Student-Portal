export function Avatar({
  name,
  size = 40,
}: {
  name: string;
  size?: number;
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold"
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {initials}
    </div>
  );
}