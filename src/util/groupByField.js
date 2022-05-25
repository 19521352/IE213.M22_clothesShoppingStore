module.exports = {
  groupByField: function (object, field) {
    return object.reduce((r, a) => {
      // console.log("a", a);
      function index(obj, i) { return obj[i] }
      // return field.split('.').reduce(index, a)
      r[field.split('.').reduce(index, a)] = [...r[(field.split('.').reduce(index, a))] || [], a];
      return r;
    }, {});
  }

};