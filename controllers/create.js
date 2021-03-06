const { mapError } = require("../utils/services");

module.exports = {
  get(req, res) {
    res.render("create", { title: "Create Listing" });
  },
  async post(req, res) {
    const car = {
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.body.imageUrl || undefined,
      price: Number(req.body.price),
      owner: req.session.user.id,
    };
    try {
      await req.storage.createCar(car);
      res.redirect("/");
    } catch (errors) {
      // if (errors.name == "ValidationError") {
      //   errors = Object.values(errors.errors).map((e) => ({ msg: e.message }));
      // }
      // console.log("Error creating record", errors);
      res.locals.errors = mapError(errors);
      res.render("create", { title: "Create Listing", car });
    }
  },
};
