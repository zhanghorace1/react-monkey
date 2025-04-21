import React, { useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [dataFetched, setDataFetched] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(process.env.REACT_APP_API_URL || 'http://localhost:5000/');
      // const response = await fetch('http://localhost:5000/');
      console.log(response)
      const data = await response.json();
      setData(data);

      // Play sound effect when data loads
      const audio = new Audio(require('./Batman_Transition_Sound_Effect.mp3'));
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
    <div className="App">
      <header className="App-header">
        <h1>Common Impact Surveys</h1>
        <button onClick={fetchData} disabled={loading || dataFetched}>
          {loading ? 'Loading...' : 'Get data 🐵'}
        </button>
        <table className="data-table">
          <thead>
            <tr>
              <th>
                <div className="table-header">
                  <span>Title</span>
                  <div className="sort-buttons">
                    <button onClick={() => sortData('title')}>⬆⬇</button>
                  </div>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <span>Date Created</span>
                  <div className="sort-buttons">
                    <button onClick={() => sortData('date_created')}>⬆⬇</button>
                  </div>
                </div>
              </th>
              <th>Analyze</th>
              <th>
                <div className="table-header">
                  <span>Important Question</span>
                  <div className="sort-buttons">
                    <button onClick={() => sortData('has_important_question')}>⬆⬇</button>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4">No data available, please click "Get data" button</td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
                  <td>{new Date(item.date_created).toLocaleDateString()}</td>
                  <td><a href={item.analyze_url} target="_blank" rel="noopener noreferrer">View</a></td>
                  <td>{item.has_important_question ? "Yes" : "No"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
