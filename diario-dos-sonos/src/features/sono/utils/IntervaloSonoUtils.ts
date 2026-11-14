import IntervaloSono from "@/src/features/sono/domain/models/IntervaloSono";
import { Formatador } from "../../../shared/utils/DataUtils";

export const separarIntervalosPorMes = (intervalosSono: IntervaloSono[]) => {
  const intervalos: Map<string, IntervaloSono[]> = new Map();

  intervalosSono.forEach((intervalo) => {
    const fmt = intervalo.horaFim;
    const chave = `${Formatador(fmt).mes} / ${Formatador(fmt).ano}`;

    if (!intervalos.has(chave)) {
      intervalos.set(chave, []);
    }

    intervalos.get(chave)?.push(intervalo);
  });

  return intervalos;
}