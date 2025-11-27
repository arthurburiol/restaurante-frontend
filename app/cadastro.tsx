import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Api from "../Servico/Api";
import Logo from "../assets/images/logo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";

import DropDownPicker from "react-native-dropdown-picker";

export default function Cadastro() {
  const router = useRouter();
  const { idusuario } = useLocalSearchParams();
  const [usuarioa, setUsuarioa] = useState(null);

  const [usuario, setUsuario] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("");

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "CLIENTE", value: "CLIENTE" },
    { label: "GARÇOM", value: "GARCOM" },
    { label: "COZINHA", value: "COZINHA" },
    { label: "ADMIN", value: "ADMIN" },
  ]);

  async function carregarParaEdicao() {
    try {
      const resp = await Api.api.get(`/usuario/${idusuario}`);
      const dados = resp.data;

      setUsuario(dados.usuario ?? "");
      setNome(dados.nome ?? "");
      setCpf(dados.cpf ?? "");
      setTelefone(dados.telefone ?? "");
      setTipo(dados.tipo ?? "");
      setSenha("");
    } catch (e) {
      console.log("Erro ao carregar usuário:", e);
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    }
  }

  async function carregarUsuario() {
    const json = await AsyncStorage.getItem("usuario");
    if (json) setUsuarioa(JSON.parse(json));
  }

  useEffect(() => {
    carregarUsuario();
    if (idusuario) {
      carregarParaEdicao();
    }
  }, [idusuario]);

  async function salvar() {
    if (!usuario || !nome) {
      Alert.alert("Atenção", "Preencha usuário e nome.");
      return;
    }

    try {
      if (idusuario) {
        const resposta = await Api.api.put(`/usuario/${idusuario}`, {
          usuario,
          nome,
          cpf,
          telefone,
          tipo,
          senha: senha || undefined,
        });

        Alert.alert("Sucesso", "Usuário atualizado com sucesso!");

        

        if (usuarioa && usuarioa.tipo === "ADMIN") {
          router.replace("/usuarios");
          return;
        }

        router.replace("/home");
        return;
      }

      const resposta = await Api.api.post("/usuario", {
        usuario,
        senha,
        cpf,
        nome,
        telefone,
        tipo: "CLIENTE",
      });

      Alert.alert("Sucesso", "Usuário cadastrado com sucesso!");
      router.replace("/");
    } catch (erro) {
      console.log("Erro ao salvar:", erro);
      Alert.alert("Erro", "Não foi possível salvar o usuário.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          backgroundColor: "#2c2c2c",
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Image source={Logo} style={baseStyles.logo} />

        <Text style={baseStyles.title}>
          {idusuario ? "Editar Usuário" : "Cadastro de Usuário"}
        </Text>

        <TextInput
          placeholder="Nome completo"
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

        <TextInput
          placeholder="CPF"
          placeholderTextColor="#aaa"
          value={cpf}
          onChangeText={setCpf}
          style={styles.input}
          keyboardType="number-pad"
        />

        <TextInput
          placeholder="Telefone"
          placeholderTextColor="#aaa"
          value={telefone}
          onChangeText={setTelefone}
          style={styles.input}
          keyboardType="phone-pad"
        />

        {usuarioa &&
      usuarioa.tipo === "ADMIN" &&
      String(usuarioa.id) !== String(idusuario) && (
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={open}
            value={tipo}
            items={items}
            setOpen={setOpen}
            setValue={setTipo}
            setItems={setItems}
            placeholder="Tipo de Usuário"
            placeholderStyle={{ color: "#aaa" }}
            style={styles.dropdownContainer}
            containerStyle={styles.dropdownWrap}
            textStyle={styles.dropdownText}
            dropDownContainerStyle={styles.dropDownContainer}
            itemSeparator={true}
            itemSeparatorStyle={{ backgroundColor: "#2c2c2c" }}
            zIndex={3000}
            zIndexInverse={1000}
            listItemLabelStyle={{ color: "white" }}
            selectedItemLabelStyle={{ fontWeight: "bold" }}
            arrowIconStyle={{ tintColor: "white" }}
          />
        </View>
    )}

        <TextInput
          placeholder="Usuário (login)"
          placeholderTextColor="#aaa"
          value={usuario}
          onChangeText={setUsuario}
          style={styles.input}
        />

        <TextInput
          placeholder={idusuario ? "Nova senha (opcional)" : "Senha"}
          placeholderTextColor="#aaa"
          value={senha}
          onChangeText={setSenha}
          style={styles.input}
          secureTextEntry
        />

        <TouchableOpacity onPress={salvar} style={styles.botao}>
          <Text style={styles.botaoTexto}>
            {idusuario ? "Salvar Edição" : "Realizar Cadastro"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2c",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    color: "#fff",
  },
});

const styles = StyleSheet.create({
  input: {
    width: "80%",
    backgroundColor: "#404040",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    color: "white",
    fontSize: 16,
    marginBottom: 25,
  },

  botao: {
    width: "80%",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#d43c14",
    backgroundColor: "transparent",
    alignItems: "center",
    marginBottom: 30,
  },

  botaoTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },

  dropdownWrap: {
    width: "80%",
    marginBottom: 25,
    zIndex: 4000, 
  },
  dropdownContainer: {
    backgroundColor: "#404040",
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 0,
    paddingHorizontal: 15,
  },
  dropdownText: {
    color: "white",
    fontSize: 16,
  },
  dropDownContainer: {
    backgroundColor: "#404040",
    borderColor: "#d43c14",
    borderWidth: 1,
    borderRadius: 8,
  },

  dropdownWrapper: {
    width: "100%",
    alignItems: "center",
  },
});
