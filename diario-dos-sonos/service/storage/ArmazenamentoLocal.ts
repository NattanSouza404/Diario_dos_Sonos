import IntervaloSono from "@/models/IntervaloSono";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";

const Chaves = {
    INTERVALOS_SONO: "intervalosSono",
    SONO_IS_ATIVO: "sonoIsAtivo",
    ULTIMA_MARCACAO: "ultimaMarcacao"
}

export default class ArmazenamentoLocal {
    
    private constructor(){}
    
    private static instance : ArmazenamentoLocal;

    static getInstance() : ArmazenamentoLocal{
        if (!this.instance){
            this.instance = new ArmazenamentoLocal();
        }

        return this.instance;
    }

    emitirMudou(){
        DeviceEventEmitter.emit('mudou');
    }

    onMudou(callback: () => void) {
        return DeviceEventEmitter.addListener('mudou', callback);
    }

    async getIntervalos(): Promise<IntervaloSono[]> {
        let intervalos = await AsyncStorage.getItem(Chaves.INTERVALOS_SONO);
    
        if (!intervalos){
            intervalos = await this.inicializarIntervalosSono();
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

        if (!ativado){
            ativado = await this.inicializarAtivado();
        }

        return ativado === 'true' ? true : false;
    }

    async setSonoIsAtivo(ativado: boolean): Promise<void> {
        AsyncStorage.setItem(Chaves.SONO_IS_ATIVO, JSON.stringify(ativado));
        this.emitirMudou();
    }

    async getUltimaMarcacao(): Promise<Date> {
        let ultimaMarcacao = await AsyncStorage.getItem(Chaves.ULTIMA_MARCACAO);

        if (!ultimaMarcacao){
            ultimaMarcacao = JSON.stringify(new Date(Date.now()).toISOString());
        }

        return new Date(ultimaMarcacao);
    }

    async iniciarIntervaloSono(): Promise<void> {
        const date = new Date(Date.now());
        AsyncStorage.setItem(Chaves.ULTIMA_MARCACAO, date.toISOString());
    }

    async pararIntervaloSono(): Promise<void> {
        const date = new Date(Date.now()).toISOString();

        const intervalos = await this.getIntervalos();
        intervalos.push
            (new IntervaloSono(await this.getUltimaMarcacao(), new Date(date)
        ));

        AsyncStorage.setItem(Chaves.INTERVALOS_SONO, JSON.stringify(intervalos));
        this.emitirMudou();
    }

    private async inicializarIntervalosSono(): Promise<string> {
        const intervalosPadrao = [
            new IntervaloSono(new Date('2025-10-10'), new Date('2025-10-10')),
        ];

        await AsyncStorage.setItem(
            Chaves.INTERVALOS_SONO, 
            JSON.stringify(intervalosPadrao)  
        );

        return JSON.stringify(intervalosPadrao);
    }

    private async inicializarAtivado(): Promise<string> {
        const ativadoPadrao = false;

        await AsyncStorage.setItem(
            Chaves.SONO_IS_ATIVO,
            JSON.stringify(ativadoPadrao)
        );

        return JSON.stringify(ativadoPadrao);
    }
        
}