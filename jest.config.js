module.exports = {
  verbose: true,
  testEnvironment: "node",
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testRegex: '.*/__test__/.*.spec.(js|ts|tsx)?$',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      skipBabel: true
    }
  }
}
