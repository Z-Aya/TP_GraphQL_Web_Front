import { gql } from '@apollo/client';

export const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions {
  getAllTransactions {
    id
    montant
    type
    dateTransaction
    compte {
      id
    }
  }
  }
`;

export const GET_TRANSACTIONS_BY_COMPTE = gql`
  query GetTransactionsByCompte($compteId: ID!) {
    transactions(compteId: $compteId) {
    dateTransaction
    id
    montant
    type
    compte {
      id
    }
    }
  }
`;
