import React, {
  createContext,
  useState,
  useReducer,
  useContext
} from 'react'

const StyleContext = createContext()

const StyleProvider = ({ children, theme, reducer }) => {
  const value = reducer
    ? useReducer(reducer, theme)
    : useState(theme)

  return (
    <StyleContext.Provider value={value}>
      {children}
    </StyleContext.Provider>
  )
}

const useStyles = (key, props, ...extra) => {
  const [theme, updater] = useContext(StyleContext)
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

  if (typeof namespace === 'function') {
    return [namespace(props, ...extra), updater]
  } else {
    return [namespace, updater]
  }
}

const useClasses = useStyles

export { StyleProvider, useStyles, useClasses }
