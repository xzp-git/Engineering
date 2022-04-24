let obj = {};
var ageValue = 10;

Object.defineProperty(obj, 'age', {
  /* writable: true,
  value: 11 */
  get() {
    return ageValue;
  },
  set(newValue) {
    ageValue = newValue;
  },
  enumerable: true,//for in 
  configurable: true///此属性是否可以通过delete obj.age;
});