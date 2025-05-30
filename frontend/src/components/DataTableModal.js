import React from 'react';
import './DataTableModal.css';

const DataTableModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const copyToClipboard = () => {
    const tableData = data.map(item => `${item.firstName}\t${item.lastName}\t${item.email}`).join('\n');
    navigator.clipboard.writeText(tableData).then(() => {
      alert('Table data copied to clipboard!');
    });
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Subscriber Contact Info</h2>
        <button className="copy-button" onClick={copyToClipboard}>Copy to Clipboard</button>
        <div className="table-wrapper"> {/* Wrapper for vertical scrolling */}
          <table className="data-table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTableModal;
