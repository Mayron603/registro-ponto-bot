const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Registro = require('./models/Registro');

const app = express();

// Configurações
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'

// Conexão com o MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://mayronpaula6:CANIG0HMsTAtnV3E@bateponto.zdbtknv.mongodb.net/?retryWrites=true&w=majority&appName=Bateponto');

// Rota para a página inicial
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Rota para buscar registros
app.get('/api/registros', async (req, res) => {
    try {
        const { username } = req.query;
        const query = username ? { username: new RegExp(username, 'i') } : {};
        
        const registros = await Registro.find(query);
        res.json(registros);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar registros' });
    }
});

// Rota para estatísticas
app.get('/api/estatisticas', async (req, res) => {
    try {
        const registros = await Registro.aggregate([
            {
                $project: {
                    username: 1,
                    totalHoras: {
                        $sum: {
                            $map: {
                                input: "$pontos",
                                as: "ponto",
                                in: {
                                    $divide: [
                                        { $subtract: ["$$ponto.saida", "$$ponto.entrada"] },
                                        3600000 // Converte para horas
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);
        res.json(registros);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao calcular estatísticas' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});