import { ProductResponseDto } from '@Application/dtos/response/product/product.response.dto';

export const PRODUCT_REQUEST_DTO_MOCK: ProductResponseDto[] = [
  {
    id: 1,
    name: 'Hambúrguer',
    category: 'Lanche',
    price: 15.99,
    preparationTime: 20,
    description:
      'Um hambúrguer suculento com carne bovina de primeira e queijo cheddar.',
    enabled: true,
    figureUrl: 'https://example.com/images/hamburguer.png',
  },
  {
    id: 2,
    name: 'Pizza de Calabresa',
    category: 'Pizza',
    price: 39.99,
    preparationTime: 30,
    description: 'Pizza de calabresa com queijo mussarela e cebola.',
    enabled: true,
    figureUrl: 'https://example.com/images/pizza_calabresa.png',
  },
  {
    id: 3,
    name: 'Batata Frita',
    category: 'Acompanhamento',
    price: 9.99,
    preparationTime: 10,
    description: 'Porção de batatas fritas crocantes e douradas.',
    enabled: true,
    figureUrl: 'https://example.com/images/batata_frita.png',
  },
  {
    id: 4,
    name: 'Refrigerante Cola',
    category: 'Bebida',
    price: 5.99,
    preparationTime: 2,
    description: 'Lata de refrigerante sabor cola de 350ml.',
    enabled: true,
    figureUrl: 'https://example.com/images/refrigerante_cola.png',
  },
  {
    id: 5,
    name: 'Milkshake de Chocolate',
    category: 'Sobremesa',
    price: 12.99,
    preparationTime: 5,
    description: 'Milkshake cremoso de chocolate feito com sorvete artesanal.',
    enabled: true,
    figureUrl: 'https://example.com/images/milkshake_chocolate.png',
  },
];
