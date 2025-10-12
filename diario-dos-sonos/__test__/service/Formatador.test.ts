import { avancarUmDia, diferencaEntreDatas, Formatador } from "@/service/Formatador";

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

  test('formata corretamente a diferença entre datas', () => {
    const dataInicio = new Date('2024-06-15T14:30:45');
    const dataFim = new Date('2024-06-15T16:45:50');
    const diff = diferencaEntreDatas(dataInicio, dataFim); 

    expect(diff).toEqual(
      {
        horas: 2,
        minutos: 15,
        segundos: 5,
        duracaoEmExtenso: "2h, 15m e 5s"
      });
  });

  test('avança corretamente uma data em um dia', () => {
    const data = new Date('2024-06-15T14:30:45');
    const novaData = avancarUmDia(data);

    expect(novaData.getFullYear()).toBe(2024);
    expect(novaData.getMonth()).toBe(5); // mês 0-based => junho = 5
    expect(novaData.getDate()).toBe(16);
    expect(novaData.getHours()).toBe(14);
  });
});
