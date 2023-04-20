// ./src/api/order/routes/confirm-order.js

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/orders/confirm/:id",
      handler: "order.confirmOrder",
      config: {
        // policies: ["global::allowPublicAccess", "api::order.is-owner"],
        // attach the middleware
        middlewares: ["api::order.ratelimit"],
      },
    },
  ],
};
