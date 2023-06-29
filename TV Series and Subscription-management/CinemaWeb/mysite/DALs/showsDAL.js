const { request, gql } = require("graphql-request");

// GET Shows
const getAllShows = async () => {
  const query = gql`
    query {
      getAllShows {
        _id
        Name
        Genres
        Date
        Image
      }
    }
  `;
  const resp = await request("http://127.0.0.1:4001/", query);
  return resp.getAllShows;
};

// GET one Show
const getOneShow = async (_id) => {
  const query = gql`
    query ($_id: String) {
      getOneShow(_id: $_id) {
        _id
        Name
        Genres
        Date
        Image
      }
    }
  `;
  const variable = { _id };
  const resp = await request("http://127.0.0.1:4001/", query, variable);
  return resp.getOneShow;
};

// GET one Show
const getOneShowDetails = async (_id) => {
  const query = gql`
    query ($_id: String) {
      getOneShowDetails(_id: $_id) {
        _id
        Name
        Genres
        Date
        Image
      }
    }
  `;
  const variable = { _id };
  const resp = await request("http://127.0.0.1:4001/", query, variable);
  return resp.getOneShowDetails;
};

// ADD Show
const addNewShow = async (obj) => {
  const query = gql`
    mutation ($Name: String, $Genres: String, $Date: String, $Image: String) {
      addNewShow(Name: $Name, Genres: $Genres, Date: $Date, Image: $Image) {
        _id
        Name
        Genres
        Date
        Image
      }
    }
  `;
  const Name = obj.Name;
  const Genres = obj.Genres;
  const Date = obj.Date;
  const Image = obj.Image;

  const variables = { Name, Genres, Date, Image };
  const resp = await request("http://127.0.0.1:4001/", query, variables);
  return resp.addNewShow;
};

// ADD Show
const editShow = async (obj) => {
  const query = gql`
    mutation (
      $_id: String
      $Name: String
      $Genres: String
      $Date: String
      $Image: String
    ) {
      editShow(
        _id: $_id
        Name: $Name
        Genres: $Genres
        Date: $Date
        Image: $Image
      ) {
        _id
        Name
        Genres
        Date
        Image
      }
    }
  `;
  const _id = obj._id;
  const Name = obj.Name;
  const Genres = obj.Genres;
  const Date = obj.Date;
  const Image = obj.Image;

  const variables = { _id, Name, Genres, Date, Image };
  const resp = await request("http://127.0.0.1:4001/", query, variables);
  return resp.editShow;
};

// DELETE Show
const deleteShow = async (_id) => {
  const query = gql`
    mutation ($_id: String) {
      deleteShow(_id: $_id) {
        _id
        Name
        Genres
        Date
        Image
      }
    }
  `;
  const variable = { _id };
  const resp = await request("http://127.0.0.1:4001/", query, variable);
  return resp.deleteShow;
};

module.exports = {
  getAllShows,
  getOneShow,
  getOneShowDetails,
  addNewShow,
  editShow,
  deleteShow,
};
