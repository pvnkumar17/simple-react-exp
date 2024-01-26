import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {createBrowserHistory} from 'history';
import configureStore from './configureStore';
import { BrainMapApp } from './actions/bootAction';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { locationChange } from './actions/locationChangedAction';
import reportWebVitals from './reportWebVitals';
const history = createBrowserHistory();
const store = configureStore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function startListener(history: any, store: any) {
  store.dispatch(
      locationChange({
          hash: history.location.hash,
          history,
      })
  );

  history.listen((location: any) => {
      console.log('location :', location);
      store.dispatch(
          locationChange({
              hash: location.hash,
              history,
          })
      );
  });
};

startListener(history, store);

const render = () =>
  new Promise(function(resolveStore, reject) {
      store.dispatch((BrainMapApp as any).initBootstrap(resolveStore));
  }).then(function(data) {
    root.render(
      <Provider store={store}>
        <BrowserRouter basename="/">
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </BrowserRouter>
      </Provider>);
  }).catch((error) => {
    console.trace()
    console.log('Error while bootstrapping', error);
    console.trace(error)
  });

render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
