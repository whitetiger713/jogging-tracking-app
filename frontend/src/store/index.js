import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from './reducer';
import logger from 'redux-logger';
import rootSaga from '../pages/App/modules/saga';
export const history = createHistory();

export const configStore =() =>{

  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
      rootReducer,
      applyMiddleware(sagaMiddleware, logger,routerMiddleware(history))
  );
  sagaMiddleware.run(rootSaga);
  return store;
}
