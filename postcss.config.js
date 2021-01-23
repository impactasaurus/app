module.exports = {
    plugins: [
      [
        "postcss-preset-env", {
          browsers: [ ">0.5%", "not op_mini all", "ie 11"]
        },
      ],
    ],
  };