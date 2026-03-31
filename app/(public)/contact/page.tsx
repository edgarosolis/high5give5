import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div>
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Decorative */}
        <div className="bg-secondary px-8 py-16 lg:py-24 lg:px-16 flex flex-col justify-center">
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-6">
            Get In Touch
          </h1>
          <p className="text-white/80 text-lg mb-10 max-w-md">
            We would love to hear from you. Whether you want to learn more about
            our work, partner with us, or simply say hello -- reach out!
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-white/70">info@high5give5.org</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Location</p>
                <p className="text-white/70">Serving 22+ countries worldwide</p>
              </div>
            </div>
          </div>

          {/* Social Links Placeholders */}
          <div className="mt-12">
            <p className="text-white/60 text-sm mb-4">Follow Us</p>
            <div className="flex gap-3">
              {["Facebook", "Instagram", "YouTube", "Twitter"].map((name) => (
                <div
                  key={name}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                  title={name}
                >
                  <span className="text-white text-xs font-medium">
                    {name[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="px-8 py-16 lg:py-24 lg:px-16 flex flex-col justify-center bg-white">
          <h2 className="font-serif text-3xl font-bold text-secondary mb-2">
            Send Us a Message
          </h2>
          <p className="text-muted mb-8">
            Fill out the form below and we will get back to you as soon as
            possible.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
