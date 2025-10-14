import IntervaloSono from "@/models/IntervaloSono";

export const validarSono = (intervalo: IntervaloSono): void => {
    if (intervalo.horaFim <= intervalo.horaInicio) {
        throw new Error("A hora de fim deve ser maior que a hora de início.");
    }
}