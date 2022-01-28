const Car = require("../models/Car");
const { carViewModel } = require("./services");

async function getAll(query) {
  const options = {};
  if (query.search) {
    options.name = new RegExp(query.search, "i");
  }
  if (query.from) {
    options.price = { $gte: Number(query.from) };
  }
  if (query.to) {
    if (!options.price) {
      options.price = {};
    }
    options.price.$lte = Number(query.to);
  }
  const cars = await Car.find(options);

  return cars.map((car) => carViewModel(car));
}

async function getById(id) {
  const car = await Car.findById(id).populate("accessories");
  if (car) {
    return carViewModel(car);
  } else {
    return undefined;
  }
}

async function createCar(car) {
  const result = new Car(car);
  console.log("🚀 ~ file: cars.js ~ line 43 ~ createCar ~ result", result);
  await result.save();
}

async function deleteById(id) {
  await Car.findByIdAndDelete(id);
}

async function updateById(id, car) {
  const existing = await Car.findById(id);
  existing.name = car.name;
  existing.description = car.description;
  existing.imageUrl = car.imageUrl;
  existing.price = car.price;
  existing.accessories = car.accessories;
  await existing.save();
}

async function attachAccessory(carId, accessoryId) {
  const existing = await Car.findById(carId);
  existing.accessories.push(accessoryId);
  await existing.save();
}

// function nextId() {
//   return "xxxxxxxx-xxxx".replace(/x/g, () =>
//     ((Math.random() * 16) | 0).toString(16)
//   );
// }
module.exports = () => (req, res, next) => {
  req.storage = {
    getAll,
    getById,
    createCar,
    updateById,
    deleteById,
    attachAccessory,
  };
  next();
};
