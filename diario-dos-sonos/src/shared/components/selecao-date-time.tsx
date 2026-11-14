import { StyleSheet } from "react-native";
import DatePicker from "./date-picker";
import { ThemedView } from "./themed-view";

type Props = {
    hora: Date,
    setHora: (date:Date) => void,
    dataIsDisabled?: boolean,
    horaIsDisabled?: boolean,
}

export const SelecaoDateTime = ({hora, setHora, dataIsDisabled = false, horaIsDisabled = false}: Props) => {
    return (
        <ThemedView style={styles.secaoDateTimeInicio} backgroundIsSecondary={true}>
            <DatePicker
                mode="date"
                onConfirm={() => {}}
                initialDate={hora}
                valor={hora}
                setValor={setHora}
                disabled={dataIsDisabled}
            />
            
            <DatePicker
                mode="time"
                onConfirm={() => {}}
                initialDate={hora}
                valor={hora}
                setValor={setHora}
                disabled={horaIsDisabled}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    secaoDateTimeInicio: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        columnGap: 16,
    },
})