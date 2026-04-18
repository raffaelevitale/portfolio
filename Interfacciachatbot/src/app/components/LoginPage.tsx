import { useState } from 'react';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { motion } from 'motion/react';
import logoImg from 'figma:asset/bd906186d630e4e6091ecee5c5303b2411b68d3d.png';

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Inserisci email e password'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full" style={{ backgroundColor: '#111111', fontFamily: '"Lexend", sans-serif' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[400px] mx-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col items-center mb-8"
        >
          <img src={logoImg} alt="CRXBU" className="h-[32px] w-auto mb-4" />
          <p className="text-[13px] text-[#555]">
            Automazione <span className="text-[#F73C1C] font-semibold">AI</span> progettata per aziende
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-[#1A1A1A] border border-white/[0.06] rounded-2xl p-6 md:p-8 shadow-2xl"
        >
          <h2 className="text-[18px] font-bold text-white mb-1">Accesso aziendale</h2>
          <p className="text-[13px] text-[#666] mb-6">Inserisci le credenziali del workspace per continuare</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#888]">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="luciano@crybu.com"
                className="bg-[#222] text-[#eee] text-[13px] px-3 py-2.5 rounded-lg border border-white/[0.06] outline-none focus:border-[#F73C1C]/40 transition-colors placeholder:text-[#444]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-[#888]">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full bg-[#222] text-[#eee] text-[13px] px-3 py-2.5 rounded-lg border border-white/[0.06] outline-none focus:border-[#F73C1C]/40 transition-colors placeholder:text-[#444] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#aaa] transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded accent-[#F73C1C]" />
                <span className="text-[11px] text-[#888]">Ricordami</span>
              </label>
              <button type="button" className="text-[11px] text-[#F73C1C] hover:text-[#ff5638] font-medium transition-colors">
                Password dimenticata?
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[12px] text-[#F73C1C] bg-[#F73C1C]/[0.06] rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#F73C1C] hover:bg-[#e63518] disabled:bg-[#F73C1C]/60 text-white text-[13px] font-semibold rounded-lg transition-colors shadow-lg shadow-[#F73C1C]/20 mt-1"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={15} />
                  Accedi
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-[11px] text-[#444] mt-6"
        >
          © 2026 CRYBU S.r.l. — Tutti i diritti riservati
        </motion.p>
      </motion.div>
    </div>
  );
}
