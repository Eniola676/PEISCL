interface CTAProps {
  onRegisterClick: () => void;
}

export const CTA = ({ onRegisterClick }: CTAProps) => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight mb-6">
          Ready to transform your career?
        </h2>
        <p className="text-xl sm:text-2xl text-indigo-100 mb-12 max-w-2xl mx-auto">
          Join hundreds of professionals who've upgraded their skills and
          advanced their careers with PEISCL.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onRegisterClick}
            className="bg-white text-indigo-600 px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            Register Now
          </button>

          <a
            href="tel:08097545740"
            className="border-2 border-white text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition-all"
          >
            Call Us: 08097545740
          </a>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <div className="text-sm font-medium uppercase tracking-wider mb-2 text-indigo-200">
              Start Date
            </div>
            <div className="text-xl font-semibold">[TBD - Contact for details]</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <div className="text-sm font-medium uppercase tracking-wider mb-2 text-indigo-200">
              Investment
            </div>
            <div className="text-xl font-semibold">[Contact for pricing]</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            <div className="text-sm font-medium uppercase tracking-wider mb-2 text-emerald-200">
              Format
            </div>
            <div className="text-xl font-semibold">In-person & Online</div>
          </div>
        </div>
      </div>
    </section>
  );
};
