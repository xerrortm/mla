import express from "express";

const app = express();
const PORT = 3000;

// lets server read JSON
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// example API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Test123" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
