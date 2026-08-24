import { Button } from "./ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfirmationModal = ({ isOpen, onClose }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-lg animate-fade-in"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl animate-slide-up">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-emerald-500 text-white text-5xl flex items-center justify-center mx-auto mb-6 animate-scale-in">
          ✓
        </div>

        <h2 className="text-3xl sm:text-4xl font-semibold mb-3 tracking-tight">
          You're on the list.
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Check WhatsApp for your confirmation message and next steps.
        </p>

        <Button
          size="lg"
          onClick={onClose}
          className="w-full sm:w-auto hover:-translate-y-1 hover:shadow-2xl"
        >
          Done
        </Button>
      </div>
    </div>
  );
};
