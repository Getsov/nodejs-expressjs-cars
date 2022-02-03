// [x] initialize  and configure Express app
// [x] initialize templating lib
// [x] create home controller
// [x] bind routing
// [x] create layout
// create data service
// - [x] read all
// - [x] read one by ID
// - [x] search
// - [x] create
// - [x] edit
// - [x] delete
// - [x] accessory read
// - [x] accessory create
// - [x] attach accessory
// - [x] register user
// - [x] login user
// - [ ] logout user
// - [ ] add authentication checks to data modification
// implement controllers
// - [x] home (catalog)
// - [x] about
// - [x] details
// - [x] create
// - [x] edit
// - [x] delete
// - [x] improved home (search)
// - [x] create accessory
// - [x] attach accessory to car
// - [x] update details to include accessory
// - [ ] auth controller with login, register, logout actions
// - [ ] protect routes
// [x] add front-end code
// [x] add database connection
// [x] create Car model
// [x] upgrade car service to use Car model
// [x] add validation rules to Car model
// [x] create Accessory model
// [ ] add session middleware and auth libraries
// [ ] create User model
// [ ] add owner property to Car, Accessory models

const express = require("express");
const hbs = require("express-handlebars");
const session = require("express-session");

const initDb = require("./models");

const { about } = require("./controllers/about");
const create = require("./controllers/create");
const { details } = require("./controllers/details");
const { home } = require("./controllers/home");
const { notFound } = require("./controllers/notFound");
const editCar = require("./controllers/edit");
const deleteCar = require("./controllers/delete");
const accessory = require("./controllers/accessory");
const attach = require("./controllers/attach");
const {
  registerGet,
  registerPost,
  loginGet,
  loginPost,
  logout,
} = require("./controllers/auth");

const carsService = require("./utils/cars");
const accessoryService = require("./utils/accessory");
const authService = require("./utils/auth");
const { isLoggedIn } = require("./utils/services");

start();

async function start() {
  await initDb();
  const app = express();

  app.engine(
    "hbs",
    hbs.create({
      extname: ".hbs",
    }).engine
  );

  app.set("view engine", "hbs");

  app.use(
    session({
      secret: "my super secret",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: "auto" },
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use("/static", express.static("static"));
  app.use(carsService());
  app.use(accessoryService());
  app.use(authService());

  app.get("/", home);
  app.get("/about", about);
  app.get("/details/:id", details);
  app
    .route("/create")
    .get(isLoggedIn(), create.get)
    .post(isLoggedIn(), create.post);
  app
    .route("/delete/:id")
    .get(isLoggedIn(), deleteCar.get)
    .post(isLoggedIn(), deleteCar.post);
  app
    .route("/edit/:id")
    .get(isLoggedIn(), editCar.get)
    .post(isLoggedIn(), editCar.post);
  app
    .route("/accessory")
    .get(isLoggedIn(), accessory.get)
    .post(isLoggedIn(), accessory.post);
  app
    .route("/attach/:id")
    .get(isLoggedIn(), attach.get)
    .post(isLoggedIn(), attach.post);
  app.route("/register").get(registerGet).post(registerPost);
  app.route("/login").get(loginGet).post(loginPost);
  app.get("/logout", logout);
  app.all("*", notFound);

  app.listen(3001, () => console.log("Server started on port 3001"));
}
