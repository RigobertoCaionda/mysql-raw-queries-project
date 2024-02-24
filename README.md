# DATABASE RAW QUERIES PROJECT APP Backend
This project is aimed at creating a simple node.js project that uses raw queries instead of an ORM, just to show that it's possible for you to work with raw queries, without ORMs although ORMs are so important to us, but sometimes in your projects you will need a raw query because there are some queries we can not do with ORMS.
Att: This project is totally focused on implementing raw queries with adonisJs and that's why i didn't care about other things like clean code, project patterns, etc. But although i encourage you to use the best software practices in your projects, it's very important to use good practices while developing your softwares...

##  Prerequisites

- Node.js (https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- npm or Yarn

## Installation

1. Clone the master branch of the repository:
```
git clone https://github.com/RigobertoCaionda/sqlite-project
```

2. Enter the sqlite-project directory:
```
cd sqlite-project
```
3. Install the dependencies: 
```
npm install or yarn install
```

4. Now you can run the server:
```
npm run start
```

If everything went well up to this point, you'll have the server running locally on port 3000

```
http://localhost:3000

```

## Estrutura do Projeto
This the folder structure of this project:
- `src/`: It has the main source code of the application.
- `models/`: Stores the data models used by the application.
- `controllers/`: Contains the controllers responsible for handling HTTP requests.
- `routes/`: Define the application API routes.
Important files:
- `database.js`: Database configuration file.
- `app.js`: The main file of the application.
- `Usuario.js`: User Model.
- `UsuarioController.js`: User Controller.
- `routes.js`: API routes definition.

## Code Example:

This is the database.js file, in this file we configured sequelize and created the connection with database using sqlite database:

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

module.exports = sequelize;


This is the User Model file called Usuario.js:
const { DataTypes } = require("sequelize");
const sequelize = require("../../database");

const Usuario = sequelize.define("Usuario", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idade: {
    type: DataTypes.INTEGER,
  },
});

(async () => {
  await sequelize.sync();
})();

module.exports = Usuario;

This is the User controller and here you can see how we can combine sequelize and sqlite:
const Usuario = require("../models/Usuario");

module.exports = {

  async index(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      return res.json(usuarios);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao consultar usuários." });
    }
  },

  async store(req, res) {
    const { nome, idade } = req.body;
    if (!nome || !idade) {
      return res.status(400).json({ error: "Nome e idade são obrigatórios." });
    }

    try {
      const usuario = await Usuario.create({ nome, idade });
      return res.json(usuario);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao inserir usuário." });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { nome, idade } = req.body;
    if (!nome || !idade) {
      return res.status(400).json({ error: "Nome e idade são obrigatórios." });
    }

    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      usuario.nome = nome;
      usuario.idade = idade;
      await usuario.save();

      return res.json(usuario);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
  },

  async destroy(req, res) {
    const { id } = req.params;

    try {
      const usuario = await Usuario.findByPk(id);
      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      await usuario.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Erro ao remover usuário." });
    }
  },
};


## Credits
This project was developed by Rigoberto Caionda.

## Contact
If you have any questions or suggestions, please contact via email rigobertocaionda98@gmail.com or via my github page https://github.com/RigobertoCaionda
