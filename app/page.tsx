"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight, Copy, Check, Mail, ArrowRight, ArrowDown,
} from "lucide-react";

function useCounter(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return { count, ref };
}

const ease = [0.22, 1, 0.36, 1] as const;

const roles = ["Creative Director", "Brand Strategist", "UI/UX Designer", "Digital Strategist"];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const [copied, setCopied] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const copyEmail = async () => {
    await navigator.clipboard.writeText("raffaele.stuudio@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main ref={containerRef} className="grain overflow-hidden">

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section id="home" className="min-h-[100dvh] relative px-6 flex items-center">
        <motion.div
          className="max-w-7xl mx-auto w-full py-24 lg:py-32"
          style={{ y: heroParallax }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease }}
            className="inline-flex items-center gap-3 mb-10"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
            </span>
            <span className="text-xs font-medium tracking-widest uppercase text-[var(--fg-muted)]">
              Disponibile per nuovi progetti
            </span>
          </motion.div>

          <div className="max-w-5xl">
            <motion.h1
              className="font-display text-huge mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9, ease }}
            >
              Raffaele Vitale
            </motion.h1>

            <div className="h-[1.3em] overflow-hidden mb-8 text-2xl md:text-3xl lg:text-4xl">
              <AnimatePresence mode="wait">
                <motion.p
                  key={roleIndex}
                  className="text-[1em] font-medium tracking-tight text-[var(--accent)] leading-[1.3]"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                >
                  {roles[roleIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease }}
              className="text-lg lg:text-xl text-[var(--fg-muted)] max-w-xl leading-relaxed"
            >
              Progetto identità visive, strategie digitali e sistemi di brand
              curando ogni dettaglio — dal concept alla direzione creativa.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <motion.a
                href="#work"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group px-8 py-4 rounded-full font-semibold text-white bg-[var(--fg)] flex items-center gap-3 transition-colors hover:bg-[var(--accent)]"
              >
                Guarda i progetti
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.a>
              <motion.a
                href="/Profile.pdf"
                download
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-full font-semibold border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                Scarica CV
              </motion.a>
            </motion.div>
          </div>

        </motion.div>

        {/* Profile card -- outside parallax wrapper so it stays fixed in viewport */}
        <motion.div
          className="absolute top-[calc(72px+10rem)] right-6 lg:right-12 hidden lg:block"
          initial={{ opacity: 0, y: 30, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 3 }}
          transition={{ delay: 0.6, duration: 0.9, ease }}
        >
          <motion.div
            whileHover={{ rotate: 0, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="bg-[var(--bg-dark)] text-white p-8 rounded-2xl max-w-xs shadow-2xl shadow-black/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60" />
            <div className="relative">
              <motion.div
                className="relative w-16 h-16 mb-5 rounded-xl overflow-hidden ring-1 ring-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <Image src="/IMG_1870.PNG" alt="Raffaele Vitale" fill className="object-cover" sizes="64px" />
              </motion.div>
              <div className="text-base font-semibold mb-1">Raffaele Vitale</div>
              <span className="inline-flex items-center gap-2 text-[11px] text-[#10B981] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Disponibile 2026
              </span>
              <p className="text-white/50 leading-relaxed text-sm mt-4">
                Creative Director & Brand Strategist con passione per sistemi visivi e identità di marca.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[var(--fg-faint)] hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ MARQUEE ═══════════════════ */}
      <section className="py-5 border-y border-[var(--border)] overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-track">
            {[0, 1].map((setIndex) => (
              <div key={setIndex} className="marquee-content" aria-hidden={setIndex > 0 ? "true" : undefined}>
                {["Brand Identity", "UI/UX Design", "Digital Strategy", "Creative Direction", "Product Design", "Business Strategy", "Design Systems", "CRM Design"].map((item, i) => (
                  <span key={`${setIndex}-${i}`} className="flex items-center gap-5 text-sm font-medium uppercase tracking-[0.2em] text-[var(--fg-faint)] whitespace-nowrap">
                    {item}
                    <span className="w-1 h-1 rounded-full bg-[var(--accent)] opacity-40" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section className="px-6 py-28 lg:py-40 relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Servizi"
            title="Cosa faccio"
            serif
          />

          <div className="mt-16 lg:mt-24">
            {[
              {
                title: "Brand Identity",
                num: "01",
                desc: "Identità coerenti e sistemi scalabili per prodotti digitali. Dal logo al design system completo.",
                tools: ["Figma", "Illustrator", "Brand Guidelines"],
              },
              {
                title: "UI/UX Design",
                num: "02",
                desc: "Wireframe, prototipi interattivi e design system accessibili. Ogni interfaccia è testata e iterata.",
                tools: ["Figma", "Prototyping", "User Research"],
              },
              {
                title: "Digital Strategy",
                num: "03",
                desc: "Sistemi operativi, infrastrutture digitali e strategie di crescita. Dal CRM al go-to-market.",
                tools: ["Notion", "CRM Design", "Business Strategy"],
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease }}
              >
                <div className="divider" />
                <motion.div
                  className="group grid grid-cols-12 gap-4 lg:gap-8 py-8 lg:py-14 items-start lg:items-center cursor-pointer"
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="col-span-2 lg:col-span-1">
                    <span className="text-sm font-mono text-[var(--fg-faint)] group-hover:text-[var(--accent)] transition-colors">
                      {service.num}
                    </span>
                  </div>

                  <div className="col-span-10 lg:col-span-4">
                    <h3 className="font-display text-3xl lg:text-5xl group-hover:text-[var(--accent)] transition-colors duration-300">
                      {service.title}
                    </h3>
                  </div>

                  <div className="col-span-12 lg:col-span-5 lg:pl-4">
                    <p className="text-[var(--fg-muted)] leading-relaxed text-sm lg:text-base">
                      {service.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {service.tools.map((tool) => (
                        <span key={tool} className="text-[11px] font-medium tracking-wider uppercase px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--fg-muted)]">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="hidden lg:flex col-span-2 justify-end">
                    <div className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-all duration-300">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </motion.div>
                {i === 2 && <div className="divider" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WORK ═══════════════════ */}
      <section id="work" className="px-6 py-28 lg:py-40 bg-[var(--bg-dark)] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <SectionHeader
            label="Portfolio"
            title="Selected Work"
            serif
            dark
          />

          <div className="mt-16 lg:mt-20 space-y-6">
            {[
              {
                name: "CRYBU S.R.L.",
                type: "Creative Direction — Brand & Strategy",
                num: "01",
                desc: "Progettata e lanciata da zero l'identità visiva e l'infrastruttura operativa di una società di business education. Coordinato team distribuito, costruito il Brand Book, configurato CRM e pipeline vendite per un ecosistema di 6 sistemi integrati.",
                url: "https://crybu.org",
                tags: ["Brand Identity", "Business Strategy", "EdTech", "B2B SaaS", "Notion", "CRM Design"],
                year: "2026",
              },
              {
                name: "ORARIO VALLAURI",
                type: "Web App — PWA",
                num: "02",
                desc: "App per la gestione dell'orario scolastico personalizzato. Progressive Web App con supporto offline e ricerca intelligente.",
                url: "https://orario.landing.raffaelevitale.it/",
                tags: ["Next.js", "TypeScript", "PWA", "Zustand"],
                year: "2025",
              },
            ].map((project, i) => (
              <motion.a
                key={i}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease }}
              >
                <div className="relative p-8 lg:p-12 rounded-2xl border border-white/8 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
                    <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-2 flex-shrink-0">
                      <span className="font-display text-6xl lg:text-7xl text-white/8 group-hover:text-white/12 transition-colors duration-500">
                        {project.num}
                      </span>
                      <span className="text-xs font-mono text-white/25">{project.year}</span>
                    </div>

                    <div className="flex-1">
                      <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-[var(--accent)]">
                        {project.type}
                      </span>
                      <h3 className="text-3xl lg:text-5xl font-semibold mt-2 tracking-tight group-hover:translate-x-3 transition-transform duration-300">
                        {project.name}
                      </h3>
                      <p className="text-white/40 mt-3 text-sm lg:text-base max-w-xl leading-relaxed">
                        {project.desc}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-5">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-medium tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/8 text-white/35">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 self-center flex-shrink-0 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.div
            className="mt-16 flex items-center justify-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="h-px bg-white/8 flex-1" />
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              className="text-white/30 hover:text-[var(--accent)] transition-colors font-medium text-sm tracking-widest uppercase flex items-center gap-3"
            >
              Richiedi il portfolio completo
              <ArrowRight className="w-4 h-4" />
            </motion.a>
            <div className="h-px bg-white/8 flex-1" />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <section id="about" className="px-6 py-28 lg:py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              <SectionHeader
                label="Chi sono"
                title="About"
                serif
              />

              <p className="text-lg text-[var(--fg-muted)] leading-relaxed mt-8 mb-12">
                Non mi limito a disegnare interfacce. Creo ponti tra{" "}
                <span className="font-semibold text-[var(--fg)]">visione</span>,{" "}
                <span className="font-semibold text-[var(--fg)]">strategia</span> e{" "}
                <span className="font-semibold text-[var(--fg)]">identità di marca</span>.
                <br /><br />
                Il mio approccio unisce direzione creativa e pensiero strategico,
                costruendo brand e sistemi che non solo funzionano, ma lasciano il segno.
              </p>

              <AnimatedStats />
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.8, ease }}
            >
              <div className="space-y-4">
                <div className="p-7 lg:p-9 rounded-2xl bg-[var(--bg-dark)] text-white overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
                  <h3 className="font-semibold text-base mb-6 text-white/70 tracking-wider uppercase text-[11px]">
                    Strumenti & Competenze
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Figma", "Notion", "Brand Design", "UI/UX Design", "Google Workspace", "CRM Design", "Product Strategy", "Framer Motion"].map((tech, i) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04, duration: 0.4, ease }}
                        whileHover={{ backgroundColor: "rgba(196, 93, 62, 0.2)", borderColor: "rgba(196, 93, 62, 0.4)" }}
                        className="px-4 py-2.5 rounded-lg bg-white/6 border border-white/8 text-sm font-medium cursor-default transition-all duration-200"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] flex flex-col justify-between min-h-[160px] hover:border-[var(--accent)] transition-colors duration-300">
                    <span className="text-xs font-medium tracking-wider uppercase text-[var(--fg-muted)]">Approccio</span>
                    <div>
                      <div className="font-display text-3xl lg:text-4xl">Fast</div>
                      <div className="text-xs text-[var(--fg-muted)] mt-1">Performance first, always.</div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[var(--accent)] text-white flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                    <span className="relative text-xs font-medium tracking-wider uppercase text-white/70">Design</span>
                    <div className="relative">
                      <div className="font-display text-3xl lg:text-4xl">Mobile</div>
                      <div className="text-xs text-white/70 mt-1">Responsive & Touch ready.</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PROCESS ═══════════════════ */}
      <section className="px-6 py-28 lg:py-40 bg-[var(--bg-alt)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            label="Processo"
            title="Come lavoro"
            serif
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px mt-16 lg:mt-24 bg-[var(--border)] rounded-2xl overflow-hidden">
            {[
              { step: "01", title: "Scoperta", desc: "Ascolto le esigenze, analizzo il contesto e definisco obiettivi chiari." },
              { step: "02", title: "Strategia", desc: "Definisco il posizionamento, l'architettura di brand e la roadmap operativa." },
              { step: "03", title: "Design", desc: "Identità visiva, sistemi di design e prototipi iterati fino alla perfezione." },
              { step: "04", title: "Lancio", desc: "Go-to-market, coordinamento team e supporto continuo per un risultato impeccabile." },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group p-7 lg:p-9 bg-[var(--bg-alt)] hover:bg-[var(--bg)] transition-colors duration-500 relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease }}
              >
                <span className="font-mono text-xs text-[var(--fg-faint)] group-hover:text-[var(--accent)] transition-colors">{item.step}</span>
                <h3 className="font-display text-2xl lg:text-3xl mt-4 mb-3">{item.title}</h3>
                <p className="text-[var(--fg-muted)] text-sm leading-relaxed">{item.desc}</p>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACT ═══════════════════ */}
      <section id="contact" className="px-6 py-28 lg:py-40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-start">
            <motion.div
              className="col-span-12 lg:col-span-7"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease }}
            >
              <SectionHeader
                label="Contatto"
                title="Collaboriamo"
                serif
              />
              <p className="font-display text-display mt-6 text-[var(--fg)]">
                Let&apos;s build<br />something together.
              </p>
              <p className="text-lg text-[var(--fg-muted)] mt-6 max-w-md leading-relaxed">
                Hai un progetto in mente? Parliamone. Sono sempre aperto a nuove collaborazioni creative.
              </p>
            </motion.div>

            <motion.div
              className="col-span-12 lg:col-span-5"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.8, ease }}
            >
              <div className="bg-[var(--bg-dark)] text-white p-8 lg:p-10 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />

                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-white/10"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image src="/IMG_1870.PNG" alt="Raffaele Vitale" fill className="object-cover" sizes="56px" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-base">Raffaele Vitale</p>
                    <span className="inline-flex items-center gap-2 text-xs text-[#10B981]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      Disponibile
                    </span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 mb-6 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 font-medium mb-1">Email</div>
                    <div className="text-sm font-medium text-white/80">raffaele.stuudio@gmail.com</div>
                  </div>
                  <motion.button
                    onClick={(e) => { e.preventDefault(); copyEmail(); }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                    aria-label="Copia email"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4 text-white/40" />}
                  </motion.button>
                </div>

                <motion.a
                  href="mailto:raffaele.stuudio@gmail.com"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 w-full py-4 font-semibold text-base rounded-xl text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  Invia una mail
                </motion.a>

                <div className="flex gap-6 mt-6 text-sm">
                  <a href="https://www.instagram.com/josh63.exe/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[var(--accent)] transition-colors font-medium">
                    Instagram
                  </a>
                  <a href="https://www.linkedin.com/in/vitaleraffaele/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[var(--accent)] transition-colors font-medium">
                    LinkedIn
                  </a>
                  <a href="https://github.com/raffaelevitale" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[var(--accent)] transition-colors font-medium">
                    GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="py-12 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <span className="font-display text-xl">Raffaele Vitale</span>
              <p className="text-[var(--fg-muted)] text-sm mt-1">Creative Director & Brand Strategist</p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <a href="#home" className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">Home</a>
              <a href="#work" className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">Work</a>
              <a href="#about" className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">About</a>
              <a href="#contact" className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">Contact</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[var(--fg-faint)] text-xs">
              &#169; 2026 Raffaele Vitale
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[var(--fg-faint)] hover:text-[var(--fg)] text-xs transition-colors font-medium flex items-center gap-2"
            >
              Torna su &#8593;
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionHeader({ label, title, serif, dark }: { label: string; title: string; serif?: boolean; dark?: boolean }) {
  return (
    <div>
      <motion.span
        className={`text-[11px] uppercase tracking-[0.3em] font-medium block mb-4 text-[var(--accent)]`}
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        {label}
      </motion.span>
      <motion.h2
        className={`${serif ? "font-display" : "font-semibold"} text-display ${dark ? "text-white" : ""}`}
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.08, duration: 0.7, ease }}
      >
        {title}
      </motion.h2>
    </div>
  );
}

function AnimatedStats() {
  const stats = [
    { label: "Anni di esperienza", value: 3, suffix: "+" },
    { label: "Progetti completati", value: 20, suffix: "+" },
    { label: "Clienti soddisfatti", value: 10, suffix: "+" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <StatCard key={i} stat={stat} index={i} />
      ))}
    </div>
  );
}

function StatCard({ stat, index }: { stat: { label: string; value: number; suffix: string }; index: number }) {
  const { count, ref } = useCounter(stat.value, 1500 + index * 300);
  return (
    <div
      ref={ref}
      className="p-4 lg:p-5 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors duration-300"
    >
      <div className="font-display text-3xl lg:text-4xl">{count}{stat.suffix}</div>
      <div className="text-[11px] text-[var(--fg-muted)] font-medium mt-2 leading-tight">{stat.label}</div>
    </div>
  );
}
