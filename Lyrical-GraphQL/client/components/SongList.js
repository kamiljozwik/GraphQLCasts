import React, { Component } from 'react';
import gql from 'graphql-tag';  // pomaga w pisaniu GraphQL queries w komponentach 
import { graphql } from 'react-apollo';  // pomaga w wykonaiu query i wciągnięciu danych do komponentu.
import { Link } from 'react-router';
import query from '../queries/fetchSongs';

class SongList extends Component {
  onSongDelete(id) {                           // handler odpowiedzialny za uruchomienie mutation usuwające rekord z bazy danych
    this.props.mutate({ variables: { id } })   
      .then(() => this.props.data.refetch());  // inny sposób (niż ten pokazany przy dodowaniu piosenki) na wykonanie ponownego pobrania danych (ponownego wykonania query) 
  }

  renderSongs() {  // helper method to iterate over array of songs and return one valid JSX to render method
    return this.props.data.songs.map(({ id, title }) => {   // dane z GraphQL dostępne pod this.props.data, wykonany destructing
      return (
        <li key={id} className="collection-item">
          <Link to={`/songs/${id}`}>
            {title}
          </Link>
          <i
            className="material-icons"
            onClick={() => this.onSongDelete(id)}
          >
            delete
          </i>
        </li>
      );
    });
  }

  render() {
    if (this.props.data.loading) { return <div>Loading...</div>; }  // czekamy aż dane zostane pobrane z serwera

    return (
      <div>
        <ul className="collection">
          {this.renderSongs()}
        </ul>
        <Link
          to="/songs/new"
          className="btn-floating btn-large red right"
        >
          <i className="material-icons">add</i>
        </Link>
      </div>
    );
  }
}

const mutation = gql`             // mutation do usuwania piosenki
  mutation DeleteSong($id: ID) {  // ID = typ danych z GraphQL (tak jak String, Integer, itd...)
    deleteSong(id: $id) {
      id
    }
  }
`;

export default graphql(mutation)(   // połączenie mution z komponentem i z query
  graphql(query)(SongList)          // połączenie danych (query) z GraphQL z komponentem; (Bond query + component) z checklisty
);
