import IntervaloSono from "@/models/IntervaloSono";
import { validarSono } from "@/service/ValidadorSono";

describe('Validar sono', () => {
    it('deve lançar um erro se horaFim for menor ou igual a horaInicio', () => {
        const intervalo: IntervaloSono = {
            horaInicio: new Date('2023-10-01T22:00:00'),
            horaFim: new Date('2023-10-01T21:00:00'),
        };

        expect(() => validarSono(intervalo)).
            toThrow("A hora de fim deve ser maior que a hora de início.");
    });

    it('não deve lançar erro se horaFim for maior que horaInicio', () => {
        const intervalo: IntervaloSono = {
            horaInicio: new Date('2023-10-01T22:00:00'),
            horaFim: new Date('2023-10-02T06:00:00'),
        };

        expect(() => validarSono(intervalo)).not.toThrow();
    });
});