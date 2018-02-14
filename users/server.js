const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema'); // schema naszej bazy danych

const app = express();

app.use('/graphql', expressGraphQL({ // mówimy aplikacji, żeby słuchała tylko zapytań dla GraphQL (czyli na path localhost:4000/graphql)
  schema,  // schema są to wszystkie relacje w naszej bazie danych (nasz graph)
  graphiql: true  // deeloper tool that allows making query to our developer server. Tylko używamy w środowisku developerskim. W przeglądarce pod adresem localhost:4000/graphql będzimy mieli graficzne narzęzedzie do testowanie GrapQL queries. 
}));

app.listen(4000, () => {
  console.log('Listening');
});
