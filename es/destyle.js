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

var defaultConcatenator = function defaultConcatenator(styleList) {
  return styleList.join(' ');
};

// config
var config = {
  concatenator: defaultConcatenator

  // style cache
};var styles = {};

var setConcatenator = function setConcatenator(con) {
  return config.concatenator = con;
};

var styleFunc = function styleFunc(names, props) {
  // create merged value object
  var merged = names.reduce(function (obj, name) {
    var item = styles[name] || {};
    Object.keys(item).forEach(function (k) {
      obj[k] = obj[k] || [];
      obj[k] = obj[k].concat(item[k]);
    });
    return obj;
  }, {});

  // replace the value array with a prop getter
  return Object.keys(merged).reduce(function (obj, key) {
    return Object.defineProperty(obj, key, {
      get: function get$$1() {
        var styleList = merged[key].map(function (style) {
          if (typeof style === 'function') {
            return style(props);
          } else {
            return style;
          }
        });
        return config.concatenator(styleList);
      }
    });
  }, {});
};

var getDisplayName = function getDisplayName(WrappedComponent) {
  var defaultName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Component';

  // TODO: add error here for providing anonymous stateless components as we need a name if none is provided
  return WrappedComponent.displayName || WrappedComponent.name || defaultName;
};

var destyle = function destyle(TheComponent, name) {
  var HOCName = 'destyle(' + getDisplayName(TheComponent, name) + ')';

  var HOC = function HOC(_ref) {
    var _ref$destyleNames = _ref.destyleNames,
        destyleNames = _ref$destyleNames === undefined ? '' : _ref$destyleNames,
        rest = objectWithoutProperties(_ref, ['destyleNames']);

    var names = destyleNames.split(' ');
    names.unshift(name);

    return React.createElement(TheComponent, _extends({
      styles: styleFunc(names, rest)
    }, rest));
  };

  HOC.displayName = HOCName;

  return HOC;
};

var setStyles = function setStyles(name, styleObject) {
  styles[name] = styles[name] || {};
  var style = styles[name];
  Object.keys(styleObject).forEach(function (k) {
    style[k] = [styleObject[k]];
  });
};

var addStyles = function addStyles(name, styleObject) {
  var namespace = styles[name] || {};
  Object.keys(styleObject).forEach(function (k) {
    namespace[k] = namespace[k] || [];
    namespace[k].push(styleObject[k]);
  });
  styles[name] = namespace;
};

export { destyle, setConcatenator, setStyles, addStyles };
