import { AlertUtils } from "@/utils/AlertUtils";
import IntervaloSono from "@/domain/models/IntervaloSono";
import { Pressable } from "react-native";

import { SonoService } from "@/domain/service/SonoService";
import { useEffect, useState } from "react";

import { StyleSheet } from 'react-native';
import { Colors } from "@/constants/theme";
import { Formatador } from "@/utils/DataUtils";
import CustomModal from "@/components/custom-modal";
import { ThemedView } from "@/components/themed-view";
import { SelecaoDateTime } from "@/components/selecao-date-time";
import { ThemedText } from "@/components/themed-text";

type Props = {
    isVisible: boolean,
    setIsVisible: (isVisible: boolean) => void,
}

export const ModalAdicionarIntervaloSono = ({setIsVisible, isVisible}:Props) => {
    const [horaInicio, setHoraInicio] = useState<Date>(new Date());
    const [horaFim, setHoraFim] = useState<Date>(new Date());

    useEffect(() => {
        if (isVisible) {
            setHoraInicio(horaInicio);
            setHoraFim(horaFim);
        }
    }, [isVisible]);

    const confirmarAdicao = () => {
        AlertUtils.confirm("Confirma as alterações?", async () => {
            try {
                const intervalo = new IntervaloSono(
                    horaInicio, horaFim
                );

                intervalo.horaInicio.setDate(horaInicio.getDate());
                intervalo.horaInicio.setMonth(horaInicio.getMonth());
                intervalo.horaInicio.setFullYear(horaInicio.getFullYear());

                const service = SonoService.getInstance();

                await service.adicionarIntervaloSono(intervalo);

                setIsVisible(false);
            } catch(error) {
                AlertUtils.alert((error as Error).message);
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
                        />

                    </ThemedView>
                </ThemedView>

                <ThemedView style={styles.navOpcoes} backgroundIsSecondary={true}>
                    <Pressable onPress={() => setIsVisible(false)}>
                        <ThemedText style={styles.textoVermelho}>
                            Cancelar
                        </ThemedText>
                    </Pressable>

                    <Pressable onPress={() => confirmarAdicao()}>
                        <ThemedText>OK</ThemedText>
                    </Pressable>
                </ThemedView>

            </ThemedView>
        </CustomModal>
    );
}

export default ModalAdicionarIntervaloSono;

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
            color: Colors.dark.vermelho
        },
    }
);