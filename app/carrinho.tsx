import React from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCarrinho } from "./CarrinhoContext";
import Api from "../Servico/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Carrinho() {
  const router = useRouter();
  const { itens, remover, total, limpar } = useCarrinho();

  const pratos = itens.filter(item => item.tipo === "PRATO");
  const bebidas = itens.filter(item => item.tipo === "BEBIDA");

  async function fazerPedido() {
    try {
      const produtos = itens.map(p => ({
        id_produto: p.id,
        quantidade: 1,
        valor_unitario: p.preco ?? 0,
      }));

      const token = await AsyncStorage.getItem("token");

      const resposta = await Api.api.post(
        "/comanda/criar",
        { produtos },
        { headers: { token } }
      );

      const idComanda = resposta.data.id_comanda;
      const valorTotal = resposta.data.total;

      limpar();

      // REDIRECIONA PARA A TELA DE PAGAMENTO
      router.push({
        pathname: "/pagamento",
        params: {
          id_comanda: idComanda,
          total: valorTotal
        }
      });

    } catch (error) {
      console.log(error);
      alert("Erro ao enviar pedido");
    }
  }

  const renderItem = (item: any) => (
    <View style={styles.itemCard}>
      <View>
        <Text style={styles.itemName}>{item.nome ?? "Produto"}</Text>
        <Text style={styles.itemPrice}>R$ {Number(item.preco ?? 0).toFixed(2)}</Text>
      </View>
      <TouchableOpacity onPress={() => remover(item)}>
        <MaterialIcons name="delete" size={28} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu Carrinho</Text>

      <Text style={styles.sectionTitle}>Comidas ({pratos.length})</Text>
      <FlatList
        data={pratos}
        keyExtractor={(_, index) => "prato-" + index}
        renderItem={({ item }) => renderItem(item)}
      />

      <Text style={styles.sectionTitle}>Bebidas ({bebidas.length})</Text>
      <FlatList
        data={bebidas}
        keyExtractor={(_, index) => "bebida-" + index}
        renderItem={({ item }) => renderItem(item)}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>
          Total: R$ {total()?.toFixed(2) ?? "0.00"}
        </Text>

        <TouchableOpacity style={styles.btnEnviar} onPress={fazerPedido}>
          <Text style={styles.btnText}>Fazer Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2c2c2c", padding: 16, paddingTop: 40 },
  title: { color: "#fff", fontSize: 26, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  sectionTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginTop: 20, marginBottom: 5 },
  itemCard: {
    backgroundColor: "#3b3b3b",
    borderWidth: 2,
    borderColor: "#d43c14",
    padding: 12,
    borderRadius: 10,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: { color: "#fff", fontSize: 18 },
  itemPrice: { color: "#ccc", marginTop: 4 },
  footer: { marginTop: 20, paddingTop: 15, borderTopWidth: 2, borderTopColor: "#d43c14" },
  totalText: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  btnEnviar: { backgroundColor: "#d43c14", paddingVertical: 12, borderRadius: 10 },
  btnText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "700" },
});
