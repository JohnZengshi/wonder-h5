export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-pxtorem": {
      rootValue: 37.5,
      propList: ["*"],
      exclude: (path) => {
        // console.log(path);
        return false;
      },
    },
  },
};
