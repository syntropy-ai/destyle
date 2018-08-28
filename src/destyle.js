import React from 'react'

const defaultConcatenator = styleList => styleList.join(' ')

// config
const config = {
  concatenator: defaultConcatenator
}

// style cache
const styles = {}

const setConcatenator = con => (config.concatenator = con)

const styleFunc = (names, props) => {
  // create merged value object
  const merged = names.reduce((obj, name) => {
    const item = styles[name] || {}
    Object.keys(item).forEach(k => {
      obj[k] = obj[k] || []
      obj[k] = obj[k].concat(item[k])
    })
    return obj
  }, {})

  // replace the value array with a prop getter
  return Object.keys(merged).reduce((obj, key) => {
    return Object.defineProperty(obj, key, {
      get: function() {
        const styleList = merged[key].map(style => {
          if (typeof style === 'function') {
            return style(props, this)
          } else {
            return style
          }
        })
        return config.concatenator(styleList)
      }
    })
  }, {})
}

const getDisplayName = (
  WrappedComponent,
  defaultName = 'Component'
) => {
  // TODO: add error here for providing anonymous stateless components as we need a name if none is provided
  return (
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    defaultName
  )
}

const destyle = (TheComponent, name) => {
  const HOCName = `destyle(${getDisplayName(
    TheComponent,
    name
  )})`

  const HOC = ({ destyleNames = '', ...rest }) => {
    const names = destyleNames.split(' ')
    names.unshift(name)

    return (
      <TheComponent
        styles={styleFunc(names, rest)}
        {...rest}
      />
    )
  }

  HOC.displayName = HOCName

  return HOC
}

const setStyles = (name, styleObject) => {
  styles[name] = styles[name] || {}
  const style = styles[name]
  Object.keys(styleObject).forEach(k => {
    style[k] = [styleObject[k]]
  })
}

const addStyles = (name, styleObject) => {
  const namespace = styles[name] || {}
  Object.keys(styleObject).forEach(k => {
    namespace[k] = namespace[k] || []
    namespace[k].push(styleObject[k])
  })
  styles[name] = namespace
}

export { destyle, setConcatenator, setStyles, addStyles }
