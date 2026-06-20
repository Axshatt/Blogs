'use client';

export function NewsletterSection() {
  return (
    <section className="bg-[#1c1c1a] border border-outline-variant/30 p-lg md:p-xl my-xxl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-lg max-w-5xl mx-auto py-md">
        {/* Left Side: Call to Action */}
        <div className="flex flex-col font-inter">
          <h3 className="text-[28px] md:text-[38px] font-bold tracking-tight text-secondary-container leading-tight">
            Sign up for our newsletter.
          </h3>
          <p className="text-[28px] md:text-[38px] font-bold tracking-tight text-white leading-tight mt-xs md:mt-0">
            Sent every Saturday morning.
          </p>
        </div>

        {/* Right Side: Email Form */}
        <div className="flex flex-col w-full md:w-[360px] lg:w-[420px] shrink-0 gap-sm font-inter">
          <span className="text-[14px] text-white/70 pl-xs">Enter your email</span>
          <form
            className="flex items-center w-full bg-white rounded-full p-[4px] pl-md border border-white"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="email@company.com"
              className="w-full bg-transparent border-none outline-none text-primary placeholder:text-outline-variant/80 text-[16px] md:text-[18px] focus:ring-0 py-xs"
            />
            <button
              type="submit"
              className="w-[44px] h-[44px] rounded-full bg-secondary-container flex items-center justify-center shrink-0 hover:bg-secondary-fixed transition-colors duration-200"
              aria-label="Subscribe"
            >
              <span className="material-symbols-outlined text-primary font-bold !text-[24px]">
                chevron_right
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
