import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ConnectedRouter } from 'connected-react-router'

import { store, persistor, history } from './store'
import AppRouter from './AppRouter'

import * as serviceWorker from './serviceWorker';
import './stylesheets/main.scss'
import '../node_modules/semantic-ui-css/semantic.min.css'

import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import * as Sentry from '@sentry/browser';
Sentry.init({dsn: "https://6967cf8c8d3a4e0697740a2cb9ca7118@sentry.io/5175765"});

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <AppRouter />
      </ConnectedRouter>
      <NotificationContainer />
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
)

// ReactDOM.render(<App />, );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
