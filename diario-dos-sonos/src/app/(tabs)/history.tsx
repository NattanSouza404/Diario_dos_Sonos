import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/src/shared/components/parallax-scroll-view';
import { ThemedView } from '@/src/shared/components/themed-view';
import { IconSymbol } from '@/src/shared/components/ui/icon-symbol';

import AdicionarSonoButtton from '@/src/features/sono/components/adicionar-sono-button';

import { SeparacaoMes } from '@/src/features/sono/components/separacao-mes';
import { useIntervalosSono } from '@/src/features/sono/hooks/use-intervalos-sono';

export default function HistoryScreen() {
  const {
    intervalosPorMes
  } = useIntervalosSono();

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
});
