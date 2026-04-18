import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Clock, Users, CheckCircle2, FileText, Plus, Eye, Download, Trash2, X, ArrowLeft, Printer, Share2, Calendar, ChevronRight } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Module } from './data';
import { useTheme } from './ThemeContext';

interface DashboardViewProps { module: Module; ambitoName?: string; }

type Report = {
  id: string;
  title: string;
  type: 'settimanale' | 'mensile' | 'trimestrale' | 'personalizzato';
  createdAt: string;
  status: 'completato' | 'in_generazione';
  period: string;
};

type ActivityItem = {
  action: string;
  detail: string;
  time: string;
};

// ---- Metrics per module ----
const metricsMap: Record<string, { label: string; value: string; change: string; up: boolean; icon: React.ElementType }[]> = {
  'ven-gestione-pipeline': [
    { label: 'Pipeline totale', value: '€ 284.500', change: '+12%', up: true, icon: BarChart3 },
    { label: 'Deal in corso', value: '23', change: '+3', up: true, icon: Users },
    { label: 'Tasso conversione', value: '34%', change: '+5%', up: true, icon: CheckCircle2 },
    { label: 'Tempo medio chiusura', value: '18 gg', change: '-2 gg', up: true, icon: Clock },
  ],
  'prod-controllo': [
    { label: 'Score qualità', value: '94.2%', change: '+1.8%', up: true, icon: CheckCircle2 },
    { label: 'Difetti rilevati', value: '12', change: '-23%', up: true, icon: BarChart3 },
    { label: 'Tempo medio fix', value: '4.2h', change: '+0.3h', up: false, icon: Clock },
    { label: 'Test superati', value: '847/862', change: '+15', up: true, icon: CheckCircle2 },
  ],
  'ass-report': [
    { label: 'Ticket risolti', value: '142', change: '+18%', up: true, icon: CheckCircle2 },
    { label: 'Tempo medio risposta', value: '2.3h', change: '-15min', up: true, icon: Clock },
    { label: 'Soddisfazione', value: '4.6/5', change: '+0.3', up: true, icon: TrendingUp },
    { label: 'Ticket aperti', value: '28', change: '-5', up: true, icon: BarChart3 },
  ],
  'dir-forecast': [
    { label: 'Revenue prevista', value: '€ 1.2M', change: '+8%', up: true, icon: BarChart3 },
    { label: 'Margine operativo', value: '22%', change: '+2%', up: true, icon: TrendingUp },
    { label: 'Costi stimati', value: '€ 936K', change: '-3%', up: true, icon: CheckCircle2 },
    { label: 'Crescita YoY', value: '+15%', change: '+3%', up: true, icon: TrendingUp },
  ],
  default: [
    { label: 'Moduli attivi', value: '8', change: '+2', up: true, icon: BarChart3 },
    { label: 'Automazioni', value: '142', change: '+18%', up: true, icon: CheckCircle2 },
    { label: 'Tempo risparmiato', value: '36h', change: '+12%', up: true, icon: Clock },
    { label: 'Utenti attivi', value: '24', change: '+3', up: true, icon: Users },
  ],
};

// ---- Report chart data ----
const areaData = [
  { name: 'Lun', ticket: 24, risolti: 20 },
  { name: 'Mar', ticket: 31, risolti: 28 },
  { name: 'Mer', ticket: 28, risolti: 26 },
  { name: 'Gio', ticket: 35, risolti: 30 },
  { name: 'Ven', ticket: 42, risolti: 38 },
  { name: 'Sab', ticket: 18, risolti: 17 },
  { name: 'Dom', ticket: 12, risolti: 11 },
];

const pieData = [
  { name: 'Tecnico', value: 38, color: '#F73C1C' },
  { name: 'Commerciale', value: 25, color: '#EC4899' },
  { name: 'Billing', value: 20, color: '#F59E0B' },
  { name: 'Altro', value: 17, color: '#8B5CF6' },
];

const barData = [
  { name: 'Gen', valore: 65 }, { name: 'Feb', valore: 72 }, { name: 'Mar', valore: 84 },
  { name: 'Apr', valore: 91 }, { name: 'Mag', valore: 78 }, { name: 'Giu', valore: 95 },
];

