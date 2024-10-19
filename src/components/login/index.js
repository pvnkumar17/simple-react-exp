import React, {useEffect, useState} from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { BrainMapApp } from '../../actions/bootaction';
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import './login.css'
import TopNavigation from '../navigation/topNavigation';
import { CallApi } from '../../services/apiCalls';

const Login = ({redirectTo, refreshToken
}) => {

  const pageLocation = useLocation();

  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [name, setName] = useState('');
  const [userEmailValid, setUserEmailValid] = useState();
  const [userNameValid, setUserNameValid] = useState();
  const [regiterPage, setRegiterPage] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [signupStep, setSignupStep] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
  }

  useEffect(()=>{
    if(!isLoginOpen){
      setStepTwo(false);
      setSignupStep(false);
      setRegiterPage(false);
    }
  }, [isLoginOpen]);

  useEffect(() => {
    if (pageLocation.pathname === '/login') {
      document.body.classList.add('login-page');
    } else {
      document.body.classList.remove('login-page');
    }

    // Clean up the effect when the component unmounts
    return () => {
      document.body.classList.remove('login-page');
    };
  }, [pageLocation]);
    
  return (
      <div className='login'>
          <TopNavigation onLoginClick={() => toggleLogin()} />
          <div className='container py-5 h-100'>
              <Row>
                <Col className='h1 mb-5 pb-5'>Organize your learning. <span className='h6 d-block'>Brainstorm, Collaborate, share your ideas.</span></Col>
              </Row>
              <Modal isOpen={isLoginOpen} className='login-modal' toggle={toggleLogin}>
                <ModalHeader toggle={toggleLogin}>{stepTwo && <Button {...{color:'none', onClick: () => setStepTwo(false)}} className='btn-back'></Button>}</ModalHeader>
                <ModalBody>
                    {!regiterPage && <div className='login-container'>
                      <div className='login-title'>Sign in to Brainmap</div>
                      <Button {...{color:'none'}} className='btn-google'>CONTINUE WITH GOOGLE</Button>
                      <div className='my-4 alternate'>or</div>
                      <input type='text' placeholder='user name' disabled={stepTwo} className='mb-5' onChange={(e) => {setUserName(e.target.value); e.target.value.length > 3 && checkAvailblity('checkusername')} } value={userName} />
                      
                    {!stepTwo && <input type='submit' value='Next' disabled={!userNameValid} className='next-btn bg-black' onClick={() => setStepTwo(true)} />}
                    {stepTwo && <> <input type='password' placeholder='password' onChange={(e) => setUserPwd(e.target.value)} value={userPwd} />
                    <hr />
                    <input type='submit' value='login' className='next-btn bg-black' onClick={() => submitLoginInfo()} /></>}

                    <div className='mt-5'>Don't have an account? <Button className='link w-auto' color='link' onClick={() => setRegiterPage(true)}>{'Sign Up'}</Button></div>
                    </div>}
                    {regiterPage && <div className='login-container'>
                              {!signupStep &&<div>
                                <div className='login-title'>Creat your account</div>
                                <Button {...{color:'none'}} className='btn-google'>CONTINUE WITH GOOGLE</Button>
                                <div className='my-4 alternate'>or</div>
                                <input type='text' placeholder='name' onChange={(e) => setName(e.target.value)} value={name} />
                                <hr />
                                <input type='email' placeholder='email' onChange={(e) => {setUserEmail(e.target.value); userEmail && checkAvailblity('checkemail')}} value={userEmail} />
                                {userEmailValid !== undefined && <div>{userEmailValid ? 'email is available' : 'email already exist please try login'}</div>}
                                {invalidEmail && <div>{'please enter valid email'}</div>}
                                <hr /> <input type='submit' value='Next' disabled={!userEmailValid} className='next-btn bg-black' onClick={() => setSignupStep(true)} /></div>}
                                {signupStep && <div>
                                <div>What should we call you</div>
                                <input type='text' placeholder='user name' onChange={(e) => {setUserName(e.target.value); userName && checkAvailblity('checkusername')}} value={userName} />
                                {userNameValid !== undefined && <div>{userNameValid ? 'user name is available' : 'user already exist please try login'}</div>}
                                <hr />
                                <input type='password' placeholder='password' onChange={(e) => setUserPwd(e.target.value)} value={userPwd} />
                                <hr />
                                <input type='submit' value='Sign Up' className='next-btn bg-black' disabled={!userNameValid || !userEmailValid || !userPwd} onClick={() => submitLoginInfo('register')} /></div>}
                    </div>} 

                </ModalBody>
              </Modal>
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
