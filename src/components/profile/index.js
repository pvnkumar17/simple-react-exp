import { connect } from 'react-redux';
import DropDown, { DropDownItem } from '../../ui/DropDown';
import './profile.css';

const Profile = ({redirectTo, refreshToken
}) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const logoutUser = () => {
    const token = localStorage.getItem('apiToken');
    if (token) {
        localStorage.removeItem('apiToken');
        localStorage.removeItem('user');
        redirectTo('LOGIN'); //TODO redirect from setLoginData
    }
  };
  return (
    <DropDown
        disabled={false}
        buttonClassName="profile"
        buttonLabel={<div><div>{user?.username}</div><div>{user?.email}</div></div>}
        buttonAriaLabel="menu specialized editor node"
        buttonIconClassName="icon humburger"
    >
        <DropDownItem
          onClick={() => logoutUser()}
          className="item">
          <span className="text">Log Out</span>
        </DropDownItem>
    </DropDown>
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
)(Profile);
