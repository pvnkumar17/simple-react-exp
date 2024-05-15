import { useState } from 'react';
import { connect } from 'react-redux';
import { BrainMapApp } from '../../actions/bootaction';
import { CallApi } from '../../services/apiCalls';

const Login = ({redirectTo, refreshToken
}) => {

  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [name, setName] = useState('');
  const [userEmailValid, setUserEmailValid] = useState();
  const [userNameValid, setUserNameValid] = useState();
  const [regiterPage, setregiterPage] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);

  const auth = process.env.REACT_APP_AUTH;

  const submitLoginInfo = (type) => {
    const webService = type !== 'register' ? `${auth}/v1/login` : `${auth}/v1/register`;
    const payload = type !== 'register' ? {
      "identifierType":"username", 
      "identifier":userName,
      "password": userPwd
  } : {
    "name":name,
    "username":userName,
    "email":userEmail,
    "password": userPwd
  }

    CallApi.directCall(webService, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      data: payload,
      successCallback: handleResponseData,
      errorCallback: handleErrorResponse,
    });
  }

  const handleResponseData = (res) => {
    if (res.data.accessToken) {
      refreshToken(res.data);
      //redirectTo('DASHBOARD'); //TODO redirect from setLoginData
    }
  };

  const handleErrorResponse = (error) => {
    console.log(error);
  };

  const checkAvailblity = (type) => {
    const payload = type === 'checkemail' ? {'email': userEmail} : {username: userName};
    CallApi.directCall(`${auth}/v1/${type}`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      data: payload,
      successCallback: (res) => handleAvailableData(res, type),
      errorCallback: handleAvailableErrorResponse,
    });
  };

  const handleAvailableData = (res, type) => {
    if(type === 'checkemail'){
      setUserEmailValid(res.data.isAvailable);
    }else {
      setUserNameValid(res.data.isAvailable);
    }
  };

  const handleAvailableErrorResponse = (error) => {
    console.log(error);
    setInvalidEmail(true);
  };
    
  return (
        <div className='login'>
            {!regiterPage && <><input type='text' placeholder='user name' onChange={(e) => setUserName(e.target.value)} value={userName} />
            <hr />
            <input type='password' placeholder='password' onChange={(e) => setUserPwd(e.target.value)} value={userPwd} />
            <hr />
            <input type='submit' value='login' onClick={() => submitLoginInfo()} />
            <button onClick={() => setregiterPage(true)}>{'Sign Up'}</button>
            </>}
            {regiterPage && <>
            <input type='text' placeholder='name' onChange={(e) => setName(e.target.value)} value={name} />
            <hr />
              <input type='text' placeholder='user name' onChange={(e) => setUserName(e.target.value)} value={userName} onBlur={() => userName && checkAvailblity('checkusername')} />
              {userNameValid !== undefined && <div>{userNameValid ? 'user name is available' : 'user already exist please try login'}</div>}
              <hr />
              <input type='email' placeholder='email' onChange={(e) => setUserEmail(e.target.value)} value={userEmail} onBlur={() => userEmail && checkAvailblity('checkemail')} />
              {userEmailValid !== undefined && <div>{userEmailValid ? 'email is available' : 'email already exist please try login'}</div>}
              {invalidEmail && <div>{'please enter valid email'}</div>}
              <hr />
              <input type='password' placeholder='password' onChange={(e) => setUserPwd(e.target.value)} value={userPwd} />
              <hr />
              <input type='submit' value='Sign Up' disabled={!userNameValid || !userEmailValid || !userPwd} onClick={() => submitLoginInfo('register')} />
            </>}
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
