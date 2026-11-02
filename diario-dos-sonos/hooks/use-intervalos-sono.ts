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

    return {
        intervalosPorMes
    }
}
