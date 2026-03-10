import express from "express";
import identifyRoutes from "./routes/identifyRoutes";

const app = express();

app.use(express.json());

// root route
app.get("/", (req, res) => {
  res.send("Identity Reconciliation API running 🚀");
});

app.use("/identify", identifyRoutes);

export default app;