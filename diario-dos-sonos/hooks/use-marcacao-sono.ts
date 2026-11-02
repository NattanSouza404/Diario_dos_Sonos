import { MarcacaoSono } from "@/domain/models/MarcacaoSono";
import { SonoService } from "@/services/SonoService";
import { AlertUtils } from "@/utils/AlertUtils";
import { useEffect, useState } from "react";

export const useMarcacaoSono = () => {
  const service = SonoService.getInstance();

  const [marcacaoSono, setMarcacaoSono] = useState<MarcacaoSono | null>(null);

  useEffect(() => {
    const obterDados = async () => {
      setMarcacaoSono(await service.consultarMarcacaoSono());
    };

    obterDados();

    const subscription = service.onMudou(() => {
      obterDados();
    });

    return () => subscription.remove();
  }, []);

  const toggleMarcacaoSono = async () => {
    const msg = marcacaoSono?.isAtiva ? "Deseja parar de monitorar seu sono?" : "Deseja iniciar o monitoramento do seu sono?";
    
    AlertUtils.confirm(
      msg,
      async () => { 
        try {
          setMarcacaoSono(await service.toggleMarcacaoSono());
        } catch (error) {
          AlertUtils.alert((error as Error).message);
        }
      }
    );
  }

  const reiniciarMarcacao = async () => {
    AlertUtils.confirm(
      "Deseja reiniciar essa marcação?",
      async () => {
        setMarcacaoSono(await service.reiniciarMarcacao());
      }
    );
  }

  return {
    marcacaoSono,
    toggleMarcacaoSono,
    reiniciarMarcacao
  }
}