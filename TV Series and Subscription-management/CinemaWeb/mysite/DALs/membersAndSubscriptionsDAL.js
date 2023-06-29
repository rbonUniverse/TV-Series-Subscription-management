const { request, gql } = require("graphql-request");

// GET Members
const getAllMembers = async () => {
  const query = gql`
    query {
      getAllMembers {
        _id
        Name
        Email
        City
      }
    }
  `;
  const resp = await request("http://127.0.0.1:4001/", query);
  return resp.getAllMembers;
};

// GET one Member
const getOneMember = async (_id) => {
  const query = gql`
    query ($_id: String) {
      getOneMember(_id: $_id) {
        _id
        Name
        Email
        City
      }
    }
  `;
  const variable = { _id };
  const resp = await request("http://127.0.0.1:4001/", query, variable);
  return resp.getOneMember;
};

// GET Subscriptions
const getAllSubscriptions = async () => {
  const query = gql`
    query {
      getAllSubscriptions {
        _id
        MemberId
        Shows {
          showId
          date
        }
      }
    }
  `;
  const resp = await request("http://127.0.0.1:4001/", query);
  return resp.getAllSubscriptions;
};

// ADD new Member
const addMember = async (obj) => {
  const query = gql`
    mutation ($Name: String, $Email: String, $City: String) {
      addMember(Name: $Name, Email: $Email, City: $City) {
        _id
        Name
        Email
        City
      }
    }
  `;
  const Name = obj.Name;
  const City = obj.City;
  const Email = obj.Email;

  const variables = { Name, City, Email };
  const resp = await request("http://127.0.0.1:4001/", query, variables);
  return resp.addMember;
};

// ADD new Member
const editMember = async (obj) => {
  const query = gql`
    mutation ($_id: String, $Name: String, $Email: String, $City: String) {
      editMember(_id: $_id, Name: $Name, Email: $Email, City: $City) {
        _id
        Name
        Email
        City
      }
    }
  `;
  const _id = obj._id;
  const Name = obj.Name;
  const City = obj.City;
  const Email = obj.Email;

  const variables = { _id, Name, City, Email };
  const resp = await request("http://127.0.0.1:4001/", query, variables);
  return resp.editMember;
};

// Member new Subscription
const newSubscription = async (obj) => {
  const query = gql`
    mutation ($MemberId: String, $showId: String) {
      newSubscription(MemberId: $MemberId, showId: $showId) {
        MemberId
        Shows {
          showId
          date
        }
      }
    }
  `;
  const resp = await request("http://127.0.0.1:4001/", query, obj);
  return resp.newSubscription;
};

// DELETE Member
const deleteMember = async (_id) => {
  const query = gql`
    mutation ($_id: String) {
      deleteMember(_id: $_id) {
        _id
        Name
        Email
        City
      }
    }
  `;
  const variable = { _id };
  const resp = await request("http://127.0.0.1:4001/", query, variable);
  return resp.deleteMember;
};

module.exports = {
  getAllMembers,
  getOneMember,
  getAllSubscriptions,
  addMember,
  editMember,
  newSubscription,
  deleteMember,
};
