import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "I joined RCPH not knowing what to expect, and within two months I had volunteered at three projects, spoken at a GBM, and made friends I genuinely hang out with outside of club work. This club doesn't just do service — it builds people. The motto 'Create. Connect. Contribute.' is not just a tagline here.",
      name: "Riya",
      role: "Rotaract Baner",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    },
    {
      id: 2,
      text: "PrebuiltUI has completely changed how I build interfaces. Most recommended components and templates.",
      name: "Sarah Collins",
      role: "Tech Lead - You Inc.",
      image:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
    },
    {
      id: 3,
      text: "PrebuiltUI templates are the most useful product for UI engineers. Saving me hours on every saas project.",
      name: "Emily Carter",
      role: "UI Engineer - Meta",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
    },
    {
      id: 4,
      text: "PrebuiltUI allows me to focus on building features instead of writing CSS. Everything looks premium right out of the box.",
      name: "Ryan Collins",
      role: "Co-founder - Unique",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    },
  ];

  return (
    <section className="bg-white py-24 px-4 md:px-16 lg:px-24 xl:px-32 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="mb-14 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-slate-900 text-center mb-4 uppercase tracking-tight">
            What our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-400">
              MEMBERS
            </span>{" "}
            Said
          </h1>
          <p className="text-slate-600 text-sm/6 text-center max-w-2xl">
            Hear directly from our passionate members about their experiences,
            growth, and the lasting impact they've created through our club.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`border border-slate-200 bg-slate-50/50 shadow-sm rounded-3xl p-8 hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col
                            ${
                              index === 0
                                ? "md:col-span-2"
                                : index === 1
                                  ? "md:col-span-1"
                                  : index === 2
                                    ? "md:col-span-1"
                                    : "md:col-span-2"
                            }`}
            >
              <div className="flex mb-6">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-star text-transparent fill-blue-500 mr-1"
                      aria-hidden="true"
                    >
                      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                    </svg>
                  ))}
              </div>

              <p
                className={`text-slate-600 text-sm leading-relaxed ${index === 0 || index === 3 ? "max-w-xl mb-14" : "mb-8"}`}
              >
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-slate-900 text-sm font-medium">
                    {testimonial.name}
                  </h3>
                  <p className="text-blue-600 text-xs font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
