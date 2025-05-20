import React from 'react';
import './App.css';

import Menu from './moleculas/menu';

const App = () => {
  return (
    <div className='App'>
      <Menu />
      <div>
      <p className="arcoiris-text">© {new Date().getFullYear()} MANGOLOKO TODOS LOS DERECHOS RESERVADOS</p>
      </div>
    </div>
  );
};

export default App;
