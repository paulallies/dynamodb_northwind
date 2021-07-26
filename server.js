require("dotenv").config("./.env");
const express = require("express");
var cors = require('cors')
const Home = require("./routes/home")
const PG = require("./routes/pg")
const app = express();
app.use(cors({ origin: ["http://localhost:3000"] }))

app.use("/", Home)
app.use("/pg", PG)

app.listen(process.env.PORT)