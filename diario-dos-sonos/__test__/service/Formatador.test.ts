import { Formatador } from "@/service/Formatador";

describe('Formatador', () => {
  test('formata corretamente a data', () => {
    const data = new Date('2024-06-15T14:30:45');
    const formatacao = Formatador(data); 

    expect(formatacao).toEqual(
      {
        dia: "15",
        mes: "junho",
        ano: "2024",
        diaSemana: "sábado",

        data: "15/06/2024",

        hora: "14",
        minuto: "30",    
        segundo: "45",

        horario: "14:30:45"
    });
  });
});
