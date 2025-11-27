import React ,{ useEffect, useState }from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Logo from "../assets/images/logo.png";

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);

  async function carregarUsuario() {
    const json = await AsyncStorage.getItem("usuario");
    if (json) setUsuario(JSON.parse(json));
  }
  async function sair() {
  try {
    await AsyncStorage.removeItem("usuario");
    await AsyncStorage.removeItem("token");
    router.replace("/");
  } catch (error) {
    console.log("Erro ao sair:", error);
  }
}

  useEffect(() => {
      carregarUsuario();
      
    }, []);
  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={styles.configButton}
        onPress={() => {
          if (usuario) {
            router.push(`/cadastro?idusuario=${usuario.id}`);
          }
        }}
      >
        <MaterialIcons name="settings" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={sair}
      >
        <MaterialIcons name="logout" size={26} color="#fff" />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
      

      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />
      </View>
      

      <View style={styles.grid}>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/comanda")}
        >
          <MaterialIcons name="receipt-long" size={40} color="#d43c14" />
          <Text style={styles.cardTitle}>Comanda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/cardapio")}
        >
          <MaterialIcons name="restaurant-menu" size={40} color="#d43c14" />
          <Text style={styles.cardTitle}>Cardápio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/copa")}
        >
          <MaterialIcons name="local-bar" size={40} color="#d43c14" />
          <Text style={styles.cardTitle}>Copa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/cozinha")}
        >
          <MaterialIcons name="restaurant" size={40} color="#d43c14" />
          <Text style={styles.cardTitle}>Cozinha</Text>
        </TouchableOpacity>
        {usuario && (usuario.tipo === "GARCOM" || usuario.tipo === "ADMIN" || usuario.tipo === "COZINHA") && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/relatorio")}
        >
          <MaterialIcons name="analytics" size={40} color="#d43c14" />
          <Text style={styles.cardTitle}>Relatório</Text>
        </TouchableOpacity>
      )}
      {usuario && (usuario.tipo === "GARCOM" || usuario.tipo === "ADMIN" || usuario.tipo === "COZINHA") && (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/usuarios")}
        >
          <MaterialIcons name="people" size={40} color="#d43c14" />
          <Text style={styles.cardTitle}>Usuários</Text>
        </TouchableOpacity>
      )} 

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2c",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  configButton: {
  position: "absolute",
  top: 50,
  left: 16,
  backgroundColor: "#d43c14",
  padding: 8,
  borderRadius: 8,
  zIndex: 10,
},

  logoutButton: {
    position: "absolute",
    top: 50,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d43c14",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10,
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 6,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 35,
    marginTop: 5,
  },

  logo: {
    width: 130,
    height: 130,
    resizeMode: "contain",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#3b3b3b",
    borderRadius: 14,
    paddingVertical: 20,
    marginBottom: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d43c14",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
});
