import { Estatisticas } from "@/domain/models/Estatisticas";
import IntervaloSono from "@/domain/models/IntervaloSono";
import { SonoService } from "@/services/SonoService";
import { separarIntervalosPorMes } from "@/utils/IntervaloSonoUtils";
import { useEffect, useState } from "react";

export const useIntervalosSono = () => {
    const service = SonoService.getInstance();

    const [intervalosPorMes, setIntervalosPorMes] = useState<Map<string, IntervaloSono[]>>(new Map());
    const [estatisticas, setEstatisticas] = useState<Estatisticas>(new Estatisticas([]));

    useEffect(() => {
        const obterDados = async () => {
            const intervalosSono = await service.consultarIntervalos();
            setIntervalosPorMes(separarIntervalosPorMes(intervalosSono));
            setEstatisticas(await service.consultarEstatisticas());
        };

        obterDados();

        const subscription = service.onMudou(obterDados);

        return () => subscription.remove();
    }, []);

    const adicionarIntervaloSono = async (intervalo: IntervaloSono) => {
        const service = SonoService.getInstance();

        await service.adicionarIntervaloSono(intervalo);
    }

    const editarIntervaloSono = async (intervaloSono: IntervaloSono) => {
        const service = SonoService.getInstance();

        await service.editarIntervaloSono(intervaloSono);
    }

    const deletarIntervaloSono = async (intervalo: IntervaloSono) => {
        await SonoService.getInstance().deletarIntervaloSono(intervalo);
    }

    return {
        intervalosPorMes,
        estatisticas,
        adicionarIntervaloSono,
        editarIntervaloSono,
        deletarIntervaloSono
    }
}
