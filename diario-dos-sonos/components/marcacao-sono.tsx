import { diferencaEntreDatas, Formatador } from "@/service/Formatador";
import { ThemedText } from "./themed-text"
import { ThemedView } from "./themed-view"
import IntervaloSono from "@/models/IntervaloSono";
import { Pressable, StyleSheet } from "react-native";
import { AlertUtils } from "@/utils/AlertUtils";
import { SonoService } from "@/service/SonoService";

import { useState } from "react";
import ModalEditarIntervaloSono from "./modal/modal-editar-intervalo-sono";

type Props = {
    intervaloSono: IntervaloSono,
}

export const MarcacaoSono = ({intervaloSono }:Props) => {

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
        <ThemedView style={styles.marcacaoSono}>
            <ThemedText type='title' style={styles.texto}>{fmtInicio.mes} {fmtInicio.ano}</ThemedText>
            <ThemedText style={styles.texto}>{fmtInicio.mes} {fmtInicio.dia} ({fmtInicio.diaSemana})</ThemedText>
            <ThemedText style={styles.texto}>{diffInicioEFim.duracaoEmExtenso}</ThemedText>
            <ThemedText style={styles.texto}>{fmtInicio.horario} - {fmtFim.horario}</ThemedText>
            <ThemedText style={styles.texto}>Média Semanal</ThemedText>
            <ThemedText style={styles.texto}>Qualidade de sono: Boa</ThemedText>
            <Pressable onPress={() => deletarIntervalo(intervaloSono)}>
                <ThemedText style={styles.textoVermelho}>X</ThemedText>
            </Pressable>
            <Pressable onPress={() => {
                setModalIsVisible(true);
            }}>
                <ThemedText style={styles.textoVermelho}>Editar</ThemedText>
            </Pressable>
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
        margin: 8,
        padding: 8,
        backgroundColor: "white",
        borderRadius: 20,
        color: "black",
    },
    texto: {
        color: "black"
    },
    textoVermelho: {
        color: "red"
    }
})