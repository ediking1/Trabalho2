import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const prisma = new PrismaClient();
const router = Router();

// Handler para obter todos os clientes
router.get("/", async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(400).json({ error: "Erro ao buscar clientes", details: error.message });
  }
});

// Handler para criar um novo cliente
router.post("/", async (req, res) => {
  const { nome, email, cidade, dataNasc } = req.body;

  // Validação dos campos obrigatórios
  if (!nome || !email || !cidade || !dataNasc) {
    res.status(400).json({ error: "Informe nome, email, cidade e dataNasc" });
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
    res.status(400).json({ error: "Erro ao criar cliente", details: error.message });
  }
});

export default router;
