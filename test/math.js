var qc = require('jsverify');
var prop = qc.property;
var assert = require('chai').assert;

var types = {
  int: qc.integer(),
  float: qc.nonshrink(qc.number()),
  "extreme float": qc.nonshrink(
    qc.number(-Number.MAX_VALUE/4, Number.MAX_VALUE/4).smap(
      function(n){return n*4;})),
};

var ops = {
  addition: function(x,y){return x+y},
  multiplication: function(x,y){return x*y},
};
var ids = {addition: 0, multiplication: 1};

var props = function(op, id){
  return {
    lident: function(n){
      return n == op(id, n);
    },
    rident: function(n){
      return n == op(n, id);
    },
    commute: function(x, y){
      return op(x,y) == op(y, x);
    },
    assoc: function(x, y, z){
      return op(x,op(y,z)) == op(op(x,y),z);
    },
  };
};

Object.keys(types).forEach(function(type){
  var gen = types[type];
  describe(type, function(){
    Object.keys(ops).forEach(function(op){
      var ps = props(ops[op], ids[op]);
      describe(op, function(){
        prop('obeys left identity', gen, ps.lident);
        prop('obeys right identity', gen, ps.rident);
        prop('obeys commutivity', gen, gen, ps.commute);
        prop('obeys associativity', gen, gen, gen, ps.assoc);
      });
    });
  });
});
