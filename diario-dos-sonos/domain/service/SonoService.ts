import IntervaloSono from "@/domain/models/IntervaloSono";
import ArmazenamentoLocal from "../../storage/ArmazenamentoLocal";
import { DeviceEventEmitter, EmitterSubscription } from "react-native";
import { Formatador } from "@/utils/DataUtils";
import { Estatisticas } from "../models/Estatisticas";

export interface ISonoService {
    getSonoIsAtivo(): Promise<boolean>;
    setSonoIsAtivo(novoSonoIsAtivo: boolean): Promise<void>;
    getIntervalos(): IntervaloSono[] | Promise<IntervaloSono[]>;
    getEstatisticas(): Promise<Estatisticas>;

    toggleMarcacaoSono(): Promise<void>;

    editarIntervaloSono(intervaloSono: IntervaloSono): Promise<void>;

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

    async getEstatisticas(): Promise<Estatisticas> {
        return this._armazenamento.getEstatisticas();
    }

    async setSonoIsAtivo(novoSonoIsAtivo: boolean): Promise<void> {
        await this._armazenamento.setSonoIsAtivo(novoSonoIsAtivo);
        this.emitirMudou();
    }

    async iniciarIntervaloSono(): Promise<void> {
        const date = new Date(Date.now());
        await this._armazenamento.setUltimaMarcacao(date);
    }

    async adicionarIntervaloSono(novoIntervalo: IntervaloSono){
        const intervalos = await this.getIntervalos();

        intervalos.forEach(i => {
            if (Formatador(i.horaFim).data === Formatador(novoIntervalo.horaFim).data){
                throw new Error("Já existe um intervalo de sono para esse dia.");
            }
        });

        intervalos.push(
            new IntervaloSono(novoIntervalo.horaInicio, novoIntervalo.horaFim)
        );

        this._armazenamento.setIntervalosSono(intervalos);

        this.atualizarEstatisticas();
        this.emitirMudou();
    }

    async pararIntervaloSono(): Promise<void> {
        const date = new Date(Date.now()).toISOString();

        const novoIntervalo = new IntervaloSono(
            await this._armazenamento.getUltimaMarcacao(),
            new Date(date)
        );

        await this.adicionarIntervaloSono(novoIntervalo);
    }

    async toggleMarcacaoSono(): Promise<void> {
      const novoSonoIsAtivo = ! (await this.getSonoIsAtivo());

      if (novoSonoIsAtivo){
        await this.iniciarIntervaloSono();
      } else {
        await this.pararIntervaloSono();
      }

      this.setSonoIsAtivo(novoSonoIsAtivo);
    }

    private async atualizarEstatisticas(): Promise<void> {
        const intervalos = await this.getIntervalos();

        this._armazenamento.salvarEstatisticas(
            new Estatisticas(intervalos)
        );
    }

    async editarIntervaloSono(intervaloSono: IntervaloSono):Promise<void> {
        const intervalos = await this.getIntervalos();

        const dataIntervalo = Formatador(intervaloSono.horaFim).data;

        const novosIntervalos = intervalos.map(i => {
            const dataI = Formatador(i.horaFim).data;
            
            if (dataI === dataIntervalo){
                return new IntervaloSono(intervaloSono.horaInicio, intervaloSono.horaFim);
            }

            return i;
        });

        new IntervaloSono(intervaloSono.horaInicio, intervaloSono.horaFim);

        this._armazenamento.setIntervalosSono(novosIntervalos);

        this.atualizarEstatisticas();
        this.emitirMudou();
    }

    async deletarIntervaloSono(intervalo: IntervaloSono): Promise<void> {
        const intervalos = await this.getIntervalos();

        const novosIntervalos = intervalos.filter(i => 
            !(i.horaInicio.getTime() === intervalo.horaInicio.getTime() &&
            i.horaFim.getTime() === intervalo.horaFim.getTime())
        );

        this._armazenamento.setIntervalosSono(novosIntervalos);
        this.atualizarEstatisticas();
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
