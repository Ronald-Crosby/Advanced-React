/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

// query the db for the relevant item based on the id we have in the props
const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

// this is how we send the info from the form to the db
const UPDATE_ITEM_MUTATION = gql`
  # we have to pass the fields and their data types into the query here
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    # this runs the createItem query we defined in our backend
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      # return the ID of the new item
      id
      title
      description
      price
    }
  }
`;

class updateItem extends Component {
  // establish (initially empty) local state for the form fields
  state = {};

  // take the name and type (of input) and the new value from the form field and update the respective state key with it
  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    });
  };

  render() {
    return (
      // we wrap the db mutation component and corresponding form in a query component so the site knows which single item in the db were mutating
      <Query
        // we pass the query defined above into the Query component
        query={SINGLE_ITEM_QUERY}
        // also the id here for some reason
        variables={{
          id: this.props.id,
        }}
      >
        {/* this returns the data and our loading boolean */}
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No item found for Id: {this.props.id}</p>;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                // this.updateItem refers to a method defined above, similar to as we do for onChange
                <Form onSubmit={(e) => this.updateItem(e, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        // set the value to equal the local state defined above
                        defaultValue={data.item.title}
                        // when the user enters info, run the handle change function to update the local state.
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        defaultValue={data.item.price}
                        onChange={this.handleChange}
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter a description"
                        required
                        defaultValue={data.item.description}
                        onChange={this.handleChange}
                      />
                    </label>
                    <button type="submit">Save changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default updateItem;
export { UPDATE_ITEM_MUTATION };
