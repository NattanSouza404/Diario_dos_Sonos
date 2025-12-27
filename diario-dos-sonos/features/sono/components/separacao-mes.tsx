import { ThemedView } from "@/components/themed-view"
import { MarcacaoSono } from "./marcacao-sono"
import { Collapsible } from "@/components/ui/collapsible"
import IntervaloSono from "@/domain/models/IntervaloSono";
import { StyleSheet } from "react-native";

type Props = {
  titulo: string;
  isAberto: boolean;
  index: number;
  intervalosSono: IntervaloSono[];
}

export const SeparacaoMes = ({titulo, isAberto, index, intervalosSono }: Props) => {
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
  containerDatas: {
    display: 'flex',
    width: 240,
    maxWidth: 240,
    justifyContent: 'flex-start'
  },
});