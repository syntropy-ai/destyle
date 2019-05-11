import React, {
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

  const result = Object.keys(namespace).reduce((r, k) => {
    r[k] = namespace[k](props, ...extra)
    return r
  }, {})

  return [result, updater]
}

const useClasses = useStyles

export { StyleProvider, useStyles, useClasses }
