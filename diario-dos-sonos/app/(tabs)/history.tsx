import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

import { useEffect, useState } from 'react';

import IntervaloSono from '@/models/IntervaloSono';

import { MarcacaoSono } from '@/components/marcacao-sono';
import { SonoService } from '@/service/SonoService';

import { Collapsible } from '@/components/ui/collapsible';
import { Formatador } from '@/service/Formatador';
import AdicionarSonoButtton from '@/components/adicionar-sono-button';

export default function HistoryScreen() {
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
    const intervalos: Map<string, IntervaloSono[]> = new Map();

    intervalosSono.forEach((intervalo) => {
      const fmt = intervalo.horaFim;
      const chave = `${Formatador(fmt).mes} / ${Formatador(fmt).ano}`;

      if (!intervalos.has(chave)) {
        intervalos.set(chave, []);
      }

      intervalos.get(chave)?.push(intervalo);
    });

    setIntervalosPorMes(intervalos);

  }, [intervalosSono]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
      height={0}
      >

      <ThemedView style={[styles.container, styles.mainContainer]}>

        <AdicionarSonoButtton/>

        <ThemedView style={styles.container}>
          {
            Array.from(intervalosPorMes.entries())
              .map(([key, value], index) => {
                const isFirst = index === 0 ? true : false;
                
                return (
                  <SeparacaoMes
                    key={key}
                    titulo={key}
                    isAberto={isFirst}
                    intervalosSono={value}
                    index={index}
                  />
                );
              })
          }
        </ThemedView>
      </ThemedView>

    </ParallaxScrollView>
  );
}

type Props = {
  titulo: string;
  isAberto: boolean;
  index: number;
  intervalosSono: IntervaloSono[];
}

const SeparacaoMes = ({titulo, isAberto, index, intervalosSono }: Props) => {
  return (
    <ThemedView style={styles.containerDatas} key={`${titulo}-${index}`}>
      <Collapsible title={titulo} isAberto={isAberto}>
        {intervalosSono.map((intervaloSono, index) => 
          <ThemedView style={{marginTop: 4, marginBottom: 4}} key={index}>
            <MarcacaoSono
              intervaloSono={intervaloSono}
            />
          </ThemedView>
        )}
      </Collapsible>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  mainContainer:{
    marginTop: 80
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  container: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center'
  },
  containerDatas: {
    display: 'flex',
    width: 240,
    maxWidth: 240,
    justifyContent: 'flex-start'
  },
});
