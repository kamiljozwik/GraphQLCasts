import React, { Component } from 'react';
import gql from 'graphql-tag';  // pomaga w pisaniu GraphQL queries w komponentach 
import { graphql } from 'react-apollo';  // pomaga w wykonaiu query i wciągnięciu danych do komponentu.
import { Link } from 'react-router';
import query from '../queries/fetchSongs';

class SongList extends Component {
  onSongDelete(id) {
    this.props.mutate({ variables: { id } })
      .then(() => this.props.data.refetch());
  }

  renderSongs() {  // helper method to iterate over array of songs and return one valid JSX to render method
    return this.props.data.songs.map(({ id, title }) => {   // dane z GraphQL dostępne pod this.props.data
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

const mutation = gql`
  mutation DeleteSong($id: ID) {
    deleteSong(id: $id) {
      id
    }
  }
`;

export default graphql(mutation)(
  graphql(query)(SongList)    // połączenie danych z GraphQL z komponentem; (Bond query + component) z checklisty
);
