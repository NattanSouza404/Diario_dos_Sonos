import React, { useState } from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type Props = {
  mode?: 'date' | 'time';
  initialDate: Date;
  onConfirm: (date: Date) => void;
  label?: string;
  valor: Date;
  setValor: (date:Date) => void;
  disabled?: boolean;
};

export default function DatePicker({
  mode = 'date',
  initialDate,
  onConfirm,
  label = '',
  valor,
  setValor,
  disabled = false,
}: Props) {
  const [visible, setVisible] = useState(false);

  const handleConfirm = (selected: Date) => {
    setVisible(false);
    setValor(selected);
    onConfirm(selected);
  };

  if (Platform.OS === 'web') {
    return <DatePickerWeb />;
  }

  return (
    <DatePickerNativo/>
  );

  function DatePickerNativo() {
    return ( 
      <View style={styles.container}>
        <Text>{label}</Text>
        <Button
          title={
            mode === 'time'
              ? valor.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
              : valor.toLocaleDateString('pt-BR')
          }
          onPress={() => setVisible(true)}
          disabled={disabled}
        />

        <DateTimePickerModal
          isVisible={visible}
          mode={mode}
          date={initialDate}
          is24Hour={true}
          onConfirm={handleConfirm}
          onCancel={() => setVisible(false)}
        />
      </View>
    );
  }

  function DatePickerWeb() {
    const inputType = mode === 'time' ? 'time' : 'date';

    return (
      <View style={stylesWeb.container}>
        <Text>{label}</Text>
        <input
          disabled={disabled}
          type={inputType}
          value={
            mode === 'time'
              ? valor.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
              : valor.toLocaleDateString('en-CA')
          }
          onChange={(e) => {
            const newValue = e.target.value;
            const current = new Date(valor);

            let newDate;
            if (mode === 'time') {
              const [hours, minutes] = newValue.split(':').map(Number);
              newDate = new Date(
                current.getFullYear(),
                current.getMonth(),
                current.getDate(),
                hours,
                minutes
              );
            } else {
              const [year, month, day] = newValue.split('-').map(Number);
              newDate = new Date(
                year,
                month - 1,
                day,
                current.getHours(),
                current.getMinutes(),
                current.getSeconds()
              );
            }

            setValor(newDate);
            onConfirm(newDate);
          }}
          style={stylesWeb.input}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: 120
  },
});

const stylesWeb = {
  container: {
    marginVertical: 8,
    width: 180,
  },
  input: {
    padding: 8,
    borderRadius: 8,
    border: '1px solid #ccc',
    fontSize: 16,
    width: '80%',
  }
}