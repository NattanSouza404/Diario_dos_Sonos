import IntervaloSono from "@/models/IntervaloSono";
import { MediaMesSono } from "@/models/MediaMesSono";
import ArmazenamentoLocal from "./storage/ArmazenamentoLocal";
import { DeviceEventEmitter, EmitterSubscription } from "react-native";

export interface ISonoService {
    getSonoIsAtivo(): Promise<boolean>;
    getMediaMensal(): Promise<MediaMesSono>;
    setSonoIsAtivo(novoSonoIsAtivo: boolean): Promise<void>;
    getIntervalos(): IntervaloSono[] | Promise<IntervaloSono[]>;

    iniciarIntervaloSono(): Promise<void>;
    pararIntervaloSono(): Promise<void>;

    calcularMediaMesAtual(intervalos:IntervaloSono[]): Promise<MediaMesSono>;

    emitirMudou(): void;
    onMudou(callback: () => void): EmitterSubscription;
}

export class SonoService implements ISonoService {
    private _armazenamento = new ArmazenamentoLocal();

    private constructor(){}
    private static instance : SonoService;

    static getInstance(): SonoService {
        if (!this.instance){
            this.instance = new SonoService();
        }

        return this.instance;
    }

    async getSonoIsAtivo(): Promise<boolean>{
        return this._armazenamento.getSonoIsAtivo();
    }

    async getMediaMensal(): Promise<MediaMesSono> {
        return await this._armazenamento.getMediaMes();
    }

    async setSonoIsAtivo(novoSonoIsAtivo: boolean): Promise<void> {
        await this._armazenamento.setSonoIsAtivo(novoSonoIsAtivo);
        this.emitirMudou();
    }

    async iniciarIntervaloSono(): Promise<void> {
        const date = new Date(Date.now());
        await this._armazenamento.setUltimaMarcacao(date);
    }

    async pararIntervaloSono(): Promise<void> {
        const date = new Date(Date.now()).toISOString();

        const novoIntervalo = new IntervaloSono(
            await this._armazenamento.getUltimaMarcacao(),
            new Date(date)
        );

        const intervalos = await this.getIntervalos();
        intervalos.push(novoIntervalo);

        this._armazenamento.setIntervalosSono(intervalos);

        this._armazenamento.setMediasMes(
            await this.calcularMediaMesAtual(intervalos)
        );
        
        this.emitirMudou();
    }

    async getIntervalos(): Promise<IntervaloSono[]> {
        return await this._armazenamento.getIntervalos();
    }

    async calcularMediaMesAtual(intervalos:IntervaloSono[]) : Promise<MediaMesSono> {
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

    emitirMudou():void{
        DeviceEventEmitter.emit('mudou');
    }

    onMudou(callback: () => void) : EmitterSubscription {
        return DeviceEventEmitter.addListener('mudou', callback);
    }

}
