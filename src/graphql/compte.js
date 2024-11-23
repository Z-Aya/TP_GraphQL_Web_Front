import { gql } from '@apollo/client';

// Requête GraphQL pour récupérer tous les comptes
export const GET_COMPTES = gql`
  query MyQuery {
    allComptes {
      dateCreation
      id
      solde
      type
    }
  }
`;

export const GET_COMPTE_BY_ID = gql`
  query GetCompteById($id: ID!) {
    compte(id: $id) {
    dateCreation
    id
    solde
    type
    }
}
`;

export const GET_COMPTE_BY_TYPE = gql`
  query GetCompteByType($type: String!) {
    comptes(type: $type) {
    dateCreation
    id
    solde
    type
    }
  }
`;