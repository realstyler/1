import express from "express";
import "dotenv/config";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello from server");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
