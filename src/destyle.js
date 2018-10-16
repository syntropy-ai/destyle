import React, { Component } from 'react'

const flatten = arr => arr.reduce((a, b) => a.concat(b), [])

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
    styleFunc = (stylesObj, names, merge) => {
      // go through each name and parse the styles
      // providing props/state if a function
      const parsed = flatten(
        names.map(styleName => {
          return (styles[styleName] || []).map(style => {
            if (typeof style === 'function') {
              return style(this.props, this.state)
            } else {
              return style
            }
          })
        })
      )
      // append any merge preprocessed styles
      if (merge) {
        parsed.push(merge)
      }

      // convert to keys with style arrays
      const arrStyles = parsed.reduce(
        (result, styleObj) => {
          Object.keys(styleObj).forEach(k => {
            if (!result[k]) {
              result[k] = []
            }
            result[k].push(styleObj[k])
          })
          return result
        },
        {}
      )

      // do concatenation and put into styles prop
      Object.keys(arrStyles).forEach(k => {
        stylesObj[k] =
          arrStyles[k].length > 1
            ? config.concatenator(arrStyles[k])
            : arrStyles[k]
      })
    }

    render() {
      const { destyleNames, destyleMerge } = this.props
      const names = []
      if (destyleNames) {
        names.push(...destyleNames.split(' '))
      }
      if (name) {
        names.unshift(name)
      }

      // modify the styles object passed to the wrapped render
      if (names.length > 0 || destyleMerge) {
        this.styleFunc(
          this.props.styles,
          names,
          destyleMerge
        )
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

const setStyles = (name, styleObjOrFunc) => {
  styles[name] = [styleObjOrFunc]
}

const addStyles = (name, styleObjOrFunc) => {
  styles[name] = styles[name] || []
  styles[name].push(styleObjOrFunc)
}

export { destyle, setConcatenator, setStyles, addStyles }
