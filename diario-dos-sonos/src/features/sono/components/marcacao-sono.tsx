import { diferencaEntreDatas, Formatador } from "@/src/shared/utils/DataUtils";
import { ThemedText } from "../../../shared/components/themed-text"
import { ThemedView } from "../../../shared/components/themed-view"
import IntervaloSono from "@/src/features/sono/domain/models/IntervaloSono";
import { Pressable, StyleSheet } from "react-native";
import { AlertUtils } from "@/src/shared/utils/AlertUtils";

import { useState } from "react";

import { useThemeColor } from "@/src/shared/hooks/use-theme-color";

import { Ionicons } from "@expo/vector-icons";
import { useIntervalosSono } from "@/src/features/sono/hooks/use-intervalos-sono";
import ModalEditarIntervaloSono from "./modal-editar-intervalo-sono";

type Props = {
    intervaloSono: IntervaloSono,
}

export const MarcacaoSono = ({intervaloSono }:Props) => {
    const vermelho = useThemeColor({}, 'vermelho');

    const [modalIsVisible, setModalIsVisible] = useState(false);

    const horaInicio = intervaloSono.horaInicio;
    const horaFim = intervaloSono.horaFim;

    const diffInicioEFim = diferencaEntreDatas(horaInicio, horaFim);

    const { deletarIntervaloSono } = useIntervalosSono();

    const deletarIntervalo = async (intervalo:IntervaloSono) => {
        AlertUtils.confirm(
            "Deseja realmente apagar esse intervalo de sono?",

            () => deletarIntervaloSono(intervalo)
        );
    }

    const fmtInicio = Formatador(horaInicio);
    const fmtFim = Formatador(horaFim);

    return (
        <ThemedView style={styles.marcacaoSono} backgroundIsSecondary={true} hasBorder={true}>

            <ThemedView style={styles.containerTitulo} backgroundIsSecondary={true}>
                <ThemedText style={styles.titulo}>
                    {fmtFim.dia}
                </ThemedText>

                <ThemedText style={styles.textoSubtitle}>
                    {fmtFim.diaSemana}
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoSono} backgroundIsSecondary={true}>
                <ThemedText style={styles.texto}>{diffInicioEFim.duracaoEmExtenso}</ThemedText>
                <ThemedText style={styles.texto}>{fmtInicio.horario} - {fmtFim.horario}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.navBotoes} backgroundIsSecondary={true}>

                <Pressable onPress={() => deletarIntervalo(intervaloSono)}>
                    <Ionicons size={24} name="trash-bin-sharp" color={vermelho} />
                </Pressable>

                <Pressable onPress={() => setModalIsVisible(true)}>
                    <Ionicons name="pencil" size={24} color={'lightgreen'} />
                </Pressable>

            </ThemedView>

           <ModalEditarIntervaloSono
                isVisible={modalIsVisible}
                setIsVisible={setModalIsVisible}
                intervaloSono={intervaloSono}
           />

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    marcacaoSono: {
        margin: 4,
        padding: 4,
        borderRadius: 20,

        borderWidth: 2,
    },
    containerTitulo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

        marginTop: 6,
        marginBottom: 4,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        lineHeight: 32,
        textAlign: 'center'
    },
    infoSono: {
        alignItems: "center",
        marginTop: 16,
        marginBottom: 16,
    },
    texto: {
        textAlign: "center"
    },
    textoSubtitle: {
        textAlign: "center",
        fontSize: 16,
    },
    textoVermelho: {
        color: "red"
    },
    navBotoes: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between', 
        padding: 4,

        marginLeft: 6,
        marginRight: 6
    },
})