import React, {
  createContext,
  useState,
  useReducer,
  useContext
} from 'react'

const StyleContext = createContext()
const defaultConcatenator = (a, b) => `${a} ${b}`

const StyleProvider = ({
  children,
  theme,
  reducer,
  concatenatorProp = 'className',
  concatenator = defaultConcatenator
}) => {
  const value = reducer
    ? useReducer(reducer, theme)
    : useState(theme)

  return (
    <StyleContext.Provider
      value={[...value, concatenatorProp, concatenator]}
    >
      {children}
    </StyleContext.Provider>
  )
}

const useStyles = (key, props, ...extra) => {
  const [
    theme,
    updater,
    concatenatorProp,
    concatenator
  ] = useContext(StyleContext)
  const namespace = theme[key]

  if (!namespace) {
    console.warn(
      `Destyle: Attempting to use namespace (${key}) which does not exist on theme.`
    )
    return [{}, updater]
  }

  if (!props) {
    console.warn(
      `Destyle: No props were not passed to namespace (${key}). Try useStyles(${key}, props).`
    )
  }

  const styles =
    typeof namespace === 'function'
      ? namespace(props, ...extra)
      : namespace

  if (props[concatenatorProp]) {
    const overrides = props[concatenatorProp]
    const res = Object.keys(overrides).reduce((r, k) => {
      r[k] = concatenator(styles[k], overrides[k])
    }, {})
    return [{ ...styles, ...r }, updater]
  }

  return [styles, updater]
}

const useClasses = useStyles

export { StyleProvider, useStyles, useClasses }
