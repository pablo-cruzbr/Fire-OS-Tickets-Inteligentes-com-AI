import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { ModalDetailTicketInterno } from "../../components/modalDetailOrderTicketsInterno";
import { ModalFormTecnicoTickets } from "../../components/modalFormTecnicoTickets";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemeToggle } from "../../components/ThemeToggle";
import { font, getStatusColor, radii, ThemeColors, useTheme, useThemedStyles, withAlpha } from "../../theme";

export type OrdensDeServico = {
  id: string;
  name: string;
  descricaodoProblemaouSolicitacao: string;
  nomedoContatoaserProcuradonoLocal: string;
  created_at: string;
  nameTecnico: string | null;
  solucao: string | null;
  bannerassinatura: string | null;
  numeroOS: number;
  startedAt?: string | null;
  endedAt?: string | null;
  duracao?: number;
  informacoesSetor?: {
  id: string;
  usuario: string;
  ramal: string;
  andar: string;
  setor: {
    id: string;
    name: string;
  };
} | null;
  user: {
    id: string;
    name: string;
    instituicaoUnidade: { name: string; endereco: string } | null;
    cliente: {id: string; name: string; endereco: string } | null;
    setor: { name: string } | null;
  };
  tipodeChamado: { id: string; name: string };
   tipodeOrdemdeServico: { id: string; name: string } | null;
  cliente: { id: string; name: string; endereco: string | null } | null;
  tecnico: { id: string; name: string } | null;
  instituicaoUnidade: { id: string; name: string; endereco: string } | null;
  statusOrdemdeServico: { id: string; name: string } | null;
};

type TipodeOrdem = {id: string; name: string};
type Instituicao = { id: string; name: string };
type Cliente = { id: string; name: string };

