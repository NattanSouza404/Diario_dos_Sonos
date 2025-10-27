import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import MarcarSonoButton from '../../components/marcar-sono-button';
import { useEffect, useState } from 'react';

import { ISonoService, SonoService } from '@/service/SonoService';
import { AlertUtils } from '@/utils/AlertUtils';
import { IconeTravesseiro } from '@/components/icons/IconeTravesseiro';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {

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
    const novoSonoIsAtivo = !sonoIsAtivo;

    try {

      if (novoSonoIsAtivo){
        await service.iniciarIntervaloSono();
      } else {
        await service.pararIntervaloSono();
      }

      setSonoIsAtivo(novoSonoIsAtivo);
      service.setSonoIsAtivo(novoSonoIsAtivo);

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

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
      height={0}
      >
        <ThemedView style={{
            flex: 1,
            justifyContent: 'center',  
            alignItems: 'center',
            marginTop: 80
          }}
        >
          <ThemedView style={styles.container}>
            <ThemedText type='title'>Diário dos Sonos</ThemedText>
          </ThemedView>

          <ThemedView>
            <IconeTravesseiro/>
          </ThemedView>

          <ThemedView style={styles.container}>
            <MarcarSonoButton
              sonoIsAtivo={sonoIsAtivo}

              onPress={toggleIniciarSono}
            />

            <Pressable style={styles.botaoReiniciar} onPress={reiniciarMarcacao}>
              <Ionicons name='square' color={Colors.dark.vermelho}/>
              <ThemedText>Reiniciar</ThemedText>
            </Pressable>
          </ThemedView>

          <ThemedView style={styles.container}>
            <ThemedText>Média da semana</ThemedText>
            <ThemedText type='subtitle'>
              {mediaSemana.horas} horas e {mediaSemana.minutos} minutos
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.container}>
            <ThemedText>Média do mês</ThemedText>
            <ThemedText type='subtitle'>
              {mediaMes.horas} horas e {mediaMes.minutos} minutos
            </ThemedText>
          </ThemedView>
        </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    alignItems: 'center',
    marginVertical: 20
  },
  botaoReiniciar: {
    display: 'flex',
    flexDirection: 'row',

    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',

    gap: 4,

    marginTop: 16,
    marginBottom: 8
  }
});
