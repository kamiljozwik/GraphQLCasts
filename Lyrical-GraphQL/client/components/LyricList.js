import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class LyricList extends Component {
  onLike(id, likes) {             // przekazujemy likes, aby zaimplementować Optymistic Updates
    this.props.mutate({           // wywołanie mutation do like'owania linii wersów
      variables: { id },
      optimisticResponse: {       // implementacji Optimistic Updates - przewidywanie odpowiedzi z serwera i błyskawiczne obrazowanie jej na froncie zanim odpowiedź fizycznie do nas dotrze
        __typename: 'Mutation',   // zawsze dodajemy tą linię
        likeLyric: {              // dokładna odpowiedź jaką oczekujemy mieć z serwera backendowego; można w consoli sobie podejrzeć jak wygląda (w chrome zakładka Network -> XHR)
          id,
          __typename: 'LyricType',
          likes: likes + 1        // przewidujemy, że like doda się poprawnie
        }
      }
    });
  }

  renderLyrics() {
    return this.props.lyrics.map(({ id, content, likes }) => {     // id and content and likes quantity of every single lyric (wiersz piosenki)
      return (
        <li key={id} className="collection-item">
          {content}
          <div className="vote-box">
            <i
              className="material-icons"
              onClick={() => this.onLike(id, likes)}  // użyta arrow function, aby mieć dostęp do "id:
            >
              thumb_up
            </i>
            {likes}
          </div>
        </li>
      );
    });
  }

  render() {
    return (
      <ul className="collection">
        {this.renderLyrics()}
      </ul>
    );
  }
}

const mutation = gql`             // mutation do like'owania pojedynczych wersów
  mutation LikeLyric($id: ID) {
    likeLyric(id: $id) {
      id
      likes
    }
  }
`;

export default graphql(mutation)(LyricList);
