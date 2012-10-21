var layout = require('./layout'),
    resource = require('resource');

module['exports'] = function (options, callback) {

  var $ = this.$;
  
  resource.replication.all(function(err, results){
    console.log(err, results);
    results.forEach(function(result){
      $('table').append('<tr><td>'+result.date+'</td><td>'+result.msg+'</td><td>'+result.author+'</td></tr>');
    });
    callback(null,  $.html());
  });

}