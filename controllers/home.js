module.exports = {
  async home(req, res) {
    const cars = await req.storage.getAll(req.query);
    console.log("HOME");
    res.render("index", { cars, title: "Carbicle", query: req.query });
  },
};
