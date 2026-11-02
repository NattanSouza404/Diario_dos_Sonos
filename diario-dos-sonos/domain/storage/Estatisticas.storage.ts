import { Estatisticas } from "../models/Estatisticas";

export interface EstatisticasStorage {
    consultarEstatisticas(): Promise<Estatisticas>;
    salvarEstatisticas(estatisticas: Estatisticas): Promise<void>;
}