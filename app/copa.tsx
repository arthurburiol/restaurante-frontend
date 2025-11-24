import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Api from "../Servico/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Copa() {
  const [pedidos, setPedidos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  

  async function carregarPedidos() {
    try {
      const response = await Api.api.get("/comandaitens/bebidas");
      setPedidos(response.data); 
    } catch (error) { 
      console.log("Erro ao buscar pedidos da copa:", error);
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

  // Função para alterar status
  async function alterarStatus(id, statusAtual) {
   if (!usuario) return;

    // Só GARCOM ou ADMIN podem alterar
    if (usuario.tipo !== "GARCOM" && usuario.tipo !== "ADMIN") return;

    let novoStatus = "";
    
    if (statusAtual === "PENDENTE") novoStatus = "EM_EXECUCAO";
    else if (statusAtual === "EM_EXECUCAO") novoStatus = "ENTREGUE";
    else return; // se já estiver ENTREGUE, não faz nada

    try {
      await Api.api.put(`/comandaitens/alterarStatusItem/${id}`, { status: novoStatus });
      carregarPedidos(); // recarrega a lista
    } catch (error) {
      console.log("Erro ao alterar status:", error);
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.titleBox}>
        <Text style={styles.title}>Copa</Text>
      </View>

      <View style={styles.bigBox}>
        <ScrollView contentContainerStyle={styles.scrollInner}>
          {pedidos.length === 0 ? (
            <Text style={styles.bigBoxText}>Nenhum pedido encontrado</Text>
          ) : (
            pedidos.map((item) => (
              <View key={item.id} style={styles.itemBox}>
                <Text style={styles.itemTitle}>
                  {item.produto.nome} — {item.quantidade} un
                </Text>

                <Text style={styles.itemInfo}>
                  Comanda #{item.id_comanda} • {item.comanda.usuario.nome}
                </Text>

                <Text style={styles.itemStatus}>
                  Status: {item.status}
                </Text>

                {/* Botão para garçom alterar status */}
               {usuario && (usuario.tipo === "GARCOM" || usuario.tipo === "ADMIN") && item.status !== "ENTREGUE" && (
                  <TouchableOpacity 
                    style={styles.statusBtn} 
                    onPress={() => alterarStatus(item.id, item.status)}
                  >
                    <Text style={styles.btnText}>
                      {item.status === "PENDENTE" ? "Iniciar" : "Entregar"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Novo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={carregarPedidos}>
          <Text style={styles.buttonText}>Atualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Histórico</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2c2c2c", padding: 16 },
  titleBox: { borderWidth: 2, borderColor: "#d43c14", paddingVertical: 10, borderRadius: 12, marginBottom: 16 },
  title: { textAlign: "center", fontSize: 22, fontWeight: "700", color: "#fff" },
  bigBox: { flex: 1, borderWidth: 2, borderColor: "#d43c14", borderRadius: 14, padding: 10, marginBottom: 20 },
  scrollInner: { paddingBottom: 20 },
  bigBoxText: { color: "#fff", fontSize: 18, opacity: 0.6, textAlign: "center", marginTop: 20 },
  itemBox: { backgroundColor: "#3a3a3a", padding: 12, borderRadius: 10, marginBottom: 12 },
  itemTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  itemInfo: { color: "#ccc", fontSize: 14, marginTop: 4 },
  itemStatus: { color: "#d43c14", fontSize: 14, marginTop: 6, fontWeight: "600" },
  statusBtn: { backgroundColor: "#d43c14", padding: 8, borderRadius: 8, marginTop: 6, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  button: { flex: 1, backgroundColor: "#d43c14", marginHorizontal: 5, paddingVertical: 12, borderRadius: 30, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
