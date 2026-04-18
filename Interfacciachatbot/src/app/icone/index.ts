import aegisIcon from '../../assets/icone/AEGIS.svg';
import orionIcon from '../../assets/icone/ORION.svg';
import gojiIcon from '../../assets/icone/GOJI.svg';
import ensoIcon from '../../assets/icone/ENSOnuovo.svg';
import lumaIcon from '../../assets/icone/LUMA.svg';
import koraIcon from '../../assets/icone/KORA.svg';
import sonnyIcon from './SONNY.svg';
import talosIcon from './TALOS.svg';
import sentraIcon from './SENTRA.svg';

const defaultIconByAmbitoId: Record<string, string> = {
    aegis: aegisIcon,
    orion: orionIcon,
    goji: gojiIcon,
    enso: ensoIcon,
    luma: lumaIcon,
    sophia: sonnyIcon,
    sonny: sonnyIcon,
    talos: talosIcon,
    sentra: sentraIcon,
    kora: koraIcon,
};

export function getAmbitoIconSrc(ambitoId: string): string | null {
    return defaultIconByAmbitoId[ambitoId] ?? null;
}
