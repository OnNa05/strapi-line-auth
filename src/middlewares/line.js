"use strict";
const axios = require("axios");
const utils = require("@strapi/utils");
const { ValidationError,NotFoundError,UnauthorizedError } = utils.errors;
const _ = require("lodash");

/**
 * `line` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // strapi.log.info("In line middleware. line");
    const isApiRoute = ctx.request.url.startsWith("/api");

    if (!isApiRoute) {
      await next();
      return;
    }

    const { authorization } = ctx.request.headers;

    const lineProfileApi = "https://api.line.me/v2/profile";

    try {
      const data = await axios({
        method: "get",
        url: lineProfileApi,
        headers: {
          Authorization: authorization,
        },
      });

      // console.log("User ID:", response.data.userId);
      // console.log("Display Name:", response.data.displayName);
      // console.log("Picture URL:", response.data.pictureUrl);
      // console.log("Status Message:", response.data.statusMessage);
      ctx.request.headers.authorization = `Bearer ${strapi.config.get(
        "server.env.LINE_TOKEN"
      )}`;
      return await next();
    } catch (error) {
      console.error("Error getting profile:", error.response.data.message);
      // if (error.response.status === 401) {
      //   throw new UnauthorizedError(error.response.data.message);
      // } else if (error.response.status === 403) {
      //   throw new ValidationError(error.response.data.message);
      // } else {
      //   throw new NotFoundError(error.response.data.message);
      // }
    }

    await next();
  };
};
