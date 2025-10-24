import IntervaloSono from "@/models/IntervaloSono";
import { MediaMesSono } from "@/models/MediaMesSono";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chaves = {
    INTERVALOS_SONO: "intervalosSono",
    SONO_IS_ATIVO: "sonoIsAtivo",
    ULTIMA_MARCACAO: "ultimaMarcacao",
    MEDIA_MES: "mediaMes"
}

export default class ArmazenamentoLocal {

    // TODO: refatorar inicialização do armazenamento

    async getIntervalos(): Promise<IntervaloSono[]> {
        let intervalos = await AsyncStorage.getItem(Chaves.INTERVALOS_SONO);
    
        if (!intervalos || intervalos === 'undefined'){
            intervalos = await this.inicializar(Chaves.INTERVALOS_SONO);
        }

        const parsed = JSON.parse(intervalos) as {
            horaInicio: string;
            horaFim: string 
        }[];

        return parsed.map(i =>
            new IntervaloSono(new Date(i.horaInicio), new Date(i.horaFim))
        );
    }

    async getSonoIsAtivo(): Promise<boolean> {
        let ativado = await AsyncStorage.getItem(Chaves.SONO_IS_ATIVO);

        if (!ativado || ativado === 'undefined'){
            ativado = await this.inicializar(Chaves.SONO_IS_ATIVO);
        }

        return ativado === 'true' ? true : false;
    }

    async setSonoIsAtivo(ativado: boolean): Promise<void> {
        AsyncStorage.setItem(Chaves.SONO_IS_ATIVO, JSON.stringify(ativado));
    }

    async getUltimaMarcacao(): Promise<Date> {
        let ultimaMarcacao = await AsyncStorage.getItem(Chaves.ULTIMA_MARCACAO);

        if (!ultimaMarcacao || ultimaMarcacao === 'undefined'){
            ultimaMarcacao = await this.inicializar(Chaves.ULTIMA_MARCACAO);
        }

        return new Date(ultimaMarcacao);
    }

    async setUltimaMarcacao(date: Date): Promise<void> {
        AsyncStorage.setItem(Chaves.ULTIMA_MARCACAO, date.toISOString());
    }

    async setIntervalosSono(intervalos: IntervaloSono[]): Promise<void> {
        const intervalosOrdenados = intervalos.sort(
            (a, b) => b.horaFim.getTime() - a.horaFim.getTime()
        );

        AsyncStorage.setItem(Chaves.INTERVALOS_SONO, JSON.stringify(intervalosOrdenados));
    }

    async getMediaMes(): Promise<MediaMesSono> {
        let media = await AsyncStorage.getItem(Chaves.MEDIA_MES);

        if (!media || media === 'undefined'){
            media = await this.inicializar(Chaves.MEDIA_MES);
        }

        return JSON.parse(media) as MediaMesSono;
    }

    async setMediasMes(media:MediaMesSono){
        AsyncStorage.setItem(Chaves.MEDIA_MES, JSON.stringify(media));
    }

    private async inicializar(chave:string): Promise<string> {

        switch (chave){
            case Chaves.INTERVALOS_SONO:
                const intervalosPadrao: IntervaloSono[] = [];

                await AsyncStorage.setItem(
                    Chaves.INTERVALOS_SONO, 
                    JSON.stringify(intervalosPadrao as IntervaloSono[])  
                );

                return JSON.stringify(intervalosPadrao);

            case Chaves.MEDIA_MES:
                const mediaPadrao:MediaMesSono = {
                    horas: 0, minutos: 0
                }

                AsyncStorage.setItem(Chaves.MEDIA_MES, JSON.stringify(mediaPadrao));

                return JSON.stringify(mediaPadrao);

            case Chaves.SONO_IS_ATIVO:
                const ativadoPadrao = false;

                await AsyncStorage.setItem(
                    Chaves.SONO_IS_ATIVO,
                    JSON.stringify(ativadoPadrao)
                );

                return JSON.stringify(ativadoPadrao);

            case Chaves.ULTIMA_MARCACAO:
                const ultimaMarcacaoPadrao = new Date().toISOString();  
                AsyncStorage.setItem(Chaves.ULTIMA_MARCACAO, ultimaMarcacaoPadrao);
                
                return JSON.stringify(ultimaMarcacaoPadrao);
        }

        throw new Error(`Chave não encontrada: ${chave}`);
    }
        
}