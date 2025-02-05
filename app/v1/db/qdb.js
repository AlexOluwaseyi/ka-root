import { Quiz, initQuizDatabase } from "../models/quizModel.js";

(async () => {
  await initQuizDatabase();
  const newQuiz = await Quiz.create({
    name: "Rosbaaods Joy",
    email: "akinsfgdft@def.com",
  });
  console.log(newQuiz.toJSON());
})();
