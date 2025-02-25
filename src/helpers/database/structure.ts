import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var Model = mongoose.Model;
// import util from 'util';

/**
 * This code is taken from official mongoose repository
 * https://github.com/Automattic/mongoose/blob/master/lib/query.js#L1996-L2018
 */
/* istanbul ignore next */
function parseUpdateArguments(conditions, doc, options, callback) {
  if(typeof options === 'function') {
    // .update(conditions, doc, callback)
    callback = options;
    options = null;
  } else if(typeof doc === 'function') {
    // .update(doc, callback);
    callback = doc;
    doc = conditions;
    conditions = {};
    options = null;
  } else if(typeof conditions === 'function') {
    // .update(callback)
    callback = conditions;
    conditions = undefined;
    doc = undefined;
    options = undefined;
  } else if(typeof conditions === 'object' && !doc && !options && !callback) {
    // .update(doc)
    doc = conditions;
    conditions = undefined;
    options = undefined;
    callback = undefined;
  }

  var args = [];

  if(conditions) args.push(conditions);
  if(doc) args.push(doc);
  if(options) args.push(options);
  if(callback) args.push(callback);

  return args;
}

function parseIndexFields(options) {
  var indexFields = {
    deleted: false,
    deletedAt: false,
    deletedBy: false
  };

  if(!options.indexFields) {
    return indexFields;
  }

  if((typeof options.indexFields === 'string' || options.indexFields instanceof String) && options.indexFields === 'all') {
    indexFields.deleted = indexFields.deletedAt = indexFields.deletedBy = true;
  }

  if(typeof (options.indexFields) === 'boolean' && options.indexFields === true) {
    indexFields.deleted = indexFields.deletedAt = indexFields.deletedBy = true;
  }

  if(Array.isArray(options.indexFields)) {
    indexFields.deleted = options.indexFields.indexOf('deleted') > -1;
    indexFields.deletedAt = options.indexFields.indexOf('deletedAt') > -1;
    indexFields.deletedBy = options.indexFields.indexOf('deletedBy') > -1;
  }

  return indexFields;
}

function createSchemaObject(typeKey, typeValue, options) {
  options[typeKey] = typeValue;
  return options;
}


  /* eslint-disable camelcase */
  /* eslint-disable no-invalid-this */
