import gql from 'graphql-tag';

export default gql`
  query SongQuery($id: ID!) {
    song(id: $id) {
      id
      title
      lyrics {        // gdy pobieramy piosenkę, pobieramy też od razu wszystkie linie tekstu z nią powiązane
        id            // pobieramy też id, aby mieć key gdy będziemy renderowac listę w React poprzez .map
        content
        likes         // liczba lików
      }
    }
  }
`;
