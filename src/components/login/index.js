import React, {useState} from 'react';
import { CallApi } from '../../services/apiCalls';
import { connect } from 'react-redux';
import { BrainMapApp } from '../../actions/bootaction';

const Login = ({redirectTo, refreshToken
}) => {

  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');

  const submitLoginInfo = () => {
    CallApi.directCall('http://localhost:9000/v1/auth/login', {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      data: {
        "identifierType":"username", 
        "identifier":"pvnk17",
        "password": "123456780"
    },
      successCallback: handleResponseData,
      errorCallback: handleErrorResponse,
    });
  }

  const handleResponseData = (res) => {
    if (res.data.accessToken) {
      refreshToken(res.data);
      redirectTo('DASHBOARD'); //TODO redirect from setLoginData
    }
  };

  const handleErrorResponse = (error) => {
    console.log(error);
  };
    
  return (
        <div className='login'>
            <input type='text' placeholder='user name' onChange={(e) => setUserName(e.target.value)} value={userName} />
            <hr />
            <input type='text' placeholder='password' onChange={(e) => setUserPwd(e.target.value)} value={userPwd} />
            <hr />
            <input type='submit' value='login' onClick={() => submitLoginInfo()} />
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
    refreshToken: data => dispatch(BrainMapApp.setLoginData(data)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
