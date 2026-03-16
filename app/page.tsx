"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Palette, Layout, Code as CodeIcon, Zap, Smartphone,
  ArrowUpRight, Copy, Terminal, Cpu, FolderOpen, Check, Mail,
  ArrowRight, Sparkles, Eye
} from "lucide-react";

/* ─── Color palette ─── */
const colors = ["#FF4D4D", "#4ECDC4", "#FFE66D", "#A855F7", "#FF6B6B", "#06B6D4", "#EC4899", "#10B981"];

/* ─── Animated counter hook ─── */
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

/* ─── Role rotation words ─── */
const roles = ["CREATIVE DIRECTOR", "UI/UX DESIGNER", "BRAND STRATEGIST", "DIGITAL STRATEGIST"];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const negRotate = useTransform(rotate, (r) => -r);
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
    <main ref={containerRef} className="bg-[#FAFAFA] text-[#1a1a1a] overflow-hidden">
      {/* Subtle grain texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section id="home" className="min-h-screen relative px-6 py-28 lg:py-32 flex items-center">
        <motion.div
          className="absolute top-20 right-0 w-[40vw] h-[50vh] rounded-l-[100px] opacity-[0.14]"
          style={{ backgroundColor: "#FF4D4D", rotate }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-[25vw] h-[30vh] rounded-[50px] opacity-[0.12]"
          style={{ backgroundColor: "#4ECDC4", rotate: negRotate }}
        />

        <div className="max-w-7xl mx-auto w-full relative">
          <div className="grid grid-cols-12 gap-6">
            <motion.div
              className="col-span-12 lg:col-span-8 relative z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a]/5 border border-[#1a1a1a]/10 mb-8"
              >
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-[#10B981]"
                />
                <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60">
                  Disponibile per nuovi progetti
                </span>
              </motion.div>

              {/* Rotating role title */}
              <div className="mb-4 h-[7vw] sm:h-[6.5vw] md:h-[6vw] lg:h-[5vw] xl:h-[4.5vw] overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={roleIndex}
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -60, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <KineticTextInline text={roles[roleIndex]} colors={colors} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-lg lg:text-xl text-[#1a1a1a]/60 max-w-lg leading-relaxed"
              >
                Progetto identità visive, strategie digitali e sistemi di brand
                curando ogni dettaglio — dal concept alla direzione creativa.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap gap-4 mt-10"
              >
                <motion.a
                  href="#work"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 rounded-full font-bold text-white bg-[#1a1a1a] flex items-center gap-3 hover:gap-4 transition-[gap]"
                >
                  Guarda i progetti
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.a>
                <motion.a
                  href="/Profile.pdf"
                  download
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full font-bold border-2 border-[#1a1a1a]/15 hover:border-[#1a1a1a]/40 transition-colors"
                >
                  Scarica CV
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Floating info card */}
            <motion.div
              className="col-span-12 lg:col-span-4 flex items-start lg:items-center justify-start lg:justify-end"
              initial={{ opacity: 0, y: 50, rotate: 3 }}
              animate={{ opacity: 1, y: 0, rotate: 3 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                whileHover={{ rotate: 0, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="bg-[#1a1a1a] text-white p-8 rounded-3xl -mt-8 lg:mt-0 lg:-ml-20 max-w-sm shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#4ECDC4]/10 to-transparent rounded-bl-full" />
                <div className="relative">
                  <motion.div
                    className="relative w-20 h-20 mb-4 rounded-2xl overflow-hidden ring-2 ring-white/10"
                    whileHover={{ scale: 1.05, rotate: -3 }}
                  >
                    <Image
                      src="/IMG_1870.PNG"
                      alt="Raffaele Vitale"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <div className="text-lg font-bold mb-1">Raffaele Vitale</div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold mb-4 bg-[#4ECDC4]/15 text-[#4ECDC4] uppercase tracking-widest">
                    <motion.span
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[#4ECDC4]"
                    />
                    Disponibile 2026
                  </span>
                  <p className="text-white/60 leading-relaxed text-sm mt-3">
                    Creative Director & Brand Strategist con passione per sistemi visivi e identità di marca.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Floating code widget */}
          <motion.div
            className="absolute top-[30%] left-[50%] hidden lg:block pointer-events-none z-10"
            initial={{ opacity: 0, y: 20, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white/90 backdrop-blur-sm border border-[#1a1a1a]/[0.06] rounded-2xl p-5 shadow-lg shadow-black/[0.04] w-56">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#FF4D4D]/60" />
                <span className="w-2 h-2 rounded-full bg-[#FFE66D]/60" />
                <span className="w-2 h-2 rounded-full bg-[#10B981]/60" />
                <span className="ml-2 text-[9px] font-mono text-[#1a1a1a]/25 tracking-wider">brand.fig</span>
              </div>
              <div className="font-mono text-[11px] leading-relaxed space-y-0.5">
                <div><span className="text-[#A855F7]">vision</span> <span className="text-[#1a1a1a]/30">→</span> <span className="text-[#4ECDC4]">identity</span></div>
                <div><span className="text-[#FF4D4D]">strategy</span> <span className="text-[#1a1a1a]/30">→</span> <span className="text-[#1a1a1a]/70">impact</span></div>
              </div>
            </div>
          </motion.div>

          {/* Central gradient orb */}
          <motion.div
            className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] rounded-full hidden lg:block pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, rgba(78,205,196,0.04) 40%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
          />

          {/* Decorative elements */}
          <motion.div
            className="absolute top-10 right-1/4 w-16 h-16 rounded-full border-2 hidden lg:block"
            style={{ borderColor: "#A855F7" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25, rotate: 360 }}
            transition={{
              opacity: { delay: 1, duration: 0.8, ease: "easeOut" },
              rotate: { delay: 1, duration: 20, repeat: Infinity, ease: "linear" },
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-8 h-8 rounded-lg hidden lg:block"
            style={{ backgroundColor: "#FFE66D" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3, y: [0, -10, 0], rotate: [0, 10, 0] }}
            transition={{
              opacity: { delay: 1.1, duration: 0.8, ease: "easeOut" },
              y: { delay: 1.1, duration: 4, repeat: Infinity, ease: "easeInOut" },
              rotate: { delay: 1.1, duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* Additional floating decorations */}
          <motion.div
            className="absolute top-[28%] left-[52%] w-2 h-2 rounded-full hidden lg:block"
            style={{ backgroundColor: "#4ECDC4" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5, scale: [1, 1.3, 1] }}
            transition={{
              opacity: { delay: 1.2, duration: 0.6, ease: "easeOut" },
              scale: { delay: 1.2, duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
          />
          <motion.div
            className="absolute bottom-[32%] left-[58%] w-16 h-px hidden lg:block"
            style={{ backgroundColor: "#A855F7" }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.25, scaleX: 1 }}
            transition={{ delay: 1.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute top-[22%] right-[18%] w-5 h-5 border border-[#FF4D4D]/25 rounded-sm hidden lg:block"
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{
              opacity: { delay: 1.4, duration: 0.6, ease: "easeOut" },
              rotate: { delay: 1.4, duration: 15, repeat: Infinity, ease: "linear" },
            }}
          />
          <motion.div
            className="absolute bottom-[22%] right-[28%] hidden lg:block text-[#FFE66D]/25 text-xl font-light select-none pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { delay: 1.5, duration: 0.6, ease: "easeOut" },
              y: { delay: 1.5, duration: 5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            +
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[#1a1a1a]/30 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-7 h-11 border-2 border-current rounded-full flex justify-center pt-2">
              <motion.div
                className="w-1 h-2.5 bg-current rounded-full"
                animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll</span>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ MARQUEE ═══════════════════ */}
      <section className="py-6 border-y border-[#1a1a1a]/5 overflow-hidden bg-white/50">
        <div className="marquee-container">
          <div className="marquee-track">
            {[0, 1].map((setIndex) => (
              <div key={setIndex} className="marquee-content" aria-hidden={setIndex > 0 ? "true" : undefined}>
                {["Brand Identity", "UI/UX Design", "Digital Strategy", "Figma", "Notion", "Product Design", "Creative Direction", "Business Strategy", "Design Systems", "CRM Design"].map((item, i) => (
                  <span key={`${setIndex}-${i}`} className="flex items-center gap-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1a1a1a]/25 whitespace-nowrap">
                    {item}
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]/15" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section className="px-6 py-28 lg:py-36 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 lg:mb-24">
            <motion.span
              className="text-xs uppercase tracking-[0.3em] font-bold block mb-6 text-[#A855F7]"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Cosa faccio
            </motion.span>
            <div className="flex flex-wrap items-end gap-4">
              <motion.h2
                className="text-5xl lg:text-8xl font-black tracking-tight"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                SERVIZI
              </motion.h2>
              <motion.span
                className="text-2xl lg:text-3xl font-light text-[#1a1a1a]/30 mb-1 lg:mb-2"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                (03)
              </motion.span>
            </div>
          </div>

          <div className="space-y-0">
            {[
              {
                title: "BRAND IDENTITY",
                sub: "Visual System",
                desc: "Identit\u00e0 coerenti e sistemi scalabili per prodotti digitali. Dal logo al design system completo.",
                color: "#FF4D4D",
                icon: Palette,
                num: "01",
                tools: ["Figma", "Illustrator", "Brand Guidelines"]
              },
              {
                title: "UI/UX DESIGN",
                sub: "User Experience",
                desc: "Wireframe, prototipi interattivi e design system accessibili. Ogni interfaccia \u00e8 testata e iterata.",
                color: "#4ECDC4",
                icon: Layout,
                num: "02",
                tools: ["Figma", "Prototyping", "User Research"]
              },
              {
                title: "DIGITAL STRATEGY",
                sub: "Business & Product",
                desc: "Sistemi operativi, infrastrutture digitali e strategie di crescita. Dal CRM al go-to-market, progettati da zero.",
                color: "#A855F7",
                icon: Zap,
                num: "03",
                tools: ["Notion", "CRM Design", "Business Strategy"]
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="h-px bg-[#1a1a1a]/10" />
                <motion.div
                  className="group grid grid-cols-12 gap-4 lg:gap-8 py-8 lg:py-12 cursor-pointer items-center"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="col-span-2 lg:col-span-1">
                    <span className="text-sm font-bold text-[#1a1a1a]/20 group-hover:text-[#1a1a1a]/50 transition-colors">
                      {service.num}
                    </span>
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                      style={{ backgroundColor: `${service.color}15`, color: service.color }}
                    >
                      <service.icon size={22} strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="col-span-8 lg:col-span-4">
                    <h3 className="text-2xl lg:text-4xl font-black tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                      {service.title}
                    </h3>
                    <span className="text-[#1a1a1a]/40 font-bold text-xs tracking-widest uppercase mt-1 block">
                      {service.sub}
                    </span>
                  </div>

                  <div className="col-span-12 lg:col-span-4 pl-0 lg:pl-4">
                    <p className="text-[#1a1a1a]/50 leading-relaxed text-sm lg:text-base">
                      {service.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {service.tools.map((tool) => (
                        <span key={tool} className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-[#1a1a1a]/10 text-[#1a1a1a]/40">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="hidden lg:flex col-span-2 justify-end">
                    <motion.div
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{ borderColor: service.color, color: service.color }}
                    >
                      <ArrowUpRight size={18} />
                    </motion.div>
                  </div>
                </motion.div>

                {i === 2 && <div className="h-px bg-[#1a1a1a]/10" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ WORK ═══════════════════ */}
      <section id="work" className="px-6 py-28 lg:py-36 bg-[#1a1a1a] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)`
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          <div className="mb-16 lg:mb-20">
            <motion.span
              className="text-xs uppercase tracking-[0.3em] font-bold block mb-6 text-[#FFE66D]"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Portfolio
            </motion.span>
            <div className="flex flex-wrap items-end gap-4">
              <motion.h2
                className="text-5xl lg:text-8xl font-black tracking-tight"
                initial={{ x: -40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                SELECTED
              </motion.h2>
              <motion.h2
                className="text-5xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-[#FF4D4D] via-[#A855F7] to-[#4ECDC4] bg-clip-text text-transparent"
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                WORK
              </motion.h2>
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                name: "CRYBU S.R.L.",
                type: "Creative Direction \u2014 Brand & Strategy",
                num: "01",
                color: "#FF4D4D",
                desc: "Progettata e lanciata da zero l\u0027identit\u00e0 visiva e l\u0027infrastruttura operativa di una societ\u00e0 di business education. Coordinato team distribuito, costruito il Brand Book, configurato CRM e pipeline vendite per un ecosistema di 6 sistemi integrati.",
                url: "https://crybu.it",
                tags: ["Brand Identity", "Business Strategy", "EdTech", "B2B SaaS", "Notion", "CRM Design"],
                year: "2026"
              },
              {
                name: "ORARIO VALLAURI",
                type: "Web App \u2014 PWA",
                num: "02",
                color: "#4ECDC4",
                desc: "App per la gestione dell\u0027orario scolastico personalizzato. Progressive Web App con supporto offline e ricerca intelligente.",
                url: "https://orario.raffaelevitale.it",
                tags: ["Next.js", "TypeScript", "PWA", "Zustand"],
                year: "2025"
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
                transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="relative p-8 lg:p-10 rounded-2xl lg:rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all cursor-pointer overflow-hidden"
                  whileHover={{ backgroundColor: `${project.color}0A` }}
                >
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileHover={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />

                  <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                    <div className="flex lg:flex-col items-center lg:items-start gap-3 lg:gap-1">
                      <span
                        className="text-6xl lg:text-8xl font-black opacity-15"
                        style={{ color: project.color }}
                      >
                        {project.num}
                      </span>
                      <span className="text-xs font-bold text-white/30 tracking-widest">{project.year}</span>
                    </div>

                    <div className="flex-1">
                      <span
                        className="text-[10px] lg:text-xs uppercase tracking-[0.2em] font-bold"
                        style={{ color: project.color }}
                      >
                        {project.type}
                      </span>
                      <h3 className="text-3xl lg:text-5xl font-black mt-2 group-hover:translate-x-4 transition-transform duration-300">
                        {project.name}
                      </h3>
                      <p className="text-white/40 mt-3 text-sm lg:text-base max-w-xl leading-relaxed">
                        {project.desc}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-5">
                        {project.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 text-white/40">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      className="w-14 h-14 rounded-full border-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 self-center flex-shrink-0"
                      style={{ borderColor: project.color, color: project.color }}
                    >
                      <ArrowUpRight size={24} />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.a>
            ))}
          </div>

          <motion.div
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-px bg-white/10 flex-1 hidden sm:block" />
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="inline-flex items-center gap-3 text-white/40 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
            >
              <Sparkles className="w-4 h-4" />
              Richiedi il portfolio completo
              <ArrowRight className="w-4 h-4" />
            </motion.a>
            <div className="h-px bg-white/10 flex-1 hidden sm:block" />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <section id="about" className="px-6 py-28 lg:py-36 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="text-xs uppercase tracking-[0.3em] font-bold block mb-6 text-[#EC4899]"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                Chi sono
              </motion.span>
              <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-[0.95]">
                Creative{" "}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] to-[#A855F7]">
                  Director
                </span>
              </h2>
              <p className="text-lg text-[#1a1a1a]/60 leading-relaxed mb-10">
                Non mi limito a disegnare interfacce. Creo ponti tra{" "}
                <span className="font-bold text-[#1a1a1a]">visione</span>,{" "}
                <span className="font-bold text-[#1a1a1a]">strategia</span> e{" "}
                <span className="font-bold text-[#1a1a1a]">identit\u00e0 di marca</span>.
                <br /><br />
                Il mio approccio unisce direzione creativa e pensiero strategico,
                costruendo brand e sistemi che non solo funzionano, ma lasciano il segno.
              </p>

              <AnimatedStats />
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 p-6 lg:p-8 rounded-3xl bg-[#1a1a1a] text-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#4ECDC4] rounded-full blur-[100px] opacity-15" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#A855F7] rounded-full blur-[80px] opacity-10" />
                  <h3 className="font-bold text-lg mb-5 flex items-center gap-2 relative">
                    <Cpu className="w-5 h-5 text-[#4ECDC4]" /> Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2 relative">
                    {["Figma", "Notion", "Brand Design", "UI/UX Design", "Google Workspace", "CRM Design", "Product Strategy", "Framer Motion"].map((tech, i) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.15)" }}
                        className="px-3.5 py-2 rounded-xl bg-white/10 text-sm font-medium cursor-default transition-colors"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <motion.div
                  className="p-6 rounded-3xl bg-white border border-[#1a1a1a]/5 text-[#1a1a1a] shadow-lg flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300"
                  whileHover={{ boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#FFE66D]/20 flex items-center justify-center text-[#d4bd38] mb-4">
                    <Zap strokeWidth={3} size={20} />
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-black mb-1">Fast</div>
                    <div className="text-xs opacity-50 font-medium leading-tight">Performance first, always.</div>
                  </div>
                </motion.div>

                <motion.div
                  className="p-6 rounded-3xl bg-gradient-to-br from-[#FF4D4D] to-[#EC4899] text-white shadow-lg flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300"
                  whileHover={{ boxShadow: "0 20px 40px -12px rgba(236,72,153,0.3)" }}
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white mb-4">
                    <Smartphone strokeWidth={3} size={20} />
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-black mb-1">Mobile</div>
                    <div className="text-xs opacity-70 font-medium leading-tight">Responsive & Touch ready.</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ PROCESS ═══════════════════ */}
      <section className="px-6 py-28 lg:py-36 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 lg:mb-24">
            <motion.span
              className="text-xs uppercase tracking-[0.3em] font-bold block mb-6 text-[#06B6D4]"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              Come lavoro
            </motion.span>
            <motion.h2
              className="text-5xl lg:text-8xl font-black tracking-tight"
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              PROCESSO
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Scoperta", desc: "Ascolto le esigenze, analizzo il contesto e definisco obiettivi chiari.", color: "#FF4D4D", icon: Eye },
              { step: "02", title: "Strategia", desc: "Definisco il posizionamento, l\u0027architettura di brand e la roadmap operativa.", color: "#A855F7", icon: Palette },
              { step: "03", title: "Design", desc: "Identit\u00e0 visiva, sistemi di design e prototipi iterati fino alla perfezione.", color: "#4ECDC4", icon: Layout },
              { step: "04", title: "Lancio", desc: "Go-to-market, coordinamento team e supporto continuo per un risultato impeccabile.", color: "#FFE66D", icon: Zap },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group relative p-6 lg:p-8 rounded-3xl border border-[#1a1a1a]/5 bg-[#FAFAFA] hover:bg-white hover:shadow-xl transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="text-7xl font-black opacity-[0.04] absolute top-4 right-6">{item.step}</span>

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <item.icon size={22} strokeWidth={2.5} />
                </div>

                <div className="text-xs font-bold text-[#1a1a1a]/30 tracking-widest mb-2">{item.step}</div>
                <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                <p className="text-[#1a1a1a]/50 text-sm leading-relaxed">{item.desc}</p>

                <div
                  className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ backgroundColor: item.color }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CONTACT ═══════════════════ */}
      <section id="contact" className="px-6 py-28 lg:py-36 relative flex items-center bg-[#FAFAFA]">
        <motion.div
          className="absolute bottom-0 left-0 w-[50vw] h-[40vh] rounded-tr-[100px] opacity-[0.06]"
          style={{ backgroundColor: "#4ECDC4" }}
        />
        <motion.div
          className="absolute top-20 right-20 w-[20vw] h-[20vh] rounded-[40px] opacity-[0.06] hidden lg:block"
          style={{ backgroundColor: "#A855F7" }}
        />

        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-12 gap-8 items-center">
            <motion.div
              className="col-span-12 lg:col-span-7"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="text-xs uppercase tracking-[0.3em] font-bold block mb-6 text-[#10B981]"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                Contattami
              </motion.span>
              <KineticTextInline text="LETS BUILD" colors={colors} size="large" />
              <div className="mt-2">
                <KineticTextInline text="TOGETHER" colors={colors} size="large" />
              </div>
              <p className="text-lg text-[#1a1a1a]/50 mt-6 max-w-md leading-relaxed">
                Hai un progetto in mente? Parliamone. Sono sempre aperto a nuove collaborazioni creative.
              </p>
            </motion.div>

            <motion.div
              className="col-span-12 lg:col-span-5"
              initial={{ opacity: 0, y: 50, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: 3 }}
              viewport={{ once: true }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              transition={{
                default: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                rotate: { type: "spring", stiffness: 180, damping: 22 },
                scale: { type: "spring", stiffness: 300, damping: 25 },
              }}
            >
              <div className="bg-[#1a1a1a] text-white p-8 lg:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF4D4D] via-[#A855F7] to-[#4ECDC4]" />

                <div className="flex items-center gap-4 mb-8">
                  <motion.div
                    className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 ring-2 ring-white/10"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Image
                      src="/IMG_1870.PNG"
                      alt="Raffaele Vitale"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <div>
                    <p className="font-bold text-lg">Raffaele Vitale</p>
                    <motion.span className="inline-flex items-center gap-2 text-xs text-[#10B981]">
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-[#10B981]"
                      />
                      Disponibile
                    </motion.span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 mb-6 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1">Email</div>
                    <div className="text-sm font-medium text-white/80">raffaele.stuudio@gmail.com</div>
                  </div>
                  <motion.button
                    onClick={(e) => { e.preventDefault(); copyEmail(); }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    aria-label="Copia email"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4 text-white/60" />}
                  </motion.button>
                </div>

                <motion.a
                  href="mailto:raffaele.stuudio@gmail.com"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-3 w-full py-4 font-bold text-base rounded-2xl text-white bg-gradient-to-r from-[#FF4D4D] via-[#A855F7] to-[#4ECDC4] transition-shadow hover:shadow-lg hover:shadow-[#A855F7]/20"
                >
                  <Mail className="w-5 h-5" />
                  Invia una mail
                </motion.a>

                <div className="flex gap-6 mt-6 text-sm">
                  <a href="https://www.instagram.com/josh63.exe/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#EC4899] transition-colors font-medium">
                    Instagram
                  </a>
                  <a href="https://www.linkedin.com/in/vitaleraffaele/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#4ECDC4] transition-colors font-medium">
                    LinkedIn
                  </a>
                  <a href="https://github.com/raffaelevitale" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#FFE66D] transition-colors font-medium">
                    GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="py-12 px-6 border-t border-[#1a1a1a]/10 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <span className="text-xl font-black tracking-tighter">RAFFAELE VITALE</span>
              <p className="text-[#1a1a1a]/40 text-sm mt-1">Creative Director & Brand Strategist</p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <a href="#home" className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors font-medium">Home</a>
              <a href="#work" className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors font-medium">Work</a>
              <a href="#about" className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors font-medium">About</a>
              <a href="#contact" className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors font-medium">Contact</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#1a1a1a]/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#1a1a1a]/30 text-xs">
              &#169; 2026 Raffaele Vitale &#8212; Progettato con &#10084;
            </p>
            <motion.a
              href="#home"
              whileHover={{ y: -2 }}
              className="text-[#1a1a1a]/30 hover:text-[#1a1a1a] text-xs transition-colors font-medium flex items-center gap-2"
            >
              Torna su &#8593;
            </motion.a>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* ─── Animated Stats Sub-component ─── */
function AnimatedStats() {
  const stats = [
    { label: "Anni di esperienza", value: 3, suffix: "+", icon: Terminal, color: "#A855F7" },
    { label: "Progetti completati", value: 20, suffix: "+", icon: FolderOpen, color: "#4ECDC4" },
    { label: "Clienti soddisfatti", value: 10, suffix: "+", icon: Eye, color: "#FF4D4D" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <StatCard key={i} stat={stat} index={i} />
      ))}
    </div>
  );
}

function StatCard({ stat, index }: { stat: { label: string; value: number; suffix: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }; index: number }) {
  const { count, ref } = useCounter(stat.value, 1500 + index * 300);
  return (
    <div
      ref={ref}
      className="p-4 lg:p-5 rounded-2xl bg-white border border-[#1a1a1a]/5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <stat.icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
      <div className="text-3xl lg:text-4xl font-black">{count}{stat.suffix}</div>
      <div className="text-[11px] text-[#1a1a1a]/50 font-medium mt-1 leading-tight">{stat.label}</div>
    </div>
  );
}

/* ─── Kinetic Text Component ─── */
function KineticTextInline({
  text,
  colors: colorsProp,
  size = "default"
}: {
  text: string;
  colors: string[];
  size?: "default" | "large";
}) {
  // Pre-compute stable random rotations per character to avoid recalculating on every render
  const rotations = useMemo(
    () => text.split("").map(() => Math.random() * 10 - 5),
    [text]
  );

  const sizeClasses = size === "large"
    ? "text-4xl md:text-5xl lg:text-6xl"
    : "text-[5.5vw] sm:text-[5vw] md:text-[4.5vw] lg:text-[4vw] xl:text-[3.5vw]";

  return (
    <div className={`${sizeClasses} font-black tracking-tighter leading-none whitespace-nowrap`}>
      {text.split("").map((letter, i) => {
        const colorIndex = i % colorsProp.length;
        const isSpace = letter === " ";

        return (
          <motion.span
            key={i}
            className={`inline-block cursor-default select-none ${isSpace ? "w-[0.3em]" : ""}`}
            style={{ color: "#1a1a1a" }}
            whileHover={!isSpace ? {
              y: -8,
              rotate: rotations[i],
              scale: 1.1,
              color: colorsProp[colorIndex],
            } : undefined}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 25,
            }}
          >
            {isSpace ? "\u00A0" : letter}
          </motion.span>
        );
      })}
    </div>
  );
}
