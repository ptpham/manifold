'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManifoldViewer = exports.DimensionEntry = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rcSlider = require('rc-slider');

var _rcSlider2 = _interopRequireDefault(_rcSlider);

var _turntableCamera = require('turntable-camera');

var _turntableCamera2 = _interopRequireDefault(_turntableCamera);

var _cartesian = require('cartesian');

var _cartesian2 = _interopRequireDefault(_cartesian);

var _glMatrix = require('gl-matrix');

var _rcSwitch = require('rc-switch');

var _rcSwitch2 = _interopRequireDefault(_rcSwitch);

require('./ManifoldViewer.css');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

require('rc-slider/assets/index.css');

require('rc-switch/assets/index.css');

require('./spinner.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SliderWithTooltip = _rcSlider2.default.createSliderWithTooltip(_rcSlider2.default);
var RangeWithTooltip = _rcSlider2.default.createSliderWithTooltip(_rcSlider.Range);

var DimensionEntry = exports.DimensionEntry = function (_React$Component) {
  _inherits(DimensionEntry, _React$Component);

  function DimensionEntry(props) {
    _classCallCheck(this, DimensionEntry);

    var _this = _possibleConstructorReturn(this, (DimensionEntry.__proto__ || Object.getPrototypeOf(DimensionEntry)).call(this));

    var _props$min = props.min,
        dimensionMin = _props$min === undefined ? 0 : _props$min,
        _props$max = props.max,
        dimensionMax = _props$max === undefined ? 1 : _props$max;

    var defaultLower = (dimensionMin + 2 * dimensionMax) / 3;
    var defaultUpper = (2 * dimensionMin + dimensionMax) / 3;
    _this.state = {
      active: false,
      interval: [defaultLower, defaultUpper]
    };

    _this._fireChange = _this._fireChange.bind(_this);
    return _this;
  }

  _createClass(DimensionEntry, [{
    key: 'getValue',
    value: function getValue(t) {
      var interval = this.state.interval;

      return (1 - t) * interval[0] + t * interval[1];
    }
  }, {
    key: '_fireChange',
    value: function _fireChange(change) {
      change = change || this.state;
      (this.props.onChange || _lodash2.default.identity)(change);
    }
  }, {
    key: '_changePartitionsActive',
    value: function _changePartitionsActive(value) {
      this.setState({ active: value }, this._fireChange);
    }
  }, {
    key: '_changeInterval',
    value: function _changeInterval(value) {
      if (this.isActive) {
        this.setState({ interval: value }, this._fireChange);
      } else {
        var delta = value - this.midpoint;
        var interval = this.state.interval;

        interval[0] += delta;
        interval[1] += delta;
        this.setState({ interval: interval }, this._fireChange);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          name = _props.name,
          _props$min2 = _props.min,
          dimensionMin = _props$min2 === undefined ? 0 : _props$min2,
          _props$max2 = _props.max,
          dimensionMax = _props$max2 === undefined ? 1 : _props$max2;
      var interval = this.state.interval;
      var isActive = this.isActive;

      var dimensionStep = (dimensionMax - dimensionMin) / 100;
      return _react2.default.createElement(
        'div',
        { className: 'manifold-dimension-entry' },
        _react2.default.createElement(
          'div',
          { className: 'manifold-dimension-control' },
          _react2.default.createElement(
            'div',
            { className: 'manifold-dimension-header' },
            _react2.default.createElement(
              'div',
              null,
              name
            ),
            _react2.default.createElement(_rcSwitch2.default, { checked: isActive, onChange: function onChange(value) {
                return _this2._changePartitionsActive(value);
              } })
          ),
          isActive ? _react2.default.createElement(RangeWithTooltip, { included: true, min: dimensionMin, max: dimensionMax,
            step: dimensionStep, value: interval,
            onChange: function onChange(value) {
              return _this2._changeInterval(value);
            } }) : _react2.default.createElement(SliderWithTooltip, { min: dimensionMin, max: dimensionMax, step: dimensionStep,
            value: this.midpoint, onChange: function onChange(value) {
              return _this2._changeInterval(value);
            } })
        ),
        _react2.default.createElement(
          'div',
          { className: 'manifold-dimension-value' },
          this.midpoint.toPrecision(2)
        )
      );
    }
  }, {
    key: 'isActive',
    get: function get() {
      return this.state.active;
    },
    set: function set(value) {
      this._changePartitionsActive(value);
    }
  }, {
    key: 'interval',
    get: function get() {
      return this.state.interval;
    }
  }, {
    key: 'midpoint',
    get: function get() {
      var interval = this.state.interval;

      return (interval[0] + interval[1]) / 2;
    }
  }]);

  return DimensionEntry;
}(_react2.default.Component);

var ManifoldViewer = exports.ManifoldViewer = function (_React$Component2) {
  _inherits(ManifoldViewer, _React$Component2);

  function ManifoldViewer() {
    _classCallCheck(this, ManifoldViewer);

    var _this3 = _possibleConstructorReturn(this, (ManifoldViewer.__proto__ || Object.getPrototypeOf(ManifoldViewer)).call(this));

    _this3.state = {
      dimensions: [],
      entries: []
    };

    _this3.view = _glMatrix.mat4.create();
    _this3.proj = _glMatrix.mat4.create();
    return _this3;
  }

  _createClass(ManifoldViewer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this4 = this;

      var canvas = this.canvas;

      this.gl = canvas.getContext('webgl');
      var camera = this.camera = new _turntableCamera2.default();
      camera.downwards = 0;
      camera.distance = 3;

      var mouseDown = false;
      this._mouseUp = function () {
        return _this4.setState({ mouseDown: false });
      };
      this._mouseDown = function () {
        return _this4.setState({ mouseDown: true });
      };
      this._mouseMove = function (e) {
        if (!_this4.state.mouseDown) return;

        var camera = _this4.camera;

        camera.rotation -= 0.005 * e.movementX;
        camera.downwards += 0.005 * e.movementY;
        camera.downwards = _lodash2.default.clamp(camera.downwards, -Math.PI / 4, Math.PI / 4);
        _this4._redraw();
      };

      canvas.addEventListener('mousedown', this._mouseDown);
      document.addEventListener('mouseup', this._mouseUp);
      document.addEventListener('mousemove', this._mouseMove);

      this._fireChange();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('mouseup', this._mouseUp);
      document.removeEventListener('mousemove', this._mouseMove);
    }
  }, {
    key: '_fireChange',
    value: function _fireChange() {
      var entries = this._generatePoints();
      (this.props.onChange || _lodash2.default.identity)(entries);
    }
  }, {
    key: '_cancelOutstanding',
    value: function _cancelOutstanding() {
      var onCancel = this.props.onCancel;

      if (!onCancel) return;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.state.entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var entry = _step.value;
          onCancel(entry);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: '_redraw',
    value: function _redraw() {
      var gl = this.gl,
          camera = this.camera,
          view = this.view,
          proj = this.proj,
          canvas = this.canvas,
          entries = this.state.entries;

      camera.view(view);

      var _canvas$getBoundingCl = canvas.getBoundingClientRect(),
          width = _canvas$getBoundingCl.width,
          height = _canvas$getBoundingCl.height;

      canvas.height = height;
      canvas.width = width;

      _glMatrix.mat4.perspective(proj, Math.PI / 4, width / height, 1, 100);
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      var context = { gl: gl, view: view, proj: proj };
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = entries[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var entry = _step2.value;

          if (!entry.render) continue;
          entry.render(context);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: '_generatePoints',
    value: function _generatePoints() {
      var _this5 = this;

      var _props2 = this.props,
          ranges = _props2.ranges,
          _props2$partitions = _props2.partitions,
          partitions = _props2$partitions === undefined ? 0 : _props2$partitions;
      var dimensions = this.state.dimensions;

      var values = [];

      this._cancelOutstanding();

      var _loop = function _loop(i) {
        var dimension = dimensions[i];
        var name = ranges[i].name;
        if (dimension == null) return {
            v: void 0
          };

        if (dimension.isActive && partitions > 0) {
          values.push(_lodash2.default.times(partitions + 1, function (j) {
            return _defineProperty({}, name, dimension.getValue(j / partitions));
          }));
        } else {
          values.push(_defineProperty({}, name, dimension.midpoint));
        }
      };

      for (var i = 0; i < ranges.length; i++) {
        var _ret = _loop(i);

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }

      var points = (0, _cartesian2.default)(values).map(function (x) {
        return _lodash2.default.merge.apply(_lodash2.default, _toConsumableArray(_lodash2.default.cloneDeep(x)));
      });
      var entries = _lodash2.default.map(points, function (point) {
        var result = { point: point };
        result.submit = function (render) {
          result.render = render;
          _this5.setState(function (state) {
            return state;
          }, function () {
            return _this5._redraw();
          });
        };

        return result;
      });

      this.setState({ entries: entries });
      return entries;
    }
  }, {
    key: '_renderDimensionEntry',
    value: function _renderDimensionEntry(range, i) {
      var _this6 = this;

      var dimensions = this.state.dimensions;

      var onChange = function onChange() {
        var madeChange = false;
        if (_lodash2.default.get(dimensions[i], 'isActive')) {
          for (var j = 0; j < dimensions.length; j++) {
            if (j == i || !dimensions[j].isActive) continue;
            dimensions[j].isActive = false;
            madeChange = true;
          }
        }

        if (!madeChange) _this6._fireChange();
      };
      return _react2.default.createElement(DimensionEntry, _extends({ key: i, ref: function ref(dimension) {
          return _this6.state.dimensions[i] = dimension;
        }
      }, range, { onChange: onChange }));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this7 = this;

      var ranges = this.props.ranges;

      return _react2.default.createElement(
        'div',
        { className: 'manifold-viewer' },
        _react2.default.createElement(
          'div',
          { className: 'manifold-dimension-list' },
          _lodash2.default.map(ranges, function (range, i) {
            return _this7._renderDimensionEntry(range, i);
          })
        ),
        _react2.default.createElement(
          'div',
          { className: 'manifold-viewer-main' },
          this.isLoading ? _react2.default.createElement('div', { className: 'manifold-spinner' }) : null,
          _react2.default.createElement('canvas', { ref: function ref(canvas) {
              return _this7.canvas = canvas;
            } })
        )
      );
    }
  }, {
    key: 'isLoading',
    get: function get() {
      return !_lodash2.default.every(this.state.entries, 'render');
    }
  }]);

  return ManifoldViewer;
}(_react2.default.Component);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9saWIvTWFuaWZvbGRWaWV3ZXIuanN4Il0sIm5hbWVzIjpbIlNsaWRlcldpdGhUb29sdGlwIiwiU2xpZGVyIiwiY3JlYXRlU2xpZGVyV2l0aFRvb2x0aXAiLCJSYW5nZVdpdGhUb29sdGlwIiwiUmFuZ2UiLCJEaW1lbnNpb25FbnRyeSIsInByb3BzIiwibWluIiwiZGltZW5zaW9uTWluIiwibWF4IiwiZGltZW5zaW9uTWF4IiwiZGVmYXVsdExvd2VyIiwiZGVmYXVsdFVwcGVyIiwic3RhdGUiLCJhY3RpdmUiLCJpbnRlcnZhbCIsIl9maXJlQ2hhbmdlIiwiYmluZCIsInQiLCJjaGFuZ2UiLCJvbkNoYW5nZSIsIl8iLCJpZGVudGl0eSIsInZhbHVlIiwic2V0U3RhdGUiLCJpc0FjdGl2ZSIsImRlbHRhIiwibWlkcG9pbnQiLCJuYW1lIiwiZGltZW5zaW9uU3RlcCIsIl9jaGFuZ2VQYXJ0aXRpb25zQWN0aXZlIiwiX2NoYW5nZUludGVydmFsIiwidG9QcmVjaXNpb24iLCJSZWFjdCIsIkNvbXBvbmVudCIsIk1hbmlmb2xkVmlld2VyIiwiZGltZW5zaW9ucyIsImVudHJpZXMiLCJ2aWV3IiwibWF0NCIsImNyZWF0ZSIsInByb2oiLCJjYW52YXMiLCJnbCIsImdldENvbnRleHQiLCJjYW1lcmEiLCJUdXJudGFibGVDYW1lcmEiLCJkb3dud2FyZHMiLCJkaXN0YW5jZSIsIm1vdXNlRG93biIsIl9tb3VzZVVwIiwiX21vdXNlRG93biIsIl9tb3VzZU1vdmUiLCJyb3RhdGlvbiIsImUiLCJtb3ZlbWVudFgiLCJtb3ZlbWVudFkiLCJjbGFtcCIsIk1hdGgiLCJQSSIsIl9yZWRyYXciLCJhZGRFdmVudExpc3RlbmVyIiwiZG9jdW1lbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiX2dlbmVyYXRlUG9pbnRzIiwib25DYW5jZWwiLCJlbnRyeSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwicGVyc3BlY3RpdmUiLCJ2aWV3cG9ydCIsImNsZWFyIiwiQ09MT1JfQlVGRkVSX0JJVCIsIkRFUFRIX0JVRkZFUl9CSVQiLCJjb250ZXh0IiwicmVuZGVyIiwicmFuZ2VzIiwicGFydGl0aW9ucyIsInZhbHVlcyIsIl9jYW5jZWxPdXRzdGFuZGluZyIsImkiLCJkaW1lbnNpb24iLCJwdXNoIiwidGltZXMiLCJnZXRWYWx1ZSIsImoiLCJsZW5ndGgiLCJwb2ludHMiLCJtYXAiLCJtZXJnZSIsImNsb25lRGVlcCIsIngiLCJyZXN1bHQiLCJwb2ludCIsInN1Ym1pdCIsInJhbmdlIiwibWFkZUNoYW5nZSIsImdldCIsIl9yZW5kZXJEaW1lbnNpb25FbnRyeSIsImlzTG9hZGluZyIsImV2ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBSUEsb0JBQW9CQyxtQkFBT0MsdUJBQVAsQ0FBK0JELGtCQUEvQixDQUF4QjtBQUNBLElBQUlFLG1CQUFtQkYsbUJBQU9DLHVCQUFQLENBQStCRSxlQUEvQixDQUF2Qjs7SUFFYUMsYyxXQUFBQSxjOzs7QUFDWCwwQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBOztBQUFBLHFCQUVzQ0EsS0FGdEMsQ0FFWEMsR0FGVztBQUFBLFFBRU5DLFlBRk0sOEJBRVMsQ0FGVDtBQUFBLHFCQUVzQ0YsS0FGdEMsQ0FFWUcsR0FGWjtBQUFBLFFBRWlCQyxZQUZqQiw4QkFFZ0MsQ0FGaEM7O0FBR2pCLFFBQUlDLGVBQWUsQ0FBQ0gsZUFBZSxJQUFFRSxZQUFsQixJQUFnQyxDQUFuRDtBQUNBLFFBQUlFLGVBQWUsQ0FBQyxJQUFFSixZQUFGLEdBQWlCRSxZQUFsQixJQUFnQyxDQUFuRDtBQUNBLFVBQUtHLEtBQUwsR0FBYTtBQUNYQyxjQUFRLEtBREc7QUFFWEMsZ0JBQVUsQ0FBQ0osWUFBRCxFQUFlQyxZQUFmO0FBRkMsS0FBYjs7QUFLQSxVQUFLSSxXQUFMLEdBQW1CLE1BQUtBLFdBQUwsQ0FBaUJDLElBQWpCLE9BQW5CO0FBVmlCO0FBV2xCOzs7OzZCQU1RQyxDLEVBQUc7QUFBQSxVQUNKSCxRQURJLEdBQ1MsS0FBS0YsS0FEZCxDQUNKRSxRQURJOztBQUVWLGFBQU8sQ0FBQyxJQUFJRyxDQUFMLElBQVFILFNBQVMsQ0FBVCxDQUFSLEdBQXNCRyxJQUFFSCxTQUFTLENBQVQsQ0FBL0I7QUFDRDs7O2dDQU9XSSxNLEVBQVE7QUFDbEJBLGVBQVNBLFVBQVUsS0FBS04sS0FBeEI7QUFDQSxPQUFDLEtBQUtQLEtBQUwsQ0FBV2MsUUFBWCxJQUF1QkMsaUJBQUVDLFFBQTFCLEVBQW9DSCxNQUFwQztBQUNEOzs7NENBRXVCSSxLLEVBQU87QUFDN0IsV0FBS0MsUUFBTCxDQUFjLEVBQUVWLFFBQVFTLEtBQVYsRUFBZCxFQUFpQyxLQUFLUCxXQUF0QztBQUNEOzs7b0NBRWVPLEssRUFBTztBQUNyQixVQUFJLEtBQUtFLFFBQVQsRUFBbUI7QUFDakIsYUFBS0QsUUFBTCxDQUFjLEVBQUVULFVBQVVRLEtBQVosRUFBZCxFQUFtQyxLQUFLUCxXQUF4QztBQUNELE9BRkQsTUFFTztBQUNMLFlBQUlVLFFBQVFILFFBQVEsS0FBS0ksUUFBekI7QUFESyxZQUVDWixRQUZELEdBRWMsS0FBS0YsS0FGbkIsQ0FFQ0UsUUFGRDs7QUFHTEEsaUJBQVMsQ0FBVCxLQUFlVyxLQUFmO0FBQ0FYLGlCQUFTLENBQVQsS0FBZVcsS0FBZjtBQUNBLGFBQUtGLFFBQUwsQ0FBYyxFQUFFVCxrQkFBRixFQUFkLEVBQTRCLEtBQUtDLFdBQWpDO0FBQ0Q7QUFDRjs7OzZCQUVRO0FBQUE7O0FBQUEsbUJBQ3NELEtBQUtWLEtBRDNEO0FBQUEsVUFDRHNCLElBREMsVUFDREEsSUFEQztBQUFBLCtCQUNLckIsR0FETDtBQUFBLFVBQ1VDLFlBRFYsK0JBQ3lCLENBRHpCO0FBQUEsK0JBQzRCQyxHQUQ1QjtBQUFBLFVBQ2lDQyxZQURqQywrQkFDZ0QsQ0FEaEQ7QUFBQSxVQUdESyxRQUhDLEdBR1ksS0FBS0YsS0FIakIsQ0FHREUsUUFIQztBQUFBLFVBSURVLFFBSkMsR0FJWSxJQUpaLENBSURBLFFBSkM7O0FBS1AsVUFBSUksZ0JBQWdCLENBQUNuQixlQUFlRixZQUFoQixJQUE4QixHQUFsRDtBQUNBLGFBQU87QUFBQTtBQUFBLFVBQUssV0FBVSwwQkFBZjtBQUNMO0FBQUE7QUFBQSxZQUFLLFdBQVUsNEJBQWY7QUFDRTtBQUFBO0FBQUEsY0FBSyxXQUFVLDJCQUFmO0FBQ0U7QUFBQTtBQUFBO0FBQU1vQjtBQUFOLGFBREY7QUFFRSwwQ0FBQyxrQkFBRCxJQUFRLFNBQVNILFFBQWpCLEVBQTJCLFVBQVUsa0JBQUNGLEtBQUQ7QUFBQSx1QkFBVSxPQUFLTyx1QkFBTCxDQUE2QlAsS0FBN0IsQ0FBVjtBQUFBLGVBQXJDO0FBRkYsV0FERjtBQU1JRSxxQkFDQSw4QkFBQyxnQkFBRCxJQUFrQixVQUFVLElBQTVCLEVBQWtDLEtBQUtqQixZQUF2QyxFQUFxRCxLQUFLRSxZQUExRDtBQUNFLGtCQUFNbUIsYUFEUixFQUN1QixPQUFPZCxRQUQ5QjtBQUVFLHNCQUFVO0FBQUEscUJBQVMsT0FBS2dCLGVBQUwsQ0FBcUJSLEtBQXJCLENBQVQ7QUFBQSxhQUZaLEdBREEsR0FJRSw4QkFBQyxpQkFBRCxJQUFtQixLQUFLZixZQUF4QixFQUFzQyxLQUFLRSxZQUEzQyxFQUF5RCxNQUFNbUIsYUFBL0Q7QUFDQSxtQkFBTyxLQUFLRixRQURaLEVBQ3NCLFVBQVU7QUFBQSxxQkFBUyxPQUFLSSxlQUFMLENBQXFCUixLQUFyQixDQUFUO0FBQUEsYUFEaEM7QUFWTixTQURLO0FBZUw7QUFBQTtBQUFBLFlBQUssV0FBVSwwQkFBZjtBQUEyQyxlQUFLSSxRQUFMLENBQWNLLFdBQWQsQ0FBMEIsQ0FBMUI7QUFBM0M7QUFmSyxPQUFQO0FBaUJEOzs7d0JBMURjO0FBQUUsYUFBTyxLQUFLbkIsS0FBTCxDQUFXQyxNQUFsQjtBQUEyQixLO3NCQUMvQlMsSyxFQUFPO0FBQUUsV0FBS08sdUJBQUwsQ0FBNkJQLEtBQTdCO0FBQXNDOzs7d0JBQzdDO0FBQUUsYUFBTyxLQUFLVixLQUFMLENBQVdFLFFBQWxCO0FBQTZCOzs7d0JBTy9CO0FBQUEsVUFDUEEsUUFETyxHQUNNLEtBQUtGLEtBRFgsQ0FDUEUsUUFETzs7QUFFYixhQUFPLENBQUNBLFNBQVMsQ0FBVCxJQUFjQSxTQUFTLENBQVQsQ0FBZixJQUE4QixDQUFyQztBQUNEOzs7O0VBMUJpQ2tCLGdCQUFNQyxTOztJQTJFN0JDLGMsV0FBQUEsYzs7O0FBQ1gsNEJBQWM7QUFBQTs7QUFBQTs7QUFFWixXQUFLdEIsS0FBTCxHQUFhO0FBQ1h1QixrQkFBWSxFQUREO0FBRVhDLGVBQVM7QUFGRSxLQUFiOztBQUtBLFdBQUtDLElBQUwsR0FBWUMsZUFBS0MsTUFBTCxFQUFaO0FBQ0EsV0FBS0MsSUFBTCxHQUFZRixlQUFLQyxNQUFMLEVBQVo7QUFSWTtBQVNiOzs7O3dDQUVtQjtBQUFBOztBQUFBLFVBQ1pFLE1BRFksR0FDRCxJQURDLENBQ1pBLE1BRFk7O0FBRWxCLFdBQUtDLEVBQUwsR0FBVUQsT0FBT0UsVUFBUCxDQUFrQixPQUFsQixDQUFWO0FBQ0EsVUFBSUMsU0FBUyxLQUFLQSxNQUFMLEdBQWMsSUFBSUMseUJBQUosRUFBM0I7QUFDQUQsYUFBT0UsU0FBUCxHQUFtQixDQUFuQjtBQUNBRixhQUFPRyxRQUFQLEdBQWtCLENBQWxCOztBQUVBLFVBQUlDLFlBQVksS0FBaEI7QUFDQSxXQUFLQyxRQUFMLEdBQWdCO0FBQUEsZUFBTSxPQUFLMUIsUUFBTCxDQUFjLEVBQUV5QixXQUFXLEtBQWIsRUFBZCxDQUFOO0FBQUEsT0FBaEI7QUFDQSxXQUFLRSxVQUFMLEdBQWtCO0FBQUEsZUFBTSxPQUFLM0IsUUFBTCxDQUFjLEVBQUV5QixXQUFXLElBQWIsRUFBZCxDQUFOO0FBQUEsT0FBbEI7QUFDQSxXQUFLRyxVQUFMLEdBQWtCLGFBQUs7QUFDckIsWUFBSSxDQUFDLE9BQUt2QyxLQUFMLENBQVdvQyxTQUFoQixFQUEyQjs7QUFETixZQUdmSixNQUhlLEdBR0osTUFISSxDQUdmQSxNQUhlOztBQUlyQkEsZUFBT1EsUUFBUCxJQUFtQixRQUFNQyxFQUFFQyxTQUEzQjtBQUNBVixlQUFPRSxTQUFQLElBQW9CLFFBQU1PLEVBQUVFLFNBQTVCO0FBQ0FYLGVBQU9FLFNBQVAsR0FBbUIxQixpQkFBRW9DLEtBQUYsQ0FBUVosT0FBT0UsU0FBZixFQUEwQixDQUFDVyxLQUFLQyxFQUFOLEdBQVMsQ0FBbkMsRUFBc0NELEtBQUtDLEVBQUwsR0FBUSxDQUE5QyxDQUFuQjtBQUNBLGVBQUtDLE9BQUw7QUFDRCxPQVJEOztBQVVBbEIsYUFBT21CLGdCQUFQLENBQXdCLFdBQXhCLEVBQXFDLEtBQUtWLFVBQTFDO0FBQ0FXLGVBQVNELGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLEtBQUtYLFFBQTFDO0FBQ0FZLGVBQVNELGdCQUFULENBQTBCLFdBQTFCLEVBQXVDLEtBQUtULFVBQTVDOztBQUVBLFdBQUtwQyxXQUFMO0FBQ0Q7OzsyQ0FFc0I7QUFDckI4QyxlQUFTQyxtQkFBVCxDQUE2QixTQUE3QixFQUF3QyxLQUFLYixRQUE3QztBQUNBWSxlQUFTQyxtQkFBVCxDQUE2QixXQUE3QixFQUEwQyxLQUFLWCxVQUEvQztBQUNEOzs7a0NBTWE7QUFDWixVQUFJZixVQUFVLEtBQUsyQixlQUFMLEVBQWQ7QUFDQSxPQUFDLEtBQUsxRCxLQUFMLENBQVdjLFFBQVgsSUFBdUJDLGlCQUFFQyxRQUExQixFQUFvQ2UsT0FBcEM7QUFDRDs7O3lDQUVvQjtBQUFBLFVBQ2I0QixRQURhLEdBQ0EsS0FBSzNELEtBREwsQ0FDYjJELFFBRGE7O0FBRW5CLFVBQUksQ0FBQ0EsUUFBTCxFQUFlO0FBRkk7QUFBQTtBQUFBOztBQUFBO0FBR25CLDZCQUFrQixLQUFLcEQsS0FBTCxDQUFXd0IsT0FBN0I7QUFBQSxjQUFTNkIsS0FBVDtBQUFzQ0QsbUJBQVNDLEtBQVQ7QUFBdEM7QUFIbUI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlwQjs7OzhCQUVTO0FBQUEsVUFDRnZCLEVBREUsR0FDcUQsSUFEckQsQ0FDRkEsRUFERTtBQUFBLFVBQ0VFLE1BREYsR0FDcUQsSUFEckQsQ0FDRUEsTUFERjtBQUFBLFVBQ1VQLElBRFYsR0FDcUQsSUFEckQsQ0FDVUEsSUFEVjtBQUFBLFVBQ2dCRyxJQURoQixHQUNxRCxJQURyRCxDQUNnQkEsSUFEaEI7QUFBQSxVQUNzQkMsTUFEdEIsR0FDcUQsSUFEckQsQ0FDc0JBLE1BRHRCO0FBQUEsVUFDdUNMLE9BRHZDLEdBQ3FELElBRHJELENBQzhCeEIsS0FEOUIsQ0FDdUN3QixPQUR2Qzs7QUFFUlEsYUFBT1AsSUFBUCxDQUFZQSxJQUFaOztBQUZRLGtDQUlnQkksT0FBT3lCLHFCQUFQLEVBSmhCO0FBQUEsVUFJRkMsS0FKRSx5QkFJRkEsS0FKRTtBQUFBLFVBSUtDLE1BSkwseUJBSUtBLE1BSkw7O0FBS1IzQixhQUFPMkIsTUFBUCxHQUFnQkEsTUFBaEI7QUFDQTNCLGFBQU8wQixLQUFQLEdBQWVBLEtBQWY7O0FBRUE3QixxQkFBSytCLFdBQUwsQ0FBaUI3QixJQUFqQixFQUF1QmlCLEtBQUtDLEVBQUwsR0FBUSxDQUEvQixFQUFrQ1MsUUFBTUMsTUFBeEMsRUFBZ0QsQ0FBaEQsRUFBbUQsR0FBbkQ7QUFDQTFCLFNBQUc0QixRQUFILENBQVksQ0FBWixFQUFlLENBQWYsRUFBa0JILEtBQWxCLEVBQXlCQyxNQUF6QjtBQUNBMUIsU0FBRzZCLEtBQUgsQ0FBUzdCLEdBQUc4QixnQkFBSCxHQUFzQjlCLEdBQUcrQixnQkFBbEM7O0FBRUEsVUFBSUMsVUFBVSxFQUFFaEMsTUFBRixFQUFNTCxVQUFOLEVBQVlHLFVBQVosRUFBZDtBQVpRO0FBQUE7QUFBQTs7QUFBQTtBQWFSLDhCQUFrQkosT0FBbEIsbUlBQTJCO0FBQUEsY0FBbEI2QixLQUFrQjs7QUFDekIsY0FBSSxDQUFDQSxNQUFNVSxNQUFYLEVBQW1CO0FBQ25CVixnQkFBTVUsTUFBTixDQUFhRCxPQUFiO0FBQ0Q7QUFoQk87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWlCVDs7O3NDQUVpQjtBQUFBOztBQUFBLG9CQUNpQixLQUFLckUsS0FEdEI7QUFBQSxVQUNWdUUsTUFEVSxXQUNWQSxNQURVO0FBQUEsdUNBQ0ZDLFVBREU7QUFBQSxVQUNGQSxVQURFLHNDQUNXLENBRFg7QUFBQSxVQUVWMUMsVUFGVSxHQUVLLEtBQUt2QixLQUZWLENBRVZ1QixVQUZVOztBQUdoQixVQUFJMkMsU0FBUyxFQUFiOztBQUVBLFdBQUtDLGtCQUFMOztBQUxnQixpQ0FPUEMsQ0FQTztBQVFkLFlBQUlDLFlBQVk5QyxXQUFXNkMsQ0FBWCxDQUFoQjtBQUNBLFlBQUlyRCxPQUFPaUQsT0FBT0ksQ0FBUCxFQUFVckQsSUFBckI7QUFDQSxZQUFJc0QsYUFBYSxJQUFqQixFQUF1QjtBQUFBO0FBQUE7O0FBRXZCLFlBQUlBLFVBQVV6RCxRQUFWLElBQXNCcUQsYUFBYSxDQUF2QyxFQUEwQztBQUN4Q0MsaUJBQU9JLElBQVAsQ0FBWTlELGlCQUFFK0QsS0FBRixDQUFRTixhQUFhLENBQXJCLEVBQXdCO0FBQUEsdUNBQVNsRCxJQUFULEVBQWdCc0QsVUFBVUcsUUFBVixDQUFtQkMsSUFBRVIsVUFBckIsQ0FBaEI7QUFBQSxXQUF4QixDQUFaO0FBQ0QsU0FGRCxNQUVPO0FBQ0xDLGlCQUFPSSxJQUFQLHFCQUFldkQsSUFBZixFQUFzQnNELFVBQVV2RCxRQUFoQztBQUNEO0FBaEJhOztBQU9oQixXQUFLLElBQUlzRCxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLE9BQU9VLE1BQTNCLEVBQW1DTixHQUFuQyxFQUF3QztBQUFBLHlCQUEvQkEsQ0FBK0I7O0FBQUE7QUFVdkM7O0FBRUQsVUFBSU8sU0FBUyx5QkFBVVQsTUFBVixFQUFrQlUsR0FBbEIsQ0FBc0I7QUFBQSxlQUFLcEUsaUJBQUVxRSxLQUFGLDRDQUFXckUsaUJBQUVzRSxTQUFGLENBQVlDLENBQVosQ0FBWCxFQUFMO0FBQUEsT0FBdEIsQ0FBYjtBQUNBLFVBQUl2RCxVQUFVaEIsaUJBQUVvRSxHQUFGLENBQU1ELE1BQU4sRUFBYyxpQkFBUztBQUNuQyxZQUFJSyxTQUFTLEVBQUVDLFlBQUYsRUFBYjtBQUNBRCxlQUFPRSxNQUFQLEdBQWdCLGtCQUFVO0FBQ3hCRixpQkFBT2pCLE1BQVAsR0FBZ0JBLE1BQWhCO0FBQ0EsaUJBQUtwRCxRQUFMLENBQWM7QUFBQSxtQkFBU1gsS0FBVDtBQUFBLFdBQWQsRUFBOEI7QUFBQSxtQkFBTSxPQUFLK0MsT0FBTCxFQUFOO0FBQUEsV0FBOUI7QUFDRCxTQUhEOztBQUtBLGVBQU9pQyxNQUFQO0FBQ0QsT0FSYSxDQUFkOztBQVVBLFdBQUtyRSxRQUFMLENBQWMsRUFBRWEsZ0JBQUYsRUFBZDtBQUNBLGFBQU9BLE9BQVA7QUFDRDs7OzBDQUVxQjJELEssRUFBT2YsQyxFQUFHO0FBQUE7O0FBQUEsVUFDeEI3QyxVQUR3QixHQUNULEtBQUt2QixLQURJLENBQ3hCdUIsVUFEd0I7O0FBRTlCLFVBQUloQixXQUFXLFNBQVhBLFFBQVcsR0FBTTtBQUNuQixZQUFJNkUsYUFBYSxLQUFqQjtBQUNBLFlBQUk1RSxpQkFBRTZFLEdBQUYsQ0FBTTlELFdBQVc2QyxDQUFYLENBQU4sRUFBcUIsVUFBckIsQ0FBSixFQUFzQztBQUNwQyxlQUFLLElBQUlLLElBQUksQ0FBYixFQUFnQkEsSUFBSWxELFdBQVdtRCxNQUEvQixFQUF1Q0QsR0FBdkMsRUFBNEM7QUFDMUMsZ0JBQUlBLEtBQUtMLENBQUwsSUFBVSxDQUFDN0MsV0FBV2tELENBQVgsRUFBYzdELFFBQTdCLEVBQXVDO0FBQ3ZDVyx1QkFBV2tELENBQVgsRUFBYzdELFFBQWQsR0FBeUIsS0FBekI7QUFDQXdFLHlCQUFhLElBQWI7QUFDRDtBQUNGOztBQUVELFlBQUksQ0FBQ0EsVUFBTCxFQUFpQixPQUFLakYsV0FBTDtBQUNsQixPQVhEO0FBWUEsYUFBTyw4QkFBQyxjQUFELGFBQWdCLEtBQUtpRSxDQUFyQixFQUF3QixLQUFLO0FBQUEsaUJBQWEsT0FBS3BFLEtBQUwsQ0FBV3VCLFVBQVgsQ0FBc0I2QyxDQUF0QixJQUEyQkMsU0FBeEM7QUFBQTtBQUE3QixTQUNEYyxLQURDLElBQ00sVUFBVTVFLFFBRGhCLElBQVA7QUFFRDs7OzZCQUVRO0FBQUE7O0FBQUEsVUFDRHlELE1BREMsR0FDVSxLQUFLdkUsS0FEZixDQUNEdUUsTUFEQzs7QUFFUCxhQUFPO0FBQUE7QUFBQSxVQUFLLFdBQVUsaUJBQWY7QUFDTDtBQUFBO0FBQUEsWUFBSyxXQUFVLHlCQUFmO0FBQ0l4RCwyQkFBRW9FLEdBQUYsQ0FBTVosTUFBTixFQUFjLFVBQUNtQixLQUFELEVBQU9mLENBQVA7QUFBQSxtQkFBYSxPQUFLa0IscUJBQUwsQ0FBMkJILEtBQTNCLEVBQWlDZixDQUFqQyxDQUFiO0FBQUEsV0FBZDtBQURKLFNBREs7QUFJTDtBQUFBO0FBQUEsWUFBSyxXQUFVLHNCQUFmO0FBQ0ksZUFBS21CLFNBQUwsR0FBaUIsdUNBQUssV0FBVSxrQkFBZixHQUFqQixHQUF1RCxJQUQzRDtBQUVFLG9EQUFRLEtBQUs7QUFBQSxxQkFBVSxPQUFLMUQsTUFBTCxHQUFjQSxNQUF4QjtBQUFBLGFBQWI7QUFGRjtBQUpLLE9BQVA7QUFTRDs7O3dCQWpHZTtBQUNkLGFBQU8sQ0FBQ3JCLGlCQUFFZ0YsS0FBRixDQUFRLEtBQUt4RixLQUFMLENBQVd3QixPQUFuQixFQUE0QixRQUE1QixDQUFSO0FBQ0Q7Ozs7RUE5Q2lDSixnQkFBTUMsUyIsImZpbGUiOiJNYW5pZm9sZFZpZXdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBTbGlkZXIsIHsgUmFuZ2UgfSBmcm9tICdyYy1zbGlkZXInO1xuaW1wb3J0IFR1cm50YWJsZUNhbWVyYSBmcm9tICd0dXJudGFibGUtY2FtZXJhJztcbmltcG9ydCBjYXJ0ZXNpYW4gZnJvbSAnY2FydGVzaWFuJztcbmltcG9ydCB7IG1hdDQgfSBmcm9tICdnbC1tYXRyaXgnO1xuaW1wb3J0IFN3aXRjaCBmcm9tICdyYy1zd2l0Y2gnO1xuaW1wb3J0ICcuL01hbmlmb2xkVmlld2VyLmNzcyc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5pbXBvcnQgJ3JjLXNsaWRlci9hc3NldHMvaW5kZXguY3NzJztcbmltcG9ydCAncmMtc3dpdGNoL2Fzc2V0cy9pbmRleC5jc3MnO1xuaW1wb3J0ICcuL3NwaW5uZXIuY3NzJztcblxubGV0IFNsaWRlcldpdGhUb29sdGlwID0gU2xpZGVyLmNyZWF0ZVNsaWRlcldpdGhUb29sdGlwKFNsaWRlcik7XG5sZXQgUmFuZ2VXaXRoVG9vbHRpcCA9IFNsaWRlci5jcmVhdGVTbGlkZXJXaXRoVG9vbHRpcChSYW5nZSk7XG5cbmV4cG9ydCBjbGFzcyBEaW1lbnNpb25FbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIoKTtcbiAgICBsZXQgeyBtaW46IGRpbWVuc2lvbk1pbiA9IDAsIG1heDogZGltZW5zaW9uTWF4ID0gMSB9ID0gcHJvcHM7XG4gICAgbGV0IGRlZmF1bHRMb3dlciA9IChkaW1lbnNpb25NaW4gKyAyKmRpbWVuc2lvbk1heCkvMztcbiAgICBsZXQgZGVmYXVsdFVwcGVyID0gKDIqZGltZW5zaW9uTWluICsgZGltZW5zaW9uTWF4KS8zO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBhY3RpdmU6IGZhbHNlLFxuICAgICAgaW50ZXJ2YWw6IFtkZWZhdWx0TG93ZXIsIGRlZmF1bHRVcHBlcl1cbiAgICB9O1xuXG4gICAgdGhpcy5fZmlyZUNoYW5nZSA9IHRoaXMuX2ZpcmVDaGFuZ2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGdldCBpc0FjdGl2ZSgpIHsgcmV0dXJuIHRoaXMuc3RhdGUuYWN0aXZlOyB9XG4gIHNldCBpc0FjdGl2ZSh2YWx1ZSkgeyB0aGlzLl9jaGFuZ2VQYXJ0aXRpb25zQWN0aXZlKHZhbHVlKTsgfVxuICBnZXQgaW50ZXJ2YWwoKSB7IHJldHVybiB0aGlzLnN0YXRlLmludGVydmFsOyB9XG5cbiAgZ2V0VmFsdWUodCkge1xuICAgIGxldCB7IGludGVydmFsIH0gPSB0aGlzLnN0YXRlO1xuICAgIHJldHVybiAoMSAtIHQpKmludGVydmFsWzBdICsgdCppbnRlcnZhbFsxXTtcbiAgfVxuXG4gIGdldCBtaWRwb2ludCgpIHtcbiAgICBsZXQgeyBpbnRlcnZhbCB9ID0gdGhpcy5zdGF0ZTtcbiAgICByZXR1cm4gKGludGVydmFsWzBdICsgaW50ZXJ2YWxbMV0pIC8gMjtcbiAgfVxuXG4gIF9maXJlQ2hhbmdlKGNoYW5nZSkge1xuICAgIGNoYW5nZSA9IGNoYW5nZSB8fCB0aGlzLnN0YXRlO1xuICAgICh0aGlzLnByb3BzLm9uQ2hhbmdlIHx8IF8uaWRlbnRpdHkpKGNoYW5nZSk7XG4gIH1cblxuICBfY2hhbmdlUGFydGl0aW9uc0FjdGl2ZSh2YWx1ZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmU6IHZhbHVlIH0sIHRoaXMuX2ZpcmVDaGFuZ2UpO1xuICB9XG5cbiAgX2NoYW5nZUludGVydmFsKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuaXNBY3RpdmUpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBpbnRlcnZhbDogdmFsdWUgfSwgdGhpcy5fZmlyZUNoYW5nZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBkZWx0YSA9IHZhbHVlIC0gdGhpcy5taWRwb2ludDtcbiAgICAgIGxldCB7IGludGVydmFsIH0gPSB0aGlzLnN0YXRlO1xuICAgICAgaW50ZXJ2YWxbMF0gKz0gZGVsdGE7XG4gICAgICBpbnRlcnZhbFsxXSArPSBkZWx0YTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBpbnRlcnZhbCB9LCB0aGlzLl9maXJlQ2hhbmdlKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHsgbmFtZSwgbWluOiBkaW1lbnNpb25NaW4gPSAwLCBtYXg6IGRpbWVuc2lvbk1heCA9IDEgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBsZXQgeyBpbnRlcnZhbCB9ID0gdGhpcy5zdGF0ZTtcbiAgICBsZXQgeyBpc0FjdGl2ZSB9ID0gdGhpcztcbiAgICBsZXQgZGltZW5zaW9uU3RlcCA9IChkaW1lbnNpb25NYXggLSBkaW1lbnNpb25NaW4pLzEwMDtcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJtYW5pZm9sZC1kaW1lbnNpb24tZW50cnlcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFuaWZvbGQtZGltZW5zaW9uLWNvbnRyb2xcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYW5pZm9sZC1kaW1lbnNpb24taGVhZGVyXCI+XG4gICAgICAgICAgPGRpdj57bmFtZX08L2Rpdj5cbiAgICAgICAgICA8U3dpdGNoIGNoZWNrZWQ9e2lzQWN0aXZlfSBvbkNoYW5nZT17KHZhbHVlKT0+IHRoaXMuX2NoYW5nZVBhcnRpdGlvbnNBY3RpdmUodmFsdWUpfSAvPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7IGlzQWN0aXZlID9cbiAgICAgICAgICA8UmFuZ2VXaXRoVG9vbHRpcCBpbmNsdWRlZD17dHJ1ZX0gbWluPXtkaW1lbnNpb25NaW59IG1heD17ZGltZW5zaW9uTWF4fVxuICAgICAgICAgICAgc3RlcD17ZGltZW5zaW9uU3RlcH0gdmFsdWU9e2ludGVydmFsfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3ZhbHVlID0+IHRoaXMuX2NoYW5nZUludGVydmFsKHZhbHVlKX0gLz5cbiAgICAgICAgICA6IDxTbGlkZXJXaXRoVG9vbHRpcCBtaW49e2RpbWVuc2lvbk1pbn0gbWF4PXtkaW1lbnNpb25NYXh9IHN0ZXA9e2RpbWVuc2lvblN0ZXB9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5taWRwb2ludH0gb25DaGFuZ2U9e3ZhbHVlID0+IHRoaXMuX2NoYW5nZUludGVydmFsKHZhbHVlKX0gLz5cbiAgICAgICAgfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hbmlmb2xkLWRpbWVuc2lvbi12YWx1ZVwiPnt0aGlzLm1pZHBvaW50LnRvUHJlY2lzaW9uKDIpfTwvZGl2PlxuICAgIDwvZGl2PjtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTWFuaWZvbGRWaWV3ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBkaW1lbnNpb25zOiBbXSxcbiAgICAgIGVudHJpZXM6IFtdXG4gICAgfTtcblxuICAgIHRoaXMudmlldyA9IG1hdDQuY3JlYXRlKCk7XG4gICAgdGhpcy5wcm9qID0gbWF0NC5jcmVhdGUoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGxldCB7IGNhbnZhcyB9ID0gdGhpcztcbiAgICB0aGlzLmdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJyk7XG4gICAgbGV0IGNhbWVyYSA9IHRoaXMuY2FtZXJhID0gbmV3IFR1cm50YWJsZUNhbWVyYSgpO1xuICAgIGNhbWVyYS5kb3dud2FyZHMgPSAwO1xuICAgIGNhbWVyYS5kaXN0YW5jZSA9IDM7XG5cbiAgICBsZXQgbW91c2VEb3duID0gZmFsc2U7XG4gICAgdGhpcy5fbW91c2VVcCA9ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBtb3VzZURvd246IGZhbHNlIH0pO1xuICAgIHRoaXMuX21vdXNlRG93biA9ICgpID0+IHRoaXMuc2V0U3RhdGUoeyBtb3VzZURvd246IHRydWUgfSk7XG4gICAgdGhpcy5fbW91c2VNb3ZlID0gZSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUubW91c2VEb3duKSByZXR1cm47XG5cbiAgICAgIGxldCB7IGNhbWVyYSB9ID0gdGhpcztcbiAgICAgIGNhbWVyYS5yb3RhdGlvbiAtPSAwLjAwNSplLm1vdmVtZW50WDtcbiAgICAgIGNhbWVyYS5kb3dud2FyZHMgKz0gMC4wMDUqZS5tb3ZlbWVudFk7XG4gICAgICBjYW1lcmEuZG93bndhcmRzID0gXy5jbGFtcChjYW1lcmEuZG93bndhcmRzLCAtTWF0aC5QSS80LCBNYXRoLlBJLzQpO1xuICAgICAgdGhpcy5fcmVkcmF3KCk7XG4gICAgfTtcblxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLl9tb3VzZURvd24pO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLl9tb3VzZVVwKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9tb3VzZU1vdmUpO1xuXG4gICAgdGhpcy5fZmlyZUNoYW5nZSgpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX21vdXNlVXApO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuX21vdXNlTW92ZSk7XG4gIH1cblxuICBnZXQgaXNMb2FkaW5nKCkge1xuICAgIHJldHVybiAhXy5ldmVyeSh0aGlzLnN0YXRlLmVudHJpZXMsICdyZW5kZXInKTtcbiAgfVxuXG4gIF9maXJlQ2hhbmdlKCkge1xuICAgIGxldCBlbnRyaWVzID0gdGhpcy5fZ2VuZXJhdGVQb2ludHMoKTtcbiAgICAodGhpcy5wcm9wcy5vbkNoYW5nZSB8fCBfLmlkZW50aXR5KShlbnRyaWVzKTtcbiAgfVxuXG4gIF9jYW5jZWxPdXRzdGFuZGluZygpIHtcbiAgICBsZXQgeyBvbkNhbmNlbCB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoIW9uQ2FuY2VsKSByZXR1cm47XG4gICAgZm9yIChsZXQgZW50cnkgb2YgdGhpcy5zdGF0ZS5lbnRyaWVzKSBvbkNhbmNlbChlbnRyeSk7XG4gIH1cblxuICBfcmVkcmF3KCkge1xuICAgIGxldCB7IGdsLCBjYW1lcmEsIHZpZXcsIHByb2osIGNhbnZhcywgc3RhdGU6IHsgZW50cmllcyB9IH0gPSB0aGlzOyBcbiAgICBjYW1lcmEudmlldyh2aWV3KTtcblxuICAgIGxldCB7IHdpZHRoLCBoZWlnaHQgfSA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoO1xuXG4gICAgbWF0NC5wZXJzcGVjdGl2ZShwcm9qLCBNYXRoLlBJLzQsIHdpZHRoL2hlaWdodCwgMSwgMTAwKTtcbiAgICBnbC52aWV3cG9ydCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG5cbiAgICBsZXQgY29udGV4dCA9IHsgZ2wsIHZpZXcsIHByb2ogfTtcbiAgICBmb3IgKGxldCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgICBpZiAoIWVudHJ5LnJlbmRlcikgY29udGludWU7XG4gICAgICBlbnRyeS5yZW5kZXIoY29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgX2dlbmVyYXRlUG9pbnRzKCkge1xuICAgIGxldCB7IHJhbmdlcywgcGFydGl0aW9ucyA9IDAgfSA9IHRoaXMucHJvcHM7XG4gICAgbGV0IHsgZGltZW5zaW9ucyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBsZXQgdmFsdWVzID0gW107XG5cbiAgICB0aGlzLl9jYW5jZWxPdXRzdGFuZGluZygpO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBkaW1lbnNpb24gPSBkaW1lbnNpb25zW2ldO1xuICAgICAgbGV0IG5hbWUgPSByYW5nZXNbaV0ubmFtZTtcbiAgICAgIGlmIChkaW1lbnNpb24gPT0gbnVsbCkgcmV0dXJuO1xuXG4gICAgICBpZiAoZGltZW5zaW9uLmlzQWN0aXZlICYmIHBhcnRpdGlvbnMgPiAwKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKF8udGltZXMocGFydGl0aW9ucyArIDEsIGogPT4gKHsgW25hbWVdOiBkaW1lbnNpb24uZ2V0VmFsdWUoai9wYXJ0aXRpb25zKSB9KSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWVzLnB1c2goeyBbbmFtZV06IGRpbWVuc2lvbi5taWRwb2ludCB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgcG9pbnRzID0gY2FydGVzaWFuKHZhbHVlcykubWFwKHggPT4gXy5tZXJnZSguLi5fLmNsb25lRGVlcCh4KSkpO1xuICAgIGxldCBlbnRyaWVzID0gXy5tYXAocG9pbnRzLCBwb2ludCA9PiB7XG4gICAgICBsZXQgcmVzdWx0ID0geyBwb2ludCB9O1xuICAgICAgcmVzdWx0LnN1Ym1pdCA9IHJlbmRlciA9PiB7XG4gICAgICAgIHJlc3VsdC5yZW5kZXIgPSByZW5kZXI7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoc3RhdGUgPT4gc3RhdGUsICgpID0+IHRoaXMuX3JlZHJhdygpKTtcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgZW50cmllcyB9KTtcbiAgICByZXR1cm4gZW50cmllcztcbiAgfVxuXG4gIF9yZW5kZXJEaW1lbnNpb25FbnRyeShyYW5nZSwgaSkge1xuICAgIGxldCB7IGRpbWVuc2lvbnMgfSA9IHRoaXMuc3RhdGU7XG4gICAgbGV0IG9uQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgbGV0IG1hZGVDaGFuZ2UgPSBmYWxzZTtcbiAgICAgIGlmIChfLmdldChkaW1lbnNpb25zW2ldLCAnaXNBY3RpdmUnKSkge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGRpbWVuc2lvbnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBpZiAoaiA9PSBpIHx8ICFkaW1lbnNpb25zW2pdLmlzQWN0aXZlKSBjb250aW51ZTtcbiAgICAgICAgICBkaW1lbnNpb25zW2pdLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgbWFkZUNoYW5nZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFtYWRlQ2hhbmdlKSB0aGlzLl9maXJlQ2hhbmdlKCk7XG4gICAgfTtcbiAgICByZXR1cm4gPERpbWVuc2lvbkVudHJ5IGtleT17aX0gcmVmPXtkaW1lbnNpb24gPT4gdGhpcy5zdGF0ZS5kaW1lbnNpb25zW2ldID0gZGltZW5zaW9uIH0gXG4gICAgICB7Li4ucmFuZ2V9IG9uQ2hhbmdlPXtvbkNoYW5nZX0vPjtcbiAgfVxuICBcbiAgcmVuZGVyKCkge1xuICAgIGxldCB7IHJhbmdlcyB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJtYW5pZm9sZC12aWV3ZXJcIj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFuaWZvbGQtZGltZW5zaW9uLWxpc3RcIj5cbiAgICAgICAgeyBfLm1hcChyYW5nZXMsIChyYW5nZSxpKSA9PiB0aGlzLl9yZW5kZXJEaW1lbnNpb25FbnRyeShyYW5nZSxpKSkgfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1hbmlmb2xkLXZpZXdlci1tYWluXCI+XG4gICAgICAgIHsgdGhpcy5pc0xvYWRpbmcgPyA8ZGl2IGNsYXNzTmFtZT1cIm1hbmlmb2xkLXNwaW5uZXJcIi8+IDogbnVsbCB9XG4gICAgICAgIDxjYW52YXMgcmVmPXtjYW52YXMgPT4gdGhpcy5jYW52YXMgPSBjYW52YXN9IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj47XG4gIH1cbn1cblxuXG4iXX0=