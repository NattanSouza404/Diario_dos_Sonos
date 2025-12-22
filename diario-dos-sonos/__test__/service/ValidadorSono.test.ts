import IntervaloSono from "@/domain/models/IntervaloSono";
import { validarSono } from "@/domain/validator/ValidadorSono";

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

    it('deve lançar um erro se a duração do sono for menor que 2 horas', () => {
        const intervalo: IntervaloSono = {
            horaInicio: new Date('2023-10-01T22:00:00'),
            horaFim: new Date('2023-10-01T23:00:00'),
        };

        expect(() => validarSono(intervalo)).
            toThrow("A duração do sono deve estar entre 2h e 14h.");
    });

    it('deve lançar um erro se a duração do sono for maior que 14 horas', () => {
        const intervalo: IntervaloSono = {
            horaInicio: new Date('2023-10-01T22:00:00'),
            horaFim: new Date('2023-10-02T13:00:00'),
        };

        expect(() => validarSono(intervalo)).
            toThrow("A duração do sono deve estar entre 2h e 14h.");
    });

    it('não deve lançar erro se a duração do sono estiver entre 2h e 14h', () => {
        const intervalo: IntervaloSono = {
            horaInicio: new Date('2023-10-01T22:00:00'),
            horaFim: new Date('2023-10-02T08:00:00'),
        };

        expect(() => validarSono(intervalo)).not.toThrow();
    });
});