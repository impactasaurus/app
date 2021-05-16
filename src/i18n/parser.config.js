module.exports = {
  keySeparator: false,
  namespaceSeparator: false,
  jsx: [
    {
      lexer: "JsxLexer",
      attr: "i18nKey",
    },
  ],
  locales: ["en"],
  output: "src/i18n/locales/$LOCALE/translation.json",
  sort: true,
  useKeysAsDefaultValue: true,
};
