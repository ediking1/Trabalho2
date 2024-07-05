import { PrismaClient, Cliente } from "@prisma/client";
import { Router, Request, Response } from "express";

const prisma = new PrismaClient();
const router = Router();

// Interface para o corpo da requisição
interface ClienteRequest {
  nome: string;
  email: string;
  cidade: string;
  dataNasc: string; // manter como string para conversão de data
}

// Constantes para mensagens de erro
const ERROR_FETCHING_CLIENTES = "Erro ao buscar clientes";
const ERROR_CREATING_CLIENTE = "Erro ao criar cliente";
const ERROR_MISSING_FIELDS = "Informe nome, email, cidade e dataNasc";

// Função para buscar todos os clientes
const fetchClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientes: Cliente[] = await prisma.cliente.findMany();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(400).json({ error: ERROR_FETCHING_CLIENTES, details: (error as Error).message });
  }
};

// Função para validar os campos do cliente
const validateClienteFields = (cliente: ClienteRequest): string | null => {
  const { nome, email, cidade, dataNasc } = cliente;
  if (!nome || !email || !cidade || !dataNasc) {
    return ERROR_MISSING_FIELDS;
  }
  return null;
};

// Função para criar um novo cliente
const createCliente = async (req: Request, res: Response): Promise<void> => {
  const { nome, email, cidade, dataNasc }: ClienteRequest = req.body;

  // Validação dos campos obrigatórios
  const validationError = validateClienteFields(req.body);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  try {
    const novoCliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        cidade,
        dataNasc: new Date(dataNasc)
      }
    });
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(400).json({ error: ERROR_CREATING_CLIENTE, details: (error as Error).message });
  }
};

// Rota para obter todos os clientes
router.get("/", fetchClientes);

// Rota para criar um novo cliente
router.post("/", createCliente);

export default router;
