import { AlertUtils } from "@/utils/AlertUtils";
import DatePicker from "../date-picker";
import IntervaloSono from "@/models/IntervaloSono";
import { Pressable } from "react-native";
import { ThemedText } from "../themed-text";
import CustomModal from "./custom-modal";
import { Formatador } from "@/service/Formatador";
import { SonoService } from "@/service/SonoService";
import { useEffect, useState } from "react";

import { StyleSheet } from 'react-native';
import { ThemedView } from "../themed-view";
import { SelecaoDateTime } from "../selecao-date-time";

type Props = {
    isVisible: boolean,
    setIsVisible: (isVisible: boolean) => void,
    intervaloSono: IntervaloSono
}

export const ModalEditarIntervaloSono = ({intervaloSono, setIsVisible, isVisible}:Props) => {
    const [horaInicio, setHoraInicio] = useState<Date>(intervaloSono.horaInicio);
    const [horaFim, setHoraFim] = useState<Date>(intervaloSono.horaFim);

    useEffect(() => {
        if (isVisible) {
            setHoraInicio(intervaloSono.horaInicio);
            setHoraFim(intervaloSono.horaFim);
        }
      }, [isVisible]);

    const confirmarEdicao = () => {
        AlertUtils.confirm("Confirma as alterações?", async () => {
            try {
                const intervalo = new IntervaloSono(
                    horaInicio, horaFim
                );

                intervalo.horaInicio.setDate(horaInicio.getDate());
                intervalo.horaInicio.setMonth(horaInicio.getMonth());
                intervalo.horaInicio.setFullYear(horaInicio.getFullYear());

                const service = SonoService.getInstance();


                await service.editarIntervaloSono(intervalo);
            } catch(error) {
                AlertUtils.alert((error as Error).message);
            } finally {
                setIsVisible(false);
            }
        });
    };

    return (
        <CustomModal
            isVisible={isVisible}
            onClose={() => {}}
        >
            <ThemedView backgroundIsSecondary={true}>
                
                <ThemedText type="title" style={styles.titulo}>
                    {Formatador(horaFim).data}
                </ThemedText>

                <ThemedView style={styles.mainContainer} backgroundIsSecondary={true}>
                    <ThemedView style={styles.secao} backgroundIsSecondary={true}>
                        <ThemedText type="subtitle" style={styles.subtitulo}>
                            Início
                        </ThemedText>

                        <SelecaoDateTime
                            hora={horaInicio}
                            setHora={setHoraInicio}
                        />
                    </ThemedView>

                    <ThemedView style={styles.secao} backgroundIsSecondary={true}>
                        <ThemedText type="subtitle" style={styles.subtitulo}>
                            Fim
                        </ThemedText>

                        <SelecaoDateTime
                            hora={horaFim}
                            setHora={setHoraFim}
                            dataIsDisabled={true}
                        />

                    </ThemedView>
                </ThemedView>

                <ThemedView style={styles.navOpcoes} backgroundIsSecondary={true}>
                    <Pressable onPress={() => setIsVisible(false)}>
                        <ThemedText style={styles.textoVermelho}>
                            Cancelar
                        </ThemedText>
                    </Pressable>

                    <Pressable onPress={() => confirmarEdicao()}>
                        <ThemedText>OK</ThemedText>
                    </Pressable>
                </ThemedView>

            </ThemedView>
        </CustomModal>
    );
}

export default ModalEditarIntervaloSono;

const styles = StyleSheet.create(
    {
        titulo: {
            textAlign: 'center'
        },
        subtitulo: {
            textAlign: "center"
        },
        mainContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
        },
        secao: {
            display: 'flex',
            alignItems: 'center',

            marginTop: 8,
            marginBottom: 8
        },
        navOpcoes: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            marginTop: 8,
            padding: 4
        },
        textoVermelho: {
            color: "red"
        },
    }
);