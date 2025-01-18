require('dotenv/config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { faker } = require('@faker-js/faker');

class Produto {
  retornarDadosProdutoFake() {
    const nome = `${faker.commerce.product()} - ${faker.string.uuid()}`;
    const descricao = faker.commerce.productDescription();
    const valorUnitario = parseFloat(faker.commerce.price());
    const imagemUrl = faker.image.url();
    return {
      nome: nome,
      valorUnitario: valorUnitario,
      descricao: descricao,
      imagemUrl: imagemUrl,
    };
  }

  async criarProduto() {
    const produtoData = {
      name: 'teste cucumber',
      categoryId: 1,
      price: 10,
      preparationTime: 15,
      description: 'Um hambúrguer com carne premium e bastante cheddar.',
      figureUrl: 'hamburguer.png',
      enabled: true,
    };

    const response = await request('http://localhost:3002')
      .post('/api/products/')
      .send(produtoData)
      .then((response) => {
        return response.body;
      });

    return response;
  }

  //   async retornarProdutoPorId(produtoId) {
  //     const response = await request(process.env.BASE_URL)
  //       .get(`/api/products/${produtoId}`)
  //       .then((response) => {
  //         return response.body;
  //       });

  //     return response;
  //   }
}

module.exports = Produto;
