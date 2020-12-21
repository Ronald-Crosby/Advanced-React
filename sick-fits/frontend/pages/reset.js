import ResetForm from '../components/Reset';

const Reset = (props) => (
  <div>
    <ResetForm resetToken={props.query.reset_token} />
  </div>
);

export default Reset;
