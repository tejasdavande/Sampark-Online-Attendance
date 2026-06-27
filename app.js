const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const errorHandler = require("./middleware/errorhandler");
const openapiSpec = require("./docs/openapi.json");

// Connect to the database
const connectedDb = require("./common/db");
connectedDb();

const app = express();

// ---- Global middleware ----
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ---- API documentation (Swagger UI) ----
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get("/openapi.json", (req, res) => res.json(openapiSpec));

// ---- Service info & health ----
app.get("/", (req, res) =>
  res.json({ name: "Sampark Online Attendance API", docs: "/api-docs", health: "/health" })
);
app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime() })
);

// ---- Routes ----
app.use("/bhulku", require("./routes/bhulku"));
app.use("/attendance", require("./routes/attendance"));
app.use("/user", require("./routes/user"));
app.use("/sabha", require("./routes/sabha"));
app.use("/birthday", require("./routes/bhulkubirthday"));

// ---- 404 + central error handler ----
app.use((req, res, next) => {
  res.status(404);
  next(new Error("Not found"));
});
app.use(errorHandler);

module.exports = app;
