import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Dropdown } from "react-native-element-dropdown";
import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ModalDetailOrder } from "../../components/modalDetailOrder";
import { useNavigation } from "@react-navigation/native";
import { ThemeToggle } from "../../components/ThemeToggle";
import {
  font,
  getPrioridadeColor as prioridadeColor,
  getStatusColor as statusColorFor,
  radii,
  ThemeColors,
  useTheme,
  useThemedStyles,
  withAlpha,
} from "../../theme";

export type OrdensDeServico = {
  id: string;
  name: string;
  descricaodoProblemaouSolicitacao: string;
  nomedoContatoaserProcuradonoLocal: string;
  created_at: string;
  nameTecnico: string | null;
  solucao: string | null;
  bannerassinatura: string | null;
  assinante: string | null;
  numeroOS: number;
  startedAt?: string | null;
  endedAt?: string | null;
  duracao?: number;
  informacoesSetor?: {
    id: string;
    usuario: string;
    ramal: string;
    andar: string;
    setor: { id: string; name: string };
    instituicaoUnidade: { id: string; name: string };
    cliente: { id: string; name: string };
  } | null;
  user: {
    id: string;
    name: string;
    instituicaoUnidade: { name: string; endereco: string } | null;
    cliente: {id: string; name: string; endereco: string } | null;
    setor: { name: string } | null;
  };
  tipodeOrdemdeServico: { id: string; name: string } | null;
  tipodeChamado: {id: string; name: string | null};
  cliente: { id: string; name: string; endereco: string, cnpj: string | null } | null;
  tecnico: { id: string; name: string } | null;
  instituicaoUnidade: { id: string; name: string; endereco: string } | null;
  statusOrdemdeServico: { id: string; name: string} | null;
  prioridade: { id: string; name: string } | null;
};

type Instituicao = { id: string; name: string };
type Cliente = { id: string; name: string };
type TipodeOrdem = { id: string; name: string };
type Prioridade = { id: string; name: string };

function timeAgo(dateStr?: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return "agora mesmo";
  if (minutes < 60) return `há ${minutes}min`;
  if (hours < 24) return `há ${hours}h`;
  if (days === 1) return "ontem";
  return `há ${days} dias`;
}

