import IntervaloSono from "@/models/IntervaloSono";
import { MediaMesSono } from "@/models/MediaMesSono";
import ArmazenamentoLocal from "./storage/ArmazenamentoLocal";
import { DeviceEventEmitter, EmitterSubscription } from "react-native";
import { Formatador } from "./Formatador";
import { Calculadora } from "./Calculadora";
import { validarSono } from "./ValidadorSono";

export interface ISonoService {
    getSonoIsAtivo(): Promise<boolean>;
    getMediaMensal(): Promise<MediaMesSono>;
    setSonoIsAtivo(novoSonoIsAtivo: boolean): Promise<void>;
    getIntervalos(): IntervaloSono[] | Promise<IntervaloSono[]>;

    iniciarIntervaloSono(): Promise<void>;
    pararIntervaloSono(): Promise<void>;

    editarIntervaloSono(intervaloSono: IntervaloSono): Promise<void>;

    emitirMudou(): void;
    onMudou(callback: () => void): EmitterSubscription;
}

export class SonoService implements ISonoService {

    private _armazenamento = new ArmazenamentoLocal();
    private _calculadora = new Calculadora();

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

        intervalos.forEach(i => {
            if (Formatador(i.horaInicio).data === Formatador(novoIntervalo.horaInicio).data){
                throw new Error("Já existe um intervalo de sono para o dia de hoje.");
            }
        });

        validarSono(novoIntervalo);

        intervalos.push(novoIntervalo);

        this._armazenamento.setIntervalosSono(intervalos);

        this.atualizarMediaMensal();
        this.emitirMudou();
    }

    async atualizarMediaMensal():Promise<void>{
        const intervalos = await this.getIntervalos();

        this._armazenamento.setMediasMes(
            this._calculadora.calcularMediaMesAtual(intervalos)
        );
    }

    async editarIntervaloSono(intervaloSono: IntervaloSono):Promise<void> {
        const intervalos = await this.getIntervalos();

        const dataIntervalo = Formatador(intervaloSono.horaFim).data;

        const novosIntervalos = intervalos.map(i => {
            const dataI = Formatador(i.horaFim).data;
            
            if (dataI === dataIntervalo){
                return intervaloSono;
            }

            return i;
        });

        this._armazenamento.setIntervalosSono(novosIntervalos);
        validarSono(intervaloSono);
        this.atualizarMediaMensal();
        this.emitirMudou();
    }

    async deletarIntervaloSono(intervalo: IntervaloSono): Promise<void> {
        const intervalos = await this.getIntervalos();

        const novosIntervalos = intervalos.filter(i => 
            !(i.horaInicio.getTime() === intervalo.horaInicio.getTime() &&
            i.horaFim.getTime() === intervalo.horaFim.getTime())
        );

        this._armazenamento.setIntervalosSono(novosIntervalos);
        this.atualizarMediaMensal();
        this.emitirMudou();
    }

    async getIntervalos(): Promise<IntervaloSono[]> {
        return await this._armazenamento.getIntervalos();
    }

    emitirMudou():void{
        DeviceEventEmitter.emit('mudou');
    }

    onMudou(callback: () => void) : EmitterSubscription {
        return DeviceEventEmitter.addListener('mudou', callback);
    }

}
