var moment = require('moment');
var qc = require('jsverify');
var assert = require('chai').assert;

function momentAfter(h, m, ref){
  var res = moment(ref).hours(h).minutes(m)
  if(res <= moment(ref)){ res.add(1, 'd'); }
  return res;
}

var prop = qc.property;
var hour = qc.nat(11);
var min  = qc.nat(23);
var time = qc.datetime();

describe('momentAfter', function(){
  prop('has the correct hours and minutes', hour, min, time, function(h, m, ref){
    var mo = momentAfter(h, m, moment(ref));
    assert.equal(mo.hours(), h);
    assert.equal(mo.minutes(), m);
    return true;
  });

  prop('is after the ref time', hour, min, time, function(h, m, ref){
    return moment(ref) <= momentAfter(h, m, moment(ref));
  });

  prop('is before the ref time + 1 day', hour, min, time, function(h, m, ref){
    return momentAfter(h, m, moment(ref)) <= moment(ref).add(1,'d');
  });
});
