import IntervaloSono from "@/src/features/sono/domain/models/IntervaloSono";
import ArmazenamentoLocal from "../infrastructure/storage/ArmazenamentoLocal";
import { DeviceEventEmitter, EmitterSubscription } from "react-native";
import { Formatador } from "@/src/shared/utils/DataUtils";
import { Estatisticas } from "../domain/models/Estatisticas";
import { MarcacaoSono } from "../domain/models/MarcacaoSono";
import { IntervaloSonoStorage } from "../domain/storage/IntervaloSono.storage";

export class SonoService {

    private intervaloSonoStorage: IntervaloSonoStorage = new ArmazenamentoLocal();
    private marcacaoSonoStorage = new ArmazenamentoLocal();
    private estatisticasStorage = new ArmazenamentoLocal();

    private constructor(){}
    
    private static instance : SonoService;

    static getInstance(): SonoService {
        if (!this.instance){
            this.instance = new SonoService();
        }

        return this.instance;
    }

    async consultarIntervalos(): Promise<IntervaloSono[]> {
        return await this.intervaloSonoStorage.consultarIntervalos();
    }

    async consultarMarcacaoSono(): Promise<MarcacaoSono> {
        return this.marcacaoSonoStorage.consultarMarcacaoSono();
    }
    
    async consultarEstatisticas(): Promise<Estatisticas> {
        return this.estatisticasStorage.consultarEstatisticas();
    }

    async adicionarIntervaloSono(novoIntervalo: IntervaloSono){
        const intervalos = await this.consultarIntervalos();

        intervalos.forEach(i => {
            if (Formatador(i.horaFim).data === Formatador(novoIntervalo.horaFim).data){
                throw new Error("Já existe um intervalo de sono para esse dia.");
            }
        });

        intervalos.push(
            new IntervaloSono(novoIntervalo.horaInicio, novoIntervalo.horaFim)
        );

        await this.intervaloSonoStorage.atualizarIntervalosSono(intervalos);

        await this.atualizarEstatisticas();
        this.emitirMudou();
    }

    async editarIntervaloSono(intervaloSono: IntervaloSono):Promise<void> {
        const intervalos = await this.consultarIntervalos();

        const dataIntervalo = Formatador(intervaloSono.horaFim).data;

        const novosIntervalos = intervalos.map(i => {
            const dataI = Formatador(i.horaFim).data;
            
            if (dataI === dataIntervalo){
                return new IntervaloSono(intervaloSono.horaInicio, intervaloSono.horaFim);
            }

            return i;
        });

        await this.intervaloSonoStorage.atualizarIntervalosSono(novosIntervalos);

        this.atualizarEstatisticas();
        this.emitirMudou();
    }

    async deletarIntervaloSono(intervalo: IntervaloSono): Promise<void> {
        const intervalos = await this.consultarIntervalos();

        const novosIntervalos = intervalos.filter(i => 
            !(i.horaInicio.getTime() === intervalo.horaInicio.getTime() &&
            i.horaFim.getTime() === intervalo.horaFim.getTime())
        );

        await this.intervaloSonoStorage.atualizarIntervalosSono(novosIntervalos);
        await this.atualizarEstatisticas();
        this.emitirMudou();
    }

    async reiniciarMarcacao(): Promise<MarcacaoSono> {
        const marcacaoSono = await this.marcacaoSonoStorage.consultarMarcacaoSono();
        marcacaoSono.reiniciar();

        await this.marcacaoSonoStorage.salvarMarcacaoSono(marcacaoSono);
        this.emitirMudou();

        return marcacaoSono;
    }

    async toggleMarcacaoSono(): Promise<MarcacaoSono> {
      const marcacaoSono = await this.marcacaoSonoStorage.consultarMarcacaoSono();

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

      await this.marcacaoSonoStorage.salvarMarcacaoSono(marcacaoSono);
      this.emitirMudou();

      return marcacaoSono;
    }

    private async atualizarEstatisticas(): Promise<void> {
        const intervalos = await this.consultarIntervalos();

        await this.estatisticasStorage.salvarEstatisticas(
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
