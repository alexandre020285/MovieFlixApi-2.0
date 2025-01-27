import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.get("/movies", async (req, res) => {
    // res.send("Listagem dos filmes!");
    const movies =await prisma.movie.findMany();
    res.json(movies);
});

app.listen(port, () => {
    console.log(`servido em execução na porta ${port}`);
});

