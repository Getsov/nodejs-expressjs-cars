const User = require("../models/User");
// testUpdate();
// async function testUpdate() {
//   const user = await User.findOne({ username: "opsiii" });
//   user.hashedPassword = 1234;
//   await user.save();
//   console.log(user);
// }

async function register(session, username, password) {
  const user = new User({
    username,
    hashedPassword: password,
  });
  await user.save();
  session.user = {
    id: user._id,
    username: user.username,
  };
}

async function login(session, username, password) {
  console.log("ass");
  const user = await User.findOne({ username });
  if (user && user.comparePassword(password)) {
    session.user = {
      id: user._id,
      username: user.username,
    };
    return true;
  } else {
    throw new Error("Incorrect username or password");
  }
}

function logout(session) {
  delete session.user;
}

module.exports = () => (req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
    res.locals.hasUser = true;
  }
  req.auth = {
    register: (...params) => register(req.session, ...params),
    login: (...params) => login(req.session, ...params),
    logout: () => logout(req.session),
  };
  next();
};
