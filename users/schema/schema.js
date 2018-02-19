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
      type: new GraphQLList(UserType),  // informujemy GraphQL, że oczekujemy listy, w której rekordy będą typu UserType.
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
    company: {                // relation with Company
      type: CompanyType,      // patrz linia 12
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)  // we try to return company associated with a given user
          .then(res => res.data); // axios zwraca dane w property `data`
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({  // RootQuery -> początkowy obiekt, z którego zaczynamy GrapQL queries.
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,  // typ, kótry zostanie zwrócony przez funkcję resolve. (patrz linia 28)
      args: { id: { type: GraphQLString } }, // required arguments for root query (tutaj "id" user'a). To co tutaj podamy będzie dostępne jako 'args' funkcji "resolve"
      resolve(parentValue, args) {  // bardzo ważna funkcja! 
        return axios.get(`http://localhost:3000/users/${args.id}`)  // tutaj idziemy do naszej bazy danych i szukamy rzeczywistej danej (tu: user o konkretnym id). Pobierane z fake JSON API, to co jest zwracane (return) jest odpowiedzią na quey
          .then(resp => resp.data); // axios zwraca dane w property `data`
      }
    },
    company: {  // teraz możemy zapytać w naszym query zapytać również bezpośrednio o dane dotyczące Company, bez pytania wcześniej o User'a
      type: CompanyType,
      args: { id: { type: GraphQLString } },  // wymagane pole w query, tak jak w przypadku User'a
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(resp => resp.data);  // axios zwraca dane w property `data`
      }
    }
  }
});

const mutation = new GraphQLObjectType({  // mutations używane do manipulowania rekordami (dodawanie nowych, usuwanie, itp.)
  name: 'Mutation',
  fields: {
    addUser: {  // first mutaion - dodawanie użytkownika. 
      type: UserType, // typ danych, który będzie zwracany z funkcji resolve
      args: {  // argumenty dla query oraz ich typy
        firstName: { type: new GraphQLNonNull(GraphQLString) }, // ten argument wymagany poprzez zastosowanie GraphQLNonNull
        age: { type: GraphQLInt }, // argument opcjonalny
        companyId: { type: GraphQLString }  // argument opcjonalny
      },
      resolve(parentValue, { firstName, age, companyId }) {  // użyty destructing, drugim argumentem jest "args"
        return axios.post('http://localhost:3000/users', { firstName, age, companyId })  // rzeczywiste query do bazy danych albo API
          .then(res => res.data);
      }
    },
    deleteUser: {  // second mutaion - usuwanie rekordu użytkownika
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }  // wymagany argument
      },
      resolve(parentValue, { id }) {
        return axios.delete(`http://localhost:3000/users/${id}`)
          .then(res => res.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString) },
        age: { type: GraphQLInt }, // argument opcjonalny
        companyId: { type: GraphQLString }  // argument opcjonalny
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/users/${args.id}`, args)
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({  // exportujemy schema, aby było dostęne dla express (server.js)
  mutation,  // musimy eksportować mutation oraz query
  query: RootQuery
});