const lineData = [
  { name: 'Sett 1', soddisfazione: 4.2, target: 4.5 },
  { name: 'Sett 2', soddisfazione: 4.4, target: 4.5 },
  { name: 'Sett 3', soddisfazione: 4.3, target: 4.5 },
  { name: 'Sett 4', soddisfazione: 4.6, target: 4.5 },
  { name: 'Sett 5', soddisfazione: 4.5, target: 4.5 },
  { name: 'Sett 6', soddisfazione: 4.7, target: 4.5 },
];

const tableData = [
  { agente: 'Marco R.', ticket: 42, risolti: 38, tempo: '1.8h', rating: '4.8/5' },
  { agente: 'Sara L.', ticket: 35, risolti: 33, tempo: '2.1h', rating: '4.7/5' },
  { agente: 'Luca B.', ticket: 31, risolti: 28, tempo: '2.5h', rating: '4.5/5' },
  { agente: 'Anna M.', ticket: 28, risolti: 26, tempo: '1.9h', rating: '4.6/5' },
  { agente: 'Paolo D.', ticket: 24, risolti: 20, tempo: '3.1h', rating: '4.3/5' },
];

const initialReports: Report[] = [
  { id: 'r1', title: 'Report Settimanale — Sett. 14', type: 'settimanale', createdAt: '07 Apr 2026, 09:00', status: 'completato', period: '31 Mar – 06 Apr 2026' },
  { id: 'r2', title: 'Report Mensile — Marzo 2026', type: 'mensile', createdAt: '01 Apr 2026, 08:30', status: 'completato', period: '01 Mar – 31 Mar 2026' },
  { id: 'r3', title: 'Report Trimestrale — Q1 2026', type: 'trimestrale', createdAt: '01 Apr 2026, 10:00', status: 'completato', period: '01 Gen – 31 Mar 2026' },
];

const initialMainChartData = [35, 52, 48, 61, 55, 72, 68, 84, 78, 91, 85, 95];

const initialActivityItems: ActivityItem[] = [
  { action: 'Report generato', detail: 'Performance mensile Marzo 2026', time: '2 ore fa' },
  { action: 'Soglia superata', detail: 'Tasso conversione > 30% raggiunto', time: '5 ore fa' },
  { action: 'Nuovo dato', detail: 'Aggiornamento metriche in tempo reale', time: '1 giorno fa' },
];

