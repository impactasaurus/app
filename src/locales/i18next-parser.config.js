module.exports = {
  keySeparator: false,
  namespaceSeparator: false,
  jsx: [{
    lexer: 'JsxLexer',
    attr: 'i18nKey',
  }],
  locales: ['en', 'pt', 'cy'],
  output: 'src/locales/$LOCALE.json',
  sort: true,
  useKeysAsDefaultValue: true
}
