import { X } from 'lucide-react';
import { useState } from 'react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onConfirm();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong',
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <div className="bg-surface border border-border w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2>{title}</h2>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-6">
          <p className="text-sm text-muted leading-relaxed">{message}</p>

          {submitError && (
            <p className="text-[13px] text-[#FFB4AB] bg-[#FFB4AB]/10 border border-[#FFB4AB]/30 rounded px-3 py-2">
              {submitError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-foreground bg-transparent hover:bg-surface-elevated border border-transparent rounded transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-[#FFB4AB] bg-[#FFB4AB]/10 hover:bg-[#FFB4AB]/20 border border-[#FFB4AB]/30 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Deleting...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
