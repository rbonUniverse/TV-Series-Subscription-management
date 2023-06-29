var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const showsDAL = require("./DALs/showsDAL");
const membersAndSubscriptionsDAL = require("./DALs/membersAndSubscriptionsDAL");
const { buildSchema } = require("graphql");
const express_graphql = require("express-graphql");
var session = require("express-session");

const app = express();

app.use(cors());
app.use(express.json());

// Build graphql schema
let appSchema = buildSchema(`
type Query {
    getAllShows: [Show],
    getAllMembers: [Member]
    getOneMember(_id: String): Member
    getOneShow(_id: String): [Show]
    getAllSubscriptions: [Subscription]
    },
type Mutation {
    addNewShow(Name: String, Genres: String, Date: String, Image: String): [Show]
    editShow(_id: String): [Show]
    deleteShow(_id: String): [Show]
        },
type Show
{
    _id: ID,
    Name: String,
    Genres: [String],
    Date: String,
    Image: String
},
type Member
{
    _id: ID,
    Name: String,
    Email: String,
    City: String
},
type Subscription
{
    _id: ID,
    MemberId: String,
    Shows: [Show]
},
`);

var loginRouter = require("./routes/login");
var createAccountRouter = require("./routes/createAccount");
var createAccountThroughLinkRouter = require("./routes/createAccountThroughLink");
var mainPageRouter = require("./routes/mainPage");
var usersManagementRouter = require("./routes/usersManagement");
var newUserRouter = require("./routes/newUser");
var updateUserRouter = require("./routes/updateUser");
var showsRouter = require("./routes/shows");
var subscriptionsRouter = require("./routes/subscriptions");

let rootFunctions = {
  getAllShows: showsDAL.getAllShows,
  getOneShow: showsDAL.getOneShow,
  deleteShow: showsDAL.deleteShow,
  getOneMember: membersAndSubscriptionsDAL.getOneMember,
  getAllSubscriptions: membersAndSubscriptionsDAL.getAllSubscriptions,
};

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    count: 0,
  })
);

app.use("/login", loginRouter);
app.use("/createAccount", createAccountRouter);
app.use("/createAccountThroughLink", createAccountThroughLinkRouter);
app.use("/mainPage", mainPageRouter);
app.use("/usersManagement", usersManagementRouter);
app.use("/newUser", newUserRouter);
app.use("/updateUser", updateUserRouter);
app.use("/shows", showsRouter);
app.use("/subscriptions", subscriptionsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Connect to Database
require("./configs/database");

app.use(
  "/shows",
  express_graphql.graphqlHTTP({
    schema: appSchema,
    rootValue: rootFunctions,
    graphiql: true,
  })
);

module.exports = app;
