'use strict';

module.exports = {
  up: function(app, next) {
    app.models.jobs.create([], next);
  },
  down: function(app, next) {
    app.models.jobs.destroyAll({}, next);
  },
};
