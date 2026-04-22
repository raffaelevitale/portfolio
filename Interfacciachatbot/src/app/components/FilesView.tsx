import { useMemo, useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Clock, Trash2, Search, Plus, Play } from 'lucide-react';
import type { Module } from './data';
import { filesPresetsMap } from './data';
import { useTheme } from './ThemeContext';
import { ModuleHero } from './ModuleHero';

type FileItem = { id: string; name: string; size: string; status: 'trained' | 'processing' | 'pending'; date: string; };

const defaultFiles: FileItem[] = [
  { id: '1', name: 'FAQ_Prodotto_v3.pdf', size: '2.4 MB', status: 'trained', date: '02 Apr 2026' },
  { id: '2', name: 'Manuale_Utente.pdf', size: '8.1 MB', status: 'trained', date: '28 Mar 2026' },
  { id: '3', name: 'Policy_Resi_2026.docx', size: '156 KB', status: 'processing', date: '08 Apr 2026' },
  { id: '4', name: 'Listino_Prezzi_Q2.xlsx', size: '340 KB', status: 'pending', date: '09 Apr 2026' },
];

interface FilesViewProps {
  module: Module;
  ambitoName?: string;
  ambitoColor?: string;
}

export function FilesView({ module, ambitoName, ambitoColor }: FilesViewProps) {
  const { t } = useTheme();
  const preset = filesPresetsMap[module.id];
  const seedFiles = useMemo<FileItem[]>(() => {
    if (preset) {
      return preset.files.map((f, i) => ({ id: `seed-${module.id}-${i}`, ...f }));
    }
    return defaultFiles;
  }, [module.id, preset]);

  const [files, setFiles] = useState<FileItem[]>(seedFiles);

  useEffect(() => {
    setFiles(seedFiles);
  }, [seedFiles]);

  const [dragOver, setDragOver] = useState(false);
  const [search, setSearch] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [lastSimulationAt, setLastSimulationAt] = useState<string | null>(null);
  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const statusConfig = {
    trained: { label: 'Addestrato', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', icon: CheckCircle2 },
    processing: { label: 'In elaborazione', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', icon: Clock },
    pending: { label: 'In attesa', color: t('text-[#888]', 'text-[#999]'), bg: t('bg-white/[0.04]', 'bg-black/[0.04]'), icon: Clock },
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const processingCount = files.filter(f => f.status === 'processing').length;
  const trainedCount = files.filter(f => f.status === 'trained').length;

  const addDemoFile = () => {
    const idx = files.length + 1;
    const id = `${Date.now()}-demo-${idx}`;
    setFiles(prev => [{
      id,
      name: `Documento_Demo_${idx}.pdf`,
      size: `${(0.9 + (idx % 5) * 0.3).toFixed(1)} MB`,
      status: 'pending',
      date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }),
    }, ...prev]);
  };

  const simulateProcessing = () => {
    if (simulating) return;
    setSimulating(true);
    setFiles(prev => prev.map(f => f.status === 'pending' ? { ...f, status: 'processing' } : f));

    setTimeout(() => {
      setFiles(prev => prev.map(f => f.status === 'processing' ? { ...f, status: 'trained' } : f));
      setSimulating(false);
      setLastSimulationAt(new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }));
    }, 1100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    Array.from(e.dataTransfer.files).forEach(f => {
      setFiles(prev => [...prev, { id: Date.now().toString() + f.name, name: f.name, size: (f.size / 1024 / 1024).toFixed(1) + ' MB', status: 'pending', date: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }) }]);
    });
  };

  const textMain = t('text-white', 'text-[#111]');
  const textSub = t('text-[#888]', 'text-[#666]');
  const cardBg = t('bg-[#1A1A1A]', 'bg-white');
  const borderCls = t('border-white/[0.04]', 'border-black/[0.06]');
  const searchBg = t('bg-[#151515]', 'bg-[#F5F5F5]');
  const hoverBg = t('hover:bg-white/[0.02]', 'hover:bg-black/[0.02]');

  return (
    <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full p-4 md:p-8 space-y-4 md:space-y-6">
        <ModuleHero
          title={preset?.summaryTitle ?? module.name}
          subtitle={preset?.summaryBlurb ?? module.description}
          ambitoName={ambitoName}
          ambitoColor={ambitoColor}
          statusLabel="Knowledge base attiva"
        >
          <button onClick={simulateProcessing} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold border ${t('border-white/[0.08] text-[#ccc] hover:bg-white/[0.04]', 'border-black/[0.08] text-[#444] hover:bg-black/[0.04]')} transition-colors`}>
            <Play size={12} /> {simulating ? 'Elaborazione...' : 'Simula elaborazione'}
          </button>
          <button onClick={addDemoFile} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold bg-[#F73C1C] hover:bg-[#e63518] text-white transition-colors">
            <Plus size={12} /> File demo
          </button>
        </ModuleHero>

        <div className="grid grid-cols-3 gap-2">
          <div className={`${cardBg} border ${borderCls} rounded-lg px-3 py-2`}>
            <p className={`text-[10px] ${t('text-[#666]', 'text-[#999]')}`}>Addestrati</p>
            <p className={`text-[14px] font-semibold text-[#10B981]`}>{trainedCount}</p>
          </div>
          <div className={`${cardBg} border ${borderCls} rounded-lg px-3 py-2`}>
            <p className={`text-[10px] ${t('text-[#666]', 'text-[#999]')}`}>In elaborazione</p>
            <p className={`text-[14px] font-semibold text-[#F59E0B]`}>{processingCount}</p>
          </div>
          <div className={`${cardBg} border ${borderCls} rounded-lg px-3 py-2`}>
            <p className={`text-[10px] ${t('text-[#666]', 'text-[#999]')}`}>In attesa</p>
            <p className={`text-[14px] font-semibold ${t('text-[#ddd]', 'text-[#444]')}`}>{pendingCount}</p>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-6 md:p-8 flex flex-col items-center gap-3 transition-colors cursor-pointer ${dragOver ? 'border-[#F73C1C] bg-[#F73C1C]/[0.03]' : `${t('border-white/[0.08] hover:border-white/[0.15]', 'border-black/[0.12] hover:border-black/[0.2]')}`}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload size={28} className={t('text-[#555]', 'text-[#bbb]')} />
          <p className={`text-[14px] ${t('text-[#999]', 'text-[#777]')}`}>Trascina i file qui o <span className="text-[#F73C1C] font-medium">sfoglia</span></p>
          <p className={`text-[11px] ${t('text-[#555]', 'text-[#bbb]')}`}>PDF, DOCX, XLSX, TXT — Max 25MB per file</p>
          <input id="file-upload" type="file" className="hidden" multiple />
        </div>

        <div className={`mb-4 rounded-lg border ${borderCls} ${t('bg-[#151515]', 'bg-[#FAFAFA]')} px-3 py-2 text-[11px] ${textSub}`}>
          {simulating
            ? 'Simulazione in corso: i file in attesa vengono processati in modalità dimostrativa.'
            : lastSimulationAt
              ? `Ultima simulazione completata alle ${lastSimulationAt}. Nessuna azione operativa reale è stata eseguita.`
              : 'Aggiungi file demo o avvia una simulazione per mostrare il flusso completo.'}
        </div>

        <div className={`flex items-center gap-2 ${searchBg} rounded-lg px-3 py-2 border ${borderCls} mb-4`}>
          <Search size={13} className={t('text-[#555]', 'text-[#bbb]')} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca file..." className={`bg-transparent text-[12px] ${t('text-[#ccc] placeholder:text-[#444]', 'text-[#333] placeholder:text-[#bbb]')} outline-none flex-1`} />
        </div>
        <div className="flex flex-col gap-2">
          {filtered.map(file => {
            const sc = statusConfig[file.status]; const StatusIcon = sc.icon;
            return (
              <div key={file.id} className={`flex items-center gap-3 ${cardBg} border ${borderCls} rounded-lg px-4 py-3 group ${hoverBg} transition-colors`}>
                <FileText size={18} className={t('text-[#666]', 'text-[#bbb]')} />
                <div className="flex flex-col flex-1 min-w-0">
                  <span className={`text-[13px] font-medium ${t('text-[#eee]', 'text-[#222]')} truncate`}>{file.name}</span>
                  <span className={`text-[11px] ${t('text-[#555]', 'text-[#bbb]')}`} style={{ fontFamily: '"JetBrains Mono", monospace' }}>{file.size} · {file.date}</span>
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${sc.bg}`}>
                  <StatusIcon size={11} className={sc.color} />
                  <span className={`text-[10px] font-medium ${sc.color}`}>{sc.label}</span>
                </div>
                <button onClick={() => setFiles(p => p.filter(f => f.id !== file.id))} className="p-1.5 text-[#555] hover:text-[#F73C1C] transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}