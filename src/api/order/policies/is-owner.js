"use strict";
const utils = require("@strapi/utils");
const { PolicyError } = utils.errors;

/**
 * `is-owner` policy
 */

module.exports = async (policyContext, config, { strapi }) => {
  // Add your own logic here.
  strapi.log.info("In is-owner policy.");
  // console.log("---------policyContext-----------");
  // console.log(policyContext);

  const { id } = policyContext.request.params;
  const user = policyContext.state.user;
  const order = await strapi.entityService.findOne("api::order.order", id, {
    populate: ["owner"],
  });

  if (order.owner.id === user.id) {
    // Go ahead to excecute
    return true;
  }
  // Error thrown when condition not met
  throw new PolicyError("Thou shall not pass!");

  console.log({
    order_id: id,
    order,
    user_id: user.id,
  });

  return false;
};
