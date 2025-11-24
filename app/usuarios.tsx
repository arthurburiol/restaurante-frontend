import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Api from "../Servico/Api";
import { useRouter } from "expo-router";

export default function Usuarios() {
  const router = useRouter();

  const [usuarios, setUsuarios] = useState([]);

  async function carregarUsuarios() {
    try {
      const resposta = await Api.api.get("/usuario"); 
      setUsuarios(resposta.data);
    } catch (erro) {
      console.log("Erro ao carregar usuários:", erro);
      alert("Erro ao buscar usuários");
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.titleBox}>
        <Text style={styles.title}>Usuários</Text>
      </View>

      <View style={styles.bigBox}>
        {usuarios.length === 0 ? (
          <Text style={styles.bigBoxText}>Nenhum usuário encontrado</Text>
        ) : (
          <ScrollView style={{ width: "100%", paddingHorizontal: 10 }}>
            {usuarios.map((u) => (
              <TouchableOpacity
                key={u.id}
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/cadastro",
                    params: { idusuario: u.id }
                  })
                }
              >
                <Text style={styles.cardNome}>{u.nome}</Text>
                <Text style={styles.cardInfo}>CPF: {u.cpf}</Text>
                <Text style={styles.cardInfo}>Usuário: {u.usuario}</Text>
                <Text style={styles.cardInfo}>Tipo: {u.tipo}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.buttonRow}>

        <TouchableOpacity
          style={styles.button}
          onPress={carregarUsuarios}
        >
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/cadastro")}
        >
          <Text style={styles.buttonText}>Novo</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2c",
    padding: 16,
  },

  titleBox: {
    borderWidth: 2,
    borderColor: "#d43c14",
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },

  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  bigBox: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#d43c14",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginBottom: 20,
  },

  bigBoxText: {
    color: "#fff",
    fontSize: 18,
    opacity: 0.5,
    marginTop: 20,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#3b3b3b",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#d43c14",
  },

  cardNome: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  cardInfo: {
    color: "#ccc",
    marginTop: 2,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
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
