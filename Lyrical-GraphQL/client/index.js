import './style/style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import ApolloClient from 'apollo-client';  // import Apollo Client (niezależne od frontowego frameworka)
import { ApolloProvider } from 'react-apollo';  // wersja Apollo tylko dla Reacta

import App from './components/App';
import SongList from './components/SongList';
import SongCreate from './components/SongCreate';
import SongDetail from './components/SongDetail';

const client = new ApolloClient({    // new instance of Apollo Client, zakłada, że na backendzie query będą szły pod path /graphql (tak też jest wszystko ustawione w pliku index folderu server)
  dataIdFromObject: o => o.id        // konfiguracja Apollo CLient'a
});

const Root = () => {
  return (
    <ApolloProvider client={client}>  // musimy podać Apollo Client - "client". "Glue between React and Apollo's world (GraphQL's world)"
      <Router history={hashHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={SongList} />
          <Route path="songs/new" component={SongCreate} />
          <Route path="songs/:id" component={SongDetail} />
        </Route>
      </Router>
    </ApolloProvider>
  );
};

ReactDOM.render(
  <Root />,
  document.querySelector('#root')
);
