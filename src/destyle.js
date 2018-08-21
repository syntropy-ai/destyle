import React from 'react'

// style cache
const styles = {}

const styleFunc = (name, props) => {
  const item = styles[name] || {}
  const result = {}
  Object.keys(item).forEach(key => {
    Object.defineProperty(result, key, {
      get: function() {
        const style = item[key]
        if (typeof style === 'function') {
          return style(props)
        } else {
          return style
        }
      }
    })
  })
  return result
}

const getDisplayName = WrappedComponent => {
  // TODO: add error here for providing anonymous stateless components as we need a name if none is provided
  return (
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'
  )
}

const destyle = (TheComponent, name) => {
  const HOCName = `destyle(${name ||
    getDisplayName(TheComponent)})`

  const HOC = ({ destyleName = name, ...rest }) => (
    <TheComponent
      styles={styleFunc(destyleName, rest)}
      {...rest}
    />
  )

  HOC.displayName = HOCName

  return HOC
}

const setStyles = (name, styleObject) => {
  styles[name] = {
    ...styles[name],
    ...styleObject
  }
}

const addStyles = (name, styleObject) => {
  const namespace = styles[name]
  Object.keys(styleObject).forEach(k => {
    namespace[k] = {
      ...(namespace[k] || {}),
      ...styleObject[k]
    }
  })
}

export { destyle, setStyles, addStyles }
