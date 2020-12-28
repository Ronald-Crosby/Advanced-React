/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/state-in-constructor */
/* eslint-disable react/static-property-placement */
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import React from 'react';
import PropTypes from 'prop-types';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const Permissions = (props) => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) =>
      console.log(data.users) || (
        <div>
          <Error error={error} />
          <div>
            <h2>User permissions</h2>
          </div>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map((permission) => (
                  <th key={permission}>{permission}</th>
                ))}
                <th>🤌</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <UserPermissions key={user.id} user={user} />
              ))}
            </tbody>
          </Table>
        </div>
      )
    }
  </Query>
);

class UserPermissions extends React.Component {
  // this is how to set prop types on all the keys of an object
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  };

  state = {
    permissions: this.props.user.permissions,
  };

  handlePermissionChange = (e) => {
    const checkbox = e.target;
    // get a copy of the current permissions
    let updatedPermissions = [...this.state.permissions];
    console.log(updatedPermissions);
    // remember this all happens when we click on a checkbox!
    // if the box you just clicked is now checked (ie if it was unchecked before), add the value of of that checkbox (eg ADMIN) to the array of permissions. this array is just a copy of the real one, which we will overwrite later
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(
        (permission) => permission !== checkbox.value
      );
    }
    console.log(updatedPermissions);
    this.setState({ permissions: updatedPermissions });
  };

  render() {
    const { user } = this.props;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map((permission) => (
          <td>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                type="checkbox"
                // this sets the state to checked if the current permission on the iterator is included in the list of permissions for the user in question
                checked={this.state.permissions.includes(permission)}
                value={permission}
                onChange={this.handlePermissionChange}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    );
  }
}

export default Permissions;
