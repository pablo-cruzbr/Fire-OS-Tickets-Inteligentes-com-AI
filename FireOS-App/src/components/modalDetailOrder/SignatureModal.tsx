import React, { useState, useRef, useEffect } from 'react';
import { Modal, SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import SignatureScreen, { SignatureViewRef } from '../SignaturePad';
import { font, radii, ThemeColors, useTheme, useThemedStyles } from '../../theme';
import { MaterialIcons } from '@expo/vector-icons';

interface SignatureModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (signature: string, nomeAssinante: string) => void;
}

export function SignatureModal({ visible, onClose, onSave }: SignatureModalProps) {
  const [nomeAssinante, setNomeAssinante] = useState('');
  const signatureRef = useRef<SignatureViewRef>(null);
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  // Limpa o campo toda vez que o modal for aberto
  useEffect(() => {
    if (visible) {
      setNomeAssinante('');
    }
  }, [visible]);

  const handleConfirm = () => {
    if (nomeAssinante.trim() === '') {
      Alert.alert('Atenção', 'Por favor, informe o nome do responsável.');
      return;
    }
    // Dispara o comando para o canvas gerar a imagem
    signatureRef.current?.readSignature();
  };

  const handleOK = (signature: string) => {
    // Quando o SignatureScreen processar com sucesso, chama o callback
    onSave(signature, nomeAssinante.trim());
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Assinatura Digital</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome do Responsável:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o nome completo..."
            value={nomeAssinante}
            onChangeText={setNomeAssinante}
            returnKeyType="done"
            placeholderTextColor={colors.placeholder}
          />
        </View>

        <Text style={[styles.label, styles.padLabel]}>Assine no quadro abaixo:</Text>
        <View style={styles.canvasWrapper}>
          <SignatureScreen
            ref={signatureRef}
            onOK={handleOK}
            onEmpty={() => Alert.alert('Aviso', 'A assinatura não pode estar vazia')}
            descriptionText=""
            autoClear={false}
            imageType="image/png"
            webStyle={`.m-signature-pad--footer { display: none; }`}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.buttonClear} 
            onPress={() => signatureRef.current?.clearSignature()}
          >
            <Text style={styles.buttonClearText}>Limpar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.buttonSave} 
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: c.border },
    title: { fontSize: 18, color: c.text, ...font('bold') },
    inputContainer: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
    label: { marginBottom: 8, fontSize: 13, color: c.body, ...font('medium') },
    padLabel: { paddingHorizontal: 20 },
    input: {
      borderWidth: 1,
      borderColor: c.inputBorder,
      borderRadius: radii.btn,
      padding: 12,
      fontSize: 16,
      color: c.text,
      backgroundColor: c.inputBg,
      ...font('regular'),
    },
    canvasWrapper: {
      flex: 1,
      marginHorizontal: 20,
      borderRadius: radii.card,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
      backgroundColor: c.paper,
    },
    footer: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: c.border, marginTop: 16 },
    buttonClear: { flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: c.borderStrong, padding: 16, borderRadius: radii.btn, alignItems: 'center' },
    buttonSave: { flex: 2, backgroundColor: c.brand, padding: 16, borderRadius: radii.btn, alignItems: 'center' },
    buttonText: { color: c.onPrimary, fontSize: 16, ...font('semibold') },
    buttonClearText: { color: c.text, fontSize: 16, ...font('semibold') },
  });
