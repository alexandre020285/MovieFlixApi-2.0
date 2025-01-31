import express from "express";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";


const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

//ROTA PARA DOCUMENTAÇÃO SWAGGER
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota para listar filmes
app.get("/movies", async (_, res) => {
  try {
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
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    res.status(500).send("Erro ao buscar filmes.");
  }
});

// Rota para cadastrar um novo filme
app.post("/movies", async (req, res) => {
  const { title, genre_id, language_id, oscar_count, release_date } = req.body;

  try {
    // Verificar se já existe um filme com o mesmo título
    const movieWithSameTitle = await prisma.movie.findFirst({
      where: { title: { equals: title, mode: "insensitive" } },
    });

    if (movieWithSameTitle) {
      return console.log("Filme ja cadastrado");
    }

    // Criar um novo filme
    await prisma.movie.create({
      data: {
        title,
        genre_id,
        language_id,
        oscar_count,
        release_date: new Date(release_date),
      },
    });

    res.status(201).send({ message: "Filme cadastrado com sucesso!" });
  } catch (error) {
    console.error("Falha ao cadastrar um filme:", error);
    res.status(500).send({ message: "Falha ao cadastrar um filme." });
  }
});

// Rota para atualizar um filme existente
app.put("/movies/:id", async (req, res) => {
  const id = Number(req.params.id); // Adiciona o id da requisição

  try {
    const movie = await prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      res.status(404).send({ message: "Filme não encontrado!" });
    }

    const data = {
      ...req.body,
      release_date: req.body.release_date
        ? new Date(req.body.release_date)
        : undefined,
    };

    await prisma.movie.update({
      where: { id },
      data,
    });

    res.status(200).send({ message: "Filme atualizado com sucesso!" });
  } catch (error) {
    console.error("Falha ao atualizar o registro:", error);
    res.status(500).send({ message: "Falha ao atualizar o registro." });
  }
});

//⭕ROTA PARA REMOVER UM FILME
app.delete("/movies/:id", async (req, res) => {
  const id = Number(req.params.id); // Adiciona o id da requisição

  try {
    const movie = await prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      //return console.log("Filme nao encontrado");
   res.status(500).send({ message: "Falha ao remover o filme." });
    }

    await prisma.movie.delete({
      where: { id },
    });

    res.status(200).send({ message: "Filme removido com sucesso!" });
  } catch (error) {
    console.error("Falha ao remover o filme:", error);
    res.status(500).send({ message: "Falha ao remover o filme." });
  }
});

//⭕FILTRAR O FILME POR GENERO ESPECIFICO
app.get("/movies/:genreName", async (req, res) => {
  //⭕FILTRAR OS FILMES DO BANCO PELO GENERO
  try {
    const moviesFilteredByGenreName = await prisma.movie.findMany({
      include: {
        genres: true,
        languages: true,
      },
      where: {
        genres: {
          name: {
            equals: req.params.genreName,
            mode: "insensitive",
          },
        },
      },
    });
    res.status(200).send(moviesFilteredByGenreName);
  } catch (error) {
    console.error("Falha ao selecionar por gênero", error);
    res
      .status(500)
      .send({ message: "Falha ao selecionar por gênero o filme." });
  }
}); 


//⭕ Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});
