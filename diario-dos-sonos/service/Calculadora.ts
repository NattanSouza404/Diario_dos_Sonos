import IntervaloSono from "@/models/IntervaloSono";
import MediaSono from "@/models/MediaSono";

export class Calculadora {

    calcularMediaMesAtual(intervalos:IntervaloSono[]) : MediaSono {
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

    calcularMediaSemanaAtual(intervalos:IntervaloSono[]) : MediaSono {
        const agora = new Date();
        const primeiroDiaSemana = new Date(agora);
        primeiroDiaSemana.setDate(agora.getDate() - agora.getDay());

        const intervalosDaSemana = intervalos.filter(i => 
            i.horaInicio >= primeiroDiaSemana &&
            i.horaInicio.getMonth() === agora.getMonth() &&
            i.horaInicio.getFullYear() === agora.getFullYear()
        );

        if (intervalosDaSemana.length === 0){
            return {
                horas: 0,
                minutos: 0
            };
        }

        let media = 0;

        for (let i = 0; i < intervalosDaSemana.length; i++) {
            const intervalo = intervalosDaSemana[i];
            const diferenca = intervalo.horaFim.getTime() - intervalo.horaInicio.getTime();
            media += diferenca;
        }

        return {
            horas: Math.floor((media / intervalosDaSemana.length) / (1000 * 60 * 60)),
            minutos: Math.floor(((media / intervalosDaSemana.length) % (1000 * 60 * 60)) / (1000 * 60))
        };
    }
    
}