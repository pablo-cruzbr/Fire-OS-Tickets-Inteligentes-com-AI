import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { api } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignatureScreen, { SignatureViewRef } from '../SignaturePad';
import { MultiSelect } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import { font, radii, ThemeColors, useTheme, useThemedStyles, withAlpha } from '../../theme';

interface ModalDetailOrderTecnicoProps {
  ordemId: string;
  handleCloseModal: () => void;
  tempoFinal: number;
}

interface Atividade {
  id: string;
  descricao: string;
}

export function ModalDetailOrderFormTecnico({
  ordemId,
  handleCloseModal,
  tempoFinal,
}: ModalDetailOrderTecnicoProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [nameTecnico, setNameTecnico] = useState('');
  const [assinante, setAssinante] = useState('');
  const [solucao, setSolucao] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [atividadesDB, setAtividadesDB] = useState<Atividade[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const signatureRef = useRef<SignatureViewRef>(null);

useEffect(() => {
  async function loadAtividades() {
    try {
      const storageToken = await AsyncStorage.getItem("@AlltiService");
      if (!storageToken) return;

      const { token } = JSON.parse(storageToken);
      if (!token) return;

      const response = await api.get('/listatividade', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = Array.isArray(response.data) ? response.data : (response.data.atividades || []);
      setAtividadesDB(data);

    } catch (error: any) {
      console.error("Erro no teste:", error.response?.status, error.message);
    }
  }

  loadAtividades();
}, []);

  const handleSignature = (sig: string) => {
    setSignature(sig);
    setShowSignatureModal(false);
  };

  const handleSubmit = async () => {
    if (!signature) {
      Alert.alert('Atenção', 'Por favor, adicione a assinatura antes de salvar.');
      return;
    }

    try {
      setLoading(true);
      const storageToken = await AsyncStorage.getItem('@AlltiService');
      if (!storageToken) return;
      const { token } = JSON.parse(storageToken);

      await api.patch(
        `/ordemdeservico/update/${ordemId}`,
        {
          nameTecnico,
          solucao,
          assinante,
          assinatura: signature,
          duracao: tempoFinal,
          atividades_ids: JSON.stringify(selectedItems),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Sucesso', 'Dados Salvos com sucesso!');
      handleCloseModal();
    } catch (error: any) {
      console.error("Erro no envio:", error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível atualizar a ordem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <Text style={styles.eyebrow}>ORDEM DE SERVIÇO</Text>
            <Text style={styles.title}>Descrição Técnica</Text>

            <TextInput
              placeholder="Nome do Técnico"
              placeholderTextColor={colors.placeholder}
              onFocus={() => setFocusedField("tecnico")}
              onBlur={() => setFocusedField(null)}
              style={[styles.input, focusedField === "tecnico" && styles.inputFocused]}
              value={nameTecnico}
              onChangeText={setNameTecnico}
            />

            <Text style={styles.label}>Atividades Realizadas:</Text>
            <MultiSelect
              style={styles.dropdown}
              data={atividadesDB}
              labelField="descricao"
              valueField="id"
              placeholder="Selecione as atividades..."
              value={selectedItems}
              onChange={item => setSelectedItems(item)}
              selectedStyle={styles.selectedBadge}
              selectedTextStyle={styles.selectedBadgeText}
              placeholderStyle={styles.dropdownPlaceholder}
              containerStyle={styles.dropdownContainer}
              itemContainerStyle={styles.dropdownItem}
              itemTextStyle={styles.dropdownItemText}
              activeColor={colors.primarySoft}
              iconColor={colors.muted}
            />

            <TextInput
              placeholder="Solução"
              placeholderTextColor={colors.placeholder}
              onFocus={() => setFocusedField("solucao")}
              onBlur={() => setFocusedField(null)}
              style={[styles.input, styles.textArea, focusedField === "solucao" && styles.inputFocused]}
              value={solucao}
              onChangeText={setSolucao}
              multiline
            />

            <Text style={styles.label}>Responsável que assinou:</Text>
            <TextInput
              placeholder="Nome de quem está assinando"
              placeholderTextColor={colors.placeholder}
              onFocus={() => setFocusedField("assinante")}
              onBlur={() => setFocusedField(null)}
              style={[styles.input, focusedField === "assinante" && styles.inputFocused]}
              value={assinante}
              onChangeText={setAssinante}
            />

            <Text style={styles.label}>Assinatura:</Text>
            {signature ? (
              <View style={styles.signaturePreviewContainer}>
                <Image 
                  source={{ uri: signature }} 
                  style={styles.signatureImage} 
                  resizeMode="contain" 
                />
                <TouchableOpacity style={styles.reSignButton} onPress={() => setShowSignatureModal(true)}>
                  <MaterialIcons name="refresh" size={16} color={colors.primaryText} />
                  <Text style={styles.reSignText}>Refazer assinatura</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.buttonSignatureOpen} 
                onPress={() => setShowSignatureModal(true)}
              >
                <MaterialIcons name="edit" size={20} color={colors.primaryText} />
                <Text style={styles.buttonSignatureText}>COLETAR ASSINATURA</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.buttonPrimary, (loading || !signature || !assinante) && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading || !signature || !assinante}
            >
              {loading ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={styles.buttonText}>Salvar PROGRESSO</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonClose} onPress={handleCloseModal}>
              <Text style={styles.buttonTextClose}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showSignatureModal} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalSignatureContainer}>
          <View style={styles.modalSignatureHeader}>
            <Text style={styles.modalSignatureTitle}>Assinatura Digital</Text>
            <TouchableOpacity onPress={() => setShowSignatureModal(false)}>
              <MaterialIcons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.padHint}>Assine no quadro abaixo</Text>
          <View style={styles.canvasWrapper}>
            <SignatureScreen
              ref={signatureRef}
              onOK={handleSignature}
              onEmpty={() => Alert.alert('Aviso', 'A assinatura não pode estar vazia')}
              descriptionText=""
              autoClear={false}
              imageType="image/png"
              webStyle={`.m-signature-pad--footer { display: none; }`}
            />
          </View>

          <View style={styles.modalSignatureFooter}>
            <TouchableOpacity style={styles.modalButtonClear} onPress={() => signatureRef.current?.clearSignature()}>
              <Text style={styles.buttonClearText}>Limpar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalButtonSave} onPress={() => signatureRef.current?.readSignature()}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}


const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: c.background },
    scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 40 },
    container: { flex: 1 },
    eyebrow: { color: c.eyebrow, fontSize: 11, letterSpacing: 1.6, ...font('semibold') },
    title: { fontSize: 22, marginBottom: 20, color: c.text, letterSpacing: -0.4, ...font('bold') },
    label: { marginBottom: 8, fontSize: 13, color: c.body, ...font('medium') },
    input: {
      borderWidth: 1,
      borderColor: c.inputBorder,
      backgroundColor: c.inputBg,
      borderRadius: radii.btn,
      padding: 12,
      marginBottom: 15,
      fontSize: 15,
      color: c.text,
      ...font('regular'),
      ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null),
    },
    inputFocused: { borderColor: c.inputFocus },
    textArea: { height: 90, textAlignVertical: 'top' },
    dropdown: {
      minHeight: 52,
      borderColor: c.inputBorder,
      backgroundColor: c.inputBg,
      borderWidth: 1,
      borderRadius: radii.btn,
      paddingHorizontal: 12,
      marginBottom: 15,
    },
    dropdownPlaceholder: { color: c.placeholder, fontSize: 14, ...font('regular') },
    dropdownContainer: { borderRadius: radii.btn, borderColor: c.border, backgroundColor: c.surface, overflow: 'hidden' },
    dropdownItem: { backgroundColor: c.surface },
    dropdownItemText: { color: c.text, fontSize: 14, ...font('regular') },
    selectedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderRadius: radii.pill,
      backgroundColor: c.primarySoft,
      borderColor: c.borderAccent,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginTop: 8,
      marginRight: 8,
    },
    selectedBadgeText: { color: c.primaryText, fontSize: 12, ...font('semibold') },

    signaturePreviewContainer: {
      width: '100%',
      height: 150,
      borderWidth: 1,
      borderColor: withAlpha(c.success, 0.6),
      borderRadius: radii.btn,
      backgroundColor: c.paper,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 25,
      overflow: 'hidden',
    },
    signatureImage: { width: '100%', height: '100%' },
    reSignButton: {
      position: 'absolute',
      bottom: 6,
      right: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: c.card,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: radii.btn,
      borderWidth: 1,
      borderColor: c.border,
    },
    reSignText: { color: c.primaryText, fontSize: 12, ...font('semibold') },

    buttonSignatureOpen: {
      backgroundColor: c.primarySoft,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: c.primary,
      flexDirection: 'row',
      padding: 16,
      borderRadius: radii.btn,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 25,
      gap: 10,
    },
    buttonSignatureText: { color: c.primaryText, fontSize: 14, letterSpacing: 0.4, ...font('bold') },

    modalSignatureContainer: { flex: 1, backgroundColor: c.background },
    modalSignatureHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    modalSignatureTitle: { fontSize: 18, color: c.text, ...font('bold') },
    padHint: { color: c.body, fontSize: 13, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, ...font('medium') },
    canvasWrapper: {
      flex: 1,
      marginHorizontal: 20,
      borderRadius: radii.card,
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
      backgroundColor: c.paper,
    },
    modalSignatureFooter: {
      flexDirection: 'row',
      padding: 20,
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: c.border,
      marginTop: 16,
    },
    modalButtonClear: { flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: c.borderStrong, padding: 16, borderRadius: radii.btn, alignItems: 'center' },
    modalButtonSave: { flex: 2, backgroundColor: c.brand, padding: 16, borderRadius: radii.btn, alignItems: 'center' },

    buttonPrimary: {
      backgroundColor: c.brand,
      borderWidth: 1,
      borderColor: withAlpha(c.periwinkle, 0.6),
      padding: 17,
      borderRadius: radii.btn,
      alignItems: 'center',
      marginBottom: 12,
    },
    buttonClose: { padding: 10, alignItems: 'center' },
    buttonText: { color: c.onPrimary, fontSize: 16, ...font('bold') },
    buttonClearText: { color: c.text, fontSize: 16, ...font('semibold') },
    buttonTextClose: { color: c.muted, fontSize: 14, ...font('semibold') },
  });
