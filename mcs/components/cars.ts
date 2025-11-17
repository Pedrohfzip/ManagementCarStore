export type Car = {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  descricao: string;
};

export const carros: Car[] = [
  {
    id: 1,
    nome: "Toyota Corolla",
    preco: 85000,
    imagem: "/carros/corolla.jpg",
    descricao: "Toyota Corolla 2022, automático, completo, 20.000km.",
  },
  {
    id: 2,
    nome: "Honda Civic",
    preco: 95000,
    imagem: "/carros/civic.jpg",
    descricao: "Honda Civic 2021, automático, teto solar, 15.000km.",
  },
  {
    id: 3,
    nome: "Volkswagen Golf",
    preco: 78000,
    imagem: "/carros/golf.jpg",
    descricao: "VW Golf 2020, manual, esportivo, 30.000km.",
  },
];
