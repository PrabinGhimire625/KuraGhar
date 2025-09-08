import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/Status";
import { APIAuthenticated } from "../http";

const friendRequestSlice = createSlice({
  name: "friendRequest",
  initialState: {
    friendRequests: [],
    status: STATUS.LOADING,
  },
  reducers: {
    setFriendRequests(state, action) {
      state.friendRequests = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    resetStatus(state) {
      state.status = STATUS.IDLE;
    },
  },
});

export const { setFriendRequests, setStatus, resetStatus } = friendRequestSlice.actions;
export default friendRequestSlice.reducer;

// Send Friend Request
export function sendFriendRequest(toId) {
  return async function (dispatch, getState) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await APIAuthenticated.post(`/api/friendRequest/send/${toId}`);
      if (response.status === 200) {
        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        dispatch(setStatus(STATUS.ERROR));
      }
    } catch (err) {
      console.error("Send Friend Request Error:", err);
      dispatch(setStatus(STATUS.ERROR));
    }
  };
}

// Accept Friend Request
export function acceptFriendRequest(requestId) {
  return async function (dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await APIAuthenticated.post(
        `/api/friendRequest/accept/${requestId}`
      );

      if (response.status === 200) {
        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        dispatch(setStatus(STATUS.ERROR));
      }
    } catch (err) {
      console.error("Accept Friend Request Error:", err);
      dispatch(setStatus(STATUS.ERROR));
    }
  };
}


// Send Friend Request
export function fetchFriendRequest() {
    return async function fetchFriendRequestThunk(dispatch) {
        dispatch(setStatus(STATUS.LOADING));
        try {
            const response = await APIAuthenticated.get("/api/friendRequest");
            if (response.status === 200) {
                dispatch(setFriendRequests(response.data.data));
                dispatch(setStatus(STATUS.SUCCESS));
            } else {
                dispatch(setStatus(STATUS.ERROR));
            }
        } catch (err) {
            console.error(err);
            dispatch(setStatus(STATUS.ERROR));
        }
    };
}
