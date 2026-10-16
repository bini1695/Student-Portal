'use client';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center">
        <div className="p-3 rounded-full bg-red-100 text-red-600 mb-4">
          <AlertTriangle size={32} />
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="btn btn-secondary flex-1"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger flex-1"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
}