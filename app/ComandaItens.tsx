
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Api from "../Servico/Api";
import { useRoute, RouteProp } from "@react-navigation/native";

type ComandaItemType = {
  id?: number; 
  id_comanda?: number;
  id_produto?: number;
  quantidade: number;
  valor_unitario: number | string;
  status: string;
  tempo_pedido?: string;
  observacoes?: string;
  produto?: {
    nome?: string;
  };
};

type RootStackParamList = {
  ComandaItens: { id_comanda: number } | undefined;
};

type ComandaItensRouteProp = RouteProp<RootStackParamList, "ComandaItens">;

export default function ComandaItens() {
  const route = useRoute<ComandaItensRouteProp>();
  const id_comanda = route?.params?.id_comanda; 

  const [itens, setItens] = useState<ComandaItemType[]>([]);

  async function carregarItens() {
    if (!id_comanda) {
      console.warn("id_comanda não fornecido na rota");
      setItens([]);
      return;
    }

    try {
      const response = await Api.api.get(`/comandaitens/${id_comanda}`);
      setItens(response.data as ComandaItemType[]);
    } catch (error) {
      console.log("Erro ao carregar itens da comanda:", error);
      setItens([]);
    }
  }

  useEffect(() => {
    carregarItens();
  }, [id_comanda]);

  const formatarData = (dataStr?: string) => {
  if (!dataStr) return "Não informada";

  const dt = new Date(dataStr);
  if (isNaN(dt.getTime())) return "Inválida";

  return dt.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const formatarValor = (v: number | string | undefined) => {
    if (v === undefined || v === null) return "0,00";
    const s = String(v).replace(",", ".");
    const n = Number(s);
    if (isNaN(n)) return "0,00";
    return n.toFixed(2).replace(".", ",");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Itens da Comanda #{id_comanda ?? "-"}</Text>

      {itens.length === 0 ? (
        <Text style={styles.empty}>Nenhum item nessa comanda</Text>
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(item) =>
            String(item.id ?? item.id_comanda ?? item.id_produto ?? Math.random())
          }
          renderItem={({ item }: { item: ComandaItemType }) => (
            <View style={styles.itemBox}>
              <Text style={styles.itemText}>
                Produto: {item.produto?.nome ?? item.id_produto ?? "—"} | Qtd:{" "}
                {item.quantidade ?? 0}
              </Text>
              <Text style={styles.itemSub}>
                R$ {formatarValor(item.valor_unitario)} | {item.status ?? "—"}
              </Text>
              <Text style={styles.itemSub}>
                Pedido: {formatarData(item.tempo_pedido)}
              </Text>
              {item.observacoes ? (
                <Text style={styles.obs}>Obs: {item.observacoes}</Text>
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2c2c2c", padding: 14 },
  title: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 16 },
  empty: { color: "#bbb", fontSize: 16, textAlign: "center", marginTop: 40 },
  itemBox: {
    borderWidth: 1,
    borderColor: "#d43c14",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  itemText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  itemSub: { color: "#ffb38a", fontSize: 14 },
  obs: { color: "#aaa", fontSize: 13, fontStyle: "italic" },
});
