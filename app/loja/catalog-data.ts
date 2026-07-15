export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  installment: string;
  imageIndex: number;
  sizes?: string[];
  colors?: string[];
  brand?: "Natura" | "Mary Kay";
  occasions?: string[];
  stock?: number;
};

export type Category = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  sheet: string;
  products: Product[];
};

export const categories: Category[] = [
  {
    slug: "moda",
    name: "Moda feminina",
    eyebrow: "Vista sua melhor versão",
    description: "Peças versáteis e elegantes, com uma grade inclusiva do P ao Plus 48–52.",
    sheet: "/catalog-moda.png",
    products: [
      { id: "moda-1", name: "Blusa Serena", description: "Cetim marfim · caimento leve", price: 129.9, badge: "Novidade", installment: "3x de R$ 43,30", imageIndex: 0, sizes: ["P", "M", "G", "GG", "XG", "48–52"], colors: ["Marfim", "Rosé", "Preto"] },
      { id: "moda-2", name: "Calça Essenza", description: "Alfaiataria preta · cintura alta", price: 189.9, installment: "4x de R$ 47,48", imageIndex: 1, sizes: ["P", "M", "G", "GG", "XG", "48–52"], colors: ["Preto", "Areia", "Marrom"] },
      { id: "moda-3", name: "Vestido Aurora", description: "Midi nude · corte elegante", price: 229.9, oldPrice: 259.9, badge: "Oferta", installment: "5x de R$ 45,98", imageIndex: 2, sizes: ["P", "M", "G", "GG", "XG", "48–52"], colors: ["Nude", "Preto", "Rosé"] },
      { id: "moda-4", name: "Cardigan Rosé", description: "Trama macia · toque aconchegante", price: 159.9, installment: "3x de R$ 53,30", imageIndex: 3, sizes: ["M", "G", "GG", "XG", "48–52"], colors: ["Rosé", "Bege", "Preto"] },
      { id: "moda-5", name: "Bolsa Clássica Lume", description: "Estruturada · detalhes dourados", price: 199.9, badge: "Mais vendido", installment: "4x de R$ 49,98", imageIndex: 4, colors: ["Preto", "Caramelo", "Off-white"] },
      { id: "moda-6", name: "Conjunto Elegance", description: "Blusa e calça · composição completa", price: 289.9, installment: "6x de R$ 48,32", imageIndex: 5, sizes: ["P", "M", "G", "GG", "XG", "48–52"], colors: ["Preto", "Nude", "Marrom"] },
    ],
  },
  {
    slug: "personalizados",
    name: "Presentes personalizados",
    eyebrow: "Feito com afeto",
    description: "Presentes delicados que transformam nomes, datas e sentimentos em lembranças únicas.",
    sheet: "/catalog-personalizados.png",
    products: [
      { id: "pers-1", name: "Caneca Coração", description: "Cerâmica premium · detalhe dourado", price: 49.9, badge: "Personalizável", installment: "2x de R$ 24,95", imageIndex: 0, colors: ["Branco", "Rosé", "Preto"] },
      { id: "pers-2", name: "Almofada Afeto", description: "Linho marfim · toque macio", price: 69.9, installment: "2x de R$ 34,95", imageIndex: 1, colors: ["Marfim", "Rosé", "Bege"] },
      { id: "pers-3", name: "Caixa Celebração", description: "Acabamento premium · laço de cetim", price: 99.9, badge: "Favorito", installment: "3x de R$ 33,30", imageIndex: 2, colors: ["Preto e dourado", "Rosé e marfim", "Kraft e cetim"] },
      { id: "pers-4", name: "Ecobag Jardim", description: "Algodão cru · estampa delicada", price: 54.9, installment: "2x de R$ 27,45", imageIndex: 3, colors: ["Natural", "Preto", "Rosé"] },
      { id: "pers-5", name: "Garrafa Essenza", description: "Térmica · acabamento rosé", price: 79.9, oldPrice: 89.9, badge: "Oferta", installment: "2x de R$ 39,95", imageIndex: 4, colors: ["Rosé", "Preto", "Branco"] },
      { id: "pers-6", name: "Caderno Memórias", description: "Capa marfim · fita de cetim", price: 59.9, installment: "2x de R$ 29,95", imageIndex: 5, colors: ["Marfim", "Rosé", "Preto"] },
    ],
  },
  {
    slug: "cosmeticos",
    name: "Cosméticos",
    eyebrow: "Seu ritual, seu momento",
    description: "Uma curadoria de beleza e bem-estar para tornar o cuidado diário ainda mais especial.",
    sheet: "/catalog-cosmeticos.png",
    products: [
      { id: "cos-1", name: "Perfume Noite de Ameixa", description: "Floral ambarado · 75 ml", price: 149.9, badge: "Mais vendido", installment: "3x de R$ 49,97", imageIndex: 0, brand: "Natura" },
      { id: "cos-2", name: "Loção Corporal Rosé", description: "Hidratação acetinada · 200 ml", price: 69.9, installment: "2x de R$ 34,95", imageIndex: 1, brand: "Natura" },
      { id: "cos-3", name: "Batom Cetim Rosa", description: "Alta cobertura · acabamento luminoso", price: 49.9, badge: "Novidade", installment: "2x de R$ 24,95", imageIndex: 2, brand: "Mary Kay" },
      { id: "cos-4", name: "Ritual Facial Lumina", description: "Sérum e creme · cuidado completo", price: 129.9, installment: "3x de R$ 43,30", imageIndex: 3, brand: "Mary Kay" },
      { id: "cos-5", name: "Body Splash Encanto", description: "Frutal suave · 150 ml", price: 89.9, oldPrice: 99.9, badge: "Oferta", installment: "3x de R$ 29,97", imageIndex: 4, brand: "Natura" },
      { id: "cos-6", name: "Kit Mãos de Seda", description: "Creme e sabonete · toque delicado", price: 59.9, installment: "2x de R$ 29,95", imageIndex: 5, brand: "Mary Kay" },
    ],
  },
  {
    slug: "kits",
    name: "Kits para presentear",
    eyebrow: "Carinho em cada detalhe",
    description: "Composições prontas e cuidadosamente montadas para celebrar todas as ocasiões.",
    sheet: "/catalog-kits.png",
    products: [
      { id: "kit-1", name: "Kit Gratidão", description: "Caneca, perfume e caixa premium", price: 189.9, badge: "Mais vendido", installment: "4x de R$ 47,48", imageIndex: 0, colors: ["Preto e dourado", "Rosé e marfim", "Kraft e cetim"], occasions: ["Agradecimento", "Aniversário"] },
      { id: "kit-2", name: "Kit Cuidado", description: "Rosas, vela e creme para mãos", price: 159.9, installment: "3x de R$ 53,30", imageIndex: 1, colors: ["Rosé e marfim", "Kraft e cetim"], occasions: ["Aniversário", "Amizade"] },
      { id: "kit-3", name: "Kit Dueto", description: "Duas canecas e laço de cetim", price: 179.9, installment: "4x de R$ 44,98", imageIndex: 2, colors: ["Preto e dourado", "Rosé e marfim"], occasions: ["Romântico", "Casamento"] },
      { id: "kit-4", name: "Kit Beleza", description: "Cosméticos e vela aromática", price: 199.9, oldPrice: 229.9, badge: "Oferta", installment: "4x de R$ 49,98", imageIndex: 3, colors: ["Rosé e marfim", "Preto e dourado"], occasions: ["Aniversário", "Amizade"] },
      { id: "kit-5", name: "Kit Mãe", description: "Almofada, caneca e carinho", price: 219.9, badge: "Edição especial", installment: "5x de R$ 43,98", imageIndex: 4, colors: ["Rosé e marfim", "Kraft e cetim"], occasions: ["Dia das Mães", "Agradecimento"] },
      { id: "kit-6", name: "Kit Celebre", description: "Perfume, sabonete e flores", price: 169.9, installment: "3x de R$ 56,63", imageIndex: 5, colors: ["Preto e dourado", "Rosé e marfim", "Kraft e cetim"], occasions: ["Aniversário", "Casamento"] },
    ],
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export const imagePositions = [
  "0% 0%",
  "50% 0%",
  "100% 0%",
  "0% 100%",
  "50% 100%",
  "100% 100%",
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
