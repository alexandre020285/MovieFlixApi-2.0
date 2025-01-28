import express from "express";
import { PrismaClient } from "@prisma/client";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/movies", async (_, res) => {
  // res.send("Listagem dos filmes!");
  const movies = await prisma.movie.findMany({
    orderBy: {
      title: "asc",
    },
    include: {
      genres: true,
      languages: true,
    },
  });
  res.json(movies);
});

app.post("/movies", async (req, res) => {
  const { title, genre_id, language_id, oscar_count, release_date } = req.body;
  try {

    //CASE INSENSITIVE - SE A BUSCAR FOR FEITA EM MAIUSCULO OU MINUSCULO, O REGITRO SERA RETORNADO {IDEAL PARA BUSCAS}

    // CASE SENSITIVE - SE A BUSCAR FOR FEITA EM MAIUSCULO OU MINUSCULO, O REGITRO NAO SERA RETORNADO


    //VERIFICAR NO BANCO SE JA EXISTE UM FILME COM O MESMO TITULO
    const movieWithSameTitle = await prisma.movie.findFirst({
      where: {title: {equals: title, mode: "insensitive"}},
    })
    if (movieWithSameTitle) {
      return     console.log("Filme ja cadastrado");
    }

    await prisma.movie.create({
      data: {
        title: title,
        genre_id: genre_id,
        language_id: language_id,
        oscar_count: oscar_count,
        release_date: new Date(release_date),
      },
    });
  } catch (error) {
    console.log(error,"Falha ao cadastrar um filme");
    // return res.status(500).send({"Falha ao cadastrar um filme"})
  }
  res.status(201).send();
});

app.listen(port, () => {
  console.log(`servido em execução na porta ${port}`);
});

