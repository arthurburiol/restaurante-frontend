
import React from "react";
import { Stack } from "expo-router";
import { CarrinhoProvider } from "./CarrinhoContext";

export default function Layout() {
  return (
    <CarrinhoProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#d43c14",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 20,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />

        <Stack.Screen name="cardapio" options={{ title: "" }} />
        <Stack.Screen name="produto" options={{ title: "" }} />
        <Stack.Screen name="produtoCadastro" options={{ title: "" }} />
        <Stack.Screen name="produtoCadastro/:id" options={{ title: "" }} />
        <Stack.Screen name="carrinho" options={{ title: "" }} />
        <Stack.Screen name="pagamento" options={{ title: "" }} />
        <Stack.Screen name="comanda" options={{ title: "" }} />
        <Stack.Screen name="comandaFechada" options={{ title: "" }} />
        <Stack.Screen name="cadastro" options={{ title: "" }} />
        <Stack.Screen name="copa" options={{ title: "" }} />
        <Stack.Screen name="cozinha" options={{ title: "" }} />
        <Stack.Screen name="usuarios" options={{ title: "" }} />
        <Stack.Screen name="relatorio" options={{ title: "" }} />
        <Stack.Screen name="relatorioDiario" options={{ title: "" }} />
        <Stack.Screen name="relatorioPeriodo" options={{ title: "" }} />
      </Stack>
    </CarrinhoProvider>
  );
}
