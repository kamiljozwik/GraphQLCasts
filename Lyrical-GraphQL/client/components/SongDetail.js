import React, { Component } from 'react';
import { graphql } from 'react-apollo';           // helper
import { Link } from 'react-router';
import fetchSong from '../queries/fetchSong';
import LyricCreate from './LyricCreate';
import LyricList from './LyricList';

class SongDetail extends Component {
  render() {
    const { song } = this.props.data;

    if (!song) { return <div>Loading...</div>; }                // czekamy na wykonanie query

    return (
      <div>
        <Link to="/">Back</Link>
        <h3>{song.title}</h3>
        <LyricList lyrics={song.lyrics} />                      // song.lyrics = podajemy dalej do komponentu kolekcję składającą się z wierszy tekstu
        <LyricCreate songId={this.props.params.id} />           // podajemy dalej songId, ponieważ ReactRouter podaje "params" tylko do pierwszego spotkanego komponentu
      </div>
    );
  }
}

export default graphql(fetchSong, {         // drugim agumentem jest obiekt. Dzięki temu podajemy do query parametry (zmienne). W naszym przypadku jest to id piosenki którą chemy pobrać. ID jest podane w path Routera
  options: (props) => { return { variables: { id: props.params.id } } } //graphql helper bierze propsy komponentu (tu: "(props)") i sam podaje je dalej do query. To co zwrócone przez return trafia do query jako query variables
})(SongDetail);
