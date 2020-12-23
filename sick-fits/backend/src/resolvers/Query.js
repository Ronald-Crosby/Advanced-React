const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  currentUser(parent, args, ctx, info) {
    // check if there is a current user in the request (we set this in index.js as req.userId)
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },

  async users(parent, args, ctx, info) {
    // check someone is logged in at all
    if (!ctx.request.userId) {
      throw new Error('You must be signed in to view this page');
    }

    // check the user has permission
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // query all users. empty 'where' object is just empty {}. info includes the graphQL query were going to do in the front-end
    return ctx.db.query.users({}, info);
  },
};

module.exports = Query;
