import React, {useState} from 'react';
import { CallApi } from '../../services/apiCalls';
import { connect } from 'react-redux';
import { BrainMapApp } from '../../actions/bootaction';

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
  const [stepTwo, setStepTwo] = useState(false);
  const [signupStep, setSignupStep] = useState(false);

  const submitLoginInfo = (type) => {
    const webService = type !== 'register' ? 'http://localhost:9000/v1/auth/login' : 'http://localhost:9000/v1/auth/register';
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
    CallApi.directCall(`http://localhost:9000/v1/auth/${type}`, {
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
          <div className='container py-5 h-100'>
              {!regiterPage && <><input type='text' placeholder='user name' onChange={(e) => {setUserName(e.target.value); e.target.value.length > 3 && checkAvailblity('checkusername')} } value={userName} />
              <hr />
              {!stepTwo && <input type='submit' value='Next' disabled={!userNameValid} onClick={() => setStepTwo(true)} />}
              {stepTwo && <> <input type='password' placeholder='password' onChange={(e) => setUserPwd(e.target.value)} value={userPwd} />
              <hr />
              <input type='submit' value='login' onClick={() => submitLoginInfo()} /></>}

              <div className='mt-5'>Don't have an account? <button onClick={() => setregiterPage(true)}>{'Sign Up'}</button></div>
              </>}
              {regiterPage && <>
              <div>Creat your account</div>
              
                {!signupStep &&<><input type='text' placeholder='name' onChange={(e) => setName(e.target.value)} value={name} />
              <hr />
                <input type='email' placeholder='email' onChange={(e) => setUserEmail(e.target.value)} value={userEmail} onBlur={() => userEmail && checkAvailblity('checkemail')} />
                {userEmailValid !== undefined && <div>{userEmailValid ? 'email is available' : 'email already exist please try login'}</div>}
                {invalidEmail && <div>{'please enter valid email'}</div>}
                <hr /> <input type='submit' value='Next' disabled={!userEmailValid} onClick={() => setSignupStep(true)} /></>}
                {signupStep && <>
                <div>What should we call you</div>
                <input type='text' placeholder='user name' onChange={(e) => setUserName(e.target.value)} value={userName} onBlur={() => userName && checkAvailblity('checkusername')} />
                {userNameValid !== undefined && <div>{userNameValid ? 'user name is available' : 'user already exist please try login'}</div>}
                <hr />
                <input type='password' placeholder='password' onChange={(e) => setUserPwd(e.target.value)} value={userPwd} />
                <hr />
                <input type='submit' value='Sign Up' disabled={!userNameValid || !userEmailValid || !userPwd} onClick={() => submitLoginInfo('register')} /></>}
              </>}
          </div>
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
