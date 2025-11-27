import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Api from "../Servico/Api";

function aplicarMascaraData(texto) {
  let limpo = texto.replace(/\D/g, "");

  if (limpo.length <= 2) return limpo;
  if (limpo.length <= 4) return limpo.slice(0, 2) + "/" + limpo.slice(2);

  return (
    limpo.slice(0, 2) +
    "/" +
    limpo.slice(2, 4) +
    "/" +
    limpo.slice(4, 8)
  );
}

function converterData(dataBR) {
  const [dia, mes, ano] = dataBR.split("/");
  return `${ano}-${mes}-${dia}`;
}

export default function RelatorioPeriodo() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [relatorio, setRelatorio] = useState([]);
  const [totalPeriodo, setTotalPeriodo] = useState(0);

  async function buscarPeriodo() {
    try {
      if (dataInicio.length !== 10 || dataFim.length !== 10) {
        alert("Informe as duas datas corretamente (DD/MM/AAAA)");
        return;
      }

      const dataIniFormatada = converterData(dataInicio);
      const dataFimFormatada = converterData(dataFim);

      const respostaItens = await Api.api.post("/relatorio/itensperiodo", {
        data_inicio: dataIniFormatada,
        data_fim: dataFimFormatada
      });

      const respostaTotal = await Api.api.post("/relatorio/totalperiodo", {
        data_inicio: dataIniFormatada,
        data_fim: dataFimFormatada
      });

      console.log("Itens:", respostaItens.data);
      console.log("Total:", respostaTotal.data);

      const itensTratados = respostaItens.data.map((item, index) => ({
        id: index + 1,
        descricao: item.nome,
        quantidade: Number(item.quantidade_vendida),
        valor: Number(item.total_faturado)
      }));

      setRelatorio(itensTratados);
      setTotalPeriodo(Number(respostaTotal.data.total_do_periodo) || 0);

    } catch (erro) {
      console.log("Erro ao buscar relatório:", erro);
      alert("Erro ao buscar relatório (veja o console).");
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Relatório por Período</Text>

      <TextInput
        style={styles.input}
        placeholder="Data Início (DD/MM/AAAA)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={dataInicio}
        maxLength={10}
        onChangeText={(txt) => setDataInicio(aplicarMascaraData(txt))}
      />

      <TextInput
        style={styles.input}
        placeholder="Data Fim (DD/MM/AAAA)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={dataFim}
        maxLength={10}
        onChangeText={(txt) => setDataFim(aplicarMascaraData(txt))}
      />

      <TouchableOpacity style={styles.btnBuscar} onPress={buscarPeriodo}>
        <Text style={styles.btnTexto}>Buscar</Text>
      </TouchableOpacity>

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
        <Text style={styles.totalLabel}>Total do Período:</Text>
        <Text style={styles.totalValor}>R$ {totalPeriodo.toFixed(2)}</Text>
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
  input: {
    backgroundColor: "#3b3b3b",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d43c14",
  },
  btnBuscar: {
    backgroundColor: "#d43c14",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  btnTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
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
});
