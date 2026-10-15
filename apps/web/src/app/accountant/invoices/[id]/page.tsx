import { RecordDetail } from '@/components/dashboard/RecordDetail';

export default function InvoiceDetailsPage() {
  return <RecordDetail endpoint="/invoices" title="Invoice details" backHref="/accountant/invoices" />;
}