import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery } from '@apollo/client';
import { GET_COMPTES } from './graphql/compte';
import { GET_ALL_TRANSACTIONS } from './graphql/transactions';
import './App.css';

// Config client Apollo
const client = new ApolloClient({
  uri: 'http://localhost:8082/graphiql', 
  cache: new InMemoryCache(),
});

function App() {
  const { data: comptesData, loading: comptesLoading } = useQuery(GET_COMPTES);
  const { data: transactionsData, loading: transactionsLoading } = useQuery(GET_ALL_TRANSACTIONS);

  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchType, setSearchType] = useState('');
  const [filteredComptes, setFilteredComptes] = useState(null);
  const [filteredTransactions, setFilteredTransactions] = useState(null);

  const renderComptes = () => {
    if (comptesLoading) return <div className="loader">Chargement des comptes...</div>;
    if (comptesData) {
      const comptesToDisplay = filteredComptes || comptesData.allComptes;
      return (
        <div className="section">
          {comptesToDisplay.map((compte) => (
            <div key={compte.id} className="list-item">
              <strong>{compte.type}</strong>
              <p>Solde: {compte.solde}</p>
              <p>Créé le: {compte.dateCreation}</p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderTransactions = () => {
    if (transactionsLoading) return <div className="loader">Chargement des transactions...</div>;
    if (transactionsData) {
      const transactionsToDisplay = filteredTransactions || transactionsData.getAllTransactions;
      return (
        <div className="section">
          {transactionsToDisplay.map((transaction) => (
            <div key={transaction.id} className="list-item">
              <strong>{transaction.type}</strong>
              <p>Montant: {transaction.montant}</p>
              <p>Date: {transaction.dateTransaction}</p>
              <p>Compte: {transaction.compte.id}</p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleSearchById = () => {
    const compte = comptesData.allComptes.find(compte => compte.id === searchId);
    setSearchResult(compte || 'Aucun compte trouvé avec cet ID');
  };

  const handleSearchByType = () => {
    if (!searchType) {
      setFilteredComptes(null);
    } else {
      const filtered = comptesData.allComptes.filter(compte => compte.type === searchType);
      setFilteredComptes(filtered);
    }
  };

  const handleSearchTransactionsById = () => {
    if (!searchId) {
      setFilteredTransactions(null);
    } else {
      const filtered = transactionsData.getAllTransactions.filter(transaction => transaction.compte.id === searchId);
      setFilteredTransactions(filtered);
    }
  };

  const renderSearchResult = () => {
    if (!searchResult) return null;
    if (typeof searchResult === 'string') {
      return <div className="loader">{searchResult}</div>;
    }
    return (
      <div className="result">
        <h3>Résultat de la recherche</h3>
        <p><strong>ID:</strong> {searchResult.id}</p>
        <p><strong>Type:</strong> {searchResult.type}</p>
        <p><strong>Solde:</strong> {searchResult.solde}</p>
        <p><strong>Date de création:</strong> {searchResult.dateCreation}</p>
      </div>
    );
  };

  return (
    <ApolloProvider client={client}>
      <div className="container">
        {/* Barre de titre en violet */}
        <header className="header-bar">
          <h1 className="header-title">Comptes et Transactions</h1>
        </header>

        <div className="header">
          <h1 className="title">Comptes</h1>
          <div className="search-section">
            <select
              className="dropdown"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="">TOUT</option>
              <option value="EPARGNE">EPARGNE</option>
              <option value="COURANT">COURANT</option>
            </select>
            <button className="button" onClick={handleSearchByType}>
              Rechercher par Type
            </button>
          </div>
        </div>

        <div className="section">
          {renderComptes()}
        </div>

        <h2 className="heading">Transactions</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par ID de compte"
            className="input"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button className="button" onClick={handleSearchTransactionsById}>
            Rechercher par ID compte
          </button>
        </div>

        <div className="section">
          {renderTransactions()}
        </div>

        {renderSearchResult()}
      </div>
    </ApolloProvider>
  );
}

export default App;
