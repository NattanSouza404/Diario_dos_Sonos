import { diferencaEntreDatas } from "@/src/shared/utils/DataUtils";

class IntervaloSono {
  horaInicio: Date;
  horaFim: Date;

  constructor(horaInicio: Date, horaFim: Date){
    if (horaFim <= horaInicio) {
      throw new Error("A hora de fim deve ser maior que a hora de início.");
    }

    const duracao = diferencaEntreDatas(horaInicio, horaFim);

    if (duracao.horas < 2 || duracao.horas > 14){
      throw new Error("A duração do sono deve estar entre 2h e 14h.")
    }
    
    this.horaInicio = new Date(horaInicio);
    this.horaFim = new Date(horaFim);
  }

}

export default IntervaloSono;