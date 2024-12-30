import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/style/output.css';
import App from './paginas/App';
import Registrar from './paginas/registrar';
import Tasks from './paginas/tasks';


import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <Tasks />
              </PrivateRoute>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);


