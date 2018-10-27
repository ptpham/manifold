
import React from 'react';
import Slider, { Range } from 'rc-slider';
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
  }

  get isActive() { return this.state.active; }
  get interval() { return this.state.interval; }

  componentWillReceiveProps(nextProps) {
    this.setState(this._processProps(nextProps));
  }

  _processProps(nextProps) {
    let result = { };
    if (nextProps.active != null) {
      result.active = nextProps.active;
    }
    return result;
  }

  get midpoint() {
    let { interval } = this.state;
    return (interval[0] + interval[1]) / 2;
  }

  _changePartitionsActive(value) {
    if (this.props.active == null) {
      this.setState({ active: value });
    } else {
      (this.props.onChangePartitionsActive || _.identity)(value);
    }
  }

  _changeInterval(value) {
    if (this.state.active) {
      this.setState({ interval: value });
    } else {
      let delta = value - this.midpoint;
      let { interval } = this.state;
      interval[0] += delta;
      interval[1] += delta;
      this.setState({ interval });
    }
  }

  render() {
    let { name, min: dimensionMin = 0, max: dimensionMax = 1 } = this.props;

    let { active, interval } = this.state;
    let dimensionStep = (dimensionMax - dimensionMin)/100;
    return <div className="manifold-dimension-entry">
      <div className="manifold-dimension-control">
        <div className="manifold-dimension-header">
          <div>{name}</div>
          <Switch checked={active} onChange={(value)=> this._changePartitionsActive(value)} />
        </div>

        { active ?
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
      actives: []
    };
  }

  get isLoading() {
    return false;
  }

  _renderDimensionEntry(range, i) {
    let { actives } = this.state;
    let onChangePartitionsActive = value => {
      actives.fill(0);
      actives[i] = value;
      this.setState({ actives });
    };
    return <DimensionEntry key={i} {...range} active={actives[i] || 0}
      onChangePartitionsActive={onChangePartitionsActive}/>;
  }
  
  render() {
    let { ranges } = this.props;
    return <div className="manifold-viewer">
      <div className="manifold-dimension-list">
        { _.map(ranges, (range,i) => this._renderDimensionEntry(range,i)) }
      </div>
      <div className="manifold-viewer-main">
        { this.isLoading ? <div className="manifold-spinner"/> : null }
        <canvas />
      </div>
    </div>;
  }
}


