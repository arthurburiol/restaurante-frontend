import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Api from "../Servico/Api";
import DropDownPicker from "react-native-dropdown-picker";

export default function CadastroProduto() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [tipo, setTipo] = useState(null);
  const [disponivel, setDisponivel] = useState(true);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Prato", value: "PRATO" },
    { label: "Bebida", value: "BEBIDA" },
  ]);

  useEffect(() => {
    if (id) {
      carregarProduto();
    }
  }, [id]);

  async function carregarProduto() {
    try {
      const resp = await Api.api.get(`/produto/${id}`);
      const p = resp.data;

      setNome(p.nome);
      setDescricao(p.descricao);
      setPreco(String(p.preco));
      setTipo(p.tipo);
      setDisponivel(p.disponivel);
    } catch (e) {
      console.log(e);
      Alert.alert("Erro", "Não foi possível carregar o produto.");
    }
  }

  async function salvar() {
    if (!nome || !preco || !tipo) {
      Alert.alert("Atenção", "Preencha nome, preço e tipo.");
      return;
    }

    const dados = {
      nome,
      descricao,
      preco: Number(preco),
      tipo,
      disponivel,
    };

    try {
      if (id) {
        await Api.api.put(`/produto/${id}`, dados);
        Alert.alert("Sucesso", "Produto atualizado!");
      } else {
        await Api.api.post("/produto", dados);
        Alert.alert("Sucesso", "Produto cadastrado!");
      }

      router.replace("/produtos");
    } catch (erro) {
      console.log(erro);
      Alert.alert("Erro", "Não foi possível salvar o produto.");
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>
        {id ? "Editar Produto" : "Cadastro de Produto"}
      </Text>

      <TextInput
        placeholder="Nome"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Descrição"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        placeholder="Preço"
        placeholderTextColor="#aaa"
        style={styles.input}
        keyboardType="numeric"
        value={preco}
        onChangeText={setPreco}
      />

      <Text style={styles.label}>Tipo</Text>

      <DropDownPicker
      open={open}
      value={tipo}
      items={items}
      setOpen={setOpen}
      setValue={setTipo}
      setItems={setItems}
      style={styles.dropdown}
      dropDownContainerStyle={styles.dropdownContainer}

      textStyle={{ color: "white" }}                
      labelStyle={{ color: "white" }}           
      listItemLabelStyle={{ color: "white" }}

      placeholder="Selecione o tipo"
      placeholderStyle={{ color: "#aaa" }}
    />

      <TouchableOpacity style={styles.botao} onPress={salvar}>
        <Text style={styles.botaoTexto}>{id ? "Atualizar" : "Salvar"}</Text>
      </TouchableOpacity>
    </ScrollView>
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#404040",
    color: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: "#404040",
    borderColor: "#555",
  },
  dropdownContainer: {
    backgroundColor: "#404040",
    borderColor: "#555",
  },
  botao: {
    backgroundColor: "#d43c14",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
  },
  botaoTexto: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
