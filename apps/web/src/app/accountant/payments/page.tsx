'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Check, Clock, X } from 'lucide-react';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';

interface PaymentRecord {
  id: number;
  invoiceId: number;
  studentId: number;
  amount: number;
  method: string;
  referenceNo?: string | null;
  paymentDate: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

interface StudentRecord {
  id: number;
  studentCode: string;
  user?: { fullName?: string };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [paymentResponse, studentResponse] = await Promise.all([
        api.get<PaymentRecord[]>('/payments'),
        api.get<StudentRecord[]>('/students'),
      ]);
      setPayments(paymentResponse.data);
      setStudents(studentResponse.data);
    } catch {
      toast.error('Could not load payment records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateVerification = async (paymentId: number, status: 'verified' | 'rejected') => {
    setProcessing(paymentId);
    try {
      await api.patch(`/payments/${paymentId}/verification`, { status });
      toast.success(status === 'verified' ? 'Payment verified and invoice balance updated.' : 'Payment rejected.');
      await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Could not update payment verification.');
    } finally {
      setProcessing(null);
    }
  };

  const getStudent = (id: number) => students.find((student) => student.id === id);
  const pendingCount = payments.filter(({ verificationStatus }) => verificationStatus === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="mt-1 text-sm text-gray-500">{pendingCount} pending verification</p>
        </div>
        <Link href="/accountant/payments/new" className="btn btn-primary">Record payment</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={40} /></div>
      ) : payments.length === 0 ? (
        <div className="card py-12 text-center text-gray-500">No payment records yet.</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="border-b text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-3 py-3">Student</th>
                <th className="px-3 py-3">Invoice</th>
                <th className="px-3 py-3">Amount</th>
                <th className="px-3 py-3">Method / reference</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Verification</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                const student = getStudent(payment.studentId);
                const pending = payment.verificationStatus === 'pending';
                return (
                  <tr key={payment.id} className="border-b last:border-0">
                    <td className="px-3 py-3">
                      <p className="font-medium">{student?.user?.fullName ?? `Student #${payment.studentId}`}</p>
                      <p className="text-xs text-gray-500">{student?.studentCode ?? ''}</p>
                    </td>
                    <td className="px-3 py-3">#{payment.invoiceId}</td>
                    <td className="px-3 py-3">${Number(payment.amount).toFixed(2)}</td>
                    <td className="px-3 py-3 capitalize">
                      {payment.method.replaceAll('_', ' ')}
                      {payment.referenceNo && <p className="text-xs text-gray-500">{payment.referenceNo}</p>}
                    </td>
                    <td className="px-3 py-3">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        pending ? 'bg-amber-50 text-amber-700' :
                          payment.verificationStatus === 'verified' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {payment.verificationStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {pending && (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => void updateVerification(payment.id, 'verified')}
                            disabled={processing === payment.id}
                            className="btn btn-primary flex items-center gap-1 px-3 py-1.5"
                          >
                            <Check size={14} /> Verify
                          </button>
                          <button
                            type="button"
                            onClick={() => void updateVerification(payment.id, 'rejected')}
                            disabled={processing === payment.id}
                            className="btn btn-secondary flex items-center gap-1 px-3 py-1.5 text-red-600"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      )}
                      {!pending && (
                        <span className="flex justify-end text-gray-400">
                          <Clock size={16} />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
