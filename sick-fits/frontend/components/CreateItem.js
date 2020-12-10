/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

// this is how we send the info from the form to the db
const CREATE_ITEM_MUTATION = gql`
  # we have to pass the fields and their data types into the query here
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    # this runs the createItem query we defined in our backend
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      # return the ID of the new item
      id
    }
  }
`;

class CreateItem extends Component {
  // establish (initially empty) local state for the form fields
  state = {
    title: 'Yeezys',
    description: 'Size 8 Yeezys hypebeast brooo',
    image: 'yeezys.jpeg',
    largeImage: 'large-yeezys.jpeg',
    price: 1000,
  };

  // take the name and type (of input) and the new value from the form field and update the respective state key with it
  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async (e) => {
              // stop the form from submitting in the usual way
              e.preventDefault();
              // call the mutation + send info off to the db
              const res = await createItem();
              // redirect to the single item page they just created
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id },
              });
            }}
          >
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
                  value={this.state.title}
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
                  value={this.state.price}
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
                  value={this.state.description}
                  onChange={this.handleChange}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
