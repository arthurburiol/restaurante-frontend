import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Api from "../Servico/Api";

// Tipagem do React Navigation
type RootStackParamList = {
  ComandaItens: { id_comanda: number };
};

// Tipagem de cada comanda
type ComandaType = {
  id: number;
  cpf_usuario: string;
  total?: number | string; // pode vir como string do backend
  status: string;
  data_abertura?: string; // opcional
  usuario?: {
    nome: string;
    cpf: string;
  };
};

export default function ComandaFechada() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [comandas, setComandas] = useState<ComandaType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function carregarComandas() {
    setLoading(true);
    try {
      const resposta = await Api.api.get("/comanda/listarComandaFechada");
      setComandas(resposta.data);
    } catch (error) {
      console.log("Erro ao carregar comandas:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarComandas();
  }, []);

  const renderComandaItem = ({ item }: { item: ComandaType }) => {
    const total = Number(item.total) || 0;

    let dataAbertura = "Não informada";
      if (item.data_abertura) {
        const dt = new Date(item.data_abertura);
        if (!isNaN(dt.getTime())) {
          // Ajuste manual GMT-3
          const dtLocal = new Date(dt.getTime() - 3 * 60 * 60 * 1000);
          dataAbertura = dtLocal.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        } 
      }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ComandaItens", { id_comanda: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Comanda #{item.id}</Text>
          <Text
            style={[
              styles.cardStatus,
              item.status === "ABERTA"
                ? { color: "#4caf50" }
                : item.status === "FECHADA"
                ? { color: "#f44336" }
                : { color: "#ff9800" },
            ]}
          >
            {item.status || "N/A"}
          </Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardUser}>
            Cliente: {item.usuario?.nome || item.cpf_usuario || "Não informado"}
          </Text>
          <Text style={styles.cardTotal}>Total: R$ {total.toFixed(2)}</Text>
          <Text style={styles.cardDate}>Abertura: {dataAbertura}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>Comandas fechadas</Text>
      </View>

      <View style={styles.bigBox}>
        {comandas.length === 0 && !loading ? (
          <Text style={styles.bigBoxText}>Nenhuma comanda encontrada</Text>
        ) : (
          <FlatList
            data={comandas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderComandaItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={carregarComandas}>
          <Text style={styles.buttonText}>Atualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>

        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2c",
    padding: 16,
  },

  titleBox: {
    borderWidth: 2,
    borderColor: "#d43c14",
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },

  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  bigBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#d43c14",
    borderRadius: 14,
    padding: 10,
  },

  bigBoxText: {
    color: "#fff",
    fontSize: 18,
    opacity: 0.5,
    textAlign: "center",
    marginTop: 20,
  },

  card: {
    backgroundColor: "#383838",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#d43c14",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  cardStatus: {
    fontWeight: "700",
  },

  cardBody: {
    paddingLeft: 2,
  },

  cardUser: {
    color: "#fff",
    fontSize: 14,
  },

  cardTotal: {
    color: "#fff",
    fontSize: 14,
    marginTop: 2,
  },

  cardDate: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 2,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  button: {
    flex: 1,
    backgroundColor: "#d43c14",
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
