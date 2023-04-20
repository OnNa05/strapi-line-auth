"use strict";

const sanitize = require("@strapi/plugin-users-permissions/server/utils/sanitize");

const getService = (name) => {
  return strapi.plugin("users-permissions").service(name);
};

module.exports = {
  getService,
  sanitize,
};
