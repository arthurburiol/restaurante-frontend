import React, { createContext, useContext, useState } from "react";

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]); // carrinho global

  function adicionar(item) {
    setItens((prev) => [...prev, item]); 
  }

  function remover(itemParaRemover) {
  // Encontra o índice do primeiro item que é estritamente igual ao itemParaRemover
  const indexParaRemover = itens.findIndex(item => item === itemParaRemover);

  if (indexParaRemover !== -1) {
    setItens((prev) => prev.filter((_, i) => i !== indexParaRemover));
  }
}

  function limpar() {
    setItens([]);
  }

  function total() {
    return itens.reduce((acc, item) => acc + Number(item.preco), 0);
  }
  // ➡️ NOVO: Função para contar itens por tipo
  function contagemItens() {
    const pratos = itens.filter(item => item.tipo === "PRATO").length;
    const bebidas = itens.filter(item => item.tipo === "BEBIDA").length;
    return { pratos, bebidas };
  }

  return (
    <CarrinhoContext.Provider value={{ itens, adicionar, remover, limpar, total, contagemItens }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  return useContext(CarrinhoContext);
}
