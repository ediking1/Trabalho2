// Importa o framework Express e os módulos de rotas
import express from 'express';
import candidatasRoutes from './routes/candidatas';
import clientesRoutes from './routes/clientes';
import votosRoutes from './routes/votos';

// Cria uma instância do servidor Express
const app = express();

// Define a porta padrão e utiliza a variável de ambiente PORT, se definida
const DEFAULT_PORT = 3000;
const port = process.env.PORT ?? DEFAULT_PORT;

// Middleware para permitir parsing de JSON nas requisições
app.use(express.json());

// Define as rotas para cada recurso da aplicação
app.use("/candidatas", candidatasRoutes);
app.use("/clientes", clientesRoutes);
app.use("/votos", votosRoutes);

// Rota de exemplo para a raiz da API
app.get('/', (req, res) => {
  res.send('API: Sistema de Controle de Votos Rainha da Fenadoce');
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
