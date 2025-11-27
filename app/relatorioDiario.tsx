import React, { useEffect,useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Api from "../Servico/Api";

export default function Relatorio() {
  
  const [relatorio, setRelatorio] = useState([]);
  const [totalDia, setTotalDia] = useState(0);

  async function atualizar() {
    try {
      const respostaItens = await Api.api.get("/relatorio/itens");
      
      const respostaTotal = await Api.api.get("/relatorio/total");
      
      const dadosItens = respostaItens.data.map((item, index) => ({
        id: index + 1,
        descricao: item.nome,
        quantidade: Number(item.quantidade_vendida),
        valor: Number(item.total_faturado)
      }));

      setRelatorio(dadosItens);
setTotalDia(Number(respostaTotal.data.total_do_dia) || 0);
    } catch (erro) {
      console.log("Erro ao atualizar relatório:", erro);
    }
  }

  useEffect(() => {
      atualizar();
      
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatório Diário</Text>

      <ScrollView style={styles.lista}>
        {relatorio.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.itemNome}>{item.descricao}</Text>
            <Text style={styles.itemInfo}>Qtd: {item.quantidade}</Text>
            <Text style={styles.valor}>R$ {item.valor.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.totalBox}>
        <Text style={styles.totalLabel}>Total do Dia:</Text>
        <Text style={styles.totalValor}>R$ {totalDia.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.btnAtualizar} onPress={atualizar}>
        <Text style={styles.btnTexto}>Atualizar Relatório</Text>
      </TouchableOpacity>
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
  lista: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#3b3b3b",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#d43c14",
  },
  itemNome: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  itemInfo: {
    color: "#bbb",
    marginTop: 4,
  },
  valor: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 6,
  },
  totalBox: {
    backgroundColor: "#3b3b3b",
    padding: 18,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#d43c14",
  },
  totalLabel: {
    color: "#ddd",
    fontSize: 18,
  },
  totalValor: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 6,
  },
  btnAtualizar: {
    backgroundColor: "#d43c14",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
