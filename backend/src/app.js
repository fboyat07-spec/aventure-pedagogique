import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { attachRequestId, requestLogger } from "./middleware/requestId.js";

const app = express();

app.use(attachRequestId);
app.use(requestLogger);
app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", requestId: req.id });
});

app.use("/v1", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
