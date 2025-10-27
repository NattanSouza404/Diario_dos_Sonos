import { Image } from "react-native";
 
export const IconeTravesseiro = () => {
    return (
        <Image
            source={require('@/assets/images/pillow.png')}
            style={{
                width: 200,
                height: 200,
                alignSelf: 'center'
            }}
          />
    );
}
        