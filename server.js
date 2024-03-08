const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const tokenS = process.env.TOKEN_PASSWORD;

app.use(express.json());

const users = [];

app.get("/users", (_request, response) => {
  response.json(users);
});

app.post("/users", async (request, response) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 10); //pega a senha enviada pelo usuário e criptografa ela 10x
    const user = { name: request.body.name, password: hashedPassword }; //armazenando dados do user com senha criptografada
    users.push(user);
    response.status(201).send();
  } catch {
    response.status(500).send();
  }
});

app.post("/users/login", async (request, response) => {
  const user = users.find((user) => user.name === request.body.name);
  if (user == null) {
    return response.status(400).send("Não foi possível encontrar o usuário");
  }

  try {
    if (await bcrypt.compare(request.body.password, user.password)) {
      const user = {
        userId: "8",
      };

      const token = jwt.sign(user, tokenS, {
        expiresIn: "1hr",
      });
      return response.json({ token, message: "ok" });
    } else {
      return response.send("Não deu certo :(");
    }
  } catch {
    response.status(500).send();
  }
});

app.listen(3000, () => {
  console.log("Rodando na porta http://localhost:3000");
});
