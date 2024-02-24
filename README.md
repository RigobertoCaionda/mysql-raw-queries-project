# DATABASE RAW QUERIES PROJECT APP Backend
This project is aimed at creating a simple node.js project that uses raw queries instead of an ORM, just to show that it's possible for you to work with raw queries, without ORMs although ORMs are so important to us, but sometimes in your projects you will need a raw query because there are some queries we can not do with ORMS.
Att: This project is totally focused on implementing raw queries with adonisJs and that's why i didn't care about other things like clean code, project patterns, etc. But although i encourage you to use the best software practices in your projects, it's very important to use good practices while developing your softwares...

##  Prerequisites

- Node.js (https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- npm or Yarn

## Installation

1. Clone the master branch of the repository:
```
git clone https://github.com/RigobertoCaionda/mysql-raw-queries-project.git
```

2. Enter the mysql-raw-queries-project:
```
cd mysql-raw-queries-project
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

## Project Structure
This the folder structure of this project:
- `app/`: It has the main source code of the application.
- `Controllers/`: Contains the controllers responsible for handling HTTP requests.
Important files:
- `UsersController.ts`: User Controller.
- `routes.ts`: API routes definition.

## Code Example:

This is index method in the UsersController to get all users:

async index({ response, request }: HttpContextContract) {
    const page = request.all().page || 1;
    const perPage = request.all().perPage || 2;
    const offset = (page - 1) * perPage;

    const users = await Database.rawQuery(
      `SELECT id, email, created_at, updated_at FROM users ORDER BY id DESC LIMIT ? OFFSET ?`, [perPage, offset]
    );
    return response.json(users && users.length > 0 ? users[0] : []);
  }


This is getUserPosts method in the UsersController to get a user with his posts:
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


## Credits
This project was developed by Rigoberto Caionda.

## Contact
If you have any questions or suggestions, please contact via email rigobertocaionda98@gmail.com or via my github page https://github.com/RigobertoCaionda
