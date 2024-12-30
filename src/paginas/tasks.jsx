import React from 'react';
import Nav from '../assets/componentes/nav';
import Table from '../assets/componentes/table';
import Crear from '../assets/componentes/create'

function Tacks() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <p>No estás autenticado. Por favor, inicia sesión.</p>;
  }
  return (
    <>
    <Nav />
    <div className=''>
      <Crear />
      <Table />
    </div>
    </>
  );
    
}

export default Tacks;