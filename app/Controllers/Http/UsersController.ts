import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

export default class UsersController {
  async index({ response, request }: HttpContextContract) {
    const page = request.all().page || 1;
    const perPage = request.all().perPage || 2;
    const offset = (page - 1) * perPage;

    const users = await Database.rawQuery(
      `SELECT id, email, created_at, updated_at FROM users ORDER BY id DESC LIMIT ? OFFSET ?`, [perPage, offset]
    );
    return response.json(users && users.length > 0 ? users[0] : []);
  }

  async show({ response, params }: HttpContextContract) {
    const id = params.id;

    if (id) {
      const user = await Database.rawQuery("select * from users where id = ?", [
        id,
      ]);
      return response.json(user && user.length > 0 ? user[0][0] : null);
    }
    return null;
  }

  async getByName({ response, request }: HttpContextContract) {
    const body = request.all();
    if (body.name) {
      const users = await Database.rawQuery(
        "select * from users where name = ?",
        [body.name]
      );
      return response.json(users && users.length > 0 ? users[0] : null);
    }
    return [];
  }

  async getByNameOrById({ response, request }: HttpContextContract) {
    const body = request.all();

    // O trecho de código comentado é susceptível a ataques de injeção de sql
    // const users = await Database.rawQuery(
    //   `select * from users where name = '${body.name}' or id = ${body.id}`
    // );

    if (!body.name || !body.id) {
      return "Name and/or Id is required";
    }
    const users = await Database.rawQuery(
      // Não susceptível a ataques de injeção de sql.
      `SELECT * FROM users WHERE name = ? OR id = ?`,
      [body.name, body.id]
    );
    return response.json(users && users.length > 0 ? users[0] : null);
  }

  async getByNameAndById({ response, request }: HttpContextContract) {
    const body = request.all();

    if (!body.name || !body.id) {
      return "Name and/or Id is required";
    }
    const users = await Database.rawQuery(
      `SELECT * FROM users WHERE name = ? AND id = ?`,
      [body.name, body.id]
    );
    return response.json(users && users.length > 0 ? users[0] : null);
  }

  async searchUser({ response, request }: HttpContextContract) {
    const body = request.all();
    const search = `%${body.search}%`;
    const users = await Database.rawQuery(
      "select * from users where name like ?",
      [search]
    );
    return response.json(users && users.length > 0 ? users[0] : null);
  }

  async getIdsGreaterThan({ response, request }: HttpContextContract) {
    const body = request.all();
    if (!body.value) {
      return "value is required";
    }
    const users = await Database.rawQuery("select * from users where id > ?", [
      body.value,
    ]);
    return response.json(users && users.length > 0 ? users[0] : null);
  }

  async groupByCountry({ response }: HttpContextContract) {
    // Pega o país, o id e o nome de todos os registros de users agrupando eles por country e retorna  a quantidade de likes por país e filtra aqueles que o likes bater mais que 3
    const user = await Database.rawQuery(
      "SELECT country, GROUP_CONCAT(id) AS user_ids, GROUP_CONCAT(name) AS user_names, SUM(likes) AS total_likes from users GROUP BY country HAVING SUM(likes) > 3"
    );
    return response.json(user && user.length > 0 ? user[0] : null);
  }

  async getUserCount({ response }: HttpContextContract) {
    const user = await Database.rawQuery(
      "SELECT COUNT(*) AS total_users FROM users"
    );
    return response.json(user && user.length > 0 ? user[0] : null);
  }

  async getUserPosts({ response, request }: HttpContextContract) {
    const body = request.all();
    if (!body.id) {
      return "id is required";
    }
    const userPosts = await Database.rawQuery(
      "SELECT users.id, users.name, users.country, users.likes, users.email, posts.id AS post_id, posts.title, posts.category_id, posts.user_id FROM users INNER JOIN posts ON users.id = posts.user_id WHERE users.id = ?",
      [body.id]
    );
    return response.json(
      userPosts && userPosts.length > 0 ? userPosts[0] : null
    );
  }

  async leftJoin({ response, request }: HttpContextContract) {
    const body = request.all();
    if (!body.id) {
      return "id is required";
    }
    // Traz todos os registros da tabela à esquerda e coloca null naquelas que não tem sua correspondencia à direita
    const userPosts = await Database.rawQuery(
      "SELECT users.id, users.name, users.country, users.likes, users.email, posts.id AS post_id, posts.title, posts.category_id, posts.user_id FROM users LEFT JOIN posts ON users.id = posts.user_id WHERE users.id = ?",
      [body.id]
    );
    return response.json(
      userPosts && userPosts.length > 0 ? userPosts[0] : null
    );
  }

  async rightJoin({ response }: HttpContextContract) {
    // Traz todos os registros da tabela à direita e coloca null naquelas que não tem sua correspondencia à esquerda
    const userPosts = await Database.rawQuery(
      "SELECT users.id, users.name, users.country, users.likes, users.email, posts.id AS post_id, posts.title, posts.category_id, posts.user_id FROM users RIGHT JOIN posts ON users.id = posts.user_id"
    );
    return response.json(
      userPosts && userPosts.length > 0 ? userPosts[0] : null
    );
  }

  async threeTablesJoin({ response, request }: HttpContextContract) {
    const body = request.all();
    if (!body.id) {
      return "id is required";
    }
    const userPosts = await Database.rawQuery(
      "SELECT users.id, users.name, users.country, users.likes, users.email, posts.id AS post_id, posts.title, posts.category_id, posts.user_id, categories.id AS cat_id, categories.name AS cat_name FROM users INNER JOIN posts ON users.id = posts.user_id INNER JOIN categories ON posts.category_id = categories.id WHERE users.id = ?",
      [body.id]
    );
    return response.json(
      userPosts && userPosts.length > 0 ? userPosts[0] : null
    );
  }

  async update({ response, request, params }: HttpContextContract) {
    const { id } = params;
    const body = request.all();
    if (!body.name || !id) {
      return "name and/or id is required";
    }
    const user = await Database.rawQuery(
      "UPDATE users SET name = ? WHERE id = ?",
      [body.name, id]
    );
    if (user[0].affectedRows > 0) {
      const updatedUser = await Database.rawQuery(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );
      return response.json(updatedUser[0][0]);
    }
    return response.json(user && user.length > 0 ? user[0] : null);
  }

  async destroy({ params, response }: HttpContextContract) {
    const { id } = params;
    const user = await Database.rawQuery("DELETE FROM users WHERE id = ?", [
      id,
    ]);
    return response.json(user);
  }

  async store({ request, response }: HttpContextContract) {
    const body = request.all();
    if ((!body.email || !body.password || !body.name || !body.country || !body.likes)) {
      return 'Fill correct the properties'
    }
      await Database.rawQuery(
        "INSERT INTO users(email, password, name, country, likes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          body.email,
          body.password,
          body.name,
          body.country,
          body.likes,
          "2024-02-24 10:48:07",
          "2024-02-24 10:48:07",
        ]
      );

      const lastInsertIdQuery = await Database.rawQuery(
        "SELECT LAST_INSERT_ID() as id"
      );
      const lastInsertId = lastInsertIdQuery[0][0].id;
       const newUserQuery = await Database.rawQuery(
         "SELECT * FROM users WHERE id = ?",
         [lastInsertId]
       );
       const newUser = newUserQuery[0][0];
    return response.json(newUser);
  }
}
