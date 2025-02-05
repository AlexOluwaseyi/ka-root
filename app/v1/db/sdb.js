import { User, initUserDatabase } from "../models/userModel.js";

(async () => {
  await initUserDatabase();
  const newUser = await User.create({
    name: "Rosbaaods Joy",
    email: "akinsfgdft@def.com",
  });
  console.log(newUser.toJSON());
})();
