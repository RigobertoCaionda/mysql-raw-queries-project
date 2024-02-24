import Route from "@ioc:Adonis/Core/Route";

Route.get("/users", "UsersController.index");
Route.post("/users", "UsersController.store");
Route.get("/users/getbyname", "UsersController.getByName");
Route.get("/users/getbynameorid", "UsersController.getByNameOrById");
Route.get("/users/getbynameandid", "UsersController.getByNameAndById");
Route.get("/users/search", "UsersController.searchUser");
Route.get("/users/idgreaterthan", "UsersController.getIdsGreaterThan");
Route.get("/users/groupby", "UsersController.groupByCountry");
Route.get("/users/getusercount", "UsersController.getUserCount");
Route.get("/users/getuserposts", "UsersController.getUserPosts");
Route.get("/users/left-join", "UsersController.leftJoin");
Route.get("/users/right-join", "UsersController.rightJoin");
Route.get("/users/three-tables-join", "UsersController.threeTablesJoin");
Route.get("/users/:id", "UsersController.show");
Route.patch("/users/:id", "UsersController.update").middleware("auth");
Route.delete("/users/:id", "UsersController.destroy").middleware("auth");
