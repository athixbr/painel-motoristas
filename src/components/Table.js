import React from 'react';
import './Table.css';

function Table() {
  const drivers = [
    { plate: 'NFN1321', driver: 'LEONIDIO', status: 'LIBERADO' },
    { plate: 'AUL8534', driver: 'JULIANO', status: 'LIBERADO' },
  ];

  return (
    <table className="drivers-table">
      <thead>
        <tr>
          <th>Placa</th>
          <th>Motorista</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {drivers.map((driver, index) => (
          <tr key={index}>
            <td>{driver.plate}</td>
            <td>{driver.driver}</td>
            <td className="status">{driver.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
