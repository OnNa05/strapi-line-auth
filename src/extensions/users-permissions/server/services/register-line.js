"use strict";

const crypto = require("crypto");
const _ = require("lodash");
const utils = require("@strapi/utils");
const { getService } = require("@strapi/plugin-users-permissions/server/utils");
const {
  validateCallbackBody,
  validateRegisterBody,
  validateSendEmailConfirmationBody,
  validateForgotPasswordBody,
  validateResetPasswordBody,
  validateEmailConfirmationBody,
  validateChangePasswordBody,
} = require("@strapi/plugin-users-permissions/server/controllers/validation/auth");

const { getAbsoluteAdminUrl, getAbsoluteServerUrl, sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};

module.exports = ({ strapi }) => ({
  async registerLine(body) {
    const pluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });

    const settings = await pluginStore.get({ key: "advanced" });

    // ? settings.allow_register = true Why? and How to set it to false?
    // if (!settings.allow_register) {
    //   throw new ApplicationError("Register action is currently disabled");
    // }

    const params = {
      ..._.omit(body, [
        "confirmed",
        "blocked",
        "confirmationToken",
        "resetPasswordToken",
        "provider",
      ]),
      provider: "line",
    };

    // ? don't know how it works
    // await validateRegisterBody(params);

    const role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: settings.default_role } });

    if (!role) {
      throw new ApplicationError("Impossible to find the default role");
    }

    const { userId, displayName, pictureUrl, provider } = params;

    const identifierFilter = {
      $or: [{ email: `${userId}@line.com` }, { username: userId }],
    };

    const conflictingUserCount = await strapi
      .query("plugin::users-permissions.user")
      .count({
        where: { ...identifierFilter, provider },
      });

    if (conflictingUserCount > 0) {
      throw new ApplicationError("Line user Id are already taken");
    }

    // * think this is not needed
    // if (settings.unique_email) {
    //   const conflictingUserCount = await strapi
    //     .query("plugin::users-permissions.user")
    //     .count({
    //       where: { ...identifierFilter },
    //     });

    //   if (conflictingUserCount > 0) {
    //     throw new ApplicationError("Email or Username are already taken");
    //   }
    // }

    const newUser = {
      ...params,
      role: role.id,
      email: `${userId}@line.com`.toLowerCase(),
      username : userId,
      displayName: displayName,
      pictureUrl: pictureUrl,
      confirmed: true,
    };

    const user = await getService("user").add(newUser);

    return user;

    // * think this is not needed
    // const sanitizedUser = await sanitizeUser(user, ctx);

    // if (settings.email_confirmation) {
    //   try {
    //     await getService("user").sendConfirmationEmail(sanitizedUser);
    //   } catch (err) {
    //     throw new ApplicationError(err.message);
    //   }

    //   return ctx.send({ user: sanitizedUser });
    // }

    // const jwt = getService("jwt").issue(_.pick(user, ["id"]));

    // return ctx.send({
    //   jwt,
    //   user: sanitizedUser,
    // });
  },
});
