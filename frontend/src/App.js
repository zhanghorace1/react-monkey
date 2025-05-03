import React, { useState } from 'react';
import './App.css';
import PasswordGate from './PasswordGate';
import DataTableModal from './components/DataTableModal';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [dataFetched, setDataFetched] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000/'
          : process.env.REACT_APP_API_URL || 'http://localhost:5000/'
      );
      const data = await response.json();
      setData(data);

      // Play sound effect when data loads
      const audio = new Audio(require('./sound/Batman_Transition_Sound_Effect.mp3'));
      audio.play();

      // Disable button after successful fetch
      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  return (
    <PasswordGate correctPassword={process.env.REACT_APP_PASSWORD_GATE}>
      <div className="App">
        <header className="App-header">
          <h1 id="header-title">Common Impact Surveys</h1>
          <div className="button-group">
            <button id="play-air-horn-button" onClick={() => {
              const audio = new Audio(require('./sound/Air_Horn_Sound.mp3'));
              audio.play();
            }}>
              🎺
            </button>
            <button id="fetch-data-button" onClick={fetchData} disabled={loading || dataFetched}>
              {loading ? 'Loading...' : 'Get data 🐵'}
            </button>
            <button id="play-batman-button" onClick={() => {
              const audio = new Audio(require('./sound/Batman_Transition_Sound_Effect.mp3'));
              audio.play();
            }}>
              🦇
            </button>
          </div>
          <table id="data-table" className="data-table">
            <thead>
              <tr>
              <th id="id-column">
                  <div className="table-header">
                    <span>Survey ID</span>
                    <div className="sort-buttons">
                      <button id="sort-title-button" onClick={() => sortData('id')}>⬆⬇</button>
                    </div>
                  </div>
                </th>
                <th id="title-column">
                  <div className="table-header">
                    <span>Title</span>
                    <div className="sort-buttons">
                      <button id="sort-title-button" onClick={() => sortData('title')}>⬆⬇</button>
                    </div>
                  </div>
                </th>
                <th id="date-created-column">
                  <div className="table-header">
                    <span>Date Created</span>
                    <div className="sort-buttons">
                      <button id="sort-date-created-button" onClick={() => sortData('date_created')}>⬆⬇</button>
                    </div>
                  </div>
                </th>
                <th id="analyze-column">Analyze</th>
                <th id="important-question-column">
                  <div className="table-header">
                    <span>Important Question</span>
                    <div className="sort-buttons">
                      <button id="sort-important-question-button" onClick={() => sortData('has_important_question')}>⬆⬇</button>
                    </div>
                  </div>
                </th>
                <th id="view-contacts-column">View Contacts</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr id="no-data-row">
                  <td colSpan="4">No data available, please click "Get data" button</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index} id={`data-row-${index}`}>
                    <td id={`data-id-${index}`}>{item.id}</td>
                    <td id={`data-title-${index}`}>{item.title}</td>
                    <td id={`data-date-created-${index}`}>{new Date(item.date_created).toLocaleDateString()}</td>
                    <td id={`data-analyze-${index}`}>
                      <a href={item.analyze_url} target="_blank" rel="noopener noreferrer">View</a>
                    </td>
                    <td id={`data-important-question-${index}`}>{item.has_important_question ? "Yes" : "No"}</td>
                    <td id={`data-view-contacts-${index}`}>
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch(
                              process.env.NODE_ENV === 'development'
                              ? `http://localhost:5000/survey-results/${item.id}`
                              : `${process.env.REACT_APP_API_URL}/survey-results/${item.id}` || `http://localhost:5000/survey-results/${item.id}`
                            );
                            const results = await response.json();
                            setModalData(results);
                            setIsModalOpen(true);
                          } catch (error) {
                            console.error('Error fetching survey results:', error);
                          }
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </header>
        <DataTableModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={modalData}
        />
      </div>
    </PasswordGate>
  );
}

export default App;
