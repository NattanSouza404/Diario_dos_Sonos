import { diferencaEntreDatas, Formatador } from "@/service/Formatador";
import { ThemedText } from "./themed-text"
import { ThemedView } from "./themed-view"
import IntervaloSono from "@/models/IntervaloSono";
import { Pressable, StyleSheet } from "react-native";
import { AlertUtils } from "@/utils/AlertUtils";
import { SonoService } from "@/service/SonoService";

import { useState } from "react";
import ModalEditarIntervaloSono from "./modal/modal-editar-intervalo-sono";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/use-theme-color";

type Props = {
    intervaloSono: IntervaloSono,
}

export const MarcacaoSono = ({intervaloSono }:Props) => {

    const vermelho = useThemeColor({}, 'vermelho');

    const [modalIsVisible, setModalIsVisible] = useState(false);

    const horaInicio = intervaloSono.horaInicio;
    const horaFim = intervaloSono.horaFim;

    const fmtInicio = Formatador(horaInicio);
    const fmtFim = Formatador(horaFim);

    const diffInicioEFim = diferencaEntreDatas(horaInicio, horaFim);

    const deletarIntervalo = async (intervalo:IntervaloSono) => {
        AlertUtils.confirm(
            "Deseja realmente apagar esse intervalo de sono?",

            async () => {
                await SonoService.getInstance().deletarIntervaloSono(intervalo);
            }
        );
    }

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