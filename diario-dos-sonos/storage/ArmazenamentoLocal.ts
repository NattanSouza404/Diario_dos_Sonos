import IntervaloSono from "@/domain/models/IntervaloSono";
import MediaSono  from "@/domain/models/MediaSono";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chaves = {
    INTERVALOS_SONO: "intervalosSono",
    SONO_IS_ATIVO: "sonoIsAtivo",
    ULTIMA_MARCACAO: "ultimaMarcacao",
    MEDIA_MES: "mediaMes",
    MEDIA_SEMANA: "mediaSemana"
}

const ChavesEValoresPadrao = new Map<string, any>([
  [Chaves.INTERVALOS_SONO, []],
  [Chaves.SONO_IS_ATIVO, false],
  [Chaves.ULTIMA_MARCACAO, new Date()],
  [Chaves.MEDIA_MES, { horas: 0, minutos: 0 }],
  [Chaves.MEDIA_SEMANA, { horas: 0, minutos: 0 }],
]);

export default class ArmazenamentoLocal {

    ArmazenamentoLocal(){
        for (const [chave, valor] of ChavesEValoresPadrao) {
            this.inicializar(chave, valor);
        }
    }

    private async get(chave: string): Promise<string> {
        const valor = await AsyncStorage.getItem(chave); 

        if (valor === null || valor === 'undefined'){
            return this.inicializar(chave, ChavesEValoresPadrao.get(chave)!);
        }

        return valor;
    }

    private async set(chave: string, valor: string): Promise<void> {
        AsyncStorage.setItem(chave, valor);
    }

    private async getParsed<T>(
        key: string,
        parser: (raw: string) => T,
        fallback: T
    ): Promise<T> {
        const raw = await this.get(key);
        return raw ? parser(raw) : fallback;
    }

    private async inicializar(chave:string, valorPadrao: any): Promise<string> {

        if (chave === null || chave === 'undefined' || chave === undefined){
            throw new Error("Chave inválida para inicialização.");
        }

        if (ChavesEValoresPadrao.get(chave) === undefined){
            throw new Error(`Chave não encontrada para inicialização: ${chave}`);
        }

        await this.set(chave, JSON.stringify(valorPadrao));

        return JSON.stringify(valorPadrao);
    }

    /**
     * Getters
     */

    async getIntervalos(): Promise<IntervaloSono[]> {
        return this.getParsed<IntervaloSono[]>(
            Chaves.INTERVALOS_SONO,
            (raw) => {
                const parsed = JSON.parse(raw) as {
                    horaInicio: string;
                    horaFim: string 
                }[];

                return parsed.map(i =>
                    new IntervaloSono(new Date(i.horaInicio), new Date(i.horaFim))
                );
            },
            []
        );
    }

    async getSonoIsAtivo(): Promise<boolean> {
        return this.getParsed<boolean>(
            Chaves.SONO_IS_ATIVO,
            (raw) => JSON.parse(raw) as boolean,
            false
        );
    }

    async getUltimaMarcacao(): Promise<Date> {
        return this.getParsed<Date>(
            Chaves.ULTIMA_MARCACAO,
            (raw) => new Date(raw),
            new Date()
        );
    }

    async getMediaMes(): Promise<MediaSono> {
        return this.getParsed<MediaSono>(
            Chaves.MEDIA_MES,
            (raw) => JSON.parse(raw) as MediaSono,
            { horas: 0, minutos: 0 }
        );
    }

    async getMediaSemana(): Promise<MediaSono> {
        return this.getParsed<MediaSono>(
            Chaves.MEDIA_SEMANA,
            (raw) => JSON.parse(raw) as MediaSono,
            { horas: 0, minutos: 0 }
        );
    }

    /**
     * Setters
     */

    async setMediasMes(media:MediaSono){
        AsyncStorage.setItem(Chaves.MEDIA_MES, JSON.stringify(media));
    }

    async setMediasSemana(media:MediaSono){
        AsyncStorage.setItem(Chaves.MEDIA_SEMANA, JSON.stringify(media));
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

    async setSonoIsAtivo(ativado: boolean): Promise<void> {
        AsyncStorage.setItem(Chaves.SONO_IS_ATIVO, JSON.stringify(ativado));
    }
        
}