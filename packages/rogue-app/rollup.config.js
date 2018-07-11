import typescript from 'rollup-plugin-typescript'
import pkg from './package.json'
import sourceMaps from 'rollup-plugin-sourcemaps'

const bundle = (name) => ({
  input: `lib/${name}/index.ts`,
  output: [
    {
      file: `dist/${name}.js`,
      format: 'cjs'
    },
    {
      file: `dist/${name}.es.js`,
      format: 'es'
    }
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    sourceMaps(),
    typescript()
  ]
})

export default [
  bundle('client'),
  bundle('server')
]