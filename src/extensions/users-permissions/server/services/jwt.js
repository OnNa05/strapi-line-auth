"use strict";

/**
 * Jwt.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const _ = require("lodash");
const jwt = require("jsonwebtoken");
const registerLine = require("./register-line");
const axios = require("axios");
const utils = require("@strapi/utils");
const { ValidationError, NotFoundError, UnauthorizedError } = utils.errors;

module.exports = ({ strapi }) => ({
  getToken(ctx) {
    let token;

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const parts = ctx.request.header.authorization.split(/\s+/);

      if (parts[0].toLowerCase() !== "bearer" || parts.length !== 2) {
        return null;
      }

      token = parts[1];
    } else {
      return null;
    }

    return this.verify(token);
  },

  getLineToken(ctx) {
    let token;

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const parts = ctx.request.header.authorization.split(/\s+/);

      if (parts[0].toLowerCase() !== "bearer" || parts.length !== 2) {
        return null;
      }

      token = parts[1];
    } else {
      return null;
    }

    return this.verifyLine(token);
  },

  issue(payload, jwtOptions = {}) {
    _.defaults(jwtOptions, strapi.config.get("plugin.users-permissions.jwt"));
    return jwt.sign(
      _.clone(payload.toJSON ? payload.toJSON() : payload),
      strapi.config.get("plugin.users-permissions.jwtSecret"),
      jwtOptions
    );
  },

  verify(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        strapi.config.get("plugin.users-permissions.jwtSecret"),
        {},
        (err, tokenPayload = {}) => {
          if (err) {
            return reject(new Error("Invalid token."));
          }
          resolve(tokenPayload);
        }
      );
    });
  },

  verifyLine(token) {
    return new Promise(async (resolve, reject) => {
      const lineProfileApi = "https://api.line.me/v2/profile";
      let body;
      try {
        const data = await axios({
          method: "get",
          url: lineProfileApi,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("body:", data.data);
        body = data.data;
      } catch (error) {
        // console.error("Error code:", error.response.status);
        // console.error("Error getting profile:", error.response.data.message);
        return reject(new Error(error.response.data.message));
      }
      resolve(body);
    });
  },
});
