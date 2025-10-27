import React from 'react';
import { Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ThemedView } from '../themed-view';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function CustomModal({ isVisible: visible, onClose, children }: CustomModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <ThemedView style={styles.overlay} />
      </TouchableWithoutFeedback>

      <ThemedView style={styles.centered}>
        <ThemedView style={styles.modal} backgroundIsSecondary={true} hasBorder={true}>
          {children}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centered: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderWidth: 2,
    padding: 20,
    borderRadius: 12,
    width: '80%',
  },
});