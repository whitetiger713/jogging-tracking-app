import {
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
  SEARCH_ERROR,
  FETCH_REQUEST,
} from './index';

export const searchStart = () => {
  return {
    type: SEARCH_REQUEST,
  };
};

export const searchSuccess = (userdata,jogging) => {
  return {
    type: SEARCH_SUCCESS,
    userdata: userdata,
    jogging: jogging,
  };
};

export const searchError = (errors) => {
  return {
    type: SEARCH_ERROR,
    errors,
  };
};
export const usersearch = (email) => {
  return {
    type: FETCH_REQUEST,
    email,
  };
};
export const jogging_search_filter = (email, from, to) => {
  return {
    type: FETCH_REQUEST,
    email: email,
    from: from,
    to: to,
  };
};