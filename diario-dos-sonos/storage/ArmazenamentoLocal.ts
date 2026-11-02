import { Estatisticas } from "@/domain/models/Estatisticas";
import IntervaloSono from "@/domain/models/IntervaloSono";
import { MarcacaoSono } from "@/domain/models/MarcacaoSono";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chaves = {
    INTERVALOS_SONO: "intervalosSono",
    ESTATISTICAS: "estatisticas",
    MARCACAO_SONO: "marcacaoSono",
}

const ChavesEValoresPadrao = new Map<string, any>([
  [Chaves.INTERVALOS_SONO, []],
  [Chaves.MARCACAO_SONO, { isAtiva: false, ultimaMarcacao: null }],
  [Chaves.ESTATISTICAS, new Estatisticas([])],
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

    async getMarcacaoSono(): Promise<MarcacaoSono> {
        return this.getParsed<MarcacaoSono>(
            Chaves.MARCACAO_SONO,
            (raw) => {
                const parsed = JSON.parse(raw);
                const isAtiva = Boolean(parsed?.isAtiva ?? parsed?.isAtivo);
                const ultimaMarcacao = parsed?.ultimaMarcacao ? new Date(parsed.ultimaMarcacao) : null;

                return new MarcacaoSono(isAtiva, ultimaMarcacao);
            },
            new MarcacaoSono(false, null)
        );
    }

    async getEstatisticas(): Promise<Estatisticas> {
        return this.getParsed<Estatisticas>(
            Chaves.ESTATISTICAS,
            (raw) => JSON.parse(raw) as Estatisticas,
            new Estatisticas([])
        );
    }

    async setIntervalosSono(intervalos: IntervaloSono[]): Promise<void> {
        const intervalosOrdenados = intervalos.sort(
            (a, b) => b.horaFim.getTime() - a.horaFim.getTime()
        );

        AsyncStorage.setItem(Chaves.INTERVALOS_SONO, JSON.stringify(intervalosOrdenados));
    }

    async setMarcacaoSono(marcacao: MarcacaoSono): Promise<void> {
        AsyncStorage.setItem(Chaves.MARCACAO_SONO, JSON.stringify(marcacao));
    }

    async salvarEstatisticas(estatisticas: Estatisticas): Promise<void> {
        AsyncStorage.setItem(Chaves.ESTATISTICAS, JSON.stringify(estatisticas));
    }
        
}