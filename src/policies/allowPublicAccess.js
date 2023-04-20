"use strict";

/**
 * `allowPublicAccess` policy
 */

module.exports = async (policyContext, config, { strapi }) => {
  strapi.log.info("In allowPublicAccess policy.");
  console.log("---------policyContext-----------");
  console.log(policyContext.state.user);
  const canDoSomething = true;

  if (canDoSomething) {
    return true;
  }

  return false;
};
