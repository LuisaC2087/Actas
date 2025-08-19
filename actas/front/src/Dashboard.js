import React from 'react';
import Navbar from './Navbar';
import HistorialMovimientos from './HistorialMovimientos';

export default function Dashboard({ token, setToken }) {
  return (
    <>
      <Navbar setToken={setToken} />
      <div className="p-6">
        <HistorialMovimientos token={token} setToken={setToken} />
      </div>
    </>
  );
}
