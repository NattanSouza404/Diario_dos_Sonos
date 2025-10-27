import IntervaloSono from "@/models/IntervaloSono";
import { diferencaEntreDatas } from "./Formatador";

export const validarSono = (intervalo: IntervaloSono): void => {
    if (intervalo.horaFim <= intervalo.horaInicio) {
        throw new Error("A hora de fim deve ser maior que a hora de início.");
    }

    const duracao = diferencaEntreDatas(intervalo.horaInicio, intervalo.horaFim);

    if (duracao.horas < 2 || duracao.horas > 14){
        throw new Error("A duração do sono deve estar entre 2h e 14h.")
    }
}