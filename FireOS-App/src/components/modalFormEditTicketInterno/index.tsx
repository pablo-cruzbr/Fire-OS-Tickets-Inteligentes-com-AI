import React, { useState, useEffect } from "react";
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
  Dimensions,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { api } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { font, radii, ThemeColors, useTheme, useThemedStyles } from "../../theme";

interface ModalDetailOrderTecnicoProps {
  ordemId: string;
  handleCloseModal: () => void;
}

interface TipoChamado {
  id: string;
  name: string;
}

interface StatusOrdem {
  id: string;
  name: string;
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


export function ModalEditFormTicketInterno({
  ordemId,
  handleCloseModal,
}: ModalDetailOrderTecnicoProps) {
  const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const [solucao, setSolucao] = useState("");
  const [descricaodoProblemaouSolicitacao, setDescricaoProblemaouSolicitacao] =
    useState("");
  const [tipodeChamado, setTipodeChamado] = useState("");
  const [statusOrdemdeServico, setStatusOrdemdeServico] = useState("");
  const [informacoesSetor, setInformacoesSetor] = useState<Setor | string | null>(null);

  const [ramal, setRamal] = useState("");
 
  const [setorInfo, setSetorInfo] = useState<Setor | null>(null);
  const [loadingRamal, setLoadingRamal] = useState(false);
 
  const [name, setName] = useState<string>("");
  const [usuarioBusca, setUsuarioBusca] = useState<string>("");
  const [tiposChamado, setTiposChamado] = useState<TipoChamado[]>([]);
  const [statusOrdens, setStatusOrdens] = useState<StatusOrdem[]>([]);

 
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storageToken = await AsyncStorage.getItem("@AlltiService");
        if (!storageToken) return;
        const { token } = JSON.parse(storageToken);

        const [ordensRes, statusRes, tiposRes] = await Promise.all([
          api.get("/listordemdeservico", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get<StatusOrdem[]>("/liststatusordemdeservico", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get<TipoChamado[]>("/listtipodechamado", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStatusOrdens(statusRes.data || []);
        setTiposChamado(tiposRes.data || []);

        const lista = ordensRes.data?.result?.controles || [];
        const ordem = lista.find((o: any) => o.id === ordemId);

        if (ordem) {
          setSolucao(ordem.solucao || "");
          setDescricaoProblemaouSolicitacao(ordem.descricaodoProblemaouSolicitacao || "");
          setTipodeChamado(ordem.tipodeChamado?.id || ""); // pega o ID
          setStatusOrdemdeServico(ordem.statusOrdemdeServico?.id || "");
          setInformacoesSetor(ordem.informacoesSetor?.id || "");
        } else {
          
          console.warn("Ordem não encontrada: ", ordemId);
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar os dados da ordem.");
      } finally {
        setLoadingData(false);
      }
    };

    if (ordemId) fetchData();
  }, [ordemId]);

  
  const handlePesquisarRamal = async () => {
    if (!ramal.trim()) {
      Alert.alert("Atenção", "Digite um ramal válido.");
      return;
    }

    try {
    const storage = await AsyncStorage.getItem("@AlltiService");
    if (!storage) return;

    const { token } = JSON.parse(storage);

    const res = await api.get<Setor[]>(`/listinformacoessetor?ramal=${ramal}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const setorEncontrado = res.data.find((s) => s.ramal === ramal);

    if (setorEncontrado) {
  setSetorInfo(setorEncontrado);
  setInformacoesSetor(setorEncontrado.id); 
}
  } catch (err) {
    console.error(err);
    Alert.alert("Erro", "Não foi possível buscar o setor.");
  }
};

const handlePesquisarUsuario = async () => {
  if (!usuarioBusca.trim()) {
    Alert.alert("Atenção", "Digite um nome de usuário para pesquisar.");
    return;
  }

  try {
    const storage = await AsyncStorage.getItem("@AlltiService");
    if (!storage) return;

    const { token } = JSON.parse(storage);

    // 2. Chamada para a API passando o usuário como query param
    const res = await api.get<Setor[]>(`/listinformacoessetor?usuario=${usuarioBusca}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const setorComUsuario = res.data.find((s) => 
      s.usuario?.toLowerCase() === usuarioBusca.toLowerCase()
    );

    if (setorComUsuario) {
      setSetorInfo(setorComUsuario);
      setInformacoesSetor(setorComUsuario.id); 
    } else {
      Alert.alert("Aviso", "Usuário não encontrado em nenhum setor.");
    }
  } catch (err) {
    console.error(err);
    Alert.alert("Erro", "Não foi possível buscar as informações do usuário.");
  }
};

 
  const handleSelecionarSetor = () => {
    if (!setorInfo) return;
    
    setInformacoesSetor(setorInfo.id);
    Alert.alert("Sucesso", "Ramal / setor selecionado.");
  };

 
  const handleSubmit = async () => {
  const TICKET_TYPE_ID = "9255770c-a7b5-400b-9773-8b249f04b9ed";

  try {
    setLoading(true);
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;
    const { token } = JSON.parse(storageToken);

    const payload = {
      solucaodoproblema: solucao || null, // Verifique se na API mobile é 'solucao' ou 'solucaodoproblema' como na Web
      descricaodoProblemaouSolicitacao: descricaodoProblemaouSolicitacao || null,
      tipodeChamado_id: tipodeChamado || null,
      statusOrdemdeServico_id: statusOrdemdeServico || null,
      
      tipodeOrdemdeServico_id: TICKET_TYPE_ID,

      informacoesSetor_id:
        informacoesSetor && typeof informacoesSetor === "object"
          ? informacoesSetor.id
          : informacoesSetor || null,
    };

    await api.patch(
      `/ordemdeservico/update/${ordemId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Alert.alert("Sucesso", "Ticket atualizado com sucesso!");
    handleCloseModal();
    
  } catch (error: any) {
    console.error("Erro ao atualizar ticket:", error.response?.data || error.message);
    Alert.alert("Erro", "Não foi possível atualizar o ticket. Tente novamente.");
  } finally {
    setLoading(false);
  }
};

  const dynamicStyles = StyleSheet.create({
    container: {
      width: WIDTH - 30,
      maxHeight: HEIGHT - 100,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 20,
      borderRadius: radii.card,
    },
  });

  if (loadingData) {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={dynamicStyles.container}>
            <Text style={styles.title}>Editar Descrição Técnica</Text>

            <TextInput
              placeholder="Descrição ou Problema / Solicitação"
            placeholderTextColor={colors.placeholder}
              style={[styles.input, styles.textArea]}
              value={descricaodoProblemaouSolicitacao}
              onChangeText={setDescricaoProblemaouSolicitacao}
              multiline
              numberOfLines={3}
            />

            <TextInput
              placeholder="Solução"
            placeholderTextColor={colors.placeholder}
              style={[styles.input, styles.textArea]}
              value={solucao}
              onChangeText={setSolucao}
              multiline
              numberOfLines={3}
            />

            <View style={styles.row}>
          <TextInput
            placeholder="Busque o Ramal"
            placeholderTextColor={colors.placeholder}
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            value={ramal}
            onChangeText={setRamal}
            keyboardType="numeric"
          />

          <TextInput
            placeholder="Nome do usuário"
            placeholderTextColor={colors.placeholder}
            style={[styles.input, { flex: 1 }]}
            value={name}
            onChangeText={setName}
            autoCapitalize="none" 
            keyboardType="default" 
            onSubmitEditing={handlePesquisarUsuario} 
          />

        
  <TouchableOpacity
    style={styles.buttonSmall}
    onPress={handlePesquisarRamal}
  >
    <Text style={styles.buttonText}>Pesquisar</Text>
  </TouchableOpacity>
</View>

{setorInfo && (
  <View style={styles.infoBox}>
    <Text style={styles.infoText}>Setor: {setorInfo?.setor.name}</Text>
    <Text style={styles.infoText}>Ramal: {setorInfo?.ramal}</Text>
    <Text style={styles.infoText}>Usuário: {setorInfo?.usuario}</Text>
    <Text style={styles.infoText}>Andar: {setorInfo?.andar}</Text>
  </View>
)}         
        
            <Text style={styles.label}>Tipo de Chamado</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.pickerInner}
                dropdownIconColor={colors.muted}
                selectedValue={tipodeChamado}
                onValueChange={(itemValue) => setTipodeChamado(itemValue)}
              >
                <Picker.Item label="Selecione um tipo..." value="" />
                {tiposChamado.map((tipo) => (
                  <Picker.Item key={tipo.id} label={tipo.name} value={tipo.id} />
                ))}
              </Picker>
            </View>

          
            <Text style={styles.label}>Status</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                style={styles.pickerInner}
                dropdownIconColor={colors.muted}
                selectedValue={statusOrdemdeServico}
                onValueChange={(itemValue) => setStatusOrdemdeServico(itemValue)}
              >
                <Picker.Item label="Selecione um status..." value="" />
                {statusOrdens.map((st) => (
                  <Picker.Item key={st.id} label={st.name} value={st.id} />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.buttonText}>Salvar Ordem</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonClose} onPress={handleCloseModal}>
              <Text style={styles.buttonCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: c.overlay,
      justifyContent: "center",
      alignItems: "center",
    },
    title: { fontSize: 18, marginBottom: 15, color: c.text, ...font("bold") },
    label: { fontSize: 13, marginBottom: 6, color: c.body, ...font("medium") },
    row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    input: {
      borderWidth: 1,
      borderColor: c.inputBorder,
      borderRadius: radii.btn,
      padding: 11,
      marginBottom: 12,
      fontSize: 14,
      color: c.text,
      backgroundColor: c.inputBg,
      ...font("regular"),
    },
    textArea: { height: 80, textAlignVertical: "top" },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: c.inputBorder,
      borderRadius: radii.btn,
      marginBottom: 12,
      backgroundColor: c.inputBg,
      overflow: "hidden",
    },
    picker: {
      color: c.text,
      backgroundColor: c.inputBg,
      borderWidth: 1,
      borderColor: c.inputBorder,
      borderRadius: radii.btn,
      marginBottom: 12,
      minHeight: 48,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    pickerInner: { color: c.text, backgroundColor: c.inputBg, borderWidth: 0, minHeight: 48, paddingHorizontal: 8, fontSize: 14 },
    infoBox: {
      backgroundColor: c.primarySoft,
      borderWidth: 1,
      borderColor: c.borderAccent,
      padding: 12,
      borderRadius: radii.btn,
      marginBottom: 12,
      gap: 2,
    },
    infoText: { color: c.body, fontSize: 13, ...font("regular") },
    infoCard: {
      padding: 10,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radii.btn,
      marginBottom: 12,
      backgroundColor: c.surface,
    },
    infoTitle: { color: c.text, marginBottom: 6, ...font("bold") },
    button: {
      backgroundColor: c.brand,
      padding: 13,
      borderRadius: radii.btn,
      alignItems: "center",
      marginBottom: 10,
    },
    buttonSmall: {
      backgroundColor: c.brand,
      paddingVertical: 11,
      paddingHorizontal: 12,
      borderRadius: radii.btn,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    buttonTextSmall: { color: c.onPrimary, fontSize: 13, ...font("bold") },
    buttonClose: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: c.borderStrong,
      padding: 12,
      borderRadius: radii.btn,
      alignItems: "center",
    },
    buttonText: { color: c.onPrimary, ...font("bold") },
    buttonCloseText: { color: c.text, ...font("semibold") },
    scrollContent: { flexGrow: 1, justifyContent: "center", paddingVertical: 20 },
  });
