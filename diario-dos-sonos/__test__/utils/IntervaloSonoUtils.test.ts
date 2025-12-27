import IntervaloSono from "@/domain/models/IntervaloSono";
import { separarIntervalosPorMes } from "@/utils/IntervaloSonoUtils";

describe('Validar sono', () => {
  it('deve separar intervalos por mês corretamente', () => {
    const intervalosSono: IntervaloSono[] = [
      {
        horaInicio: new Date('2023-10-01T22:00:00'),
        horaFim: new Date('2023-10-02T06:00:00'),
      },
      {
        horaInicio: new Date('2023-10-15T23:00:00'),
        horaFim: new Date('2023-10-16T07:00:00'),
      },
      {
        horaInicio: new Date('2023-11-01T22:30:00'),
        horaFim: new Date('2023-11-02T06:30:00'),
      },
    ];

    const resultado = separarIntervalosPorMes(intervalosSono);

    expect(resultado.size).toBe(2);
    expect(resultado.get('Outubro / 2023')?.length).toBe(2);
    expect(resultado.get('Novembro / 2023')?.length).toBe(1);
  });
});
