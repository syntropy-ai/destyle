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

  const HOC = ({ stylerName = HOCName, ...rest }) => (
    <TheComponent
      styles={styleFunc(stylerName, rest)}
      {...rest}
    />
  )

  HOC.displayName = HOCName

  return HOC
}

const setStyles = (nameOrComponent, styleObject) => {
  const name =
    typeof nameOrComponent === 'string'
      ? nameOrComponent
      : getDisplayName(nameOrComponent)

  styles[name] = {
    ...styles[name],
    ...styleObject
  }
}

export { destyle, setStyles }
