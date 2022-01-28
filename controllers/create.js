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
    };
    console.log(car);
    try {
      await req.storage.createCar(car);
      res.redirect("/");
    } catch (err) {
      console.log("Error creating record", err);
      res.redirect("/create");
    }
  },
};
