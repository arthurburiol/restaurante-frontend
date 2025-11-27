import React, { useState } from "react";
import Logo from "../assets/images/logo.png";
import { View, Text, TouchableOpacity, TextInput, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import Api from "../Servico/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    if (!usuario || !senha) {
      Alert.alert("Atenção", "Preencha usuário e senha.");
      return;
    }

    try {
      const response = await Api.api.post("/login", {
        usuario,
        senha,
      });

      if (response.status === 200) {
        const {token, usuario: dadosUsuario} = response.data;

        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("usuario", JSON.stringify(dadosUsuario));
        await Api.setTokenAxios();

        router.push("/home");  
      } else {
        Alert.alert("Erro", "Falha no login");
      }

    } catch (error) {
      console.log("Erro no login:", error);
      const msg = error.response?.data?.error || "Não foi possível conectar ao servidor.";
      Alert.alert("Erro", msg);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#2c2c2c",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 80,
      }}
    >
      <Image
        source={Logo}
        style={{
          width: 140,
          height: 140,
          resizeMode: "contain",
          marginBottom: 40,
        }}
      />

      <Text
        style={{
          fontSize: 26,
          fontWeight: "700",
          marginBottom: 20,
          color: "#fff",
        }}
      >
        Sistema de Restaurante
      </Text>

      <TextInput
        placeholder="Usuario"
        placeholderTextColor="#aaa"
        value={usuario}
        onChangeText={setUsuario}
        style={{
          width: "80%",
          backgroundColor: "#404040",
          paddingVertical: 12,
          paddingHorizontal: 15,
          borderRadius: 8,
          color: "white",
          fontSize: 16,
          marginBottom: 15,
        }}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#aaa"
        value={senha}
        onChangeText={setSenha}
        style={{
          width: "80%",
          backgroundColor: "#404040",
          paddingVertical: 12,
          paddingHorizontal: 15,
          borderRadius: 8,
          color: "white",
          fontSize: 16,
          marginBottom: 30,
        }}
        secureTextEntry
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          width: "80%",
          paddingVertical: 12,
          borderRadius: 8,
          borderWidth: 1.5,
          borderColor: "#d43c14",
          backgroundColor: "#d43c14",
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          Entrar
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/cadastro")}
        style={{
          width: "80%",
          paddingVertical: 12,
          borderRadius: 8,
          borderWidth: 1.5,
          borderColor: "#d43c14",
          backgroundColor: "transparent",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          Fazer Cadastro
        </Text>
      </TouchableOpacity>
    </View>
  );
}
