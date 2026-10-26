import { CheckCircle2, X, AlertCircle } from 'lucide-react';
import { useCart } from '../context/useCart';
import { useStore } from '../context/useStore';

export default function Toast() {
  const { toastMessage, setToastMessage } = useCart();
  const { notification, setNotification } = useStore();

  const activeNotif = notification || (toastMessage ? { text: toastMessage, isError: false } : null);

  if (!activeNotif) return null;

  const handleClose = () => {
    if (notification) {
      if (setNotification) setNotification(null);
    } else {
      setToastMessage(null);
    }
  };

  return (
    <div
      className={`toast-notification ${activeNotif.isError ? 'toast-error' : 'toast-success'}`}
      role="status"
      aria-live="polite"
    >
      {activeNotif.isError ? (
        <AlertCircle size={18} className="toast-icon" />
      ) : (
        <CheckCircle2 size={18} className="toast-icon" />
      )}
      <span className="toast-text">{activeNotif.text}</span>
      <button
        onClick={handleClose}
        className="toast-close"
        aria-label="Fermer la notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}
