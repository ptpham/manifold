
import React, { Component } from 'react';
import { ManifoldViewer } from './lib/ManifoldViewer';
import createGeometry from 'gl-geometry';
import createShader from 'gl-shader';
import { vec3 } from 'gl-matrix';
import './App.css';

let vsShader = `

attribute vec3 position;

uniform mat4 view, proj;

void main() {
  gl_Position = proj*view*vec4(position, 1.0);
}

`;

let fsShader = `
precision mediump float;

void main() {
  gl_FragColor = vec4(1.,1.,1.,1.);
}

`;

function makeRender(params) {
  let state = null;
  
  return ({ gl, view, proj }) => {
    if (state == null) {
      let point = vec3.fromValues(params['x-coord'], params['y-coord'], params['z-coord']);
      vec3.normalize(point, point);

      let geometry = createGeometry(gl).attr('position', [vec3.create(), point]);
      let shader = createShader(gl, vsShader, fsShader);
      state = { geometry, shader };
    }

    let { geometry, shader } = state;
    geometry.bind(shader);
    shader.uniforms.view = view;
    shader.uniforms.proj = proj;
    geometry.draw(gl.LINES);
  };
}

class App extends Component {
  render() {
    let ranges = [
      { name: 'x-coord' },
      { name: 'y-coord' },
      { name: 'z-coord' },
    ];

    let onChange = entries => {
      for (let entry of entries) {
        entry.submit(makeRender(entry.point));
      }
    };

    return (
      <div className="App">
        <ManifoldViewer ranges={ranges} onChange={onChange} partitions={8} />
      </div>
    );
  }
}

export default App;

