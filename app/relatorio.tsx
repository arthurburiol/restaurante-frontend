import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";



export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      
       

   

      <View style={styles.grid}>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/relatorioDiario")}
        >
          <MaterialIcons name="analytics" size={40} color="#d43c14" />
          <Text style={styles.cardTitle}>Relatório Diario</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/relatorioPeriodo")}
        >
          <MaterialIcons name="analytics" size={40} color="#d43c14" />
          <Text style={styles.cardTitle}>Relatório Periodo</Text>
        </TouchableOpacity>


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

  logoutButton: {
    position: "absolute",
    top: 20,
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
