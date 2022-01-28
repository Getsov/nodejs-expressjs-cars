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
// - [ ] accessory read
// - [ ] accessory create
// - [ ] attach accessory
// implement controllers
// - [x] home (catalog)
// - [x] about
// - [x] details
// - [x] create
// - [x] edit
// - [x] delete
// - [x] improved home (search)
// - [ ] create accessory
// - [ ] attach accessory to car
// - [ ] update details to include accessory
// [x] add front-end code
// [x] add database connection
// [x] create Car model
// [x] upgrade car service to use Car model
// [ ] add validation rules to Car model
// [ ] create Accessory model

const express = require("express");
const hbs = require("express-handlebars");

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

const carsService = require("./utils/cars");
const accessoryService = require("./utils/accessory");

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

  app.use(express.urlencoded({ extended: true }));
  app.use("/static", express.static("static"));
  app.use(carsService());
  app.use(accessoryService());

  app.get("/", home);
  app.get("/about", about);
  app.get("/details/:id", details);
  app.route("/create").get(create.get).post(create.post);
  app.route("/delete/:id").get(deleteCar.get).post(deleteCar.post);
  app.route("/edit/:id").get(editCar.get).post(editCar.post);
  app.route("/accessory").get(accessory.get).post(accessory.post);
  app.route("/attach/:id").get(attach.get).post(attach.post);

  app.all("*", notFound);

  app.listen(3000, () => console.log("Server started on port 3000"));
}
