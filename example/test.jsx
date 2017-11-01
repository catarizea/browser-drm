import React from 'react';
import ReactDOM from 'react-dom';
import browserDrm from '../dist';

const Hello = name => (
  <pre>{name}</pre>
);

const view = Hello(JSON.stringify(browserDrm, null, 4));

const element = document.getElementById('app');
ReactDOM.render(view, element);
