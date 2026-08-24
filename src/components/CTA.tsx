import { GradientBlurBg } from "./ui/gradient-blur-bg";
import { Button } from "./ui/button";

interface CTAProps {
  onRegisterClick: () => void;
}

export const CTA = ({ onRegisterClick }: CTAProps) => {
  return (
    <GradientBlurBg className="h-[80vh] flex items-center">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center w-full">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 mb-6">
          Ready to transform your career?
        </h2>
        <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Join hundreds of professionals who've upgraded their skills and
          advanced their careers with PEISCL.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            onClick={onRegisterClick}
            className="shadow-lg hover:-translate-y-1 hover:shadow-2xl"
          >
            Register Now
          </Button>

          <Button asChild variant="outline" size="lg">
            <a href="tel:08097545740">Call Us: 08097545740</a>
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-sm font-medium uppercase tracking-wider mb-2 text-purple-600">
              Start Date
            </div>
            <div className="text-xl font-semibold text-gray-900">[TBD - Contact for details]</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-sm font-medium uppercase tracking-wider mb-2 text-purple-600">
              Investment
            </div>
            <div className="text-xl font-semibold text-gray-900">[Contact for pricing]</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-sm font-medium uppercase tracking-wider mb-2 text-emerald-600">
              Format
            </div>
            <div className="text-xl font-semibold text-gray-900">In-person & Online</div>
          </div>
        </div>
      </div>
    </GradientBlurBg>
  );
};
