import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  whatsappLink?: string;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  whatsappLink,
}: ConfirmationModalProps) => {
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
          We've got your details.
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Send them to our team on WhatsApp and we'll confirm your spot right away.
        </p>

        <div className="flex flex-col gap-3">
          {whatsappLink && (
            <Button asChild size="lg" className="w-full">
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                <MessageCircle className="w-4 h-4" />
                Send on WhatsApp
              </a>
            </Button>
          )}

          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            className="w-full text-gray-600"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
