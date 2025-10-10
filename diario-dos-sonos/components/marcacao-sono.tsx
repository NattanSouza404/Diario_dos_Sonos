import { diferencaEntreDatas, Formatador } from "@/service/Formatador";
import { ThemedText } from "./themed-text"
import { ThemedView } from "./themed-view"
import IntervaloSono from "@/models/IntervaloSono";

type Props = {
    intervaloSono: IntervaloSono,
}

export const MarcacaoSono = ({intervaloSono}:Props) => {

    const horaInicio = intervaloSono.horaInicio;
    const horaFim = intervaloSono.horaFim;

    const fmtInicio = Formatador(horaInicio);
    const fmtFim = Formatador(horaFim);

    const diffInicioEFim = diferencaEntreDatas(horaInicio, horaFim);

    return (
        <ThemedView style={{ backgroundColor: 'white'}}>
            <ThemedText type='title'>{fmtInicio.mes} {fmtInicio.ano}</ThemedText>
            <ThemedText>{fmtInicio.mes} {fmtInicio.dia} ({fmtInicio.diaSemana})</ThemedText>
            <ThemedText>{diffInicioEFim.horas} horas e {diffInicioEFim.minutos} minutos</ThemedText>
            <ThemedText>{fmtInicio.horario} - {fmtFim.horario}</ThemedText>
            <ThemedText>Média Semanal</ThemedText>
            <ThemedText>Qualidade de sono: Boa</ThemedText>
        </ThemedView>
    );
}
