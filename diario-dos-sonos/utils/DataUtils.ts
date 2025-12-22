import { primeiraLetraMaiuscula } from "@/utils/FormatadorUtils";

const LOCAL = "pt-BR";
const OPCOES = { timeZone: 'America/Sao_Paulo', hour12: false };

export const Formatador = (data: Date) => {
    return {
        dia:        data.toLocaleString(LOCAL, { ...OPCOES, day: '2-digit' }),
        mes:        primeiraLetraMaiuscula(data.toLocaleString(LOCAL, { ...OPCOES, month: 'long' })),
        ano:        data.toLocaleString(LOCAL, { ...OPCOES, year: 'numeric' }),
        diaSemana:  primeiraLetraMaiuscula(data.toLocaleString(LOCAL, { ...OPCOES, weekday: 'long' })),

        data:       data.toLocaleString(LOCAL).slice(0, 10),

        hora:       data.toLocaleString(LOCAL, { ...OPCOES, hour: '2-digit' }),
        minuto:     data.toLocaleString(LOCAL, { ...OPCOES, minute: '2-digit' }),
        segundo:    data.toLocaleString(LOCAL, { ...OPCOES, second: '2-digit' }),

        horario:    data.toLocaleString(LOCAL).slice(12, 20)
    }
}

export const diferencaEntreDatas = (inicio: Date, fim: Date) => {
  const diffMs = fim.getTime() - inicio.getTime();
  const horas = Math.floor(diffMs / (1000 * 60 * 60));
  const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diffMs % (1000 * 60)) / 1000);

  const duracaoEmExtenso = `${horas}h, ${minutos}m e ${segundos}s`;

  return { horas, minutos, segundos, duracaoEmExtenso };
}

export const avancarUmDia = (data: Date) : Date => {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + 1);
  return novaData;
}

export const retrocederUmDia = (data: Date) : Date => {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() - 1);
  return novaData;
}