export default function ListOrdemdeServicoInterna() {
  const navigation = useNavigation();
  const { signOut } = useContext(AuthContext);
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const [ordensDeServico, setOrdensDeServico] = useState<OrdensDeServico[]>([]);
  const [filteredOrdens, setFilteredOrdens] = useState<OrdensDeServico[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [tiposOrdem, setTiposOrdem] = useState<TipodeOrdem[]>([]);
  const [tipoOrdemFilter, setTipoOrdemFilter] = useState<string>("");
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [instituicaoFilter, setInstituicaoFilter] = useState<string>("");
  const [clienteFilter, setClienteFilter] = useState<string>("");

  const [modalDetailVisible, setModalDetailVisible] = useState(false);
  const [modalFormTicketInternoVisible, setModalFormTicketInternoVisible] = useState(false);

  const [selectedOrdem, setSelectedOrdem] = useState<OrdensDeServico | null>(null);
  const [loading, setLoading] = useState(false);

  const statusList = [
    { id: "all", name: "TODOS" },
    { id: "80e14fbe-c7fd-45bc-b3cd-cfa51ede44e0", name: "ABERTA" },
    { id: "ce3a8414-704c-4562-bb3d-b400fe9f3b6b", name: "EM ANDAMENTO" },
    { id: "fa69ed32-20b2-4d3a-9a6d-e61c5b45efea", name: "CONCLUIDA" },
  ];


  const ID_TIPO_TICKET = "9255770c-a7b5-400b-9773-8b249f04b9ed";

  const loadOrdens = async () => {
  setLoading(true);
  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;

    const { token } = JSON.parse(storageToken);
    const response = await api.get("/listordemdeservico", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const todasAsOrdens: OrdensDeServico[] = response.data.controles || [];
    const ordensTipoTicket = todasAsOrdens.filter((ordem: OrdensDeServico) => {
       return ordem.tipodeOrdemdeServico?.id === ID_TIPO_TICKET;
    });

    setOrdensDeServico(ordensTipoTicket);
    setFilteredOrdens(ordensTipoTicket);
    
  } catch (error) {
    console.error("Erro ao carregar ordens de serviço:", error);
  } finally {
    setLoading(false);
  }
};
  
   const loadFilters = async () => {
    try{
      const storageToken = await AsyncStorage.getItem("@AlltiService");
         if (!storageToken) return;
      
        const { token } = JSON.parse(storageToken);
            if (!token) return;
      
      const tipoResponse = await api.get("/listtipodeordemdeservico", {
            headers: {},
          });
    
          const tipoList = tipoResponse.data || [];
    
          setTiposOrdem(
            tipoList.map((tipo: any) => ({ id: tipo.id, name: tipo.name }))
          );

          // Instituições
          const instResponse = await api.get("/listinstuicao", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const instList = instResponse.data.instituicoes || [];
          setInstituicoes(instList.map((inst: any) => ({ id: inst.id, name: inst.name })));
    
          // Clientes
          const cliResponse = await api.get("/listcliente", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const cliList = cliResponse.data.controles || [];
          setClientes(cliList.map((cli: any) => ({ id: cli.id, name: cli.name })));
          

        }catch (error) {
      console.error("Erro ao carregar filtros:", error);
    }
   } 

     // Filtragem
     useEffect(() => {
       let result = [...ordensDeServico];
   
       // Pesquisa
       if (search.trim()) {
         const lower = search.toLowerCase();
         result = result.filter(
           (os) =>
             os.numeroOS?.toString().includes(lower) ||
             os.instituicaoUnidade?.name?.toLowerCase().includes(lower) ||
             os.user?.cliente?.name?.toLowerCase().includes(lower)
         );
       }

        
        if (instituicaoFilter) {
          result = result.filter(
            (os) => os.instituicaoUnidade?.id === instituicaoFilter
          );
        }

      
        if (clienteFilter) {
          result = result.filter(
            (os) => os.user?.cliente?.id === clienteFilter || os.cliente?.id === clienteFilter
          );
        }
      
     
       if (statusFilter && statusFilter !== "TODOS") {
         result = result.filter((os) => os.statusOrdemdeServico?.name === statusFilter);
       }
   
       if (tipoOrdemFilter) {
         result = result.filter(
           (os) => os.tipodeOrdemdeServico?.id === tipoOrdemFilter
         );
       }
   
   
       setFilteredOrdens(result);
     }, [search, statusFilter, ordensDeServico, tipoOrdemFilter, instituicaoFilter, clienteFilter]);
   
    
     useEffect(() => {
       loadOrdens();
       loadFilters();
     }, []);
  // Filtro
  useEffect(() => {
    let result = [...ordensDeServico];

    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (os) =>
          os.numeroOS?.toString().includes(lower) ||
          os.instituicaoUnidade?.name?.toLowerCase().includes(lower) ||
          os.user?.cliente?.name?.toLowerCase().includes(lower)
      );
    }

    if (statusFilter && statusFilter !== "TODOS") {
      result = result.filter(
        (os) => os.statusOrdemdeServico?.name === statusFilter
      );
    }

    setFilteredOrdens(result);
  }, [search, statusFilter, ordensDeServico]);

  useEffect(() => {
    loadOrdens();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Image
            source={
              isDark
                ? require("../../assets/fire-os-wordmark-white.png")
                : require("../../assets/fire-os-wordmark-navy.png")
            }
            style={styles.wordmark}
            accessibilityLabel="Fire OS"
          />
          <View style={styles.headerIcons}>
            <ThemeToggle />
            <TouchableOpacity style={styles.iconButton} onPress={loadOrdens} disabled={loading} activeOpacity={0.75}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Ionicons name="refresh" size={18} color={colors.text} />
              )}
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Feather name="user" size={16} color={colors.onPrimary} />
            </View>
          </View>
        </View>
        <Text style={styles.eyebrow}>SUPORTE INTERNO</Text>
        <Text style={styles.title}>Tickets Internos</Text>
      </View>

      {/* Input de pesquisa */}
      <TextInput
        style={styles.input}
        placeholder="Pesquisar por número da OS, Instituição ou Empresa"
        placeholderTextColor={colors.placeholder}
        value={search}
        onChangeText={setSearch}
      />

      {/* Botões de filtro */}
      <View
        style={styles.filterArea}
      >
        {statusList.map((status) => {
          const active =
            statusFilter === status.name ||
            (status.id === "all" && statusFilter === "");
          return (
            <TouchableOpacity
              key={status.id}
              style={[styles.statusButton, active && styles.statusButtonActive]}
              onPress={() =>
                setStatusFilter(status.id === "all" ? "" : status.name)
              }
            >
              <Text
                style={[styles.statusText, active && styles.statusTextActive]}
              >
                {status.name}
              </Text>
            </TouchableOpacity>
          );
        })}

      <Picker
        selectedValue={tipoOrdemFilter}
        style={styles.picker}
        dropdownIconColor={colors.muted}
        onValueChange={(value) => setTipoOrdemFilter(value)}
      >
        <Picker.Item label="Todos Tipos de OS" value="" />
        {tiposOrdem.map((tipo) => (
          <Picker.Item key={tipo.id} label={tipo.name} value={tipo.id} />
        ))}
      </Picker>

        <Picker
          selectedValue={instituicaoFilter}
          style={styles.picker}
        dropdownIconColor={colors.muted}
          onValueChange={(value) => setInstituicaoFilter(value)}
        >
          <Picker.Item label="Todas Instituições" value="" />
          {instituicoes.map((inst) => (
            <Picker.Item key={inst.id} label={inst.name} value={inst.id} />
          ))}
        </Picker>

        <Picker
          selectedValue={clienteFilter}
          style={styles.picker}
        dropdownIconColor={colors.muted}
          onValueChange={(value) => setClienteFilter(value)}
        >
          <Picker.Item label="Todos Clientes" value="" />
          {clientes.map((cli) => (
            <Picker.Item key={cli.id} label={cli.name} value={cli.id} />
          ))}
        </Picker>
        
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Dashboard" as never)}
        activeOpacity={0.7}
      >
        <FontAwesome5 name="arrow-left" size={20} color={colors.text} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.formtec}
        onPress={() => setModalFormTicketInternoVisible(true)}
        activeOpacity={0.7}
      >
        <AntDesign name="form" size={24} color={colors.onPrimary} />

      </TouchableOpacity>

       
      {/* Lista */}
      <FlatList
        data={filteredOrdens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setSelectedOrdem(item);
              setModalDetailVisible(true);
            }}
          >

            <View style={[styles.cardAccent, { backgroundColor: getStatusColor(colors, item.statusOrdemdeServico?.name) }]} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>
                Número do Ticket: {item.numeroOS || "Não Disponível"}
              </Text>
              <Text style={styles.cardStatus}>
                Status da OS: {item.statusOrdemdeServico?.name || "N/A"}
              </Text>

              {item.user.cliente && (
                <>
                  <Text style={styles.cardSubtitle}>
                    Empresa: {item.user.cliente.name}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    Endereço: {item.user.cliente.endereco}
                  </Text>
                </>
              )}

              {item.instituicaoUnidade && (
                <Text style={styles.cardSubtitle}>
                  Endereço: {item.instituicaoUnidade.endereco}
                </Text>
              )}

              <Text style={styles.cardItem}>
                Setor: {item.informacoesSetor?.setor.name}
              </Text>
              <Text style={styles.cardItem}>
                Quem Solicitou o chamado: {item.informacoesSetor?.usuario}
              </Text>
              <Text style={styles.cardItem}>
                Andar: {item.informacoesSetor?.andar}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{
          paddingBottom: 90,
          paddingTop: 10,
        }}
      />

      {/* Modal detalhe da OS */}
      {modalDetailVisible && selectedOrdem && (
        <ModalDetailTicketInterno
          ordem={selectedOrdem}
          visible={modalDetailVisible} 
          handleCloseModal={() => setModalDetailVisible(false)}
        />
      )}

      {/* Modal Form Técnico Ticket */}
      {modalFormTicketInternoVisible && (
        <ModalFormTecnicoTickets
          visible={modalFormTicketInternoVisible}
          handleCloseModal={() => setModalFormTicketInternoVisible(false)}
        />
      )}
    </SafeAreaView>
  );
}

