var resource = require('resource'),
    crud = require('./lib/crud'),
    jugglingdb = resource.define('jugglingdb');

jugglingdb.schema.description = "enables jugglingdb for resources";

//
// Enables a resource to persistence by
// creating a JugglingDB model to back the resource,
// allowing the resource to be instantiable and backed by a datasource
//
function enable (r, options) {

  if(typeof options === "string") {
    options = {
      type: options
    };
  }

  //
  // Require JugglingDB.Schema
  //
  var Schema = require('./vendor/jugglingdb').Schema,
      path = require('path');

  //
  // Create new JugglingDB schema, based on incoming datasource type
  //
  var _type = mappings[options.type] || options.type || 'fs';
  resource.use(options.type);
  crud(r);
  var schema = new Schema(_type, {
    database: options.name || "big",
    host: options.host,
    port: options.port,
    path: options.path || path.join(resource.helper.appDir, 'db'),
    username: options.username,
    password: options.password,
    options: options.options,
    https: true // TODO: check that HTTPS actually does something
  });

  //
  // Create empty schema object for mapping between resource and JugglingDB
  //
  var _schema = {};

  //
  // For every property in the resource schema, map the property to JugglingDB
  //
  Object.keys(r.schema.properties).forEach(function(p){
    var prop = r.schema.properties[p];
    _schema[p] = { type: jugglingType(prop) };
  });
  function jugglingType(prop) {
    var typeMap = {
      'string': String,
      'number': Number,
      'integer': Number,
      'array': JSON,
      'boolean': Boolean,
      'object': JSON,
      'null': null,
      'any': String
    };

    return typeMap[prop.type] || String;
  }

  //
  // Create a new JugglingDB schema based on temp schema
  //
  var Model = schema.define(r.name, _schema);

  // assign model to resource
  r.model = Model;
}

var mappings = {
  "couchdb": "cradle",
  "couch": "cradle"
};

//
// enable is not a resource method ( as we don't want to defer binding of CRUD methods while waiting for node-uuid dep )
//
jugglingdb.enable = enable;

jugglingdb.dependencies = {};

exports.jugglingdb = jugglingdb;