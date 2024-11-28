import { useState } from 'react';
import { connect } from 'react-redux';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import './profile.css';

const Profile = ({redirectTo, refreshToken
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);

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
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction='down'>
        <DropdownToggle caret color='none' className='profile'><div className='fw-bold'>{user?.name}</div></DropdownToggle>
        <DropdownMenu className='w-100'>
          <DropdownItem
            onClick={() => logoutUser()}
            className="item ml-0">
            <span className="text">Log Out</span>
          </DropdownItem>
        </DropdownMenu>
    </Dropdown>
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