export default function Dashboard() {
  const navigation = useNavigation();
  const { signOut } = useContext(AuthContext);
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const getStatusColor = (name?: string | null) => statusColorFor(colors, name);
  const getPrioridadeColor = (name: string) => prioridadeColor(colors, name);
  const [searchFocused, setSearchFocused] = useState(false);

  const [ordensDeServico, setOrdensDeServico] = useState<OrdensDeServico[]>([]);
  const [filteredOrdens, setFilteredOrdens] = useState<OrdensDeServico[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [instituicaoFilter, setInstituicaoFilter] = useState<string>("");
  const [clienteFilter, setClienteFilter] = useState<string>("");
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalOsDetailVisible, setModalOsVisible] = useState(false);
  const [selectedOrdem, setSelectedOrdem] = useState<OrdensDeServico | null>(null);
  const [loading, setLoading] = useState(false);
  const [tiposOrdem, setTiposOrdem] = useState<TipodeOrdem[]>([]);
  const [tipoOrdemFilter, setTipoOrdemFilter] = useState<string>("");
  const [prioridades, setPrioridades] = useState<Prioridade[]>([]);
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const activeFiltersCount = [tipoOrdemFilter, instituicaoFilter, clienteFilter, prioridadeFilter].filter(Boolean).length;

  const clearFilters = () => {
    setTipoOrdemFilter("");
    setInstituicaoFilter("");
    setClienteFilter("");
    setPrioridadeFilter("");
  };

  const statusList = [
    { id: "all", name: "TODOS" },
    { id: "80e14fbe-c7fd-45bc-b3cd-cfa51ede44e0", name: "ABERTA" },
    { id: "ce3a8414-704c-4562-bb3d-b400fe9f3b6b", name: "EM ANDAMENTO" },
    { id: "fa69ed32-20b2-4d3a-9a6d-e61c5b45efea", name: "CONCLUIDA" },
    { id: "f5341cb0-e6e1-4a5a-b5fc-c55386e55222", name: "PAUSADA" },
  ];

const loadOrdens = async () => {
  setLoading(true);
  try {
    const storageToken = await AsyncStorage.getItem("@AlltiService");
    if (!storageToken) return;

    const { token } = JSON.parse(storageToken);
    if (!token) return;

    const response = await api.get("/listordemdeservico", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("QTD DE ORDENS RECEBIDAS:", response.data.controles?.length);
console.log("DADOS COMPLETOS:", JSON.stringify(response.data.controles, null, 2));

    const ordens = response.data.controles || []; 
    
    setOrdensDeServico(ordens);
    setFilteredOrdens(ordens);
    console.log("QTD FINAL NA LISTA:", filteredOrdens.length);
  } catch (error) {
    console.error("Erro ao carregar ordens de serviço:", error);
  } finally {
    setLoading(false);
  }
};

  // Carrega filtros de instituição e cliente
  const loadFilters = async () => {
    try {
      const storageToken = await AsyncStorage.getItem("@AlltiService");
      if (!storageToken) return;

      const { token } = JSON.parse(storageToken);
      if (!token) return;

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

      const tipoResponse = await api.get("/listtipodeordemdeservico", {
        headers: {},
      });
      const tipoList = tipoResponse.data || [];
      setTiposOrdem(tipoList.map((tipo: any) => ({ id: tipo.id, name: tipo.name })));

      const prioResponse = await api.get("/liststatusprioridade", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const prioList = prioResponse.data || [];
      setPrioridades(prioList.map((p: any) => ({ id: p.id, name: p.name })));

    } catch (error) {
      console.error("Erro ao carregar filtros:", error);
    }
  };

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

  
    if (statusFilter && statusFilter !== "TODOS") {
      result = result.filter((os) => os.statusOrdemdeServico?.name === statusFilter);
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

    if (tipoOrdemFilter) {
      result = result.filter(
        (os) => os.tipodeOrdemdeServico?.id === tipoOrdemFilter
      );
    }

    if (prioridadeFilter) {
      result = result.filter(
        (os) => os.prioridade?.id === prioridadeFilter
      );
    }

    setFilteredOrdens(result);
  }, [search, statusFilter, instituicaoFilter, clienteFilter, ordensDeServico, tipoOrdemFilter, prioridadeFilter]);

 
  useEffect(() => {
    loadOrdens();
    loadFilters();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
  
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
            <TouchableOpacity style={styles.iconButton} onPress={signOut} activeOpacity={0.75}>
              <SimpleLineIcons name="logout" size={16} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Feather name="user" size={16} color={colors.onPrimary} />
            </View>
          </View>
        </View>
        <Text style={styles.eyebrow}>PAINEL DO TÉCNICO</Text>
        <Text style={styles.title}>Ordens de Serviço</Text>
        <Text style={styles.subtitle}>
          {filteredOrdens.length} {filteredOrdens.length === 1 ? "ordem" : "ordens"} na sua fila
        </Text>
      </View>

      <View style={styles.searchRow}>
        <View style={[styles.searchBox, searchFocused && styles.searchBoxFocused]}>
          <Ionicons name="search" size={16} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="Pesquisar por número da OS, Instituição ou Empresa"
            placeholderTextColor={colors.placeholder}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </View>

        <TouchableOpacity
          style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="options-outline" size={18} color={colors.primaryText} />
          <Text style={styles.filterButtonText}>Filtros</Text>
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statusRow}>
        {statusList.map((status) => {
          const active =
            statusFilter === status.name || (status.id === "all" && statusFilter === "");
          return (
            <TouchableOpacity
              key={status.id}
              style={[styles.statusButton, active && styles.statusButtonActive]}
              onPress={() => setStatusFilter(status.id === "all" ? "" : status.name)}
            >
              <Text style={[styles.statusText, active && styles.statusTextActive]}>
                {status.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

     
  
      <FlatList
        data={filteredOrdens}
        keyExtractor={(item) => item.id}
       renderItem={({ item }) => {
  const statusColor = getStatusColor(item.statusOrdemdeServico?.name);
  const local = item.instituicaoUnidade?.name ?? null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => { setSelectedOrdem(item); setModalOsVisible(true); }}
      activeOpacity={0.85}
    >
      <View style={[styles.cardAccent, { backgroundColor: statusColor }]} />

      <View style={styles.cardBody}>

        {/* Linha 1: número + badge de status */}
        <View style={styles.cardRowSpaced}>
          <Text style={styles.cardNumber}>OS #{item?.numeroOS ?? "N/A"}</Text>
          <View style={[styles.statusBadge, { backgroundColor: withAlpha(statusColor, 0.14), borderColor: withAlpha(statusColor, 0.32) }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusBadgeText, { color: statusColor }]}>
              {item?.statusOrdemdeServico?.name ?? "—"}
            </Text>
          </View>
        </View>

        {/* Local do chamado */}
        {!!local && (
          <View style={styles.cardRowInfo}>
            <Ionicons name="business-outline" size={14} color={colors.primaryText} />
            <Text style={styles.cardLocalText} numberOfLines={1}>{local}</Text>
          </View>
        )}

        {/* Prioridade */}
        {item?.prioridade?.name && (
          <View style={[styles.priorityBadge, { backgroundColor: withAlpha(getPrioridadeColor(item.prioridade.name), 0.12) }]}>
            <Ionicons name="flag-outline" size={11} color={getPrioridadeColor(item.prioridade.name)} />
            <Text style={[styles.priorityBadgeText, { color: getPrioridadeColor(item.prioridade.name) }]}>
              {item.prioridade.name}
            </Text>
          </View>
        )}

        {/* Descrição do problema */}
        {!!item?.descricaodoProblemaouSolicitacao && (
          <View style={styles.cardRowInfo}>
            <Ionicons name="chatbubble-outline" size={13} color={colors.muted} />
            <Text style={styles.cardProblemText} numberOfLines={1}>
              {item.descricaodoProblemaouSolicitacao}
            </Text>
          </View>
        )}

        {/* Data */}
        <View style={styles.cardRowInfo}>
          <Ionicons name="time-outline" size={12} color={colors.muted} />
          <Text style={styles.cardDateText}>{timeAgo(item?.created_at)}</Text>
        </View>

      </View>
    </TouchableOpacity>
  );
}}
        contentContainerStyle={{ paddingBottom: 90, paddingTop: 10 }}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={52} color={colors.muted} />
              <Text style={styles.emptyTitle}>Nenhuma OS encontrada</Text>
              <Text style={styles.emptySubtitle}>
                {search || statusFilter || activeFiltersCount > 0
                  ? "Tente ajustar os filtros aplicados."
                  : "Não há ordens de serviço para exibir."}
              </Text>
            </View>
          ) : null
        }
      />

     
      <Modal
        transparent
        visible={modalOsDetailVisible}
        animationType="slide"
        onRequestClose={() => setModalOsVisible(false)}
      >
        <ModalDetailOrder
          ordem={selectedOrdem}
          handleCloseModal={() => setModalOsVisible(false)}
        />
      </Modal>

      <TouchableOpacity
        style={styles.fabSecondary}
        onPress={() => navigation.navigate("ListOrdemdeServicoInterna" as never)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="form-select" size={26} color={colors.onPrimary} />
      </TouchableOpacity>

      {/* Modal de filtros — bottom sheet */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.filterOverlay}
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        />
        <View style={styles.filterSheet}>
          <View style={styles.filterHandle} />

          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filtros</Text>
            {activeFiltersCount > 0 && (
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.filterClearText}>Limpar tudo</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            <Text style={styles.filterLabel}>Tipo de OS</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelected}
              inputSearchStyle={styles.dropdownSearchInput}
              containerStyle={styles.dropdownContainer}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItem}
              activeColor={colors.primarySoft}
              iconColor={colors.muted}
              data={[{ label: "Todos os tipos", value: "" }, ...tiposOrdem.map(t => ({ label: t.name, value: t.id }))]}
              labelField="label"
              valueField="value"
              placeholder="Todos os tipos"
              search
              searchPlaceholder="Buscar tipo..."
              value={tipoOrdemFilter}
              onChange={(item) => setTipoOrdemFilter(item.value)}
              maxHeight={220}
            />

            <Text style={styles.filterLabel}>Instituição</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelected}
              inputSearchStyle={styles.dropdownSearchInput}
              containerStyle={styles.dropdownContainer}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItem}
              activeColor={colors.primarySoft}
              iconColor={colors.muted}
              data={[{ label: "Todas as instituições", value: "" }, ...instituicoes.map(i => ({ label: i.name, value: i.id }))]}
              labelField="label"
              valueField="value"
              placeholder="Todas as instituições"
              search
              searchPlaceholder="Buscar instituição..."
              value={instituicaoFilter}
              onChange={(item) => setInstituicaoFilter(item.value)}
              maxHeight={220}
            />

            <Text style={styles.filterLabel}>Cliente</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelected}
              inputSearchStyle={styles.dropdownSearchInput}
              containerStyle={styles.dropdownContainer}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItem}
              activeColor={colors.primarySoft}
              iconColor={colors.muted}
              data={[{ label: "Todos os clientes", value: "" }, ...clientes.map(c => ({ label: c.name, value: c.id }))]}
              labelField="label"
              valueField="value"
              placeholder="Todos os clientes"
              search
              searchPlaceholder="Buscar cliente..."
              value={clienteFilter}
              onChange={(item) => setClienteFilter(item.value)}
              maxHeight={220}
            />

            <Text style={styles.filterLabel}>Prioridade</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelected}
              inputSearchStyle={styles.dropdownSearchInput}
              containerStyle={styles.dropdownContainer}
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItem}
              activeColor={colors.primarySoft}
              iconColor={colors.muted}
              data={[{ label: "Todas as prioridades", value: "" }, ...prioridades.map(p => ({ label: p.name, value: p.id }))]}
              labelField="label"
              valueField="value"
              placeholder="Todas as prioridades"
              search
              searchPlaceholder="Buscar prioridade..."
              value={prioridadeFilter}
              onChange={(item) => setPrioridadeFilter(item.value)}
              maxHeight={220}
            />
          </ScrollView>

          <TouchableOpacity
            style={styles.filterApplyButton}
            onPress={() => setFilterModalVisible(false)}
          >
            <Text style={styles.filterApplyText}>
              {activeFiltersCount > 0 ? `Aplicar (${activeFiltersCount})` : "Fechar"}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    subtitle: { color: c.body, fontSize: 13, marginTop: 2, ...font("regular") },

    searchRow: { flexDirection: "row", alignItems: "center", gap: 8, marginHorizontal: 16, marginTop: 14, marginBottom: 10 },
    searchBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      height: 44,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: c.inputBorder,
      borderRadius: radii.btn,
      backgroundColor: c.inputBg,
    },
    searchBoxFocused: { borderColor: c.inputFocus },
    input: {
      flex: 1,
      height: "100%",
      color: c.text,
      fontSize: 13,
      ...font("regular"),
      ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null),
    },

    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      height: 44,
      paddingHorizontal: 12,
      borderRadius: radii.btn,
      borderWidth: 1,
      borderColor: c.borderAccent,
      backgroundColor: c.primarySoft,
      gap: 6,
    },
    filterButtonActive: { borderColor: c.primary },
    filterButtonText: { color: c.primaryText, fontSize: 13, ...font("semibold") },
    filterBadge: {
      backgroundColor: c.brand,
      borderRadius: 9,
      minWidth: 18,
      height: 18,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 4,
    },
    filterBadgeText: { color: c.onPrimary, fontSize: 11, ...font("bold") },

    statusRow: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 4, flexWrap: "wrap", gap: 8 },
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
      borderRadius: radii.card,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
      shadowColor: dark ? "#000" : "#0B1033",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: dark ? 0.3 : 0.06,
      shadowRadius: 16,
      elevation: 2,
    },
    cardAccent: { width: 3, alignSelf: "stretch" },
    cardBody: { flex: 1, paddingVertical: 14, paddingHorizontal: 14, gap: 6 },
    cardRowSpaced: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
    cardNumber: { fontSize: 15, color: c.text, letterSpacing: -0.2, ...font("extrabold") },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      borderRadius: radii.pill,
      borderWidth: 1,
      paddingHorizontal: 9,
      paddingVertical: 3,
    },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusBadgeText: { fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, ...font("bold") },
    cardRowInfo: { flexDirection: "row", alignItems: "center", gap: 6 },
    cardLocalText: { fontSize: 13, color: c.text, flex: 1, ...font("semibold") },
    priorityBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      alignSelf: "flex-start",
      borderRadius: radii.chip,
      paddingHorizontal: 7,
      paddingVertical: 3,
      marginTop: 1,
    },
    priorityBadgeText: { fontSize: 11, ...font("bold") },
    cardProblemText: { fontSize: 12, color: c.body, flex: 1, ...font("regular") },
    cardDateText: { fontSize: 11, color: c.muted, ...font("medium") },

    fabSecondary: {
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
    },

    emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 80, gap: 10 },
    emptyTitle: { fontSize: 16, color: c.text, ...font("bold") },
    emptySubtitle: { fontSize: 13, color: c.muted, textAlign: "center", paddingHorizontal: 40, ...font("regular") },

    filterOverlay: { flex: 1, backgroundColor: c.overlay },
    filterSheet: {
      backgroundColor: c.card,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: c.border,
      paddingHorizontal: 16,
      paddingBottom: 30,
      paddingTop: 10,
      maxHeight: "85%",
    },
    filterHandle: {
      width: 40,
      height: 4,
      backgroundColor: c.borderStrong,
      borderRadius: 2,
      alignSelf: "center",
      marginBottom: 14,
    },
    filterHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    filterTitle: { fontSize: 18, color: c.text, ...font("bold") },
    filterClearText: { fontSize: 13, color: c.errorText, ...font("semibold") },
    filterLabel: {
      fontSize: 11,
      color: c.eyebrow,
      marginTop: 14,
      marginBottom: 2,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      ...font("semibold"),
    },
    dropdown: {
      height: 48,
      backgroundColor: c.inputBg,
      borderRadius: radii.btn,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: c.inputBorder,
      marginTop: 6,
      marginBottom: 4,
    },
    dropdownPlaceholder: { fontSize: 13, color: c.placeholder, ...font("regular") },
    dropdownSelected: { fontSize: 13, color: c.text, ...font("semibold") },
    dropdownSearchInput: {
      height: 40,
      fontSize: 13,
      borderRadius: radii.btn,
      borderColor: c.border,
      color: c.text,
      backgroundColor: c.inputBg,
    },
    dropdownContainer: {
      borderRadius: radii.btn,
      borderColor: c.border,
      backgroundColor: c.surface,
      overflow: "hidden",
      elevation: 4,
    },
    dropdownItem: { backgroundColor: c.surface },
    dropdownItemText: { fontSize: 13, color: c.text, ...font("regular") },
    filterApplyButton: {
      marginTop: 16,
      backgroundColor: c.brand,
      borderRadius: radii.btn,
      paddingVertical: 14,
      alignItems: "center",
    },
    filterApplyText: { color: c.onPrimary, fontSize: 15, ...font("semibold") },
  });
};

