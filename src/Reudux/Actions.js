import * as actionTypes from "./actionTypes";
import firebase from "../firebase";

export const login = user => {
  return {
    type: actionTypes.LOGIN,
    payload: { user }
  };
};

export const setUserLoading = isLoading => {
  return {
    type: actionTypes.SET_USER_LOADING,
    payload: isLoading
  };
};

export const addJoinedServers = server => {
  console.log(server);
  return {
    type: actionTypes.ADD_JOINED_SERVER,
    payload: server
  };
};

const addTotalServers = servers => {
  return {
    type: actionTypes.ADD_TOTAL_SERVER,
    payload: servers
  };
};

const setLoadingTotalServer = isLoading => {
  return {
    type: actionTypes.SET_LOADING_TOTAL_SERVERS,
    payload: isLoading
  };
};

export const loadTotalServers = () => {
  return dispatch => {
    dispatch(setLoadingTotalServer(true));
    firebase
      .database()
      .ref("servers")
      .once("value", snap => {
        const servers = convertToArray(snap.val());
        dispatch(addTotalServers(servers));
      });
  };
};
export const loadJoinedServers = uid => {
  console.clear();
  console.log(uid);

  return dispatch => {
    firebase
      .database()
      .ref("users/" + uid + "/servers")
      .once("value", snap => {
        const servers = convertToArray(snap.val());

        dispatch(addJoinedServers(servers));
      });
  };
};

const convertToArray = servers => {
  if (servers === null) return [];
  const keys = Object.keys(servers);
  return keys.map(key => servers[key]);
};
