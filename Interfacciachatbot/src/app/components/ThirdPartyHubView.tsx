import { useTheme } from './ThemeContext';

export function ThirdPartyHubView() {
    const { t } = useTheme();

    const panelBg = t('bg-[#141414] border-white/[0.05]', 'bg-[#FAFAFA] border-black/[0.08]');
    const textMain = t('text-white', 'text-[#111]');
    const textSub = t('text-[#888]', 'text-[#666]');

    return (
        <div className="flex flex-col flex-1 h-full min-w-0 overflow-y-auto">
            <div className="max-w-6xl mx-auto w-full p-4 md:p-8">
                <div className={`${panelBg} border rounded-xl p-6 md:p-8 text-center`}>
                    <h1 className={`text-[22px] md:text-[28px] font-bold ${textMain}`}>Terze Parti</h1>
                    <p className={`text-[13px] md:text-[14px] mt-2 ${textSub}`}>
                        Sezione disattivata.
                    </p>
                </div>
            </div>
        </div>
    );
}
