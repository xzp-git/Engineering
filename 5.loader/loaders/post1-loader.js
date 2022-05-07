
function loader(source) {
  console.log('post1');
  return source + '//post1';
}
loader.pitch = function () {
  console.log('post1-pitch');
  // return 'post1-value';
}
module.exports = loader;