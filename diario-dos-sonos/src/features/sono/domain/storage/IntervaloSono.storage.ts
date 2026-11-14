import IntervaloSono from "../models/IntervaloSono";

export interface IntervaloSonoStorage {
  consultarIntervalos(): Promise<IntervaloSono[]>;
  atualizarIntervalosSono(intervalos: IntervaloSono[]): Promise<void>;
}