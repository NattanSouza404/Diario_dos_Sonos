import IntervaloSono from "@/models/IntervaloSono";
import { MediaMesSono } from "@/models/MediaMesSono";

export class Calculadora {

    calcularMediaMesAtual(intervalos:IntervaloSono[]) : MediaMesSono {
        const agora = new Date();

        const intervalosDoMes = intervalos.filter(i => 
            i.horaInicio.getMonth() === agora.getMonth() &&
            i.horaInicio.getFullYear() === agora.getFullYear()
        );

        if (intervalosDoMes.length === 0){
            return {
                horas: 0,
                minutos: 0
            };
        }

        let media = 0;

        for (let i = 0; i < intervalosDoMes.length; i++) {
            const intervalo = intervalosDoMes[i];
            const diferenca = intervalo.horaFim.getTime() - intervalo.horaInicio.getTime();
            media += diferenca;
        }

        return {
            horas: Math.floor((media / intervalosDoMes.length) / (1000 * 60 * 60)),
            minutos: Math.floor(((media / intervalosDoMes.length) % (1000 * 60 * 60)) / (1000 * 60))
        };
    }
    
}