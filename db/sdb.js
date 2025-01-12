import User from "../model/user.js";

const newUser = await User.create({
  name: "Rosbaaods Joy",
  email: "akint@def.com",
});
console.log(newUser.toJSON());
