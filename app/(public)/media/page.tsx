export default function MediaPage() {
  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-secondary h-48 flex items-center justify-center">
        <h1 className="font-serif text-5xl text-white">Media</h1>
      </section>

      {/* Media Grid */}
      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="bg-light rounded-xl shadow h-64 flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-muted"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-muted font-medium">Coming Soon</p>
                  <p className="text-muted/60 text-sm mt-1">Media Item {i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