export function DashboardView({ module, ambitoName }: DashboardViewProps) {
  const { t } = useTheme();
  const metrics = metricsMap[module.id] || metricsMap.default;
  const [chartData, setChartData] = useState<number[]>(initialMainChartData);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>(initialActivityItems);
  const [demoLive, setDemoLive] = useState(false);
  const maxVal = Math.max(...chartData, 1);

  const [reports, setReports] = useState<Report[]>(initialReports);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newReportType, setNewReportType] = useState<Report['type']>('settimanale');
  const [activeChartPeriod, setActiveChartPeriod] = useState('12M');

  useEffect(() => {
    setDemoLive(false);
    setChartData(initialMainChartData);
    setActivityFeed(initialActivityItems);
  }, [module.id]);

  useEffect(() => {
    if (!demoLive) return;

    const demoActivityPool: Omit<ActivityItem, 'time'>[] = [
      { action: 'Sync completata', detail: 'Flusso dati consolidato su dashboard dimostrativa' },
      { action: 'Anomalia rilevata', detail: 'Scostamento lieve intercettato e segnalato in tempo reale' },
      { action: 'Regola applicata', detail: 'Priorità dinamica aggiornata sul cluster operativo' },
      { action: 'Insight AI', detail: 'Trend settimanale confermato con confidenza alta' },
    ];

    const intervalId = window.setInterval(() => {
      setChartData(prev => {
        const last = prev[prev.length - 1] ?? 60;
        const delta = Math.round((Math.random() - 0.5) * 14);
        const nextPoint = Math.min(98, Math.max(18, last + delta));
        return [...prev.slice(1), nextPoint];
      });

      const randomActivity = demoActivityPool[Math.floor(Math.random() * demoActivityPool.length)];
      setActivityFeed(prev => [
        { ...randomActivity, time: 'adesso' },
        ...prev.slice(0, 5),
      ]);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [demoLive]);

  const cardBg = t('bg-[#1A1A1A] border-white/[0.04]', 'bg-white border-black/[0.06]');
  const textMain = t('text-white', 'text-[#111]');
  const textSub = t('text-[#888]', 'text-[#666]');
  const textMuted = t('text-[#666]', 'text-[#999]');
  const textTime = t('text-[#555]', 'text-[#bbb]');
  const borderCls = t('border-white/[0.03]', 'border-black/[0.04]');
  const tabActive = t('bg-white/[0.06] text-white', 'bg-black/[0.06] text-[#111]');
  const tabInactive = t('text-[#666] hover:text-white', 'text-[#999] hover:text-[#333]');
  const hoverBg = t('hover:bg-white/[0.02]', 'hover:bg-black/[0.02]');
  const modalBg = t('bg-[#1E1E1E]', 'bg-white');
  const modalBorder = t('border-white/[0.1]', 'border-black/[0.1]');
  const inputBg = t('bg-[#222] border-white/[0.08]', 'bg-[#F5F5F5] border-black/[0.08]');
  const inputText = t('text-[#eee]', 'text-[#222]');
  const tooltipBg = t('#1E1E1E', '#FFFFFF');
  const tooltipBorder = t('#333', '#e0e0e0');
  const tooltipText = t('#eee', '#222');
  const gridColor = t('#ffffff10', '#00000010');
  const axisColor = t('#555', '#bbb');
  const tableBg = t('bg-[#151515]', 'bg-[#FAFAFA]');
  const tableHeaderBg = t('bg-[#1E1E1E]', 'bg-[#F0F0F0]');
  const tableRowBorder = t('border-white/[0.04]', 'border-black/[0.04]');
  const reportCardBg = t('bg-[#151515] border-white/[0.04]', 'bg-[#FAFAFA] border-black/[0.06]');

  const generateReport = () => {
    const typeNames = { settimanale: 'Settimanale', mensile: 'Mensile', trimestrale: 'Trimestrale', personalizzato: 'Personalizzato' };
    const newReport: Report = {
      id: 'r' + Date.now(),
      title: `Report ${typeNames[newReportType]} — ${new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}`,
      type: newReportType,
      createdAt: new Date().toLocaleString('it-IT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'in_generazione',
      period: 'Periodo corrente',
    };
    setReports(prev => [newReport, ...prev]);
    setShowNewReportModal(false);
    setTimeout(() => {
      setReports(prev => prev.map(r => r.id === newReport.id ? { ...r, status: 'completato' as const } : r));
    }, 2500);
  };

  // ---- REPORT VIEWER ----
  if (viewingReport) {
    return (
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
        {/* Breadcrumb bar */}
        <div className={`flex items-center gap-1.5 px-3 md:px-6 py-2 border-b ${t('border-white/[0.04]', 'border-black/[0.04]')} shrink-0 overflow-x-auto`} style={{ backgroundColor: t('#151515', '#FAFAFA') }}>
          {ambitoName && (
            <>
              <span className={`text-[11px] ${t('text-[#555]', 'text-[#aaa]')} shrink-0`}>{ambitoName}</span>
              <ChevronRight size={10} className={t('text-[#444]', 'text-[#ccc]')} />
            </>
          )}
          <button onClick={() => setViewingReport(null)} className={`text-[11px] ${t('text-[#888] hover:text-white', 'text-[#777] hover:text-[#111]')} transition-colors shrink-0`}>
            {module.name}
          </button>
          <ChevronRight size={10} className={t('text-[#444]', 'text-[#ccc]')} />
          <span className={`text-[11px] font-semibold ${t('text-white', 'text-[#111]')} truncate`}>{viewingReport.title}</span>
        </div>

        {/* Report header bar */}
        <div className={`flex items-center justify-between px-3 md:px-6 py-3 md:py-4 border-b ${t('border-white/[0.06]', 'border-black/[0.08]')} shrink-0`} style={{ backgroundColor: t('#1A1A1A', '#FFFFFF') }}>
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <button onClick={() => setViewingReport(null)} className={`p-1.5 rounded-md ${t('text-[#666] hover:text-white hover:bg-white/[0.04]', 'text-[#999] hover:text-[#222] hover:bg-black/[0.04]')} transition-colors shrink-0`}>
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h2 className={`text-[13px] md:text-[15px] font-bold ${textMain} truncate`}>{viewingReport.title}</h2>
              <p className={`text-[10px] md:text-[11px] ${textMuted} truncate`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>{viewingReport.period}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
            <button className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] ${t('text-[#888] hover:text-white border-white/[0.06] hover:bg-white/[0.04]', 'text-[#777] hover:text-[#222] border-black/[0.08] hover:bg-black/[0.04]')} border transition-colors`}>
              <Share2 size={13} /> Condividi
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] md:text-[12px] font-semibold bg-[#F73C1C] hover:bg-[#e63518] text-white transition-colors">
              <Download size={13} /> <span className="hidden sm:inline">Esporta</span> PDF
            </button>
          </div>
        </div>

        {/* Report content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">

            {/* Summary Section */}
            <div className={`${cardBg} border rounded-xl p-6`}>
              <h3 className={`text-[15px] font-bold ${textMain} mb-1`}>Riepilogo Esecutivo</h3>
              <p className={`text-[13px] ${textSub} leading-relaxed mb-5`}>
                Nel periodo analizzato, il team ha gestito <strong className={textMain}>190 ticket</strong> con un tasso di risoluzione del <strong className="text-[#10B981]">91%</strong>.
                Il tempo medio di prima risposta è sceso a <strong className={textMain}>2.3 ore</strong> (−15 min rispetto al periodo precedente).
                La soddisfazione del cliente è salita a <strong className="text-[#10B981]">4.6/5</strong>, superando il target di 4.5.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Ticket totali', value: '190', color: 'text-[#EC4899]' },
                  { label: 'Risolti', value: '173 (91%)', color: 'text-[#10B981]' },
                  { label: 'Tempo medio', value: '2.3h', color: 'text-[#F59E0B]' },
                  { label: 'CSAT', value: '4.6/5', color: 'text-[#8B5CF6]' },
                ].map(s => (
                  <div key={s.label} className={`${reportCardBg} border rounded-lg p-4 text-center`}>
                    <div className={`text-[22px] font-bold ${s.color}`}>{s.value}</div>
                    <div className={`text-[11px] ${textMuted} mt-1`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Area chart: Volume ticket */}
            <div className={`${cardBg} border rounded-xl p-6`}>
              <h3 className={`text-[14px] font-bold ${textMain} mb-5`}>Volume Ticket — Ultima Settimana</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={areaData}>
                  <defs>
                    <linearGradient id={`gradTicket-${viewingReport.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F73C1C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F73C1C" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id={`gradRisolti-${viewingReport.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 10, fontSize: 12, color: tooltipText, fontFamily: '"Lexend", sans-serif' }} />
                  <Legend wrapperStyle={{ fontSize: 11, fontFamily: '"Lexend", sans-serif' }} />
                  <Area type="monotone" dataKey="ticket" name="Ricevuti" stroke="#F73C1C" fill={`url(#gradTicket-${viewingReport.id})`} strokeWidth={2} />
                  <Area type="monotone" dataKey="risolti" name="Risolti" stroke="#10B981" fill={`url(#gradRisolti-${viewingReport.id})`} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Two-column: Pie + Line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Pie chart: Categories */}
              <div className={`${cardBg} border rounded-xl p-6`}>
                <h3 className={`text-[14px] font-bold ${textMain} mb-5`}>Distribuzione per Categoria</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 10, fontSize: 12, color: tooltipText, fontFamily: '"Lexend", sans-serif' }} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: '"Lexend", sans-serif' }} formatter={(value) => <span style={{ color: axisColor }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Line chart: CSAT */}
              <div className={`${cardBg} border rounded-xl p-6`}>
                <h3 className={`text-[14px] font-bold ${textMain} mb-5`}>Trend Soddisfazione Cliente</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={lineData}>
                    <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[3.5, 5]} tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 10, fontSize: 12, color: tooltipText, fontFamily: '"Lexend", sans-serif' }} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: '"Lexend", sans-serif' }} />
                    <Line type="monotone" dataKey="soddisfazione" name="CSAT" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: '#8B5CF6', r: 4 }} />
                    <Line type="monotone" dataKey="target" name="Target" stroke="#F73C1C" strokeWidth={1.5} strokeDasharray="6 3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar chart: Performance mensile */}
            <div className={`${cardBg} border rounded-xl p-6`}>
              <h3 className={`text-[14px] font-bold ${textMain} mb-5`}>Ticket Risolti per Mese</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 10, fontSize: 12, color: tooltipText, fontFamily: '"Lexend", sans-serif' }} />
                  <Bar dataKey="valore" name="Ticket risolti" fill="#F73C1C" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table: Performance agenti */}
            <div className={`${cardBg} border rounded-xl overflow-hidden`}>
              <div className="px-6 py-4">
                <h3 className={`text-[14px] font-bold ${textMain}`}>Performance Agenti</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={tableHeaderBg}>
                      {['Agente', 'Ticket', 'Risolti', 'Tempo Medio', 'Rating'].map(h => (
                        <th key={h} className={`px-6 py-3 text-left text-[11px] font-semibold ${textMuted} uppercase tracking-wider`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, i) => (
                      <tr key={i} className={`border-t ${tableRowBorder} ${hoverBg} transition-colors`}>
                        <td className={`px-6 py-3.5 text-[13px] font-medium ${textMain}`}>{row.agente}</td>
                        <td className={`px-6 py-3.5 text-[13px] ${textSub}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>{row.ticket}</td>
                        <td className="px-6 py-3.5 text-[13px]">
                          <span className="text-[#10B981] font-medium" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{row.risolti}</span>
                          <span className={`text-[11px] ${textMuted} ml-1`}>({Math.round(row.risolti / row.ticket * 100)}%)</span>
                        </td>
                        <td className={`px-6 py-3.5 text-[13px] ${textSub}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>{row.tempo}</td>
                        <td className="px-6 py-3.5">
                          <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${parseFloat(row.rating) >= 4.6 ? 'bg-[#10B981]/10 text-[#10B981]' :
                              parseFloat(row.rating) >= 4.4 ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                                'bg-[#F73C1C]/10 text-[#F73C1C]'
                            }`}>{row.rating}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Insights section */}
            <div className={`${cardBg} border rounded-xl p-6`}>
              <h3 className={`text-[14px] font-bold ${textMain} mb-4`}>Insight e Raccomandazioni AI</h3>
              <div className="flex flex-col gap-3">
                {[
                  { emoji: '🎯', title: 'Obiettivo CSAT raggiunto', desc: 'Il punteggio di soddisfazione ha superato il target di 4.5. Mantenere la formazione attuale sugli agenti.' },
                  { emoji: '⚠️', title: 'Picco ticket il venerdì', desc: 'Il venerdì registra il 22% in più di ticket. Consigliato aumentare la copertura del team nelle ore 14-18.' },
                  { emoji: '💡', title: 'Categoria "Tecnico" dominante', desc: 'Il 38% dei ticket è di natura tecnica. Valutare una FAQ dedicata per ridurre il volume del 15-20%.' },
                  { emoji: '📈', title: 'Trend positivo', desc: 'Il tasso di risoluzione è in costante crescita (+5% negli ultimi 3 mesi). L\'automazione sta dando i risultati attesi.' },
                ].map((insight, i) => (
                  <div key={i} className={`flex gap-3 p-4 rounded-lg ${reportCardBg} border`}>
                    <span className="text-[18px] shrink-0">{insight.emoji}</span>
                    <div>
                      <p className={`text-[13px] font-semibold ${textMain}`}>{insight.title}</p>
                      <p className={`text-[12px] ${textSub} mt-0.5 leading-relaxed`}>{insight.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- MAIN DASHBOARD VIEW ----
  return (
    <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full p-4 md:p-8">
        <div className="flex items-center justify-between mb-6 md:mb-8 gap-3">
          <div className="min-w-0">
            <h2 className={`text-[12px] md:text-[13px] font-semibold ${textMain}`}>{module.name}</h2>
            <p className={`text-[11px] md:text-[12px] ${textSub} mt-1 truncate`}>{module.description}</p>
          </div>
          <button
            onClick={() => setShowNewReportModal(true)}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 bg-[#F73C1C] hover:bg-[#e63518] text-white text-[12px] md:text-[13px] font-semibold rounded-lg transition-colors shadow-lg shadow-[#F73C1C]/20 shrink-0 whitespace-nowrap"
          >
            <Plus size={15} /> <span className="hidden sm:inline">Genera</span> Report
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {metrics.map(m => {
            const Icon = m.icon;
            return (
              <div key={m.label} className={`${cardBg} border rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon size={16} className={textMuted} />
                  <div className={`flex items-center gap-1 text-[11px] font-medium ${m.up ? 'text-[#10B981]' : 'text-[#F73C1C]'}`}>
                    {m.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{m.change}
                  </div>
                </div>
                <div className={`text-[22px] font-bold ${textMain}`}>{m.value}</div>
                <div className={`text-[11px] ${textMuted} mt-1`}>{m.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main chart */}
        <div className={`${cardBg} border rounded-xl p-4 md:p-6 mb-6 md:mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-[14px] font-bold ${textMain}`}>Andamento ultimi 12 mesi</h3>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setDemoLive(v => !v)}
                className={`text-[11px] px-2.5 py-1 rounded-md transition-colors font-semibold ${demoLive ? 'bg-[#10B981]/15 text-[#10B981]' : t('bg-white/[0.04] text-[#888] hover:text-white', 'bg-black/[0.06] text-[#777] hover:text-[#111]')}`}
              >
                {demoLive ? 'Demo live ON' : 'Avvia demo live'}
              </button>
              {['7G', '30G', '12M'].map(p => (
                <button key={p} onClick={() => setActiveChartPeriod(p)} className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${p === activeChartPeriod ? `${tabActive} font-semibold` : tabInactive}`}>{p}</button>
              ))}
            </div>
          </div>
          <div className="flex items-end gap-[6px] h-[160px]">
            {chartData.map((val, i) => {
              const monthLabels = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-md bg-gradient-to-t from-[#F73C1C]/60 to-[#F73C1C] transition-all hover:from-[#F73C1C]/80 hover:to-[#ff5638] cursor-pointer" style={{ height: `${(val / maxVal) * 140}px` }} />
                  <span className={`text-[9px] ${textTime}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    {monthLabels[i][0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generated Reports */}
        <div className={`${cardBg} border rounded-xl p-4 md:p-6 mb-6 md:mb-8`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-[14px] font-bold ${textMain}`}>Report Generati</h3>
            <span className={`text-[12px] ${textMuted}`}>{reports.length} report</span>
          </div>
          <div className="flex flex-col gap-3">
            {reports.map(report => (
              <div key={report.id} className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl ${reportCardBg} border group transition-colors ${hoverBg}`}>
                <div className={`flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-lg shrink-0 ${report.status === 'completato' ? 'bg-[#10B981]/10' : 'bg-[#F59E0B]/10'}`}>
                  <FileText size={16} className={report.status === 'completato' ? 'text-[#10B981]' : 'text-[#F59E0B]'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] md:text-[13px] font-semibold ${textMain} truncate`}>{report.title}</p>
                  <div className="flex items-center gap-2 md:gap-3 mt-1 flex-wrap">
                    <span className={`text-[10px] md:text-[11px] ${textMuted}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                      <Calendar size={10} className="inline mr-1" />{report.createdAt}
                    </span>
                    <span className={`text-[9px] md:text-[10px] font-medium px-2 py-0.5 rounded-full ${report.type === 'settimanale' ? 'bg-[#EC4899]/10 text-[#EC4899]' :
                        report.type === 'mensile' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' :
                          report.type === 'trimestrale' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                            'bg-[#10B981]/10 text-[#10B981]'
                      }`}>{report.type}</span>
                    {report.status === 'in_generazione' && (
                      <span className="text-[10px] font-medium text-[#F59E0B] flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" /> Generazione in corso...
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  {report.status === 'completato' && (
                    <>
                      <button onClick={() => setViewingReport(report)} className={`p-2 rounded-lg ${t('text-[#888] hover:text-white hover:bg-white/[0.06]', 'text-[#999] hover:text-[#222] hover:bg-black/[0.06]')} transition-colors`} title="Visualizza">
                        <Eye size={15} />
                      </button>
                      <button className={`p-2 rounded-lg ${t('text-[#888] hover:text-white hover:bg-white/[0.06]', 'text-[#999] hover:text-[#222] hover:bg-black/[0.06]')} transition-colors`} title="Scarica">
                        <Download size={15} />
                      </button>
                    </>
                  )}
                  <button onClick={() => setReports(prev => prev.filter(r => r.id !== report.id))} className="p-2 rounded-lg text-[#555] hover:text-[#F73C1C] hover:bg-[#F73C1C]/[0.06] transition-colors" title="Elimina">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="text-center py-8">
                <FileText size={32} className={textMuted} />
                <p className={`text-[13px] ${textMuted} mt-3`}>Nessun report generato</p>
                <p className={`text-[12px] ${textTime} mt-1`}>Clicca "Genera Report" per crearne uno</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity */}
        <div className={`${cardBg} border rounded-xl p-4 md:p-6`}>
          <h3 className={`text-[14px] font-bold ${textMain} mb-4`}>Attività recenti</h3>
          <div className="flex flex-col gap-3">
            {activityFeed.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 py-2 border-b ${borderCls} last:border-0`}>
                <div className="w-2 h-2 rounded-full bg-[#F73C1C] shrink-0" />
                <div className="flex-1">
                  <span className={`text-[13px] ${t('text-[#ddd]', 'text-[#222]')} font-medium`}>{item.action}</span>
                  <span className={`text-[12px] ${t('text-[#777]', 'text-[#888]')} ml-2`}>{item.detail}</span>
                </div>
                <span className={`text-[10px] ${textTime} shrink-0`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Report Modal */}
      {showNewReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-[420px] ${modalBg} border ${modalBorder} rounded-2xl shadow-2xl overflow-hidden`} style={{ fontFamily: '"Lexend", sans-serif' }}>
            <div className="h-[3px] bg-gradient-to-r from-[#F73C1C] to-[#F73C1C]/40" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className={`text-[16px] font-bold ${textMain}`}>Genera Nuovo Report</h3>
                <button onClick={() => setShowNewReportModal(false)} className={`${t('text-[#555] hover:text-white', 'text-[#bbb] hover:text-[#333]')} transition-colors`}>
                  <X size={18} />
                </button>
              </div>

              <p className={`text-[13px] ${textSub} mb-5`}>Seleziona il tipo di report da generare. Il sistema raccoglierà automaticamente i dati del periodo.</p>

              <div className="flex flex-col gap-2 mb-6">
                {([
                  { value: 'settimanale' as const, label: 'Settimanale', desc: 'Ultimi 7 giorni', color: '#EC4899' },
                  { value: 'mensile' as const, label: 'Mensile', desc: 'Ultimo mese completo', color: '#8B5CF6' },
                  { value: 'trimestrale' as const, label: 'Trimestrale', desc: 'Ultimo trimestre', color: '#F59E0B' },
                  { value: 'personalizzato' as const, label: 'Personalizzato', desc: 'Seleziona periodo manualmente', color: '#10B981' },
                ]).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setNewReportType(opt.value)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${newReportType === opt.value
                        ? `border-[#F73C1C] ${t('bg-[#F73C1C]/[0.04]', 'bg-[#F73C1C]/[0.03]')}`
                        : `${t('border-white/[0.06] hover:border-white/[0.12]', 'border-black/[0.06] hover:border-black/[0.12]')}`
                      }`}
                  >
                    <div className="w-3 h-3 rounded-full border-2 shrink-0" style={{ borderColor: newReportType === opt.value ? '#F73C1C' : t('#444', '#ccc'), backgroundColor: newReportType === opt.value ? '#F73C1C' : 'transparent' }} />
                    <div className="flex-1">
                      <p className={`text-[13px] font-semibold ${textMain}`}>{opt.label}</p>
                      <p className={`text-[11px] ${textMuted}`}>{opt.desc}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowNewReportModal(false)} className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium border ${t('border-white/[0.08] text-[#ccc] hover:bg-white/[0.04]', 'border-black/[0.08] text-[#666] hover:bg-black/[0.04]')} transition-colors`}>
                  Annulla
                </button>
                <button onClick={generateReport} className="flex-1 py-2.5 bg-[#F73C1C] hover:bg-[#e63518] text-white text-[13px] font-semibold rounded-lg transition-colors shadow-lg shadow-[#F73C1C]/20">
                  Genera Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}