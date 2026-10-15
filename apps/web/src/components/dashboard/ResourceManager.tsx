'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import api from '@/lib/api';
import { SearchInput } from '@/components/ui/SearchInput';

export interface ResourceField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'datetime-local' | 'url' | 'textarea' | 'select';
  required?: boolean;
  options?: { value: string; label: string }[];
}

export interface ResourceColumn {
  key: string;
  label: string;
  format?: (value: unknown, row: Record<string, unknown>) => string;
}

function display(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function ResourceManager({
  title,
  endpoint,
  fields,
  columns,
  readOnly = false,
  canCreate = !readOnly,
  canEdit = !readOnly,
  canDelete = !readOnly,
}: {
  title: string;
  endpoint: string;
  fields: ResourceField[];
  columns: ResourceColumn[];
  readOnly?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Record<string, unknown>[]>(endpoint);
      if (!Array.isArray(response.data)) throw new Error(`Unexpected response from ${endpoint}`);
      setRows(response.data);
    } catch (requestError: unknown) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.message ?? requestError.message
          : requestError instanceof Error
            ? requestError.message
            : `Unable to load ${title.toLowerCase()}.`,
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint, title]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return rows;
    return rows.filter((row) =>
      columns.some((column) => {
        const value = row[column.key];
        return display(value).toLowerCase().includes(normalized);
      }),
    );
  }, [columns, rows, search]);

  const startCreate = () => {
    setEditing(Object.fromEntries(fields.map((field) => [field.key, ''])));
    setError(null);
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError(null);
    const body = Object.fromEntries(fields.map(({ key, type }) => {
      const value = editing[key];
      if (type === 'number') return [key, value === '' ? null : Number(value)];
      return [key, value === '' ? null : value];
    }));
    try {
      const id = editing.id;
      if (typeof id === 'number' || typeof id === 'string') {
        await api.patch(`${endpoint}/${id}`, body);
      } else {
        await api.post(endpoint, body);
      }
      setEditing(null);
      await load();
    } catch (requestError: unknown) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.message ?? requestError.message
          : 'Unable to save changes.',
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: Record<string, unknown>) => {
    if (typeof row.id !== 'number' && typeof row.id !== 'string') return;
    if (!window.confirm(`Delete this ${title.toLowerCase().replace(/s$/, '')}?`)) return;
    setError(null);
    try {
      await api.delete(`${endpoint}/${row.id}`);
      await load();
    } catch (requestError: unknown) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.message ?? requestError.message
          : 'Unable to delete this record.',
      );
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        {canCreate && (
          <button type="button" className="btn btn-primary" onClick={startCreate}>
            Add {title.replace(/s$/, '')}
          </button>
        )}
      </div>
      <div className="card space-y-4">
        <SearchInput value={search} onChange={setSearch} placeholder={`Search ${title.toLowerCase()}…`} />
        {error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {loading ? (
          <p role="status" className="py-5 text-gray-500">Loading {title.toLowerCase()}…</p>
        ) : filtered.length === 0 ? (
          <p className="py-5 text-gray-500">No {title.toLowerCase()} found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  {columns.map((column) => <th key={column.key} className="p-3 font-medium">{column.label}</th>)}
                  {(canEdit || canDelete) && <th className="p-3 font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, index) => (
                  <tr key={String(row.id ?? index)} className="border-b last:border-0">
                    {columns.map((column) => (
                      <td key={column.key} className="p-3">
                        {column.format ? column.format(row[column.key], row) : display(row[column.key])}
                      </td>
                    ))}
                    {(canEdit || canDelete) && (
                      <td className="p-3">
                        <div className="flex gap-3">
                          {canEdit && <button className="text-blue-700 hover:underline" onClick={() => setEditing({ ...row })} type="button">Edit</button>}
                          {canDelete && <button className="text-red-700 hover:underline" onClick={() => void remove(row)} type="button">Delete</button>}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && error && <button className="btn btn-secondary" type="button" onClick={() => void load()}>Retry</button>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget && !saving) setEditing(null);
        }}>
          <form onSubmit={(event) => void save(event)} className="max-h-[90vh] w-full max-w-xl space-y-4 overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing.id ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}</h2>
              <button type="button" className="text-gray-500" onClick={() => setEditing(null)} aria-label="Close form">×</button>
            </div>
            {fields.map((field) => (
              <label key={field.key} className="label">
                {field.label}
                {field.type === 'textarea' ? (
                  <textarea className="input mt-1 min-h-24" required={field.required} value={String(editing[field.key] ?? '')} onChange={(event) => setEditing({ ...editing, [field.key]: event.target.value })} />
                ) : field.type === 'select' ? (
                  <select className="input mt-1" required={field.required} value={String(editing[field.key] ?? '')} onChange={(event) => setEditing({ ...editing, [field.key]: event.target.value })}>
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {(field.options ?? []).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                ) : (
                  <input className="input mt-1" type={field.type ?? 'text'} required={field.required} value={String(editing[field.key] ?? '').slice(0, field.type === 'datetime-local' ? 16 : undefined)} onChange={(event) => setEditing({ ...editing, [field.key]: event.target.value })} />
                )}
              </label>
            ))}
            <div className="flex justify-end gap-3">
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
