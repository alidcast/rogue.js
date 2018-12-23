import typescript from 'rollup-plugin-typescript'
import pkg from './package.json'
import sourceMaps from 'rollup-plugin-sourcemaps'

const bundle = (name) => ({
  input: `${name}.ts`,
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
    ...Object.keys(pkg.peerDependencies || {}),
    ...Object.keys(pkg.optionalDependencies || {})
  ],
  plugins: [
    sourceMaps(),
    typescript()
  ]
})

export default [
  bundle('web/client'),
  bundle('web/server'),
  bundle('native-web/client'),
  bundle('native-web/server'),
  bundle('lib/rogue'),
  bundle('lib/utils'),
  bundle('lib/constants'),
]