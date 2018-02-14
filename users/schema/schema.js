const graphql = require('graphql');
const axios = require('axios');
const {              // lots of destructing from graphql
  GraphQLObjectType, // tells about presents of our objects in application
  GraphQLString,  // typy naszych properties
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({  // tells about presents of "Company" object in application. Opisuje object "Company" z grafiki
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data)
      }
    }
  })
});

const UserType = new GraphQLObjectType({  // tells about presents of "User" object in application. Opisuje object "User" z grafiki
  name: 'User',  // nazwa obiektu
  fields: () => ({  // bardzo ważne - mówi GraphQL o properties naszego obiektu
    id: { type: GraphQLString }, // musimy powiedzieć jakiego typu jest property - typy pochodzą z GraphQL library
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)  // to co tutaj jest zwracane (return), będzie odpowiedzią na nasze GraphQL query.
          .then(res => res.data);
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({  // RootQuery -> początkowy obiekt, z którego zaczynamy GrapQL queries.
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,  // typ, kótry zostanie zwrócony. (patrz linia 28)
      args: { id: { type: GraphQLString } }, // required arguments for root query (tutaj "id" user'a). To co tutaj podamy będzie dostępne jako 'args' funkcji "resolve"
      resolve(parentValue, args) {  // bardzo ważna funkcja! 
        return axios.get(`http://localhost:3000/users/${args.id}`)  // tutaj idziemy do naszej bazy danych i szukamy rzeczywistej danej (tu: user o konkretnym id). Pobierane z fake JSON API
          .then(resp => resp.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(resp => resp.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age, companyId }) {
        return axios.post('http://localhost:3000/users', { firstName, age, companyId })
          .then(res => res.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({  // exportujemy schema, aby było dostęne dla express (server.js)
  mutation,
  query: RootQuery
});
