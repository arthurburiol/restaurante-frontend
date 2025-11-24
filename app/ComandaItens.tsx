
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Api from "../Servico/Api";
import { useRoute, RouteProp } from "@react-navigation/native";

type ComandaItemType = {
  id?: number; // opcional porque o backend pode usar outro nome
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

// Tipagem simples para a rota (ajuste o name da tela se quiser)
type RootStackParamList = {
  ComandaItens: { id_comanda: number } | undefined;
};

// usamos RouteProp para tipar useRoute
type ComandaItensRouteProp = RouteProp<RootStackParamList, "ComandaItens">;

export default function ComandaItens() {
  const route = useRoute<ComandaItensRouteProp>();
  const id_comanda = route?.params?.id_comanda; // seguro contra undefined

  const [itens, setItens] = useState<ComandaItemType[]>([]);

  async function carregarItens() {
    if (!id_comanda) {
      // evita chamada inválida quando o parâmetro não foi passado
      console.warn("id_comanda não fornecido na rota");
      setItens([]);
      return;
    }

    try {
      const response = await Api.api.get(`/comandaitens/${id_comanda}`);
      // cast explícito (ajuste se a API devolver envelopamento)
      setItens(response.data as ComandaItemType[]);
    } catch (error) {
      console.log("Erro ao carregar itens da comanda:", error);
      setItens([]);
    }
  }

  // dispara quando id_comanda estiver disponível / mudar
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

  // função utilitária para transformar o valor em número seguro
  const formatarValor = (v: number | string | undefined) => {
    if (v === undefined || v === null) return "0,00";
    // converte string com vírgula para ponto antes do Number
    const s = String(v).replace(",", ".");
    const n = Number(s);
    if (isNaN(n)) return "0,00";
    // retorna com duas casas, usando vírgula como separador BR
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
            // tolerante a diferentes nomes de id vindos do backend
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
