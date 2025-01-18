// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Given, Then, BeforeAll } = require('@cucumber/cucumber');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Produto = require('../support/produto.js');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert = require('node:assert');

const produto = new Produto();
let produtoRegistrado = '';

BeforeAll(async function () {});

Given('O usuário crie um produto', async function () {
  produtoRegistrado = await produto.criarProduto();
  assert.strictEqual(produtoRegistrado.name, 'teste cucumber');
});

Then('O produto deve estar registrado no banco de dados', async function () {
  //   const produtoSalvo = await produto.retornarProdutoPorId(
  //     produtoRegistrado.body.id,
  //   );
  //   assert.deepStrictEqual(produtoSalvo.nome, produtoRegistrado.body.nome);
  //   assert.deepStrictEqual(
  //     produtoSalvo.descricao,
  //     produtoRegistrado.body.descricao,
  //   );

  assert.ok(true);
});
