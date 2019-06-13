
import React from 'react';
import Slider, { Range } from 'rc-slider';
import TurntableCamera from 'turntable-camera';
import cartesian from 'cartesian';
import { mat4 } from 'gl-matrix';
import Switch from 'rc-switch';
import './ManifoldViewer.css';
import _ from 'lodash';

import 'rc-slider/assets/index.css';
import 'rc-switch/assets/index.css';
import './spinner.css';

let SliderWithTooltip = Slider.createSliderWithTooltip(Slider);
let RangeWithTooltip = Slider.createSliderWithTooltip(Range);

export class DimensionEntry extends React.Component {
  constructor(props) {
    super();
    let { min: dimensionMin = 0, max: dimensionMax = 1 } = props;
    let defaultLower = (dimensionMin + 2*dimensionMax)/3;
    let defaultUpper = (2*dimensionMin + dimensionMax)/3;
    this.state = {
      active: false,
      interval: [defaultLower, defaultUpper]
    };

    this._fireChange = this._fireChange.bind(this);
  }

  get isActive() { return this.state.active; }
  set isActive(value) { this._changePartitionsActive(value); }
  get interval() { return this.state.interval; }

  getValue(t) {
    let { interval } = this.state;
    return (1 - t)*interval[0] + t*interval[1];
  }

  get midpoint() {
    let { interval } = this.state;
    return (interval[0] + interval[1]) / 2;
  }

  _fireChange(change) {
    change = change || this.state;
    (this.props.onChange || _.identity)(change);
  }

  _changePartitionsActive(value) {
    this.setState({ active: value }, this._fireChange);
  }

  _changeInterval(value) {
    if (this.isActive) {
      this.setState({ interval: value }, this._fireChange);
    } else {
      let delta = value - this.midpoint;
      let { interval } = this.state;
      interval[0] += delta;
      interval[1] += delta;
      this.setState({ interval }, this._fireChange);
    }
  }

  render() {
    let { name, min: dimensionMin = 0, max: dimensionMax = 1 } = this.props;

    let { interval } = this.state;
    let { isActive } = this;
    let dimensionStep = (dimensionMax - dimensionMin)/100;
    return <div className="manifold-dimension-entry">
      <div className="manifold-dimension-control">
        <div className="manifold-dimension-header">
          <div>{name}</div>
          <Switch checked={isActive} onChange={(value)=> this._changePartitionsActive(value)} />
        </div>

        { isActive ?
          <RangeWithTooltip included={true} min={dimensionMin} max={dimensionMax}
            step={dimensionStep} value={interval}
            onChange={value => this._changeInterval(value)} />
          : <SliderWithTooltip min={dimensionMin} max={dimensionMax} step={dimensionStep}
            value={this.midpoint} onChange={value => this._changeInterval(value)} />
        }
      </div>
      <div className="manifold-dimension-value">{this.midpoint.toPrecision(2)}</div>
    </div>;
  }
}

export class ManifoldViewer extends React.Component {
  constructor() {
    super();
    this.state = {
      dimensions: [],
      entries: []
    };

    this.view = mat4.create();
    this.proj = mat4.create();
  }

  componentDidMount() {
    let { canvas } = this;
    this.gl = canvas.getContext('webgl');
    let camera = this.camera = new TurntableCamera();
    camera.downwards = 0;
    camera.distance = 4;

    let mouseDown = false;
    this._mouseUp = () => this.setState({ mouseDown: false });
    this._mouseDown = () => this.setState({ mouseDown: true });
    this._mouseMove = e => {
      if (!this.state.mouseDown) return;

      let { camera } = this;
      camera.rotation -= 0.005*e.movementX;
      camera.downwards += 0.005*e.movementY;
      camera.downwards = _.clamp(camera.downwards, -Math.PI/4, Math.PI/4);
      this._redraw();
    };

    canvas.addEventListener('mousedown', this._mouseDown);
    document.addEventListener('mouseup', this._mouseUp);
    document.addEventListener('mousemove', this._mouseMove);

    this._fireChange();
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this._mouseUp);
    document.removeEventListener('mousemove', this._mouseMove);
  }

  get isLoading() {
    return !_.every(this.state.entries, 'render');
  }

  _fireChange() {
    let entries = this._generatePoints();
    (this.props.onChange || _.identity)(entries);
  }

  _cancelOutstanding() {
    let { onCancel } = this.props;
    if (!onCancel) return;
    for (let entry of this.state.entries) onCancel(entry);
  }

  _redraw() {
    let { gl, camera, view, proj, canvas, state: { entries } } = this; 
    camera.view(view);

    let { width, height } = canvas.getBoundingClientRect();
    canvas.height = height;
    canvas.width = width;

    mat4.perspective(proj, Math.PI/4, width/height, 1, 100);
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let context = { gl, view, proj };
    for (let entry of entries) {
      if (!entry.render) continue;
      entry.render(context);
    }
  }

  _generatePoints() {
    let { ranges, partitions = 0 } = this.props;
    let { dimensions } = this.state;
    let values = [];

    this._cancelOutstanding();

    for (let i = 0; i < ranges.length; i++) {
      let dimension = dimensions[i];
      let name = ranges[i].name;
      if (dimension == null) return;

      if (dimension.isActive && partitions > 0) {
        values.push(_.times(partitions + 1, j => ({ [name]: dimension.getValue(j/partitions) })));
      } else {
        values.push({ [name]: dimension.midpoint });
      }
    }

    let points = cartesian(values).map(x => _.merge(..._.cloneDeep(x)));
    let entries = _.map(points, point => {
      let result = { point };
      result.submit = render => {
        result.render = render;
        this.setState(state => state, () => this._redraw());
      };

      return result;
    });

    this.setState({ entries });
    return entries;
  }

  _renderDimensionEntry(range, i) {
    let { dimensions } = this.state;
    let onChange = () => {
      let madeChange = false;
      if (_.get(dimensions[i], 'isActive')) {
        for (let j = 0; j < dimensions.length; j++) {
          if (j == i || !dimensions[j].isActive) continue;
          dimensions[j].isActive = false;
          madeChange = true;
        }
      }

      if (!madeChange) this._fireChange();
    };
    return <DimensionEntry key={i} ref={dimension => this.state.dimensions[i] = dimension } 
      {...range} onChange={onChange}/>;
  }
  
  render() {
    let { ranges } = this.props;
    return <div className="manifold-viewer">
      <div className="manifold-dimension-list">
        { _.map(ranges, (range,i) => this._renderDimensionEntry(range,i)) }
      </div>
      <div className="manifold-viewer-main">
        { this.isLoading ? <div className="manifold-spinner"/> : null }
        <canvas ref={canvas => this.canvas = canvas} />
      </div>
    </div>;
  }
}


