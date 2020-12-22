import { Query, Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';
import SignIn from './Signin';

const PleaseSignIn = (props) => (
  <Query query={CURRENT_USER_QUERY}>
    {(payload) => {
      console.log(payload);
      if (payload.loading) return <p>Loading...</p>;
      if (!payload.data.currentUser) {
        return (
          <div>
            <p>Please sign in to perform this action</p>
            <SignIn />
          </div>
        );
      }
      return props.children;
    }}
  </Query>
);

export default PleaseSignIn;
