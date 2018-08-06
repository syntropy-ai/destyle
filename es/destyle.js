import React from 'react';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

// style cache
var styles = {};

var styleFunc = function styleFunc(name, props) {
  var item = styles[name] || {};
  var result = {};
  Object.keys(item).forEach(function (key) {
    Object.defineProperty(result, key, {
      get: function get$$1() {
        var style = item[key];
        if (typeof style === 'function') {
          return style(props);
        } else {
          return style;
        }
      }
    });
  });
  return result;
};

var getDisplayName = function getDisplayName(WrappedComponent) {
  // TODO: add error here for providing anonymous stateless components as we need a name if none is provided

  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
};

var destyle = function destyle(TheComponent, name) {
  var HOCName = 'destyle(' + (name || getDisplayName(TheComponent)) + ')';

  var HOC = function HOC(_ref) {
    var _ref$stylerName = _ref.stylerName,
        stylerName = _ref$stylerName === undefined ? HOCName : _ref$stylerName,
        rest = objectWithoutProperties(_ref, ['stylerName']);
    return React.createElement(TheComponent, _extends({
      styles: styleFunc(stylerName, rest)
    }, rest));
  };

  HOC.displayName = HOCName;

  return HOC;
};

var setStyles = function setStyles(nameOrComponent, styleObject) {
  var name = typeof nameOrComponent === 'string' ? nameOrComponent : getDisplayName(nameOrComponent);

  styles[name] = _extends({}, styles[name], styleObject);
};

export { destyle, setStyles };
