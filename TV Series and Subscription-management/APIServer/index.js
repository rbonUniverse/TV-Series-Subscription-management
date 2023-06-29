const express_graphql = require("express-graphql");
const membersBL = require("./BL/membersBL");
const subscriptionsBL = require("./BL/subscriptionsBL");
const showsBL = require("./BL/showsBL");
const { buildSchema } = require("graphql");
const express = require("express");
var cors = require("cors");

// Build graphql schema
let appSchema = buildSchema(`
type Query {
getAllMembers: [Member],
getOneMember(_id: String): Member,
getAllShows: [Show],
getOneShow(_id: String): Show,
getOneShowDetails(_id: String): Show,
getAllSubscriptions: [Subscription]
},
type Mutation {
addMember(Name: String, Email: String, City: String): [Member],
addNewShow(Name: String, Genres: String, Date: String, Image: String): [Show],
newSubscription(MemberId: String, showId: String): [Subscription],
editShow(_id: String, Name: String, Genres: String, Date: String, Image: String): [Show],
editMember(_id: String, Name: String, Email: String, City: String): [Member],
deleteShow(_id: String): [Show],
deleteMember(_id: String): [Member],
removeSubscription(_id: String): [Subscription],
},
type Member
{
    _id: ID,
    Name: String,
    Email: String,
    City: String
},
type Show
{
    _id: ID,
    Name: String,
    Genres: [String],
    Date: String,
    Image: String,
},
type MemberShowSubscription
{
    showId: String,
    date: String
},
type Subscription
{
    _id: ID,
    MemberId: String,
    Shows: [MemberShowSubscription]
}
`);

let rootFunctions = {
  getAllMembers: membersBL.getAllMembers,
  getOneMember: membersBL.getOneMember,
  getAllShows: showsBL.getAllShows,
  getOneShow: showsBL.getOneShow,
  getOneShowDetails: showsBL.getOneShowDetails,
  getAllSubscriptions: subscriptionsBL.getAllSubscriptions,
  addMember: membersBL.addMember,
  addNewShow: showsBL.addNewShow,
  newSubscription: subscriptionsBL.newSubscription,
  editMember: membersBL.editMember,
  editShow: showsBL.editShow,
  deleteMember: membersBL.deleteMember,
  deleteShow: showsBL.deleteShow,
  removeSubscription: subscriptionsBL.removeSubscription,
};

let app = express();
// Connect to Database
require("./configs/database");

app.use(
  "/",
  express_graphql.graphqlHTTP({
    schema: appSchema,
    rootValue: rootFunctions,
    graphiql: true,
  })
);

app.use(cors());
app.use(express.json());
// Connect to server
app.listen(4001, () => console.log("Running at 4001"));
