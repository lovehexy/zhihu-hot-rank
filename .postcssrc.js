module.exports = {
  map: false,
  plugins: [
    require('autoprefixer')({
      browsers: ['last 20 versions']
    }),
    require('cssnano')({
      reduceIdents: false,
      safe: true
    })
  ]
};
