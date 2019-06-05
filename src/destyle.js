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
      `Destyle: attempting to use namespace (${key}) which does not exist on theme.`
    )
    return [{}, updater]
  }

  if (!props) {
    console.warn(
      `Destyle: props were not passed to namespace (${key}). Ensure useStyles(${key}, props).`
    )
  }

  return [namespace(props, ...extra), updater]
}

const useClasses = useStyles

export { StyleProvider, useStyles, useClasses }
