import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable } from "react-native";

import { StyleSheet } from 'react-native';
import ModalAdicionarIntervaloSono from "./modal/modal-adicionar-intervalo-sono";
import { ThemedView } from "./themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export const AdicionarSonoButton = () => {
    const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
    
    const vermelho = useThemeColor({}, 'vermelho');

    return(
        <ThemedView style={styles.container} hasBorder={true} backgroundIsSecondary={true}>
            <Pressable
                onPress={() => setModalIsVisible(true)}
                style={styles.button}
            >
                <Ionicons name="calendar-sharp" size={28} color={vermelho} />
                <ThemedText>Adicionar novo sono</ThemedText>

                <ModalAdicionarIntervaloSono
                    isVisible={modalIsVisible}
                    setIsVisible={setModalIsVisible}
                />
            </Pressable>
        </ThemedView>
    )
}

export default AdicionarSonoButton;

const styles = StyleSheet.create({
    container: {
        borderRadius: '10%',
        width: 200,
        borderWidth: 1
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-around',
        padding: 8,
    },
})