const makeStyles = (c: ThemeColors) => {
  const dark = c.mode === "dark";
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },
    header: {
      backgroundColor: c.header,
      paddingHorizontal: 16,
      paddingTop: 44,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
    wordmark: { width: 96, height: 20, resizeMode: "contain" },
    headerIcons: { flexDirection: "row", alignItems: "center", gap: 8 },
    iconButton: {
      width: 38,
      height: 38,
      borderRadius: radii.btn,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: dark ? "rgba(255,255,255,0.04)" : c.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    avatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: c.brand,
      borderWidth: 1,
      borderColor: withAlpha(c.periwinkle, 0.6),
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 2,
    },
    eyebrow: { color: c.eyebrow, fontSize: 11, letterSpacing: 1.8, ...font("semibold") },
    title: { color: c.text, fontSize: 24, letterSpacing: -0.5, marginTop: 4, ...font("bold") },
    input: {
      marginHorizontal: 16,
      marginTop: 14,
      height: 44,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: c.inputBorder,
      borderRadius: radii.btn,
      backgroundColor: c.inputBg,
      color: c.text,
      fontSize: 13,
      ...font("regular"),
      ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null),
    },
    filterArea: { flexDirection: "row", paddingHorizontal: 16, marginTop: 12, flexWrap: "wrap", gap: 8 },
    statusButton: {
      height: 32,
      paddingHorizontal: 14,
      backgroundColor: dark ? "rgba(255,255,255,0.03)" : c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radii.pill,
      justifyContent: "center",
      alignItems: "center",
    },
    statusButtonActive: { backgroundColor: c.brand, borderColor: withAlpha(c.periwinkle, 0.6) },
    statusText: { fontSize: 11, color: c.body, letterSpacing: 0.4, ...font("semibold") },
    statusTextActive: { color: c.onPrimary },
    card: {
      flexDirection: "row",
      backgroundColor: c.card,
      marginHorizontal: 16,
      marginTop: 10,
      paddingVertical: 14,
      paddingRight: 14,
      borderRadius: radii.card,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: "center",
      overflow: "hidden",
      elevation: 2,
    },
    cardAccent: { width: 3, alignSelf: "stretch", marginRight: 12, marginVertical: -14 },
    cardInfo: { flex: 1, gap: 2 },
    cardTitle: { fontSize: 15, color: c.text, ...font("extrabold") },
    cardStatus: { fontSize: 12, color: c.primaryText, marginTop: 2, marginBottom: 4, ...font("semibold") },
    cardSubtitle: { fontSize: 12, color: c.body, ...font("regular") },
    cardItem: { fontSize: 12, color: c.muted, ...font("regular") },
    formtec: {
      position: "absolute",
      bottom: 40,
      right: 20,
      backgroundColor: c.brand,
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: withAlpha(c.periwinkle, 0.6),
      justifyContent: "center",
      alignItems: "center",
      shadowColor: c.brand,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 16,
      elevation: 6,
      zIndex: 99,
    },
    fab: {
      position: "absolute",
      bottom: 108,
      right: 24,
      backgroundColor: c.card,
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: c.borderStrong,
      justifyContent: "center",
      alignItems: "center",
      elevation: 6,
      zIndex: 99,
    },
    picker: {
      height: 48,
      width: "100%",
      color: c.text,
      backgroundColor: c.inputBg,
      borderWidth: 1,
      borderColor: c.inputBorder,
      borderRadius: radii.btn,
      paddingHorizontal: 8,
      fontSize: 13,
    },
  });
};
