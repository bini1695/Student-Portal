'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CreditCard, Receipt } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

interface InvoiceRecord {
  id: number;
  invoiceNumber: string;
  totalDue: number;
  amountPaid: number;
  status: string;
  dueDate?: string | null;
}

interface PaymentRecord {
  id: number;
  invoiceId: number;
  amount: number;
  method: string;
  paymentDate: string;
  verificationStatus: string;
  referenceNo?: string | null;
}

export default function StudentFeesPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [methods, setMethods] = useState<Record<number, string>>({});
  const [references, setReferences] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [invoiceResponse, paymentResponse] = await Promise.all([
        api.get<InvoiceRecord[]>('/invoices'),
        api.get<PaymentRecord[]>('/payments'),
      ]);
      setInvoices(invoiceResponse.data);
      setPayments(paymentResponse.data);
    } catch {
      toast.error('Could not load your financial records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submitPayment = async (invoice: InvoiceRecord) => {
    const balance = Number(invoice.totalDue) - Number(invoice.amountPaid);
    setPaying(invoice.id);
    try {
      await api.post('/payments', {
        invoiceId: invoice.id,
        amount: balance,
        method: methods[invoice.id] || 'bank_transfer',
        referenceNo: references[invoice.id] || undefined,
      });
      toast.success('Payment submitted for finance verification.');
      await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not submit payment.');
    } finally {
      setPaying(null);
    }
  };

  const outstanding = invoices.reduce(
    (total, invoice) => total + Math.max(0, Number(invoice.totalDue) - Number(invoice.amountPaid)),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fees & Payments</h1>
        <p className="mt-1 text-gray-500">Outstanding balance: ${outstanding.toFixed(2)}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : (
        <>
          <section className="card">
            <h2 className="mb-4 flex items-center gap-2 font-semibold"><Receipt size={18} /> My invoices</h2>
            {invoices.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">No invoices found.</p>
            ) : (
              <div className="space-y-4">
                {invoices.map((invoice) => {
                  const balance = Math.max(0, Number(invoice.totalDue) - Number(invoice.amountPaid));
                  const canPay = balance > 0 && invoice.status !== 'cancelled';
                  const pendingPayment = payments.some((payment) =>
                    payment.invoiceId === invoice.id && payment.verificationStatus === 'pending',
                  );
                  return (
                    <div key={invoice.id} className="rounded-lg border p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            Due {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '—'} · {invoice.status}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <p>Total: ${Number(invoice.totalDue).toFixed(2)}</p>
                          <p className="text-gray-500">Paid: ${Number(invoice.amountPaid).toFixed(2)}</p>
                          <p className="font-semibold">Balance: ${balance.toFixed(2)}</p>
                        </div>
                      </div>
                      {canPay && (
                        <div className="mt-4 flex flex-wrap items-end gap-3 border-t pt-4">
                          <label className="min-w-44 flex-1">
                            <span className="label">Payment method</span>
                            <select
                              className="input"
                              value={methods[invoice.id] ?? 'bank_transfer'}
                              onChange={(event) => setMethods((current) => ({ ...current, [invoice.id]: event.target.value }))}
                            >
                              <option value="bank_transfer">Bank transfer</option>
                              <option value="mobile_money">Mobile money</option>
                              <option value="online">Online payment</option>
                              <option value="card">Card</option>
                            </select>
                          </label>
                          <label className="min-w-44 flex-1">
                            <span className="label">Reference number</span>
                            <input
                              className="input"
                              value={references[invoice.id] ?? ''}
                              onChange={(event) => setReferences((current) => ({ ...current, [invoice.id]: event.target.value }))}
                              placeholder="Optional transfer reference"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => void submitPayment(invoice)}
                            disabled={paying === invoice.id || pendingPayment}
                            className="btn btn-primary flex items-center gap-2"
                          >
                            <CreditCard size={16} />
                            {paying === invoice.id ? 'Submitting…' : pendingPayment ? 'Verification pending' : 'Submit payment'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="card">
            <h2 className="mb-4 font-semibold">Payment history</h2>
            {payments.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">No payments recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b text-xs uppercase text-gray-500">
                    <tr>
                      <th className="py-3">Date</th><th className="py-3">Invoice</th>
                      <th className="py-3">Method</th><th className="py-3">Amount</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id} className="border-b last:border-0">
                        <td className="py-3">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                        <td className="py-3">#{payment.invoiceId}</td>
                        <td className="py-3 capitalize">{payment.method.replaceAll('_', ' ')}</td>
                        <td className="py-3">${Number(payment.amount).toFixed(2)}</td>
                        <td className="py-3 capitalize">{payment.verificationStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
