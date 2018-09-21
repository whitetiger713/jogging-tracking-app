import axios from 'axios';
import { put, takeEvery} from 'redux-saga/effects';
import { FETCH_REQUEST } from './index';
import { searchStart , searchSuccess , searchError } from './actions';


const getdataAPI = ({email}) => {
  const user = email;
  if(!user.from){
    return axios.get(`http://localhost:8080/user/usersearch?key=${user.email}`);
  }
  else {
    return axios.post('http://localhost:8080/user/usersearch', {
        email: user.email,
        from: user.from,
        to: user.to
      })
    }
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