export function generalStructure(schema) {
  var typeKey = schema.options.typeKey;
  schema.add({ created_at: createSchemaObject(typeKey, Date, { index: false }) });
  schema.add({ updated_at: createSchemaObject(typeKey, Date, { index: false }) });
  schema.pre('findOneAndUpdate', function() {
    this.findOneAndUpdate({}, { $set: { updated_at: new Date() } });
  });
  schema.pre('findByIdAndUpdate', function() {
    this.findByIdAndUpdate({}, { $set: { updated_at: new Date() } });
  });
  schema.pre('update', function() {
    this.update({}, { $set: { updated_at: new Date() } });
  });
  schema.pre('updateMany', function() {
    this.updateMany({}, { $set: { updated_at: new Date() } });
  });
  // schema.pre('updateOne', function() {
  //   if(typeof this.updated_at == 'undefined') {
  //     this.updateOne({}, { });
  //   } else {
  //     this.updateOne({}, { $set: { updated_at: new Date() } });
  //   }
  // });
  schema.pre('save', function(next) {
    if(typeof this.created_at == 'undefined') {
      this.created_at = new Date();
    }
    this.updated_at = new Date();
    next();
  });
  schema.pre('create', function(next) {
    this.created_at = new Date();
    this.updated_at = new Date();
    next();
  });
}
export function softDelete(schema, options) {
  options = options || {};
  var indexFields = parseIndexFields(options);

  var typeKey = schema.options.typeKey;
  schema.add({ created_at: createSchemaObject(typeKey, Date, { index: false }) });
  schema.add({ updated_at: createSchemaObject(typeKey, Date, { index: false }) });

  schema.add({ deleted: createSchemaObject(typeKey, Boolean, { default: false, index: indexFields.deleted }) });

  if(options.deletedAt === true) {
    schema.add({ deletedAt: createSchemaObject(typeKey, Date, { index: indexFields.deletedAt }) });
  }

  if(options.deletedBy === true) {
    schema.add({ deletedBy: createSchemaObject(typeKey, options.deletedByType || Schema.Types.ObjectId, { index: indexFields.deletedBy }) });
  }

  schema.pre('save', function(next) {
    if(!this.deleted) {
      this.deleted = false;
    }
    if(typeof this.created_at == 'undefined') {
      this.created_at = new Date();
    }
    this.updated_at = new Date();
    next();
  });
  schema.pre('findOneAndUpdate', function() {
    this.findOneAndUpdate({}, { updated_at: new Date() });
  });
  schema.pre('findByIdAndUpdate', function() {
    this.findByIdAndUpdate({}, { $set: { updated_at: new Date() } });
  });
  schema.pre('update', function() {
    this.update({}, { $set: { updated_at: new Date() } });
  });
  schema.pre('updateMany', function() {
    this.updateMany({}, { $set: { updated_at: new Date() } });
  });
  // schema.pre('updateOne', function() {
  //   if(typeof this.updated_at == 'undefined') {
  //     this.updateOne({}, { });
  //   } else {
  //     this.updateOne({}, { $set: { updated_at: new Date() } });
  //   }
  // });

  if(options.overrideMethods) {
    var overrideItems = options.overrideMethods;
    var overridableMethods = ['count', 'find', 'findOne', 'findOneAndUpdate', 'update'];
    var finalList = [];

    if((typeof overrideItems === 'string' || overrideItems instanceof String) && overrideItems === 'all') {
      finalList = overridableMethods;
    }

    if(typeof (overrideItems) === 'boolean' && overrideItems === true) {
      finalList = overridableMethods;
    }

    if(Array.isArray(overrideItems)) {
      overrideItems.forEach(function(method) {
        if(overridableMethods.indexOf(method) > -1) {
          finalList.push(method);
        }
      });
    }

    finalList.forEach(function(method) {
      /* eslint-disable prefer-rest-params */
      if(method === 'count' || method === 'find' || method === 'findOne') {
        schema.statics[method] = function() {
          return Reflect.apply(Model[method], this, arguments).where('deleted').ne(true);
        };
        schema.statics[`${method}Deleted`] = function() {
          return Reflect.apply(Model[method], this, arguments).where('deleted').ne(false);
        };
        schema.statics[`${method}WithDeleted`] = function() {
          return Reflect.apply(Model[method], this, arguments);
        };
      } else {
        schema.statics[method] = function() {
          var args = Reflect.apply(parseUpdateArguments, undefined, arguments);

          args[0].deleted = {'$ne': true};

          return Reflect.apply(Model[method], this, args);
        };

        schema.statics[`${method}Deleted`] = function() {
          var args = Reflect.apply(parseUpdateArguments, undefined, arguments);

          args[0].deleted = {'$ne': false};

          return Reflect.apply(Model[method], this, args);
        };

        schema.statics[`${method}WithDeleted`] = function() {
          return Reflect.apply(Model[method], this, arguments);
        };
      }
    });
  }

  schema.methods.delete = function(deletedBy, cb) {
    if(typeof deletedBy === 'function') {
      cb = deletedBy;
      deletedBy = null;
    }

    this.deleted = true;

    if(schema.path('deletedAt')) {
      this.deletedAt = new Date();
    }

    if(schema.path('deletedBy')) {
      this.deletedBy = deletedBy;
    }

    if(options.validateBeforeDelete === false) {
      return this.save({ validateBeforeSave: false }, cb);
    }

    return this.save(cb);
  };

  schema.statics.delete = function(conditions, deletedBy, callback) {
    if(typeof deletedBy === 'function') {
      callback = deletedBy;
      // conditions = conditions;
      deletedBy = null;
    } else if(typeof conditions === 'function') {
      callback = conditions;
      conditions = {};
      deletedBy = null;
    }

    var doc = {
      deleted: true,
      deletedAt: undefined,
      deletedBy: undefined
    };

    if(schema.path('deletedAt')) {
      doc.deletedAt = new Date();
    }

    if(schema.path('deletedBy')) {
      doc.deletedBy = deletedBy;
    }

    if(this.updateWithDeleted) {
      return this.updateWithDeleted(conditions, doc, { multi: true }, callback);
    } else {
      return this.update(conditions, doc, { multi: true }, callback);
    }
  };

  schema.methods.restore = function(callback) {
    this.deleted = false;
    this.deletedAt = undefined;
    this.deletedBy = undefined;
    return this.save(callback);
  };

  schema.statics.restore = function(conditions, callback) {
    if(typeof conditions === 'function') {
      callback = conditions;
      conditions = {};
    }

    var doc = {
      deleted: false,
      deletedAt: undefined,
      deletedBy: undefined
    };

    if(this.updateWithDeleted) {
      return this.updateWithDeleted(conditions, doc, { multi: true }, callback);
    } else {
      return this.update(conditions, doc, { multi: true }, callback);
    }
  };
};
