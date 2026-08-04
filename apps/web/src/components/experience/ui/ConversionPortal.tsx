"use client";

/**
 * SECTION 5 — CONVERSION PORTAL
 *
 * The only section where the DOM outranks the canvas. Every conversion
 * decision here is deliberate:
 *   • one primary action, stated as an outcome ("Deploy Arcant Server"), not
 *     as a mechanism ("Submit");
 *   • the form is a real `<form>` with real labels and a real `required`
 *     constraint, so browser autofill and password managers work;
 *   • the success state replaces the form in place rather than routing away —
 *     nothing about a 3D landing page should cost the user their scroll
 *     position;
 *   • the newsletter input is separate from the access request, because
 *     bundling them is how you lose both.
 */

import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "../lib/scroll";
import { ShaderButton } from "./ShaderButton";
import { MagneticButton } from "./MagneticButton";

const NAV_GROUPS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Architecture", href: "#hero" },
      { label: "Deconstruction", href: "#deconstruction" },
      { label: "Metamorphosis", href: "#metamorphosis" },
      { label: "Artifact", href: "#artifact" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Pricing", href: "/pricing" },
      { label: "Patch notes", href: "/patchnotes" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const SOCIALS: { label: string; href: string }[] = [
  { label: "Discord", href: "https://discord.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "X", href: "https://x.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

export function ConversionPortal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-portal-reveal]",
        { opacity: 0, y: 42, filter: "blur(20px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: rootRef.current, start: "top 82%", end: "top 30%", scrub: 1 },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const onDeploy = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Wire to your access-request endpoint. Kept local so the framework has
    // no opinion about your backend.
    setSubmitted(true);
  };

  const onSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return (
    <div
      ref={rootRef}
      className="pointer-events-none relative flex min-h-full w-full flex-col justify-end px-6 pb-16 pt-32 sm:px-10 lg:px-16 lg:pr-40"
    >
      {/* Legibility scrim. The void behind this section is bright volumetric
          fog, and no amount of text-shadow rescues 14px labels sitting on it.
          A vertical gradient keeps the grid readable at the top of the frame
          while guaranteeing contrast where the form actually is. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#02060a] via-[#02060a]/70 to-transparent"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* ---- Primary conversion ---------------------------------- */}
        <div data-portal-reveal className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-teal-300/60">
            05 / Deploy
          </p>
          <h2 className="mt-5 text-balance text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Request access to
            <br />
            <span className="text-white/35">the Arcant lattice.</span>
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/50">
            Provisioning is manual while the core is in preview. Tell us what you
            are building and we will open a node.
          </p>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          {/* ---- Access form -------------------------------------- */}
          <div data-portal-reveal className="pointer-events-auto">
            {submitted ? (
              <div className="rounded-2xl border border-teal-300/40 bg-teal-400/[0.07] p-8 backdrop-blur-2xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal-200">
                  Request received
                </p>
                <p className="mt-4 text-lg text-white">
                  Your node is queued. Expect a provisioning key within 48 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-white/40 underline-offset-8 hover:text-teal-200 hover:underline"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form
                onSubmit={onDeploy}
                className="rounded-2xl border border-white/10 bg-black/45 p-8 backdrop-blur-2xl"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="portal-name" label="Name" autoComplete="name" required />
                  <Field
                    id="portal-email"
                    label="Work email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="portal-scope"
                    className="block font-mono text-[10px] uppercase tracking-[0.24em] text-white/35"
                  >
                    Deployment scope
                  </label>
                  <textarea
                    id="portal-scope"
                    name="scope"
                    rows={3}
                    className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 transition-colors duration-300 focus:border-teal-300/60 focus:outline-none"
                    placeholder="Community size, workloads, regions…"
                  />
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <ShaderButton type="submit">Deploy Arcant Server</ShaderButton>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                    No card required
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* ---- Newsletter + socials ----------------------------- */}
          <div className="pointer-events-auto space-y-10">
            <div data-portal-reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-teal-300/60">
                Signal
              </p>
              <p className="mt-4 text-sm text-white/50">
                Engineering notes on the render pipeline, roughly monthly.
              </p>

              {subscribed ? (
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-teal-200">
                  ✓ Subscribed
                </p>
              ) : (
                <form onSubmit={onSubscribe} className="group mt-5 flex items-center gap-3">
                  <label htmlFor="portal-news" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="portal-news"
                    name="newsletter"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@company.com"
                    className="w-full border-b border-white/15 bg-transparent px-1 py-3 text-sm text-white placeholder:text-white/20 transition-colors duration-300 focus:border-teal-300 focus:outline-none"
                  />
                  <MagneticButton
                    className="!px-6 !py-3 !text-xs"
                    strength={14}
                    onClick={() => setSubscribed(true)}
                  >
                    Join
                  </MagneticButton>
                </form>
              )}
            </div>

            <div data-portal-reveal className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {NAV_GROUPS.map((group) => (
                <nav key={group.title} aria-label={group.title}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/30">
                    {group.title}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-sm text-white/55 transition-colors duration-300 hover:text-teal-200"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>
        </div>

        {/* ---- Footer rule ----------------------------------------- */}
        <div
          data-portal-reveal
          className="pointer-events-auto mt-20 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/25">
            © {new Date().getFullYear()} Arcant · All systems nominal
          </p>
          <ul className="flex flex-wrap gap-6">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40 transition-colors duration-300 hover:text-teal-200"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block font-mono text-[10px] uppercase tracking-[0.24em] text-white/35"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 transition-colors duration-300 focus:border-teal-300/60 focus:outline-none"
      />
    </div>
  );
}
