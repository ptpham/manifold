
import React, { Component } from 'react';
import { ManifoldViewer } from './lib/ManifoldViewer';
import './App.css';

class App extends Component {
  render() {
    let ranges = [
      { name: 'skew' },
      { name: 'theta0' },
      { name: 'theta1' },
    ];
    return (
      <div className="App">
        <ManifoldViewer ranges={ranges} />
      </div>
    );
  }
}

export default App;

