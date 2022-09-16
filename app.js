var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
const bodyParser = require("body-parser")
const cors = require("cors")

require("dotenv").config()
require("./models").sequelize.sync()

var authRouter = require("./routes/auth")
var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")
var botsRouter = require("./routes/bots")

var app = express()

// require("./routes/users")(app);

// parse requests of content-type - application/json
app.use(bodyParser.json())

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use(cors({
  origin: "*"
}))

app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/api/auth/", authRouter)
app.use("/api/bots/", botsRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

module.exports = app
