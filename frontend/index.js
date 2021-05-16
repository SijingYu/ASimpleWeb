import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import '@/common/assets/styles/normalize.scss';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <BrowserRouter>
      <App></App>
    </BrowserRouter>,
  document.getElementById('root'));
registerServiceWorker();

