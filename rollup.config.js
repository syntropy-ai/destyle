import babel from 'rollup-plugin-babel'

const config = {
  input: 'src/destyle.js',
  external: ['react'],
  output: {
    format: 'umd',
    name: 'destyle',
    globals: {
      react: 'React'
    }
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

export default config
