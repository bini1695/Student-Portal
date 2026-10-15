'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

function displayValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function RecordDetail({
  endpoint,
  title,
  backHref,
}: {
  endpoint: string;
  title: string;
  backHref: string;
}) {
  const params = useParams<{ id: string }>();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Record<string, unknown>>(`${endpoint}/${params.id}`);
      setRecord(response.data);
    } catch (requestError: unknown) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.message ?? requestError.message
          : `Unable to load ${title.toLowerCase()}.`,
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint, params.id, title]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link href={backHref} className="btn btn-secondary">Back to list</Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : error ? (
        <div role="alert" className="card border-red-200 bg-red-50 text-red-700">
          <p>{error}</p>
          <button type="button" onClick={() => void load()} className="btn btn-secondary mt-3">Try again</button>
        </div>
      ) : record ? (
        <dl className="card grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Object.entries(record)
            .filter(([key]) => !['passwordHash', 'password', 'rememberToken'].includes(key))
            .map(([key, value]) => (
              <div key={key} className="border-b border-gray-100 pb-3">
                <dt className="text-sm capitalize text-gray-500">{key.replace(/([A-Z])/g, ' $1')}</dt>
                <dd className="mt-1 break-words font-medium text-gray-800">{displayValue(value)}</dd>
              </div>
            ))}
        </dl>
      ) : null}
    </div>
  );
}
