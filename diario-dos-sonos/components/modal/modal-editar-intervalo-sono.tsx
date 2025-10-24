import { AlertUtils } from "@/utils/AlertUtils";
import DatePicker from "../date-picker";
import IntervaloSono from "@/models/IntervaloSono";
import { Pressable, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";
import CustomModal from "./custom-modal";
import { Formatador, retrocederUmDia } from "@/service/Formatador";
import { SonoService } from "@/service/SonoService";
import { useEffect, useState } from "react";
import { ThemedView } from "../themed-view";

import { StyleSheet } from 'react-native';

type Props = {
    isVisible: boolean,
    setIsVisible: (isVisible: boolean) => void,
    intervaloSono: IntervaloSono
}

export const ModalEditarIntervaloSono = ({intervaloSono, setIsVisible, isVisible}:Props) => {
    const [selected, setSelected] = useState(intervaloSono.horaInicio);

    const [horaInicio, setHoraInicio] = useState<Date>(intervaloSono.horaInicio);
    const [horaFim, setHoraFim] = useState<Date>(intervaloSono.horaFim);

    const opcoesData = [retrocederUmDia(intervaloSono.horaFim), intervaloSono.horaFim];

    useEffect(() => {
        if (isVisible) {
            setHoraInicio(intervaloSono.horaInicio);
            setHoraFim(intervaloSono.horaFim);
        }
      }, [isVisible]);

    const confirmarEdicao = (intervalo:IntervaloSono) => {
        AlertUtils.confirm("Confirma as alterações?", async () => {
            const service = SonoService.getInstance();

            try {
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
            {opcoesData.map((option) => (
                <TouchableOpacity
                    key={Formatador(option).data}
                    onPress={() => setSelected(new Date(option))}
                    style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
                    >
                    <ThemedView style={styles.selecao}>
                        {
                            selected.getTime() === option.getTime() && (
                                <ThemedView style={styles.selecaoSelecionada}/>
                            )
                        }
                    </ThemedView>
                    <ThemedText style={styles.textoVermelho}>
                        {Formatador(option).data}
                    </ThemedText>
                </TouchableOpacity>
            ))}


            <DatePicker
                mode="time"
                onConfirm={() => {}}
                initialDate={horaInicio}
                label={"Inicio: "+Formatador(selected).data}
                valor={horaInicio}
                setValor={setHoraInicio}
            />

            <DatePicker
                mode="time"
                onConfirm={() => {}}
                initialDate={horaFim}
                label={"Final: "+Formatador(horaFim).data}
                valor={horaFim}
                setValor={setHoraFim}
            />

            <Pressable onPress={() => {
                setIsVisible(false)
            }}>
                <ThemedText style={styles.textoVermelho}>Cancelar</ThemedText>
            </Pressable>

            <Pressable onPress={() => {
                const intervalo = new IntervaloSono(
                    horaInicio, horaFim
                );

                intervalo.horaInicio.setDate(selected.getDate());
                intervalo.horaInicio.setMonth(selected.getMonth());
                intervalo.horaInicio.setFullYear(selected.getFullYear());

                confirmarEdicao(intervalo);
            }}
            >
                <ThemedText style={styles.textoVermelho}>OK</ThemedText>
            </Pressable>
        </CustomModal>
    );
}

export default ModalEditarIntervaloSono;

const styles = StyleSheet.create(
    {
        selecao: {
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#555',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
        },
        selecaoSelecionada: {
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: '#555',
        },
        textoVermelho: {
            color: "red"
        }
    }
);