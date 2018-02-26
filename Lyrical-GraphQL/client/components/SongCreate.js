import React, { Component } from 'react';
import { graphql } from 'react-apollo'; 
import gql from 'graphql-tag';                      // helper to write query and mutaions
import { Link, hashHistory } from 'react-router';
import query from '../queries/fetchSongs';

class SongCreate extends Component {
  constructor(props) {
    super(props);

    this.state = { title: '' };
  }

  onSubmit(event) {
    event.preventDefault();

    this.props.mutate({                        // dostępne dzięki linii 48; wywołanie naszego mutaion napisanego w linii 40
      variables: { title: this.state.title },  // tutaj podajemy query variables
      refetchQueries: [{ query }]              // ponowne wywołanie query (abo wielu queries), po wykoaniu mutation. Dzięki temu nowo dodany rekord pojawi się od razu na stronie. Query zaimportowane z innego pliku. Podajemy tutaj obiekt [{ query: query, variables: {}}]; wiec możemy podać zmienne, ale my tutaj nie potrrzebujemy
    }).then(() => hashHistory.push('/'));      // mutation zwraca promise; tutaj po wykonaniu mutaion jesteśmy przekierowani do root path
  }

  render() {
    return (
      <div>
        <Link to="/">Back</Link>
        <h3>Create a New Song</h3>
        <form onSubmit={this.onSubmit.bind(this)}>
          <label>Song Title:</label>
          <input
            onChange={event => this.setState({ title: event.target.value })}
            value={this.state.title}
          />
        </form>
      </div>
    );
  }
}

const mutation = gql`                 // GraphQL mutation przy użyciu helpera do queries i mutations - "gql"
  mutation AddSong($title: String){   // AddSong = name of the mutation, sami wymyślamy, nie zależne od backendu; // $title = name of parametr (zmienna, query variable); String = parametr type
    addSong(title: $title) {          // definiowane przez backend, wymagany tytuł; $title = można traktować jako zmienną, dostępną w całym naszym mutation
      title
    }
  }
`;

export default graphql(mutation)(SongCreate);  // połaączenie GrapQL z komponentem - teraz możemy podawać zmienne do naszych mutaions. 
                                               //Od teraz mamy dostęp do 'props.mutate' w komponencie
