import express from "express";
import sql from "./database.js";

const routes = express.Router();

// ROTA PARA PROCURAR TODOS OS USUÁRIOS
routes.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await sql`SELECT * FROM Usuarios`;
        return res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar usuários', error });
    }
});

// ROTA PARA FAZER O LOGIN
routes.post('/Login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        let resp = await sql`SELECT * FROM usuario WHERE email = ${email} AND senha = ${senha}`;
        if (resp.length === 0) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }
        return res.status(200).json(resp[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao realizar login', error });
    }
});

// ROTA PARA CADASTRAR OS USUÁRIOS
routes.post('/Cadastrar', async (req, res) => {
    const { email, senha } = req.body;
    try {
        await sql`INSERT INTO usuario (email, senha) VALUES (${email}, ${senha})`;
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
    }
});

// ROTA PARA PROCURAR TODAS AS QUESTÕES
routes.get('/questao', async (req, res) => {
    try {
        const questoes = await sql`SELECT * FROM perguntas`;
        return res.status(200).json(questoes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao buscar questões', error });
    }
});

// ROTA PARA CADASTRAR UMA NOVA QUESTÃO
routes.post('/questao/cadastrar', async (req, res) => {
    try {
        const { questao, questao1, questao2, questao3, questao4, gabarito, nivel } = req.body;
        const insert = await sql`
            INSERT INTO perguntas (questao, questao1, questao2, questao3, questao4, gabarito, nivel)
            VALUES (${questao}, ${questao1}, ${questao2}, ${questao3}, ${questao4}, ${gabarito}, ${nivel})
            RETURNING *;
        `;
        return res.status(201).json({ message: 'Questão cadastrada com sucesso!', questao: insert[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao cadastrar questão', error });
    }
});

// ROTA PARA ATUALIZAR UMA QUESTÃO
routes.put('/Atualizar/:id', async (req, res) => {
    const { id } = req.params;
    const { questao, questao1, questao2, questao3, questao4, gabarito, nivel } = req.body;

    try {
        const result = await sql`
            UPDATE perguntas
            SET questao = ${questao}, questao1 = ${questao1}, questao2 = ${questao2}, 
                questao3 = ${questao3}, questao4 = ${questao4}, gabarito = ${gabarito}, nivel = ${nivel}
            WHERE id = ${id}
            RETURNING *;
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: 'Questão não encontrada' });
        }

        return res.status(200).json({ message: 'Questão atualizada com sucesso!', questao: result[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao atualizar questão', error });
    }
});

// ROTA PARA DELETAR UMA QUESTÃO
routes.delete('/deletequestao/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await sql`
            DELETE FROM perguntas WHERE id = ${id} ;
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: 'Questão não encontrada' });
        }

        return res.status(200).json({ message: 'Questão excluída com sucesso!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao excluir questão', error });
    }
});

export default routes;
