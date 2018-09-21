import axios from 'axios';
import { put, takeEvery} from 'redux-saga/effects';
import { FETCH_REQUEST } from './index';
import { searchStart , searchSuccess , searchError } from './actions';


const getdataAPI = (email) => {
  const userkey = email.email;
  return axios.get(`http://localhost:8080/user/usersearch?key=${userkey}`);
}

function* usersearch(email){
  try {
      yield put(searchStart()); 
      const respone = yield getdataAPI(email);
      if(!respone.data){
        const message = email.email + " isn't exist!";
        yield put(searchError(message));
      }
      yield put(searchSuccess(respone.data.user, respone.data.jogging));
    } catch (err) {
        const message = email.email +" isn't exist!";
        yield put(searchError(message));
  }
}

function* AppSaga() {
    yield takeEvery( FETCH_REQUEST, usersearch)
}

export default AppSaga;