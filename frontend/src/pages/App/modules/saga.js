import axios from 'axios';
import { put, takeEvery} from 'redux-saga/effects';
import { FETCH_REQUEST } from './index';
import { searchStart , searchSuccess , searchError } from './actions';


const getdataAPI = (keyword) => {
  const userkey = keyword.keyword;
  return axios.get(`https://api.github.com/search/users?q=${userkey}`);
}

function* usersearch(keyword){
    try {
        yield put(searchStart());
        const respone = yield getdataAPI(keyword);
        if(respone.data.items.length === 0){
          const message = keyword.keyword +" isn't exist!";
          yield put(searchError(message));
        }
        yield put(searchSuccess(respone.data.items));
        } catch (err) {
          const message = keyword.keyword +" isn't exist!";
          yield put(searchError(message));
    }
}

function* AppSaga() {
    yield takeEvery( FETCH_REQUEST, usersearch)
}

export default AppSaga;