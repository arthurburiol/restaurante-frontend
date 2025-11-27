import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import Api from "../Servico/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function Cozinha() {

  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);

  const router = useRouter(); 

  async function carregarPedidos() {
    try {
      setLoading(true);
      const resposta = await Api.api.get("/comandaitens/pratos");
      setPedidos(resposta.data);
    } catch (erro) {
      console.log("Erro ao buscar pedidos:", erro);
    } finally {
      setLoading(false);
    }
  }

  async function carregarUsuario() {
    const json = await AsyncStorage.getItem("usuario");
    if (json) setUsuario(JSON.parse(json));
  }

  useEffect(() => {
    carregarUsuario();
    carregarPedidos();
  }, []);

  async function alterarStatus(id, statusAtual) {
    if (!usuario) return;

    if (usuario.tipo !== "COZINHA" && usuario.tipo !== "ADMIN") return;

    let novoStatus = "";

    if (statusAtual === "PENDENTE") novoStatus = "EM_EXECUCAO";
    else if (statusAtual === "EM_EXECUCAO") novoStatus = "PRONTO";
    else return;

    try {
      await Api.api.put(`/comandaitens/alterarStatusItem/${id}`, { status: novoStatus });
      carregarPedidos();
    } catch (error) {
      console.log("Erro ao alterar status:", error);
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Cozinha</Text>

      {loading && (
        <ActivityIndicator size={40} color="#fff" style={{ marginBottom: 20 }} />
      )}

      <ScrollView style={{ width: "100%" }}>
        {pedidos.map((p) => (
          <View key={p.id} style={styles.card}>

            <Text style={styles.cardTitle}>
              Cliente: {p.comanda?.usuario?.nome || p.comanda?.cpf_usuario || "Não informado"}
            </Text>

            <Text style={styles.cardItem}>
              {p.produto?.nome}  • {p.quantidade}x
            </Text>

            {p.observacoes && (
              <Text style={styles.obs}>Obs: {p.observacoes}</Text>
            )}

            <Text style={styles.status}>
              Status: {p.status}
            </Text>

            {usuario &&
              (usuario.tipo === "COZINHA" || usuario.tipo === "ADMIN") &&
              p.status !== "PRONTO" && (
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => alterarStatus(p.id, p.status)}
                >
                  <Text style={styles.btnText}>
                    {p.status === "PENDENTE"
                      ? "Marcar como EM EXECUÇÃO"
                      : "Marcar como PRONTO"}
                  </Text>
                </TouchableOpacity>
              )}
          </View>
        ))}
      </ScrollView>

  
      <View style={styles.buttonRow}>
    {usuario && (usuario.tipo === "GARCOM" || usuario.tipo === "ADMIN" || usuario.tipo === "COZINHA") && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/produto")} // 🔥 AJUSTADO
        >
          <Text style={styles.buttonText}>Produtos</Text>
        </TouchableOpacity>
      )}
        <TouchableOpacity style={styles.button} onPress={carregarPedidos}>
          <Text style={styles.buttonText}>Atualizar</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2c",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#3b3b3b",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#d43c14",
  },
  cardTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
  cardItem: {
    fontSize: 18,
    color: "#ddd",
    marginVertical: 4,
  },
  obs: {
    fontSize: 14,
    color: "#ffdd99",
    marginTop: 4,
    fontStyle: "italic",
  },
  status: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 8,
  },
  btn: {
    marginTop: 12,
    backgroundColor: "#d43c14",
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
