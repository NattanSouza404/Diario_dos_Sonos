import { Alert, Platform } from "react-native";

class AlertWeb {
    confirm(msg:string, handleConfirmacao:Function){
        if (confirm(msg)){
            handleConfirmacao();
        }
    }
}

class AlertAndroid {
    confirm(msg:string, handleConfirmacao:Function){
        Alert.alert("Atenção", msg, [
        {
            text: "Cancelar",
            style: "cancel"
        },
        {
            text: "Sim",
            onPress: () => handleConfirmacao()
        }
        ]);
    }
}

export class AlertUtils {
    static implAlert: AlertWeb | AlertAndroid; 

    static {
        if (Platform.OS === 'web'){
            this.implAlert = new AlertWeb();
        }

        if (Platform.OS === 'android'){
            this.implAlert = new AlertAndroid();
        }
    }

    static confirm(msg:string, handleConfirmacao:Function){
        this.implAlert.confirm(msg, handleConfirmacao);
    }

}
