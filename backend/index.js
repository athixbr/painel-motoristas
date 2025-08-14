const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const PORT = 3703;

app.use(bodyParser.json());
app.use(cors());

// Configuração do banco de dados
const pool = mysql.createPool({
    host: 'coopergraos.com.br',    // Altere se seu MySQL estiver em outro lugar
    user: 'coopergraos_pmcvmotoristas',  // Substitua pelo seu usuário do MySQL
    password: 'DgulKQ{;]19K',// Substitua pela sua senha do MySQL
    database: 'coopergraos_motoristas',// Substitua pelo nome do banco
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Rotas básicas
app.get('/', (req, res) => {
    res.send('Servidor está rodando!');
});

app.get('/embarques', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM controle_embarque ORDER BY data DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/embarques', async (req, res) => {
    try {
        const {
            id, // Receber o ID no corpo da requisição para decidir entre UPDATE ou INSERT
            data = null,
            transportadora,
            motorista,
            placas,
            hora_chegada,
            hora_entrada,
            hora_saida,
            nfe,
            empresa,
            produto,
            status,
        } = req.body;

        if (!transportadora || !motorista) {
            throw new Error('Campos obrigatórios não podem estar vazios.');
        }

        const formattedDate = data ? new Date(data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        if (id) {
            // Atualização
            const [result] = await pool.query(
                `UPDATE controle_embarque SET
                    data = ?, transportadora = ?, motorista = ?, placas = ?,
                    hora_chegada = ?, hora_entrada = ?, hora_saida = ?, 
                    nfe = ?, empresa = ?, produto = ?, status = ?
                WHERE id = ?`,
                [
                    formattedDate,
                    transportadora,
                    motorista,
                    placas,
                    hora_chegada,
                    hora_entrada,
                    hora_saida,
                    nfe,
                    empresa,
                    produto,
                    status,
                    id,
                ]
            );

            if (result.affectedRows > 0) {
                res.json({ success: true, message: 'Registro atualizado com sucesso.' });
            } else {
                res.status(404).json({ error: 'Nenhum registro foi encontrado para atualizar.' });
            }
        } else {
            // Inserção
            const [result] = await pool.query(
                `INSERT INTO controle_embarque (
                    data, transportadora, motorista, placas, hora_chegada,
                    hora_entrada, hora_saida, nfe, empresa, produto, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    formattedDate,
                    transportadora,
                    motorista,
                    placas,
                    hora_chegada,
                    hora_entrada,
                    hora_saida,
                    nfe,
                    empresa,
                    produto,
                    status,
                ]
            );

            res.json({ success: true, id: result.insertId });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.put('/embarques', async (req, res) => {
    try {
        const {
            id,
            data = null,
            transportadora,
            motorista,
            placas,
            hora_chegada,
            hora_entrada,
            hora_saida,
            nfe,
            empresa,
            produto,
            status,
        } = req.body;

        if (!id) {
            throw new Error('ID é obrigatório para atualizar um registro.');
        }
        if (!transportadora || !motorista) {
            throw new Error('Campos obrigatórios não podem estar vazios.');
        }

        const formattedDate = data ? new Date(data).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        const [result] = await pool.query(
            `UPDATE controle_embarque SET
                data = ?, transportadora = ?, motorista = ?, placas = ?,
                hora_chegada = ?, hora_entrada = ?, hora_saida = ?, 
                nfe = ?, empresa = ?, produto = ?, status = ?
            WHERE id = ?`,
            [
                formattedDate,
                transportadora,
                motorista,
                placas,
                hora_chegada,
                hora_entrada,
                hora_saida,
                nfe,
                empresa,
                produto,
                status,
                id,
            ]
        );

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Registro atualizado com sucesso.' });
        } else {
            res.status(404).json({ error: 'Nenhum registro foi encontrado para atualizar.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/embarques', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            throw new Error('ID é obrigatório para deletar um registro.');
        }

        const [result] = await pool.query('DELETE FROM controle_embarque WHERE id = ?', [id]);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Registro deletado com sucesso.' });
        } else {
            res.status(404).json({ error: 'Nenhum registro foi encontrado para deletar.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/motoristas', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM motoristas ORDER BY nome ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
