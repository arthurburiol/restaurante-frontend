import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert, 
} from "react-native";
import { useRouter } from "expo-router";
import Api from "../Servico/Api";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export default function ProdutosListagem() {
  const router = useRouter();
  const [produtos, setProdutos] = useState([]);

  async function carregar() {
    try {
      const resp = await Api.api.get("/produto");
      setProdutos(resp.data);
    } catch (erro) {
      console.log("Erro ao listar produtos:", erro);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    }
  }

  

  useFocusEffect(
  useCallback(() => {
    carregar();
  }, [])
);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Produtos</Text>

      <TouchableOpacity
        style={styles.botaoNovo}
        onPress={() => router.push("/produtoCadastro")}
      >
        <Text style={styles.botaoTexto}>Cadastrar Novo Produto</Text>
      </TouchableOpacity>

      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.descricao}>{item.descricao}</Text>
              <Text style={styles.preco}>R$ {Number(item.preco).toFixed(2)}</Text>
              <Text style={styles.tipo}>Tipo: {item.tipo}</Text>
              <Text style={styles.disp}>
                Disponível: {item.disponivel ? "Sim" : "Não"}
              </Text>
            </View>

            <View style={styles.cardBtns}>
              <TouchableOpacity
                style={styles.btnEditar}
                    onPress={() =>
                  router.push({
                    pathname: "/produtoCadastro",
                    params: { id: item.id }
                  })
                }
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2c",
    padding: 20,
  },
  titulo: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  botaoNovo: {
    backgroundColor: "#d43c14",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  botaoTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#404040",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
  },
  nome: { color: "#fff", fontSize: 18, fontWeight: "700" },
  descricao: { color: "#ccc", marginTop: 5 },
  preco: { color: "#fff", marginTop: 5, fontWeight: "bold" },
  tipo: { color: "#bbb", marginTop: 5 },
  disp: { color: "#bbb", marginTop: 5 },
  cardBtns: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginLeft: 10,
  },
  btnEditar: {
    backgroundColor: "#1188ee",
    padding: 8,
    borderRadius: 6,
  },
  btnExcluir: {
    backgroundColor: "#d43c14",
    padding: 8,
    borderRadius: 6,
  },
  btnText: {
    color: "white",
    fontWeight: "700",
  },
});
