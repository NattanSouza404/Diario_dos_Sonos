import IntervaloSono from "@/models/IntervaloSono";
import MediaSono  from "@/models/MediaSono";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chaves = {
    INTERVALOS_SONO: "intervalosSono",
    SONO_IS_ATIVO: "sonoIsAtivo",
    ULTIMA_MARCACAO: "ultimaMarcacao",
    MEDIA_MES: "mediaMes",
    MEDIA_SEMANA: "mediaSemana"
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

    async getMediaMes(): Promise<MediaSono> {
        let media = await AsyncStorage.getItem(Chaves.MEDIA_MES);

        if (!media || media === 'undefined'){
            media = await this.inicializar(Chaves.MEDIA_MES);
        }

        return JSON.parse(media) as MediaSono;
    }

    async getMediaSemana(): Promise<MediaSono> {
        let media = await AsyncStorage.getItem(Chaves.MEDIA_SEMANA);

        if (!media || media === 'undefined'){
            media = await this.inicializar(Chaves.MEDIA_SEMANA);
        }

        return JSON.parse(media) as MediaSono;
    }

    async setMediasMes(media:MediaSono){
        AsyncStorage.setItem(Chaves.MEDIA_MES, JSON.stringify(media));
    }

    async setMediasSemana(media:MediaSono){
        AsyncStorage.setItem(Chaves.MEDIA_SEMANA, JSON.stringify(media));
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
                const mediaPadrao:MediaSono = {
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

            case Chaves.MEDIA_SEMANA:
                const mediaSemanaPadrao:MediaSono = {
                    horas: 0, minutos: 0
                }

                AsyncStorage.setItem(Chaves.MEDIA_SEMANA, JSON.stringify(mediaSemanaPadrao));

                return JSON.stringify(mediaSemanaPadrao);
        }

        throw new Error(`Chave não encontrada: ${chave}`);
    }
        
}