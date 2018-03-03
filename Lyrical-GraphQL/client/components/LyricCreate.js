import React, { Component } from 'react';
import gql from 'graphql-tag';         // pozwala na wykonanie query bezpośrednio z JavaScriptu
import { graphql } from 'react-apollo';  // helper łączący GraphQL query z komponentem

class LyricCreate extends Component {
  constructor(props) {
    super(props);

    this.state = { content: '' };
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.mutate({               // call mutation
      variables: {                    // zmienne dla query
        content: this.state.content,  
        songId: this.props.songId     
      }
    }).then(() => this.setState({ content: '' }));
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <label>Add a Lyric</label>
        <input
          value={this.state.content}
          onChange={event => this.setState({ content: event.target.value })}
        />
      </form>
    );
  }
}

const mutation = gql`
  mutation AddLyricToSong($content: String, $songId: ID) {
    addLyricToSong(content: $content, songId: $songId) {
      id
      lyrics {
        id
        content
        likes
      }
    }
  }
`;

export default graphql(mutation)(LyricCreate);  // associate mutaion with component
