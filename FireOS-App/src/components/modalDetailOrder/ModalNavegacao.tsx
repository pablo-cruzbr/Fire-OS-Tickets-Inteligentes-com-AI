import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert,
  Platform,
  Modal
} from "react-native";
import { ScrollComIndicador } from "../ScrollComIndicador";
import { OrdensDeServico } from "../../pages/Dashboard";
import { ModalDetailOrderFormTecnico } from "../modalDetailOrderFormTecnico";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons'; // Se usar Expo
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Se usar React Native CLI puro
import { font, radii, ThemeColors, useTheme, useThemedStyles } from '../../theme';


const { width: WIDTH } = Dimensions.get("window");

interface ModalDetailOsProps {
  ordem: OrdensDeServico | null;
  handleCloseModal: () => void;
}

export function ModalNavegacao({ ordem, handleCloseModal }: ModalDetailOsProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [modalTecnicoOpen, setModalTecnicoOpen] = useState(false);
  const [modalDestinoOpen, setModalDestinoOpen] = useState(false);
  const [ordemAtual] = useState<OrdensDeServico | null>(ordem);
  const [time] = useState(0);

  const abrirWaze = (endereco: string) => {
    const url = `waze://?q=${encodeURIComponent(endereco)}&navigate=yes`;
    const fallback = `https://waze.com/ul?q=${encodeURIComponent(endereco)}&navigate=yes`;
    Linking.openURL(url).catch(() => Linking.openURL(fallback).catch(() => Alert.alert("Erro", "Não foi possível abrir o Waze.")));
  };

  const abrirGoogleMaps = (endereco: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(endereco)}`,
      android: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`
    });
    if (url) Linking.openURL(url);
  };

  const getDestinos = () => {
    const destinos = [];
    if (ordemAtual?.instituicaoUnidade?.endereco) destinos.push({ label: "Instituição: " + ordemAtual.instituicaoUnidade.name, endereco: ordemAtual.instituicaoUnidade.endereco });
    if (ordemAtual?.user?.cliente?.endereco) destinos.push({ label: "Empresa: " + ordemAtual.user.cliente.name, endereco: ordemAtual.user.cliente.endereco });
    return destinos;
  };

  if (!ordemAtual) return null;

  return (
    <>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={handleCloseModal} />
      
 <View style={styles.modalContainer}>
  <TouchableOpacity 
    style={[styles.buttonBase, styles.buttonNavigation]} 
    onPress={() => setModalDestinoOpen(true)}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <MaterialIcons name="navigation" size={20} color={colors.onPrimary} style={{ marginRight: 8 }} />
      <Text style={styles.textButton}>NAVEGAR ATÉ O LOCAL</Text>
    </View>
  </TouchableOpacity>
</View>

      <Modal visible={modalDestinoOpen} transparent={true} animationType="fade">
        <View style={styles.centeredModal}>

        <View style={styles.modalContent}>
  <Text style={styles.title}>Escolha o destino:</Text>
  {getDestinos().map((item, index) => (
    <View key={index} style={styles.destinoItem}>
      <Text style={styles.destinoLabel}>{item.label}</Text>
      <View style={styles.rowButtons}>
        <TouchableOpacity style={styles.btnNav} onPress={() => abrirWaze(item.endereco)}>
          <FontAwesome5 name="waze" size={16} color={colors.onPrimary} /> <Text style={styles.btnNavText}>WAZE</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={[styles.btnNav, styles.btnNavMaps]} onPress={() => 
          abrirGoogleMaps(item.endereco)}>
          <FontAwesome5 name="map-marked-alt" size={16} color={colors.onPrimary} /> <Text style={styles.btnNavText}>GOOGLE MAPS</Text>
        </TouchableOpacity>
      </View>
    </View>
  ))}
  <TouchableOpacity onPress={() => setModalDestinoOpen(false)} style={{marginTop: 15, width: '100%', alignItems: 'center', justifyContent: 'center'}}
><Text style={styles.closeText}>Fechar</Text></TouchableOpacity>
</View>

        </View>
      </Modal>
    </>
  );
}

export default ModalNavegacao;

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: c.overlay },
    modalContainer: {
      width: WIDTH,
      backgroundColor: 'transparent',
      paddingTop: 14,
      paddingBottom: 4,
    },
    buttonBase: {
      backgroundColor: c.brand,
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: radii.btn,
      alignItems: 'center',
      width: '90%',
    },
    buttonNavigation: { backgroundColor: c.brand, borderWidth: 1, borderColor: 'rgba(121,137,250,0.6)' },
    textButton: { color: c.onPrimary, fontSize: 13, letterSpacing: 0.4, ...font('bold') },
    title: { fontSize: 18, color: c.text, ...font('bold') },
    centeredModal: { flex: 1, backgroundColor: c.overlay, justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: c.card, padding: 20, borderRadius: radii.card, borderWidth: 1, borderColor: c.border },
    destinoItem: { marginTop: 15, borderBottomWidth: 1, borderColor: c.border, paddingBottom: 12 },
    destinoLabel: { color: c.text, fontSize: 14, ...font('semibold') },
    rowButtons: { flexDirection: 'row', gap: 10, marginTop: 10 },
    btnNav: { flex: 1, flexDirection: 'row', gap: 6, justifyContent: 'center', padding: 11, backgroundColor: c.brand, alignItems: 'center', borderRadius: radii.btn },
    btnNavMaps: { backgroundColor: c.successStrong },
    btnNavText: { color: c.onPrimary, fontSize: 12, ...font('bold') },
    closeText: { color: c.body, fontSize: 14, ...font('semibold') },
  });
