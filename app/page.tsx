"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowUpRight, Copy, Check, Mail, ArrowRight,
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

const roles = ["Brand & Design Director", "Chief of Staff", "UI/UX Designer", "Fotografo & Videomaker"];

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
      <section id="home" className="min-h-[100dvh] relative px-6 flex items-center overflow-hidden">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow hero-glow--primary" aria-hidden="true" />
        <div className="hero-glow hero-glow--secondary" aria-hidden="true" />
        <motion.div
          className="max-w-7xl mx-auto w-full py-24 lg:py-32"
          style={{ y: heroParallax }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease }}
            className="inline-flex items-center gap-3 mb-10 px-4 py-2 rounded-full bg-[#10B981]/[0.06] border border-[#10B981]/15"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
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
                  initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
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
              Direzione creativa, identità visive e sistemi di brand per startup
              e prodotti digitali — dal concept al lancio, curando ogni dettaglio.
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
                className="group relative px-8 py-4 rounded-full font-semibold text-white bg-[var(--fg)] flex items-center gap-3 overflow-hidden transition-shadow hover:shadow-xl hover:shadow-black/10"
              >
                <span className="absolute inset-0 bg-[var(--accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10">Guarda i progetti</span>
                <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
              </motion.a>
              <motion.a
                href="/Profile.pdf"
                download
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group px-8 py-4 rounded-full font-semibold border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-[var(--accent)]/[0.04] translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <span className="relative z-10">Scarica CV</span>
              </motion.a>
            </motion.div>
          </div>

        </motion.div>

        {/* Profile card */}
        <motion.div
          className="absolute top-[calc(72px+10rem)] right-6 lg:right-12 hidden lg:block"
          initial={{ opacity: 0, y: 30, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 3 }}
          transition={{ delay: 0.6, duration: 0.9, ease }}
        >
          <motion.div
            whileHover={{ rotate: 0, scale: 1.03, y: -4 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="bg-[var(--bg-dark)]/90 backdrop-blur-xl text-white p-8 rounded-2xl max-w-xs shadow-2xl shadow-black/15 relative overflow-hidden border border-white/[0.06]"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--accent)]/10 rounded-full blur-3xl" aria-hidden="true" />
            <div className="relative">
              <motion.div
                className="relative w-16 h-16 mb-5 rounded-xl overflow-hidden ring-2 ring-white/10 ring-offset-2 ring-offset-[var(--bg-dark)]"
                whileHover={{ scale: 1.05 }}
              >
                <Image src="/IMG_1870.PNG" alt="Raffaele Vitale" fill className="object-cover" sizes="64px" />
              </motion.div>
              <div className="text-base font-semibold mb-1.5">Raffaele Vitale</div>
              <span className="inline-flex items-center gap-2 text-[11px] text-[#10B981] tracking-wider uppercase font-medium">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]" />
                </span>
                Disponibile 2026
              </span>
              <p className="text-white/45 leading-relaxed text-sm mt-4">
                Brand & Design Director e Chief of Staff di Crybu. Studente di Informatica, fotografo freelance.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--fg-faint)] font-medium">Scroll</span>
          <motion.div
            className="w-[1px] h-8 bg-gradient-to-b from-[var(--fg-faint)] to-transparent"
            animate={{ scaleY: [1, 0.5, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        </motion.div>
      </section>

      {/* ═══════════════════ MARQUEE ═══════════════════ */}
      <section className="py-5 border-y border-[var(--border)] overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-track">
            {[0, 1].map((setIndex) => (
              <div key={setIndex} className="marquee-content" aria-hidden={setIndex > 0 ? "true" : undefined}>
                {["Art Direction", "Brand Identity", "UI Design", "Visual Communication", "Fotografia", "Creative Direction", "Design Systems", "Videomaking"].map((item, i) => (
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
                title: "Brand Identity & Art Direction",
                num: "01",
                desc: "Definizione e sviluppo dell'identità visiva, dalla creazione del logo alla costruzione di un sistema grafico coerente su tutti i touchpoint.",
                tools: ["Figma", "Illustrator", "Brand Guidelines"],
              },
              {
                title: "UI & Visual Design",
                num: "02",
                desc: "Progettazione di interfacce e materiali visivi per piattaforme digitali, garantendo coerenza tra prodotto e immagine aziendale.",
                tools: ["Figma", "Prototyping", "Design Systems"],
              },
              {
                title: "Fotografia & Video",
                num: "03",
                desc: "Servizi fotografici per eventi, ritratti e shooting commerciali. Post-produzione professionale con color grading e ritocco.",
                tools: ["Lightroom", "Photoshop", "Post-produzione"],
              },
              {
                title: "Strategy & Operations",
                num: "04",
                desc: "Strutturazione organizzativa, coordinamento processi e sviluppo operativo. Dal CRM al go-to-market.",
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
                  className="group grid grid-cols-12 gap-4 lg:gap-8 py-8 lg:py-14 items-start lg:items-center cursor-pointer relative rounded-xl -mx-4 px-4 hover:bg-[var(--fg)]/[0.015] transition-all duration-500"
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="col-span-2 lg:col-span-1">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--border)] group-hover:border-[var(--accent)]/40 group-hover:bg-[var(--accent)]/[0.06] text-sm font-mono text-[var(--fg-faint)] group-hover:text-[var(--accent)] transition-all duration-300">
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
                        <span key={tool} className="text-[11px] font-medium tracking-wider uppercase px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--fg-muted)] group-hover:border-[var(--accent)]/20 group-hover:text-[var(--fg)] transition-all duration-300">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="hidden lg:flex col-span-2 justify-end">
                    <motion.div
                      className="w-10 h-10 rounded-full border border-[var(--border)] flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-all duration-300"
                      whileHover={{ scale: 1.15, rotate: 45 }}
                    >
                      <ArrowUpRight size={18} />
                    </motion.div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
                </motion.div>
                {i === 3 && <div className="divider" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WORK ═══════════════════ */}
      <section id="work" className="px-6 py-28 lg:py-40 bg-[var(--bg-dark)] text-white relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--accent)]/[0.04] rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/[0.03] rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

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
                type: "Brand & Design Direction — Chief of Staff",
                num: "01",
                desc: "Direzione creativa e identità visiva di una startup nel settore creativo e digitale. Art direction, UI design, visual communication e supporto organizzativo come Chief of Staff — dalla brand identity alla strutturazione operativa.",
                url: "https://crybu.org",
                tags: ["Art Direction", "Brand Identity", "UI Design", "Visual Communication", "Organizational Management"],
                year: "2026",
              },
              {
                name: "ORARIO VALLAURI",
                type: "Full-Stack Web App — PWA",
                num: "02",
                desc: "Applicazione web per la gestione e visualizzazione dell'orario scolastico dell'IIS Vallauri. Progressive Web App con supporto offline, ricerca intelligente e interfaccia ottimizzata per mobile.",
                url: "https://orario.raffaelevitale.it/orario",
                tags: ["Next.js", "TypeScript", "PWA", "Zustand", "Vercel"],
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
                <div className="light-sweep relative p-8 lg:p-12 rounded-2xl border border-white/8 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden group-hover:shadow-2xl group-hover:shadow-[var(--accent)]/[0.06]">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/[0.04] via-transparent to-purple-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12">
                    <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-2 flex-shrink-0">
                      <span className="font-display text-6xl lg:text-7xl text-white/[0.06] group-hover:text-white/10 transition-colors duration-500">
                        {project.num}
                      </span>
                      <span className="text-xs font-mono text-white/25 group-hover:text-[var(--accent)]/60 transition-colors duration-300">{project.year}</span>
                    </div>

                    <div className="flex-1">
                      <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-[var(--accent)]">
                        {project.type}
                      </span>
                      <h3 className="text-3xl lg:text-5xl font-semibold mt-2 tracking-tight group-hover:translate-x-3 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]">
                        {project.name}
                      </h3>
                      <p className="text-white/40 mt-3 text-sm lg:text-base max-w-xl leading-relaxed group-hover:text-white/55 transition-colors duration-500">
                        {project.desc}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-5">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-medium tracking-wider uppercase px-3 py-1.5 rounded-full border border-white/8 text-white/35 group-hover:border-white/12 group-hover:text-white/45 transition-all duration-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 self-center flex-shrink-0 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] group-hover:bg-[var(--accent)]/10"
                      whileHover={{ scale: 1.15 }}
                    >
                      <ArrowUpRight size={20} />
                    </motion.div>
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
            <div className="h-px bg-gradient-to-r from-transparent to-white/10 flex-1" />
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="group text-white/30 hover:text-[var(--accent)] transition-colors font-medium text-sm tracking-widest uppercase flex items-center gap-3"
            >
              Richiedi il portfolio completo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
            <div className="h-px bg-gradient-to-l from-transparent to-white/10 flex-1" />
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
                Studente di Informatica al 5° anno, con forte passione per{" "}
                <span className="font-semibold text-[var(--fg)]">tecnologia</span> e{" "}
                <span className="font-semibold text-[var(--fg)]">creatività</span>.
                Brand & Design Director e Chief of Staff di{" "}
                <span className="font-semibold text-[var(--fg)]">Crybu</span>,
                startup nel settore digitale.
                <br /><br />
                Fotografo e videomaker freelance. Nei weekend lavoro come Chef de Rang,
                sviluppando leadership e gestione del team. Cerco opportunità per crescere
                nel mondo tech e creativo.
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
                    {["Figma", "Adobe Lightroom", "Photoshop", "Python", "HTML/CSS/JS", "Notion", "SQL", "Cisco CCNA", "UI Design", "Art Direction"].map((tech, i) => (
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
                    <span className="text-xs font-medium tracking-wider uppercase text-[var(--fg-muted)]">Formazione</span>
                    <div>
                      <div className="font-display text-3xl lg:text-4xl">IT</div>
                      <div className="text-xs text-[var(--fg-muted)] mt-1">IIS Vallauri, Informatica</div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[var(--accent)] text-white flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                    <span className="relative text-xs font-medium tracking-wider uppercase text-white/70">Lingue</span>
                    <div className="relative">
                      <div className="font-display text-3xl lg:text-4xl">B2</div>
                      <div className="text-xs text-white/70 mt-1">Italiano nativo, Inglese B2</div>
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)]/[0.02] rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
        <div className="max-w-7xl mx-auto relative">
          <SectionHeader
            label="Processo"
            title="Come lavoro"
            serif
          />

          {/* Progress connector for desktop */}
          <div className="hidden lg:block mt-16 lg:mt-24 mb-6">
            <div className="relative mx-auto max-w-[calc(100%-4rem)]">
              <div className="h-px bg-[var(--border)]" />
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-[12.5%]">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-[var(--bg-alt)] border-2 border-[var(--accent)]/40"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 400 }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mt-6 lg:mt-0">
            {[
              { step: "01", title: "Scoperta", desc: "Ascolto le esigenze, analizzo il contesto e definisco obiettivi chiari." },
              { step: "02", title: "Strategia", desc: "Definisco il posizionamento, l'architettura di brand e la roadmap operativa." },
              { step: "03", title: "Design", desc: "Identità visiva, sistemi di design e prototipi iterati fino alla perfezione." },
              { step: "04", title: "Lancio", desc: "Go-to-market, coordinamento team e supporto continuo per un risultato impeccabile." },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group p-7 lg:p-8 bg-[var(--bg)] rounded-2xl border border-[var(--border)] hover:border-[var(--accent)]/30 transition-all duration-500 relative overflow-hidden hover:shadow-lg hover:shadow-[var(--accent)]/[0.04]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6, ease }}
              >
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-[var(--accent)]/[0.04] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--accent)]/[0.06] border border-[var(--accent)]/15 font-mono text-xs text-[var(--accent)] group-hover:bg-[var(--accent)]/[0.12] transition-colors duration-300">{item.step}</span>
                <h3 className="font-display text-2xl lg:text-3xl mt-5 mb-3 group-hover:text-[var(--accent)] transition-colors duration-300">{item.title}</h3>
                <p className="text-[var(--fg-muted)] text-sm leading-relaxed">{item.desc}</p>

                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--accent)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACT ═══════════════════ */}
      <section id="contact" className="px-6 py-28 lg:py-40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)]/[0.03] rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/[0.02] rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
        <div className="max-w-7xl mx-auto relative">
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
              <div className="bg-[var(--bg-dark)]/95 backdrop-blur-xl text-white p-8 lg:p-10 rounded-2xl relative overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/20">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent)]/[0.08] rounded-full blur-3xl" aria-hidden="true" />

                <div className="relative flex items-center gap-4 mb-8">
                  <motion.div
                    className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/10 ring-offset-2 ring-offset-[var(--bg-dark)]"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image src="/IMG_1870.PNG" alt="Raffaele Vitale" fill className="object-cover" sizes="56px" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-base">Raffaele Vitale</p>
                    <span className="inline-flex items-center gap-2 text-xs text-[#10B981] font-medium">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-60" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]" />
                      </span>
                      Disponibile
                    </span>
                  </div>
                </div>

                <div className="relative bg-white/[0.04] hover:bg-white/[0.06] rounded-xl p-4 mb-6 flex items-center justify-between border border-white/[0.04] transition-colors duration-300">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 font-medium mb-1">Email</div>
                    <div className="text-sm font-medium text-white/80">raffaele.stuudio@gmail.com</div>
                  </div>
                  <motion.button
                    onClick={(e) => { e.preventDefault(); copyEmail(); }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all duration-200 border border-white/[0.04]"
                    aria-label="Copia email"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="w-4 h-4 text-[#10B981]" />
                        </motion.span>
                      ) : (
                        <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Copy className="w-4 h-4 text-white/40" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                <motion.a
                  href="mailto:raffaele.stuudio@gmail.com"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex items-center justify-center gap-3 w-full py-4 font-semibold text-base rounded-xl text-white bg-[var(--accent)] overflow-hidden transition-shadow hover:shadow-lg hover:shadow-[var(--accent)]/20"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[var(--accent-hover)] to-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Mail className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Invia una mail</span>
                </motion.a>

                <div className="relative flex gap-6 mt-7 pt-6 border-t border-white/[0.06] text-sm">
                  {[
                    { label: "Instagram", url: "https://www.instagram.com/josh63.exe/" },
                    { label: "LinkedIn", url: "https://www.linkedin.com/in/vitaleraffaele/" },
                    { label: "GitHub", url: "https://github.com/raffaelevitale" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link text-white/30 hover:text-[var(--accent)] transition-colors font-medium"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="py-14 px-6 border-t border-[var(--border)] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <span className="font-display text-xl">Raffaele Vitale</span>
              <p className="text-[var(--fg-muted)] text-sm mt-1.5">Brand & Design Director · Fotografo</p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {[
                { href: "#home", label: "Home" },
                { href: "#work", label: "Work" },
                { href: "#about", label: "About" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[var(--fg-faint)] text-xs">
              &#169; 2026 Raffaele Vitale
            </p>
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-2 text-[var(--fg-faint)] hover:text-[var(--accent)] text-xs transition-colors font-medium px-4 py-2 rounded-full border border-transparent hover:border-[var(--accent)]/20 hover:bg-[var(--accent)]/[0.04]"
            >
              <span>Torna su</span>
              <motion.span
                className="inline-block"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                &#8593;
              </motion.span>
            </motion.button>
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
    { label: "Anni nel creativo", value: 3, suffix: "+" },
    { label: "Progetti & shooting", value: 30, suffix: "+" },
    { label: "Clienti & brand", value: 15, suffix: "+" },
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
