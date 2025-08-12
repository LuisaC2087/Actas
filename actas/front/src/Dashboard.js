import React from 'react';
import Navbar from './Navbar';

export default function Dashboard({ token, setToken }) {
  return (
    <>
      <Navbar setToken={setToken} />
    </>
  );
}
