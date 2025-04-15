import React, { useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    fetch('http://localhost:5000/')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchData} disabled={loading}>
          {loading ? 'Loading...' : 'Get data'}
        </button>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date Created</th>
              <th>Analyze</th>
              <th>Important Question</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4">No data available</td>
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
