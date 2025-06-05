import { app } from "./index.js";
import { connectDB } from "./src/config/db.js";
// import { seedDatabase } from "./src/utils/seedDatabase.js";
app.listen(3000, async () => {
  //   seedDatabase();
  //   console.log("Seeding database...");
  await connectDB();
  console.log("Server is running at port 3000");
});
