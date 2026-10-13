interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

export function Table({ columns, data }: { columns: Column[]; data: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-gray-400 py-8">
                No data
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-sm">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}