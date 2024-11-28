import { connect } from 'react-redux';

const Logout = ({redirectTo, refreshToken
}) => {

  const logoutUser = () => {
    const token = localStorage.getItem('apiToken');
    if (token) {
        localStorage.removeItem('apiToken');
        redirectTo('LOGIN'); //TODO redirect from setLoginData
    }
  };
  return (
        <div className='logout'>
            <button onClick={() => logoutUser(true)}>{'Log Out'}</button>
        </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
    redirectTo: (page, data) => {
      dispatch({ type: page, payload: { filter: data } });
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logout);
