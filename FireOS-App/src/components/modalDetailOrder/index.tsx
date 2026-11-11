import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Linking,
  Image,
  Alert,
  Platform,
  Modal
} from "react-native";
import { ScrollComIndicador } from "../ScrollComIndicador";
import { OrdensDeServico } from "../../pages/Dashboard";
import { MaterialIcons } from "@expo/vector-icons";
import { ModalDetailOrderFormTecnico } from "../modalDetailOrderFormTecnico";
import { ModalNavegacao } from "./ModalNavegacao";
import { SignatureModal } from './SignatureModal'; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../services/api";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from "expo-image-picker";
import { SiGooglemaps } from "react-icons/si";
import { SiWaze } from "react-icons/si";
import { FontAwesome5 } from '@expo/vector-icons'; // Ou de 'react-native-vector-icons/FontAwesome5'
import { font, getStatusColor, radii, ThemeColors, useTheme, useThemedStyles, withAlpha } from '../../theme';



interface ModalDetailOsProps {
  ordem: OrdensDeServico | null;
  handleCloseModal: () => void;
}

interface Setor {
  id: string;
  usuario: string;
  ramal: string;
  andar: string;
  setor: {
    id: string;
    name: string;
  };
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const IMAGE_SIZE = (WIDTH - 90) / 3;

const getImageFingerprint = (base64: string) => {
  const raw = base64.replace(/^data:[^;]+;base64,/, '');
  return `${raw.length}|${raw.slice(0, 80)}|${raw.slice(-80)}`;
};

export function ModalDetailOrder({ ordem, handleCloseModal }: ModalDetailOsProps) {

  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [signature, setSignature] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [modalTecnicoOpen, setModalTecnicoOpen] = useState(false);
  const [ordemAtual, setOrdemAtual] = useState<OrdensDeServico | null>(ordem);
  const [selectedImages, setSelectedImages] = useState<{ uri: string; base64: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasDeslocate, setHasDeslocate] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [time, setTime] = useState(0);
  const [assinatura, setAssinatura] = useState<string | null>(null);
  const [retomarSuccess, setRetomarSuccess] = useState(false);
  const isConcluida = ordemAtual?.statusOrdemdeServico?.id === "fa69ed32-20b2-4d3a-9a6d-e61c5b45efea";
  const formatTime = (seconds: number) => {
  const totalSeconds = seconds < 0 ? 0 : seconds;

  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  
  return `${h}:${m}:${s}`;
};

useEffect(() => {
  let interval: any = null;

  if (isRunning && !isPaused) {
    setLastUpdate(new Date());
    interval = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  } else {
    if (interval) clearInterval(interval);
  }

  return () => {
    if (interval) clearInterval(interval);
  };
}, [isRunning, isPaused]);

useEffect(() => {
  if (ordemAtual?.startedAt) {
    setHasStarted(true);
  }
  
  if (ordemAtual?.statusOrdemdeServico?.id === "2926ff57-cbfe-4da7-b478-f4ca24f3175a") {
    setHasDeslocate(true);
  } else {
    setHasDeslocate(false);
  }
}, [ordemAtual]);


  if (!ordemAtual) return null;

  const endereco = ordemAtual.cliente?.endereco ?? ordemAtual.instituicaoUnidade?.endereco ?? "";

  const abrirGoogleMaps = (endereco: string) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`; // <-- ERRO AQUI
  Linking.openURL(url);
};

const atualizarOrdem = async () => {
  try {
    if (!ordemAtual?.id) return;
    const response = await api.get(`/ordemdeservico/${ordemAtual.id}`);
    setOrdemAtual(response.data);
  } catch (error) {
    console.log("Erro ao atualizar ordem:", error);
    Alert.alert("Erro", "Não foi possível sincronizar os dados da OS.");
  }
};
  const fetchAssinatura = async (ordemId: string) => {
    try {
      const storageToken = await AsyncStorage.getItem("@AlltiService");
      if (!storageToken) return;
      const { token } = JSON.parse(storageToken);

      const response = await api.get(`/assinatura/${ordemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssinatura(response.data?.bannerassinatura ?? null);
    } catch (err) {
      console.error("Erro ao buscar assinatura:", err);
    }
  };

const fetchTempo = async (ordemId: string) => {
  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;

    const { token } = JSON.parse(storageToken);

    const response = await api.get(`/ordemdeservico/tempo/${ordemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { startedAt, endedAt } = response.data;

    if (!startedAt) return;

    const startedAtDate = new Date(startedAt);
    const endedAtDate = endedAt ? new Date(endedAt) : null;

    const diffSeconds = endedAtDate
      ? Math.floor((endedAtDate.getTime() - startedAtDate.getTime()) / 1000)
      : Math.floor((Date.now() - startedAtDate.getTime()) / 1000);

    setTime(diffSeconds > 0 ? diffSeconds : 0);
    setIsRunning(!endedAtDate);

    setOrdemAtual((prev) =>
      prev
        ? {
            ...prev,
            startedAt,
            endedAt,
          }
        : prev
    );
  } catch (error) {
    console.error("Erro ao buscar tempo da OS:", error);
  }
};

    useEffect(() => {
    if (ordemAtual?.id) {
      fetchAssinatura(ordemAtual.id);
      fetchTempo(ordemAtual.id); 
    }
  }, [ordemAtual?.id]); // Correção: Dependência específica do ID

  const enviarAssinatura = async (base64: string) => {
    try {
      const storageToken = await AsyncStorage.getItem("@AlltiService");
      if (!storageToken) return;
      const { token } = JSON.parse(storageToken);

      await api.patch(`/assinatura/${ordemAtual!.id}`, { assinatura: base64 }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert("Sucesso", "Assinatura salva!");
      setAssinatura(base64);
    } catch (err) {
      console.error("Erro ao salvar assinatura:", err);
      Alert.alert("Erro", "Não foi possível salvar a assinatura.");
    }
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permissão negada", "Habilite o acesso às fotos.");

    const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: 'images', 
  allowsMultipleSelection: true,
  quality: 1,
  base64: true,
});

    if (!result.canceled) {
      const candidatas = result.assets.map(asset => ({
        uri: asset.uri,
        base64: `data:${asset.type};base64,${asset.base64}`,
      }));

      const urisExistentes = new Set(selectedImages.map(img => img.uri));
      const fingerprintsExistentes = new Set(selectedImages.map(img => getImageFingerprint(img.base64)));

      const novas = candidatas.filter(
        img => !urisExistentes.has(img.uri) && !fingerprintsExistentes.has(getImageFingerprint(img.base64))
      );

      const ignoradas = candidatas.length - novas.length;
      if (ignoradas > 0) Alert.alert("Atenção", `${ignoradas} imagem(ns) já adicionada(s) foi ignorada.`);
      if (novas.length > 0) setSelectedImages(prev => [...prev, ...novas]);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return Alert.alert("Permissão negada", "Habilite o acesso à câmera.");

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const candidatas = result.assets.map(asset => ({
        uri: asset.uri,
        base64: `data:${asset.type};base64,${asset.base64}`,
      }));

      const urisExistentes = new Set(selectedImages.map(img => img.uri));
      const fingerprintsExistentes = new Set(selectedImages.map(img => getImageFingerprint(img.base64)));

      const novas = candidatas.filter(
        img => !urisExistentes.has(img.uri) && !fingerprintsExistentes.has(getImageFingerprint(img.base64))
      );

      const ignoradas = candidatas.length - novas.length;
      if (ignoradas > 0) Alert.alert("Atenção", `${ignoradas} imagem(ns) já adicionada(s) foi ignorada.`);
      if (novas.length > 0) setSelectedImages(prev => [...prev, ...novas]);
    }
  };

  const removeImage = (index: number) => setSelectedImages(selectedImages.filter((_, i) => i !== index));

  const isJaConcluida = ordemAtual?.statusOrdemdeServico?.name?.trim().toUpperCase() === "CONCLUIDA";

  const handleFinalizarEEnviar = async () => {
  await uploadImages();

  if (!isJaConcluida) {
    await handleCloseAndComplete();
  } else {
    Alert.alert("Sucesso", "Novas imagens enviadas para esta OS já concluída.");
  }
};

const uploadImages = async () => {
  if (selectedImages.length === 0) {
    return Alert.alert("Atenção", "Selecione pelo menos uma imagem.");
  }

  try {
    for (let i = 0; i < selectedImages.length; i++) {
      const img = selectedImages[i]; 

      const manipResult = await ImageManipulator.manipulateAsync(
        img.uri,
        [{ resize: { width: 1920 } }], 
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG } 
      );

      const formData = new FormData();
      formData.append("ordemdeServico_id", ordemAtual.id);
      formData.append("file", {
        uri: Platform.OS === 'android' ? manipResult.uri : manipResult.uri.replace('file://', ''),
        name: `foto_${i}_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);

      await api.post(`/foto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });
    }

    Alert.alert( 
      "Operação concluída",
      "A ordem de serviço foi finalizada com sucesso.");
    setSelectedImages([]);

  } catch (err: any) {
    console.error("Erro no upload:", err.response?.data || err.message);
    Alert.alert("Erro", "Falha ao enviar uma ou mais imagens.");
  }
};

const refreshOrdemAtual = async () => {
  if (!ordemAtual?.id) return; 
  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;
    const { token } = JSON.parse(storageToken);

    const { data } = await api.get(`/ordemdeservico/${ordemAtual.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setOrdemAtual(data); 

  } catch (error) {
    console.error("Erro ao buscar OS atualizada:", error);
  }
};

const takePhoto = async () => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 0.7, 
    base64: true, 
  });

  if (!result.canceled && result.assets[0]) {
    const asset = result.assets[0];
    const newImage = {
      uri: asset.uri,
      base64: asset.base64 ?? "",
    };

    const jaExiste = selectedImages.some(
      img => img.uri === newImage.uri || getImageFingerprint(img.base64) === getImageFingerprint(newImage.base64)
    );

    if (jaExiste) {
      Alert.alert("Atenção", "Essa foto já foi adicionada.");
    } else {
      setSelectedImages(prev => [...prev, newImage]);
    }
  }
};

