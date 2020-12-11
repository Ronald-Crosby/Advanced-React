import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from './Items';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

class DeleteItem extends Component {
  // cache is the stuff stored by the browser using apollo
  // payload is the data that is returned when we run the deleteItem mutation
  update = (cache, payload) => {
    // manually update the cache so it matches whats on the server
    // 1. read the cache for the present set of items using the ALL_ITEMS_QUERY
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    console.log(data);
    // 2. filter the deleted item out of our local variable using the js filter method
    data.items = data.items.filter(
      (item) => item.id !== payload.data.deleteItem.id
    );
    // 3. write the data local variable to the cache
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    return (
      // variables tells us which item were actually deleting
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{
          id: this.props.id,
        }}
        // this is an apollo thing for updating the interface
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button
            type="button"
            onClick={() => {
              if (confirm('Are you sure you want to delete this item?')) {
                deleteItem();
              }
            }}
          >
            {this.props.children}
          </button>
        )}
      </Mutation>
    );
  }
}

export default DeleteItem;
