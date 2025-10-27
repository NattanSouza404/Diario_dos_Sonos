class IntervaloSono {
  horaInicio: Date;
  horaFim: Date;

  constructor(horaInicio:Date | string, horaFim:Date | string){
    this.horaInicio = new Date(horaInicio);
    this.horaFim = new Date(horaFim);
  }

}

export default IntervaloSono;