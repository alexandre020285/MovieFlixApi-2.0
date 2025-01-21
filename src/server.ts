import express from "express";

const port = 3000;
const app = express();

app.get("/movies", (req, res) => {
    res.send("Listagem dos filmes!");
});

app.listen(port, () => {
    console.log(`servido em execução na porta ${port}`);
});