const handleDeslocamento = async () => {
  try {
    console.log("Botão clicado! Iniciando função...");
    
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) {
      Alert.alert("Erro de Autenticação", "Token não encontrado no Storage.");
      return;
    }
    
    const { token } = JSON.parse(storageToken);
    console.log("Token recuperado: Sim");
    console.log("Enviando ID da OS:", ordemAtual.id);

    // 1. Faz a atualização no banco primeiro
    await api.patch(
      `/ordemdeservico/update/${ordemAtual.id}`,
      { statusOrdemdeServico_id: "2926ff57-cbfe-4da7-b478-f4ca24f3175a" },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 2. Alerta o usuário PRIMEIRO para ele ver que deu certo
    Alert.alert("Sucesso", "Deslocamento iniciado!", [
      {
        text: "OK",
        onPress: async () => {
          // 3. Só atualiza o estado e a OS quando ele clicar em OK no alerta
          setHasDeslocate(true);
          await refreshOrdemAtual();
        }
      }
    ]);

  } catch (error) {
    console.error("Erro ao iniciar deslocamento:", error);
    Alert.alert("Erro", "Não foi possível atualizar o status.");
  }
};

const handleStart = async () => {
  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;
    const { token } = JSON.parse(storageToken);

    await api.patch(
      `/ordemdeservico/iniciar/${ordemAtual.id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await refreshOrdemAtual();

    setIsRunning(true);
    setIsPaused(false);
    setHasStarted(true);
    setHasDeslocate(true)
    

  } catch (error) {
    console.error("Erro ao iniciar OS:", error);
  }
};

useEffect(() => {
  if (!ordem?.id) return;

  let isMounted = true; 

  const fetchOrdemAtualizada = async () => {
    try {
      const storageToken = await AsyncStorage.getItem("@AlltiService");
      if (!storageToken) return;
      const { token } = JSON.parse(storageToken);
      
      const response = await api.get(`/ordemdeservico/${ordem.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (isMounted) {
        setOrdemAtual(response.data);
        fetchAssinatura(ordem.id);
        fetchTempo(ordem.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchOrdemAtualizada();

  return () => { isMounted = false; };
}, [ordem?.id]); 

const handlePause = async () => {
  if (!ordemAtual?.id) return;

  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;
    const { token } = JSON.parse(storageToken);

    const payload = { endedAt: new Date().toISOString() };

    await api.patch(
      `/ordemdeservico/pausar/${ordemAtual.id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setIsRunning(false);
    setIsPaused(true);

    await refreshOrdemAtual();

  } catch (error: any) {
    Alert.alert("Erro", "Não foi possível pausar a OS.");
  }
};


const handleResume = async () => {
  if (!ordemAtual?.id) return;

  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;
    const { token } = JSON.parse(storageToken);

    await api.patch(
      `/ordemdeservico/retomar/${ordemAtual.id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setIsPaused(false);
    setIsRunning(true);
    setRetomarSuccess(true);

    Alert.alert("Ordem retomada", "A contagem de tempo foi retomada com sucesso.");

    setTimeout(async () => {
      await refreshOrdemAtual();
    }, 500);
  } catch (error: any) {
    Alert.alert("Erro", "Não foi possível retomar a OS.");
  }
};

const handleCloseAndComplete = async () => {
  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) {
      Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
      return;
    }
    
    const { token } = JSON.parse(storageToken);

    // Estrutura do payload: 
    // Verifique se o nome do campo é 'statusOrdemdeServico_id' ou apenas 'status_id'
    const payload = {
      statusOrdemdeServico_id: '80e14fbe-c7fd-45bc-b3cd-cfa51ede44e0'
    };

    console.log("Enviando patch para:", `/ordemdeservico/concluir/${ordemAtual.id}`);
    console.log("Payload enviado:", payload);

    const response = await api.patch(
      `/ordemdeservico/concluir/${ordemAtual.id}`, 
      payload, 
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Resposta do servidor:", response.data);

    await refreshOrdemAtual();
    handleCloseModal();
    Alert.alert("Sucesso", "Ordem de Serviço concluída com sucesso!");
    
  } catch (error: any) {
    // Captura detalhada para debugar
    if (error.response) {
      console.error("ERRO 400 - Detalhes do Servidor:", error.response.data);
      // Exibe a mensagem real que o backend está devolvendo
      Alert.alert("Erro do Servidor", error.response.data.message || JSON.stringify(error.response.data));
    } else if (error.request) {
      console.error("Erro de Rede:", error.request);
      Alert.alert("Erro", "Sem conexão com o servidor.");
    } else {
      console.error("Erro desconhecido:", error.message);
      Alert.alert("Erro", "Ocorreu um erro inesperado.");
    }
  }
};
const isDisabled = selectedImages.length === 0;

  return (
    <>
   <TouchableOpacity
     activeOpacity={1}
     style={styles.overlay}
     onPress={handleCloseModal}
  />
    <View style={styles.modalContainer}>
      <ScrollComIndicador>
        
        <View style={styles.header}>
          <Text style={styles.title}>Detalhes da Ordem</Text>
          <TouchableOpacity onPress={atualizarOrdem} style={styles.refreshIcon}>
            <MaterialIcons name="refresh" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCloseModal} style={styles.closeIcon}>
            <MaterialIcons name="close" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>

        
        {ordemAtual.informacoesSetor && (
      <View style={{ marginTop: 20 }}>
      <Text style={styles.label}>Local do Chamado: </Text>
      
        {ordemAtual?.informacoesSetor?.instituicaoUnidade?.name ? (
          <Text style={styles.value}>{ordemAtual.informacoesSetor.instituicaoUnidade.name}</Text>
          ) : ordemAtual?.informacoesSetor?.cliente?.name ? (
          <Text style={styles.value}>{ordemAtual.informacoesSetor.cliente.name}</Text>
          ) : (
          <Text style={styles.value}>Não informado</Text>
          )}
      
          <Text style={styles.label}>
          Informações do usuário que solicitou o chamado
          </Text>
                        
            <Text style={styles.value}>Setor: {ordemAtual.informacoesSetor.setor.name}</Text>
            <Text style={styles.value}>Usuário: {ordemAtual.informacoesSetor.usuario}</Text>
            <Text style={styles.value}>Ramal: {ordemAtual.informacoesSetor.ramal}</Text>
          <Text style={styles.value}>Andar: {ordemAtual.informacoesSetor.andar}</Text>
            </View>
            )}

        <Text style={styles.label}>Número: {ordemAtual.numeroOS ?? "Não Disponível"}</Text>
        <Text style={styles.label}>Status:</Text>
        <View style={[styles.statusPill, { backgroundColor: withAlpha(getStatusColor(colors, ordemAtual.statusOrdemdeServico?.name), 0.14), borderColor: withAlpha(getStatusColor(colors, ordemAtual.statusOrdemdeServico?.name), 0.32) }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(colors, ordemAtual.statusOrdemdeServico?.name) }]} />
          <Text style={[styles.statusPillText, { color: getStatusColor(colors, ordemAtual.statusOrdemdeServico?.name) }]}>{ordemAtual.statusOrdemdeServico?.name ?? "-"}</Text>
        </View>
        <Text style={styles.label}>Quem abriu a OS:</Text>
        <Text style={styles.value}>{ordemAtual.name}</Text>

       {ordemAtual.user?.cliente ? (
    <>
      <Text style={styles.label}>Empresa:</Text>
      <Text style={styles.value}>{ordemAtual.user.cliente.name}</Text>
      <Text style={styles.label}>Endereço:</Text>
      <Text style={styles.value}>{ordemAtual.user.cliente.endereco || "Endereço ainda não atribuído. Peça para seu gestor atribuir."}</Text>
    </>
  ) : ordemAtual.instituicaoUnidade ? (
    <>

<Text style={styles.label}>Local de Atendimento:</Text>
      <Text style={styles.label}>Instituição:</Text>
      <Text style={styles.value}>{ordemAtual.instituicaoUnidade.name}</Text>
      <Text style={styles.label}>Endereço:</Text>
      <Text style={styles.value}>{ordemAtual.instituicaoUnidade.endereco || "Endereço ainda não atribuído. Peça para seu gestor atribuir."}</Text>
    </>
  ) : (
    <>
      <Text style={styles.label}>Endereço:</Text>
      <Text style={styles.warningText}>
        Endereço ainda não atribuído. Peça para seu gestor atribuir.
      </Text>
    </>
  )}

 <ModalNavegacao ordem={ordem} handleCloseModal={handleCloseModal} />


<View style={styles.timerContainer}>
    <View style={styles.actionWrapper}>
        {isConcluida ? (
            <View style={[styles.mainButton, styles.btnDisabled]}>
                <Text style={styles.mainButtonText}>ATENDIMENTO FINALIZADO</Text>
            </View>
        ) : (
            <>
                
                {!hasStarted && (
                    <TouchableOpacity 
                        style={[styles.mainButton, styles.btnStart]} 
                        onPress={handleStart}
                    >
                        <Text style={styles.mainButtonText}>INICIAR ATENDIMENTO</Text>
                    </TouchableOpacity>
                )}

                {isRunning && (
                    <TouchableOpacity 
                        style={[styles.mainButton, styles.btnPause]} 
                        onPress={handlePause}
                    >
                        <Text style={styles.mainButtonText}>PAUSAR SERVIÇO</Text>
                    </TouchableOpacity>
                )}

                {(isPaused || ordemAtual?.statusOrdemdeServico?.name?.trim().toUpperCase() === "PAUSADA") && !isRunning && (
                    <TouchableOpacity 
                        style={[styles.mainButton, styles.btnResume]} 
                        onPress={async () => {
                            await handleResume();
                            setIsRunning(true);
                            setIsPaused(false);
                        }}
                    >
                        <Text style={styles.mainButtonText}>RETOMAR TRABALHO</Text>
                    </TouchableOpacity>
                )}
            </>
        )}
    </View>
</View>
            <Text style={styles.label}>Tipo de Chamado:</Text>
            <Text style={styles.value}>{ordemAtual.tipodeChamado?.name ?? "-"}</Text>
            <Text style={styles.label}>Problema:</Text>
            <Text style={styles.value}>{ordemAtual.descricaodoProblemaouSolicitacao}</Text>
            <Text style={styles.label}>Patrimônio: </Text>

<Text style={styles.label}>Assinatura:</Text>

{signature || assinatura ? (
  <View style={styles.signaturePreviewContainer}>
    <Image 
      source={{ uri: signature || assinatura! }} 
      style={styles.signatureImage} 
      resizeMode="contain" 
    />
    <TouchableOpacity 
      style={styles.reSignButton} 
      onPress={() => setShowSignatureModal(true)}
    >
      <MaterialIcons name="refresh" size={16} color={colors.primaryText} />
      <Text style={styles.reSignText}>Refazer assinatura</Text>
    </TouchableOpacity>
  </View>
) : (
  <View style={{ marginVertical: 10 }}>
    <Text style={styles.emptyText}>
      Nenhuma assinatura coletada para esta ordem.
    </Text>
  </View>
)}

             <TouchableOpacity style={styles.buttonClose} onPress={() => setModalTecnicoOpen(true)}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="description" size={20} color={colors.primaryText} />
                <Text style={styles.textButtonClose}>ADICIONAR DESCRIÇÃO TÉCNICA</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonClose} onPress={takePhoto}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="photo-camera" size={20} color={colors.primaryText} />
                <Text style={styles.textButtonClose}>TIRAR FOTO</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonClose} onPress={pickImages}>
              <View style={styles.buttonContent}>
                <MaterialIcons name="photo-library" size={20} color={colors.primaryText} />
                <Text style={styles.textButtonClose}>SELECIONAR IMAGENS</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.gridImages}>
              {selectedImages.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri: img.uri }} style={styles.imageItem} />
                  <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                    <MaterialIcons name="close" size={16} color={colors.onPrimary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

           <TouchableOpacity
          style={[
            styles.buttonClose,
            isJaConcluida ? styles.buttonResend : styles.buttonComplete, 
            isDisabled && styles.buttonDisabled,
          ]}
          disabled={isDisabled}
          onPress={handleFinalizarEEnviar}
        >
          <View style={styles.buttonContent}>
            <MaterialIcons name="check-circle" size={20} color={isJaConcluida ? colors.text : colors.onPrimary} />
            <Text style={[styles.textButtonClose, !isJaConcluida && { color: colors.onPrimary }]}>
              {isJaConcluida ? "ENVIAR MAIS IMAGENS" : "CONCLUIR OS"}
            </Text>
          </View>
        </TouchableOpacity>

          </ScrollComIndicador>
        </View>

        <SignatureModal 
        visible={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={(sig) => {
          setSignature(sig);
          setShowSignatureModal(false);
        }}
      />

      <Modal
        visible={modalTecnicoOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalTecnicoOpen(false)}
      >
        <ModalDetailOrderFormTecnico
          ordemId={ordemAtual.id}
          tempoFinal={time}
          handleCloseModal={() => setModalTecnicoOpen(false)}
        />
      </Modal>
    </>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: c.background, // Removido o transparente para parecer uma tela cheia
    },
    modalContainer: {
      width: WIDTH,
      height: HEIGHT, // Ocupa a altura total
      backgroundColor: c.background,
      borderRadius: 0, // Remove arredondamento para colar nas bordas
      padding: 16,
      paddingTop: 40, // Espaço para não cobrir a barra de status do celular
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    title: { fontSize: 20, color: c.text, letterSpacing: -0.3, ...font("bold") },
    refreshIcon: { left: 40 },
    closeIcon: { right: 4 },
    label: {
      marginTop: 16,
      marginBottom: 3,
      fontSize: 11,
      color: c.eyebrow,
      letterSpacing: 1,
      textTransform: "uppercase",
      ...font("semibold"),
    },
    value: { color: c.body, fontSize: 14, lineHeight: 20, ...font("regular") },
    warningText: { color: c.warningText, fontSize: 14, ...font("medium") },
    emptyText: { color: c.muted, fontSize: 13, fontStyle: "italic", marginBottom: 10, ...font("regular") },
    statusPill: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      gap: 6,
      borderRadius: radii.pill,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusPillText: { fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", ...font("bold") },
    buttonClose: {
      marginTop: 14,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.borderAccent,
      padding: 15,
      borderRadius: radii.btn,
      alignItems: "center",
    },
    buttonContent: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
    textButtonClose: { color: c.text, marginLeft: 8, fontSize: 13, letterSpacing: 0.3, ...font("semibold") },
    buttonNavigation: { backgroundColor: c.brand },
    buttonDisabled: { backgroundColor: c.surface, borderColor: c.border, opacity: 0.5 },
    timerContainer: {
      marginVertical: 18,
      padding: 14,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radii.card,
      alignItems: "center",
      width: "100%",
      zIndex: 99,
    },
    btnDisabled: {
      backgroundColor: withAlpha(c.neutral, 0.18),
      borderWidth: 1,
      borderColor: withAlpha(c.neutral, 0.4),
      elevation: 0,
    },
    timerLabel: {
      fontSize: 13,
      color: c.muted,
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    actionWrapper: {
      width: "100%",
    },
    mainButton: {
      height: 54,
      borderRadius: radii.btn,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
    },
    mainButtonText: {
      color: c.onPrimary,
      fontSize: 15,
      letterSpacing: 1,
      ...font("bold"),
    },
    btnStart: {
      backgroundColor: c.brand,
      borderWidth: 1,
      borderColor: withAlpha(c.periwinkle, 0.6),
      shadowColor: c.brand,
      shadowOpacity: 0.45,
    },
    btnPause: {
      backgroundColor: c.warningStrong,
    },
    btnResume: {
      backgroundColor: c.successStrong,
    },
    gridImages: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
    imageWrapper: { width: IMAGE_SIZE, height: IMAGE_SIZE, marginRight: 10, marginBottom: 10, position: "relative" },
    imageItem: { width: "100%", height: "100%", borderRadius: radii.btn, borderWidth: 1, borderColor: c.border },
    removeButton: { position: "absolute", top: 5, right: 5, backgroundColor: "rgba(0,2,20,0.7)", borderRadius: 12, padding: 2, zIndex: 10 },
    buttonComplete: { backgroundColor: c.brand, borderColor: withAlpha(c.periwinkle, 0.6) },
    buttonResend: { backgroundColor: c.surface, borderColor: c.borderStrong },

    signaturePreviewContainer: {
      width: "100%",
      height: 150,
      borderWidth: 1,
      borderColor: withAlpha(c.success, 0.6),
      borderRadius: radii.btn,
      backgroundColor: c.paper,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
      overflow: "hidden",
    },
    signatureImage: { width: "100%", height: "100%" },
    reSignButton: {
      position: "absolute",
      bottom: 6,
      right: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: c.card,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderRadius: radii.btn,
      borderWidth: 1,
      borderColor: c.border,
    },
    reSignText: { color: c.primaryText, fontSize: 12, ...font("semibold") },
    buttonSignatureOpen: {
      backgroundColor: c.brand,
      flexDirection: "row",
      padding: 16,
      borderRadius: radii.btn,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15,
      gap: 10,
    },
    buttonText: { color: c.onPrimary, fontSize: 16, ...font("bold") },
  });
