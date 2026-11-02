import IntervaloSono from "@/domain/models/IntervaloSono";
import { SonoService } from "@/domain/service/SonoService";
import { separarIntervalosPorMes } from "@/utils/IntervaloSonoUtils";
import { useEffect, useState } from "react";

export const useIntervalosSono = () => {
    const service = SonoService.getInstance();

    const [intervalosSono, setIntervalosSono] = useState<IntervaloSono[]>([]);
    const [intervalosPorMes, setIntervalosPorMes] = useState<Map<string, IntervaloSono[]>>(new Map());

    const obterDados = async () => {
        setIntervalosSono(
            await service.getIntervalos()
        );
    };

    useEffect(() => {
        obterDados();

        const subscription = service.onMudou(() => {
            obterDados();
        });

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        setIntervalosPorMes(
            separarIntervalosPorMes(intervalosSono)
        );
    }, [intervalosSono]);

    return {
        intervalosPorMes
    }
}
