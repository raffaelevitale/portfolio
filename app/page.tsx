"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 8]);

  // Mixed color palette
  const colors = ["#FF4D4D", "#4ECDC4", "#FFE66D", "#A855F7", "#FF6B6B", "#06B6D4", "#EC4899", "#10B981"];

  return (
    <main ref={containerRef} className="bg-[#FAFAFA] text-[#1a1a1a] overflow-hidden">
      {/* Subtle grain texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02] z-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Hero Section */}
      <section id="home" className="min-h-screen relative px-6 py-32 flex items-center">
        {/* Background accent shapes */}
        <motion.div
          className="absolute top-20 right-0 w-[40vw] h-[50vh] rounded-l-[100px] opacity-10"
          style={{ backgroundColor: "#FF4D4D", rotate }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-[25vw] h-[30vh] rounded-[50px] opacity-10"
          style={{ backgroundColor: "#4ECDC4", rotate: useTransform(rotate, r => -r) }}
        />

        <div className="max-w-7xl mx-auto w-full relative">
          <div className="grid grid-cols-12 gap-6">
            {/* Main kinetic title */}
            <motion.div
              className="col-span-12 lg:col-span-8 relative z-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-8">
                <KineticTextInline text="CREATIVE DEVELOPER" colors={colors} />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl lg:text-2xl text-[#1a1a1a]/70 max-w-xl leading-relaxed"
              >
                Progetto interfacce pulite, sistemi visivi e prodotti digitali curando ogni dettaglio.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4 mt-10"
              >
                <motion.a
                  href="#work"
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-[#FF4D4D] to-[#EC4899]"
                >
                  Guarda i progetti
                </motion.a>
                <motion.a
                  href="/Profile.pdf"
                  download
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full font-bold border-2 border-[#1a1a1a]/20 hover:border-[#4ECDC4] hover:text-[#4ECDC4] transition-colors"
                >
                  Scarica CV
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Floating info card with photo */}
            <motion.div
              className="col-span-12 lg:col-span-4 flex items-start lg:items-center justify-start lg:justify-end"
              initial={{ opacity: 0, y: 50, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 5 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ rotate: 0, scale: 1.02 }}
                className="bg-[#1a1a1a] text-white p-8 rounded-3xl -mt-8 lg:mt-0 lg:-ml-20 max-w-sm shadow-2xl"
              >
                <motion.div
                  className="relative w-20 h-20 mb-4 rounded-2xl overflow-hidden"
                  whileHover={{ scale: 1.05, rotate: -3 }}
                >
                  <Image
                    src="/IMG_1870.PNG"
                    alt="Raffaele Vitale"
                    fill
                    className="object-cover"
                  />
                </motion.div>
                <motion.span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4 bg-gradient-to-r from-[#4ECDC4]/20 to-[#06B6D4]/20 text-[#4ECDC4]"
                >
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-[#4ECDC4]"
                  />
                  DISPONIBILE 2026
                </motion.span>
                <p className="text-white/80 leading-relaxed">
                  Designer & Developer con passione per tipografia e interazioni inaspettate.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <motion.div
            className="absolute top-10 right-1/4 w-16 h-16 rounded-full border-2 opacity-30 hidden lg:block"
            style={{ borderColor: "#A855F7" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-8 h-8 rounded-lg opacity-40 hidden lg:block"
            style={{ backgroundColor: "#FFE66D" }}
            animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/3 left-10 w-6 h-6 rounded-full opacity-30 hidden lg:block"
            style={{ backgroundColor: "#4ECDC4" }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-12 text-[#1a1a1a]/40 hidden md:block"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-12 border-2 border-current rounded-full flex justify-center pt-2">
              <motion.div
                className="w-1.5 h-3 bg-current rounded-full"
                animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="px-6 py-32 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-16 lg:mb-24"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="text-sm uppercase tracking-[0.3em] font-bold block mb-4 text-[#A855F7]"
              initial={{ x: -30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              Cosa faccio
            </motion.span>
            <div className="flex flex-wrap items-end gap-4">
              <motion.h2
                className="text-5xl lg:text-8xl font-black tracking-tight"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                SERVIZI
              </motion.h2>
              <motion.span
                className="text-2xl lg:text-3xl font-light text-[#1a1a1a]/40 mb-1 lg:mb-2"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                (03)
              </motion.span>
            </div>
          </motion.div>

          {/* Service cards - responsive grid on mobile, scattered on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:relative lg:min-h-[60vh]">
            {[
              { title: "BRAND", sub: "Visual System", desc: "Identità coerenti e sistemi scalabili per prodotti digitali.", x: "0%", y: "0%", rotate: -4, color: "#FF4D4D" },
              { title: "UI/UX", sub: "Web App", desc: "Wireframe, prototipi e design system accessibili.", x: "35%", y: "30%", rotate: 3, color: "#4ECDC4" },
              { title: "CODE", sub: "Front-end", desc: "React, Next.js, TypeScript con animazioni fluide.", x: "65%", y: "5%", rotate: -2, color: "#A855F7" },
            ].map((service, i) => (
              <motion.div
                key={i}
                className="bg-white p-8 rounded-3xl shadow-lg border border-[#1a1a1a]/5 lg:absolute lg:w-80"
                style={{
                  left: service.x,
                  top: service.y,
                }}
                initial={{ opacity: 0, y: 50, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: service.rotate }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ rotate: 0, scale: 1.03, zIndex: 10 }}
              >
                <div
                  className="w-12 h-12 rounded-2xl mb-6 flex items-center justify-center text-white text-xl font-black"
                  style={{ backgroundColor: service.color }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <h3 className="text-3xl font-black tracking-tight">{service.title}</h3>
                <span className="text-[#1a1a1a]/50 font-medium">{service.sub}</span>
                <p className="text-[#1a1a1a]/70 mt-4 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="px-6 py-32 bg-[#1a1a1a] text-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)`
          }}
        />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            className="mb-16 lg:mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="text-sm uppercase tracking-[0.3em] font-bold block mb-4 text-[#FFE66D]"
            >
              Portfolio
            </motion.span>
            <div className="flex flex-wrap items-end gap-4">
              <motion.h2
                className="text-5xl lg:text-8xl font-black tracking-tight"
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                SELECTED
              </motion.h2>
              <motion.h2
                className="text-5xl lg:text-8xl font-black tracking-tight bg-gradient-to-r from-[#FF4D4D] via-[#A855F7] to-[#4ECDC4] bg-clip-text text-transparent"
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                WORK
              </motion.h2>
            </div>
          </motion.div>

          {/* Project cards */}
          <div className="space-y-4 lg:space-y-6">
            {[
              {
                name: "ORARIO VALLAURI",
                type: "Web App",
                num: "01",
                color: "#4ECDC4",
                desc: "App per la gestione dell'orario scolastico personalizzato. PWA con supporto offline.",
                url: "https://orario.raffaelevitale.it"
              },
            ].map((project, i) => (
              <motion.a
                key={i}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block"
                style={{ marginLeft: `${i * 20}px` }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.div
                  className="flex items-center gap-4 lg:gap-8 p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all cursor-pointer"
                  whileHover={{ x: 20, backgroundColor: `${project.color}15` }}
                >
                  <span
                    className="text-5xl lg:text-8xl font-black opacity-20"
                    style={{ color: project.color }}
                  >
                    {project.num}
                  </span>

                  <div className="flex-1">
                    <span
                      className="text-xs lg:text-sm uppercase tracking-widest font-bold"
                      style={{ color: project.color }}
                    >
                      {project.type}
                    </span>
                    <h3 className="text-2xl lg:text-5xl font-black mt-1 group-hover:translate-x-4 transition-transform">
                      {project.name}
                    </h3>
                    <p className="text-white/50 mt-2 text-sm lg:text-base max-w-lg">
                      {project.desc}
                    </p>
                  </div>

                  <motion.div
                    className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ borderColor: project.color, color: project.color }}
                  >
                    <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </motion.div>
                </motion.div>
              </motion.a>
            ))}
          </div>

          <motion.div
            className="mt-12 lg:mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="#contact"
              whileHover={{ x: 10 }}
              className="inline-flex items-center gap-3 text-white/60 hover:text-white transition-colors font-medium"
            >
              Richiedi il portfolio completo
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-32 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="text-sm uppercase tracking-[0.3em] font-bold block mb-4 text-[#EC4899]"
            >
              Chi sono
            </motion.span>
            <h2 className="text-4xl lg:text-6xl font-black mb-8">
              Designer & Developer
            </h2>
            <p className="text-xl text-[#1a1a1a]/70 leading-relaxed mb-8">
              Creo esperienze digitali dove estetica e funzionalità si incontrano.
              Esperto di <span className="font-semibold text-[#FF4D4D]">React</span>, <span className="font-semibold text-[#4ECDC4]">Next.js</span>, <span className="font-semibold text-[#A855F7]">TypeScript</span> e <span className="font-semibold text-[#EC4899]">Figma</span>,
              lavoro end-to-end dal concept al rilascio.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {["React", "Next.js", "TypeScript", "Framer Motion", "Figma", "Tailwind"].map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="px-4 py-2 rounded-full text-sm font-medium border-2 border-[#1a1a1a]/10 hover:border-[#4ECDC4] hover:text-[#4ECDC4] transition-colors cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-32 relative flex items-center bg-[#FAFAFA]">
        <motion.div
          className="absolute bottom-0 left-0 w-[50vw] h-[40vh] rounded-tr-[100px] opacity-10"
          style={{ backgroundColor: "#4ECDC4" }}
        />
        <motion.div
          className="absolute top-20 right-20 w-[20vw] h-[20vh] rounded-[40px] opacity-10 hidden lg:block"
          style={{ backgroundColor: "#A855F7" }}
        />

        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-12 gap-8 items-center">
            <motion.div
              className="col-span-12 lg:col-span-7"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <KineticTextInline text="LETS BUILD" colors={colors} size="large" />
              <div className="mt-2">
                <KineticTextInline text="TOGETHER" colors={colors} size="large" />
              </div>
            </motion.div>

            <motion.div
              className="col-span-12 lg:col-span-5"
              initial={{ opacity: 0, y: 50, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: 4 }}
              viewport={{ once: true }}
              whileHover={{ rotate: 0 }}
            >
              <div className="bg-[#1a1a1a] text-white p-8 lg:p-10 rounded-3xl shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#4ECDC4]/30"
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
                    <p className="font-bold">Raffaele Vitale</p>
                    <motion.span
                      className="inline-flex items-center gap-2 text-xs text-[#10B981]"
                    >
                      <motion.span
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-[#10B981]"
                      />
                      Disponibile
                    </motion.span>
                  </div>
                </div>

                <p className="text-white/70 mb-8 leading-relaxed">
                  Hai un progetto in mente? Parliamone e creiamo qualcosa di memorabile.
                </p>

                <motion.a
                  href="mailto:raffaele.stuudio@gmail.com"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="block w-full py-4 text-center font-bold text-lg rounded-2xl text-white bg-gradient-to-r from-[#FF4D4D] via-[#A855F7] to-[#4ECDC4]"
                >
                  Invia una mail
                </motion.a>

                <div className="flex gap-6 mt-6 text-sm">
                  <a href="https://www.instagram.com/josh63.exe/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#EC4899] transition-colors">
                    Instagram
                  </a>
                  <a href="https://www.linkedin.com/in/vitaleraffaele/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#4ECDC4] transition-colors">
                    LinkedIn
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[#1a1a1a]/10 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#1a1a1a]/40 text-sm">
            © 2026 Raffaele Vitale
          </p>
          <motion.a
            href="#home"
            whileHover={{ y: -2 }}
            className="text-[#1a1a1a]/40 hover:text-[#1a1a1a] text-sm transition-colors"
          >
            Torna su ↑
          </motion.a>
        </div>
      </footer>
    </main>
  );
}

// Kinetic Text Component
function KineticTextInline({
  text,
  colors,
  size = "default"
}: {
  text: string;
  colors: string[];
  size?: "default" | "large";
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sizeClasses = size === "large"
    ? "text-4xl md:text-5xl lg:text-6xl"
    : "text-[5.5vw] sm:text-[5vw] md:text-[4.5vw] lg:text-[4vw] xl:text-[3.5vw]";

  return (
    <div className={`${sizeClasses} font-black tracking-tighter leading-none whitespace-nowrap`}>
      {text.split("").map((letter, i) => {
        const colorIndex = i % colors.length;
        const isSpace = letter === " ";

        return (
          <motion.span
            key={i}
            className={`inline-block cursor-pointer ${isSpace ? "w-[0.3em]" : ""}`}
            style={{
              color: hoveredIndex === i ? colors[colorIndex] : "#1a1a1a",
            }}
            onMouseEnter={() => !isSpace && setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={!isSpace ? {
              y: -8,
              rotate: Math.random() * 10 - 5,
              scale: 1.1,
              color: colors[colorIndex],
            } : {}}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
            }}
          >
            {isSpace ? "\u00A0" : letter}
          </motion.span>
        );
      })}
    </div>
  );
}
