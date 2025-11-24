import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Api from "../Servico/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";

export default function Pagamento() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id_comanda = Number(params.id_comanda);
  const total = Number(params.total);

  // Estados do dropdown
  const [open, setOpen] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState(null);

  const [items, setItems] = useState([
    { label: "PIX", value: "PIX" },
    { label: "Débito", value: "DEBITO" },
    { label: "Crédito", value: "CREDITO" }
  ]);

  async function confirmarPagamento() {
    if (!formaPagamento) {
      alert("Selecione a forma de pagamento!");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      await Api.api.post(
        "/pagamento",
        {
          id_comanda,
          valor: total,
          forma_pagamento: formaPagamento,
          hora_pagamento: new Date()
        },
        { headers: { token } }
      );

      alert("Pagamento realizado!");
      router.push("/home");

    } catch (error) {
      console.log(error);
      alert("Erro ao processar pagamento.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento</Text>
      <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

      {/* Dropdown */}
      <DropDownPicker
        open={open}
        value={formaPagamento}
        items={items}
        setOpen={setOpen}
        setValue={setFormaPagamento}
        setItems={setItems}
        placeholder="Selecione a forma de pagamento"
        placeholderStyle={{ color: "#aaa" }}

        style={styles.dropdownContainer}
        containerStyle={styles.dropdownWrap}
        textStyle={styles.dropdownText}
        dropDownContainerStyle={styles.dropDownContainer}

        zIndex={3000}
        zIndexInverse={1000}

        listItemLabelStyle={{ color: "white" }}
        selectedItemLabelStyle={{ fontWeight: "bold" }}
      />

      <TouchableOpacity style={styles.button} onPress={confirmarPagamento}>
        <Text style={styles.buttonText}>Confirmar Pagamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#222", padding: 20, paddingTop: 50 },
  title: { color: "#fff", fontSize: 26, textAlign: "center", marginBottom: 40 },
  total: { color: "#fff", fontSize: 22, textAlign: "center", marginBottom: 20 },

  dropdownWrap: {
    marginTop: 10,
    marginBottom: 20,
  },

  dropdownContainer: {
    backgroundColor: "#333",
    borderColor: "#d43c14",
  },

  dropDownContainer: {
    backgroundColor: "#444",
    borderColor: "#d43c14",
  },

  dropdownText: {
    color: "white",
    fontSize: 16,
  },

  button: {
    backgroundColor: "#d43c14",
    padding: 15,
    borderRadius: 10,
    marginTop: 30
  },
  buttonText: { color: "#fff", fontSize: 18, textAlign: "center" }
});
