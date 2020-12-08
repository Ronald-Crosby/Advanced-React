const Mutation = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if theyre logged in

    // this is how we access the db that we added to context earlier in the createServer file
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
        },
      },
      info
    );
    return item;
  },
};

module.exports = Mutation;
