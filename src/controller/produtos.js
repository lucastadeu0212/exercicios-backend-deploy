const knex = require('../database/conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoria } = req.query;

    try {
        const produtos = await knex('produtos')
            .where({ usuario_id: usuario.id })
            .where((query) => {
                if (categoria) {
                    return query.where('categoria', 'ilike', `%${categoria}%`);
                }
            });

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where({ usuario_id: usuario.id, id }).first();

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome || !estoque || !preco || !categoria || !descricao || !imagem) {
        return res.status(400).json("Todos os campos são obrigatórios.");
    }

    try {

        const produtoCadastrado = await knex('produtos').insert({
            usuario_id: usuario.id,
            nome,
            estoque,
            preco,
            categoria,
            descricao,
            imagem

        }).returning('*');

        if (!produtoCadastrado[0]) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(200).json(produtoCadastrado[0]);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(400).json('Informe ao menos um campo para atualizaçao do produto.');
    }

    try {

        const produto = await knex('produtos').where({ usuario_id: usuario.id, id }).first();

        if (!produto) {
            return res.status(400).json('Produto não encontrado.');
        }

        const produtoAtualizado = await knex('produtos').where({
            usuario_id: usuario.id,
            id: produto.id
        }).update({
            nome,
            estoque,
            preco,
            categoria,
            descricao,
            imagem
        });


        if (!produtoAtualizado) {
            return res.status(400).json("O produto não foi atualizado.");
        }

        return res.status(200).json('produto foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {

        const produto = await knex('produtos').where({ usuario_id: usuario.id, id }).first();

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoExcluido = await knex('produtos').where({ id, usuario_id: usuario.id }).del();

        if (!produtoExcluido) {
            return res.status(400).json("O produto não foi excluido.");
        }

        return res.status(200).json('Produto excluido com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}