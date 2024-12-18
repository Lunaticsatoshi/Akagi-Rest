module.exports = {
  extends: ['./node_modules/commitlint-config-gitmoji'],
  rules: {
    'scope-enum': [2, 'always', ['feat', 'fix', 'wip', 'chore', 'patch', 'build']],
  },
}
