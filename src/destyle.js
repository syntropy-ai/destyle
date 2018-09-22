import React, { Component } from 'react'

const defaultConcatenator = styleList => styleList.join(' ')

// config
const config = {
  concatenator: defaultConcatenator
}

// style cache
const styles = {}

const setConcatenator = con => (config.concatenator = con)

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

const isStateless = component => {
  const proto = component.prototype || {}

  return (
    !component.isReactComponent &&
    !proto.isReactComponent &&
    !component.render &&
    !proto.render
  )
}

const destyle = (TheComponent, name) => {
  const compName = getDisplayName(TheComponent, name)
  const HOCName = `destyle(${compName})`

  if (!name) {
    console.warn(
      `destyle was applied to ${compName} without providing a namespace.`
    )
  }

  if (isStateless(TheComponent)) {
    const component = TheComponent
    TheComponent = class extends Component {
      render() {
        return component(this.props, this.context)
      }
    }
  }

  class InnerComponent extends TheComponent {
    styleFunc = (stylesObj, names) => {
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
      Object.keys(merged).forEach(key => {
        Object.defineProperty(stylesObj, key, {
          configurable: true,
          get: () => {
            const styleList = merged[key].map(style => {
              if (typeof style === 'function') {
                return style(this.props, this.state)
              } else {
                return style
              }
            })
            return config.concatenator(styleList)
          }
        })
      })
    }

    render() {
      const { destyleNames } = this.props
      const names = destyleNames
        ? destyleNames.split(' ')
        : []
      if (name) {
        names.unshift(name)
      }

      // modify the styles object passed to the wrapped render
      if (names.length > 0) {
        this.styleFunc(this.props.styles, names)
      }

      return super.render()
    }
  }

  class HOC extends Component {
    render() {
      return <InnerComponent styles={{}} {...this.props} />
    }
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
