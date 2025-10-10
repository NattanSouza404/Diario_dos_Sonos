import { ThemedText } from "@/components/themed-text";
import { Pressable } from "react-native";

import { StyleSheet } from 'react-native';

type Props = {
    sonoIsAtivo: boolean,
    onPress: () => void
}

export const MarcarSonoButton = ( {sonoIsAtivo, onPress }: Props ) => {
    return(
        <Pressable
            onPress={onPress}
            style={[
                styles.marcarSonoButton,
                { backgroundColor: sonoIsAtivo ? 'red' : 'green' }
            ]}
        >
            <ThemedText>
                {sonoIsAtivo ? 'Parar' : 'Iniciar'}
            </ThemedText>
        </Pressable>
    )
}

export default MarcarSonoButton;

const styles = StyleSheet.create({

    marcarSonoButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'green',
        height: 100,
        width: 100,
        borderRadius: 50, // half of width/height → makes it a circle
    }

})