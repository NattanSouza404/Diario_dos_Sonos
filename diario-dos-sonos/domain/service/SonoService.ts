import IntervaloSono from "@/domain/models/IntervaloSono";
import ArmazenamentoLocal from "../../storage/ArmazenamentoLocal";
import { DeviceEventEmitter, EmitterSubscription } from "react-native";
import { Formatador } from "@/utils/DataUtils";
import { Estatisticas } from "../models/Estatisticas";
import { MarcacaoSono } from "../models/MarcacaoSono";

export class SonoService {

    private _armazenamento = new ArmazenamentoLocal();

    private constructor(){}
    
    private static instance : SonoService;

    static getInstance(): SonoService {
        if (!this.instance){
            this.instance = new SonoService();
        }

        return this.instance;
    }

    async getMarcacaoSono(): Promise<MarcacaoSono> {
        return this._armazenamento.getMarcacaoSono();
    }
    
    async getEstatisticas(): Promise<Estatisticas> {
        return this._armazenamento.getEstatisticas();
    }

    async reiniciarMarcacao(): Promise<MarcacaoSono> {
        const marcacaoSono = await this._armazenamento.getMarcacaoSono();
        marcacaoSono.reiniciar();

        await this._armazenamento.setMarcacaoSono(marcacaoSono);
        this.emitirMudou();

        return marcacaoSono;
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

        await this._armazenamento.setIntervalosSono(intervalos);

        await this.atualizarEstatisticas();
        this.emitirMudou();
    }

    async toggleMarcacaoSono(): Promise<MarcacaoSono> {
      const marcacaoSono = await this._armazenamento.getMarcacaoSono();

      if (!marcacaoSono.isAtiva) {
        marcacaoSono.iniciar();
      } else {
        const novoIntervalo = new IntervaloSono(
            marcacaoSono.ultimaMarcacao as Date,
            new Date()
        );

        await this.adicionarIntervaloSono(novoIntervalo);
        marcacaoSono.parar();
      }

      await this._armazenamento.setMarcacaoSono(marcacaoSono);
      this.emitirMudou();

      return marcacaoSono;
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

    private async atualizarEstatisticas(): Promise<void> {
        const intervalos = await this.getIntervalos();

        this._armazenamento.salvarEstatisticas(
            new Estatisticas(intervalos)
        );
    }

    emitirMudou():void{
        DeviceEventEmitter.emit('mudou');
    }

    onMudou(callback: () => void) : EmitterSubscription {
        return DeviceEventEmitter.addListener('mudou', callback);
    }

}
