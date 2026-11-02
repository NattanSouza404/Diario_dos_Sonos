import { ISonoService, SonoService } from "@/domain/service/SonoService";
import { AlertUtils } from "@/utils/AlertUtils";
import { useEffect, useState } from "react";

export const useMarcacaoSono = () => {
  const service: ISonoService = SonoService.getInstance();

  const [sonoIsAtivo, setSonoIsAtivo] = useState<boolean>(false);
  const [mediaMes, setMediaMes] = useState<any>({hora: 0, minuto: 0});
  const [mediaSemana, setMediaSemana] = useState<any>({hora: 0, minuto: 0});

  const obterDados = async () => {
    setSonoIsAtivo(
      await service.getSonoIsAtivo()
    );

    setMediaMes(
      await service.getMediaMensal()
    );

    setMediaSemana(
      await service.getMediaSemanal()
    );
  };

  useEffect(() => {
    obterDados();

    const subscription = service.onMudou(() => {
      obterDados();
    });

    return () => subscription.remove();
  }, []);

  const toggleIniciarSono = async () => {
    const msg = sonoIsAtivo ? "Deseja parar de monitorar seu sono?" : "Deseja iniciar o monitoramento do seu sono?";
    
    AlertUtils.confirm(msg, () => handleConfirmacao());
  }

  const handleConfirmacao = async () => {
    try {
      await service.toggleMarcacaoSono();
      setSonoIsAtivo(await service.getSonoIsAtivo());
    } catch (error) {
      AlertUtils.alert((error as Error).message);
    }
  }

  const reiniciarMarcacao = async () => {
    AlertUtils.confirm("Deseja reiniciar essa marcação?", () => {
      setSonoIsAtivo(false);
      service.setSonoIsAtivo(false);
    });
  }

  return {
    toggleIniciarSono,
    reiniciarMarcacao,
    sonoIsAtivo,
    mediaMes,
    mediaSemana
  }
}