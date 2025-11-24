import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Api from "../Servico/Api";
import { useCarrinho } from "./CarrinhoContext";
import { useRouter } from "expo-router";

export default function CardapioUsuario() {
  const router = useRouter();

  // ➡️ ATUALIZADO: Incluir contagemItens
  const { itens, adicionar, contagemItens } = useCarrinho(); 

  const [categoria, setCategoria] = useState("PRATO");
  const [produtosPratos, setProdutosPratos] = useState([]);
  const [produtosBebidas, setProdutosBebidas] = useState([]);

  // ➡️ NOVO: Obter a contagem separada
  const { pratos, bebidas } = contagemItens ? contagemItens() : { pratos: 0, bebidas: 0 };


  async function carregarProdutos() {
    try {
      const resp = await Api.api.get("/produto");
      setProdutosPratos(resp.data.filter((p) => p.tipo === "PRATO"));
      setProdutosBebidas(resp.data.filter((p) => p.tipo === "BEBIDA"));
    } catch (error) {
      console.log("Erro ao buscar produtos:", error);
    }
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cardápio</Text>
      </View>

      <View style={styles.menuRow}>
        <TouchableOpacity
          style={[styles.menuBtn, categoria === "PRATO" && styles.menuActive]}
          onPress={() => setCategoria("PRATO")}
        >
          <Text style={styles.menuText}>Comidas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuBtn, categoria === "BEBIDA" && styles.menuActive]}
          onPress={() => setCategoria("BEBIDA")}
        >
          <Text style={styles.menuText}>Bebidas</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categoria === "PRATO" ? produtosPratos : produtosBebidas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 140 }}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View>
              <Text style={styles.itemTitle}>{item.nome}</Text>
              <Text style={styles.itemPrice}>R$ {Number(item.preco).toFixed(2)}</Text>
              <Text style={styles.itemPrice}>{item.descricao}</Text>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={() => adicionar(item)}>
              <MaterialIcons name="add-shopping-cart" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Barra inferior */}
      <View style={styles.cartBar}>
        
        {/* ➡️ ATUALIZADO: Contador de Comidas */}
        <View style={styles.itemCounter}>
            <MaterialIcons name="restaurant-menu" size={20} color="#fff" />
            <Text style={styles.cartText}>{pratos}</Text>
        </View>

        {/* ➡️ NOVO: Contador de Bebidas */}
        <View style={styles.itemCounter}>
            <MaterialIcons name="local-drink" size={20} color="#fff" />
            <Text style={styles.cartText}>{bebidas}</Text>
        </View>


        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push("/carrinho")}
        >
          <MaterialIcons name="shopping-cart" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2c",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d43c14",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  menuBtn: {
    width: "48%",
    paddingVertical: 12,
    backgroundColor: "#3b3b3b",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d43c14",
    alignItems: "center",
  },
  menuActive: {
    backgroundColor: "#d43c14",
    borderColor: "#a92f10",
  },
  menuText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  itemCard: {
    width: "100%",
    padding: 16,
    backgroundColor: "#3b3b3b",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#d43c14",
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: { color: "#fff", fontSize: 18, fontWeight: "600" },
  itemPrice: { color: "#aaa", marginTop: 4 },
  addButton: { padding: 10, backgroundColor: "#d43c14", borderRadius: 10 },
  
  // ➡️ NOVO ESTILO PARA O CONTADOR
  itemCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  
  cartBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#3b3b3b",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 2,
    borderTopColor: "#d43c14",
    // ➡️ ATUALIZADO: Usar space-between para distribuir bem os 3 elementos
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center",
  },
  cartText: { color: "#fff", fontSize: 16 },
  cartButton: {
    backgroundColor: "#d43c14",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
});