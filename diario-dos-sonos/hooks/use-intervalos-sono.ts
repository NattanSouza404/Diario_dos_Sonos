import IntervaloSono from "@/domain/models/IntervaloSono";
import { SonoService } from "@/domain/service/SonoService";
import { separarIntervalosPorMes } from "@/utils/IntervaloSonoUtils";
import { useEffect, useState } from "react";

export const useIntervalosSono = () => {
    const service = SonoService.getInstance();

    const [intervalosPorMes, setIntervalosPorMes] = useState<Map<string, IntervaloSono[]>>(new Map());

    useEffect(() => {
        const obterDados = async () => {
            const intervalosSono = await service.getIntervalos();
            setIntervalosPorMes(separarIntervalosPorMes(intervalosSono));
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
        adicionarIntervaloSono,
        editarIntervaloSono,
        deletarIntervaloSono
    }
}
