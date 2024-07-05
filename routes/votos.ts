import { PrismaClient } from "@prisma/client";
import { Router } from "express";

// Inicializa o cliente Prisma e o roteador Express
const prisma = new PrismaClient();
const router = Router();

// Rota GET para obter todos os votos
router.get("/", async (req, res) => {
  try {
    // Busca todos os votos, incluindo informações de candidata e cliente
    const votos = await prisma.voto.findMany({
      include: {
        candidata: true,
        cliente: true,
      },
    });
    // Retorna os votos com status 200 (OK)
    res.status(200).json(votos);
  } catch (error) {
    // Em caso de erro, retorna o erro com status 400 (Bad Request)
    res.status(400).json(error);
  }
});

// Rota POST para criar um novo voto
router.post("/", async (req, res) => {
  const { candidataId, clienteId, justificativa } = req.body;

  // Verifica se os campos obrigatórios estão presentes
  if (!candidataId || !clienteId) {
    res.status(400).json({ erro: "Informe candidataId e clienteId" });
    return;
  }

  try {
    // Cria uma transação para criar o voto e atualizar o número de votos da candidata
    const [voto, candidata] = await prisma.$transaction([
      prisma.voto.create({ data: { candidataId, clienteId, justificativa } }),
      prisma.candidata.update({
        where: { id: candidataId },
        data: { numVotos: { increment: 1 } },
      }),
    ]);
    // Retorna o voto criado e a candidata atualizada com status 201 (Created)
    res.status(201).json({ voto, candidata });
  } catch (error) {
    // Em caso de erro, retorna o erro com status 400 (Bad Request)
    res.status(400).json(error);
  }
});

export default router;
