import { MarcacaoSono } from "../models/MarcacaoSono";

export interface MarcacaoSonoStorage {
    consultarMarcacaoSono(): Promise<MarcacaoSono>;
    salvarMarcacaoSono(marcacao: MarcacaoSono): Promise<void>;
}