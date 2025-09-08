import { createSlice } from "@reduxjs/toolkit";
import { STATUS } from "../globals/Status";
import { API, APIAuthenticated } from "../http/index";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    data: [],
    userList: [],
    status: STATUS.LOADING,
    token: "",
    profile: "",
    searchUser:[],
    singleUser:null
  },
  reducers: {
    setUserData(state, action) {
      state.data = action.payload;
    },
    setUserList(state, action) {
      state.userList = action.payload;
    },
    setSingleUser(state, action) {
      state.singleUser = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    resetStatus(state) {
      state.status = STATUS.LOADING;
    },
    setToken(state, action) {
      state.token = action.payload;
      console.log(state.token);
    },
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setSearchUser(state, action) {
      state.searchUser = action.payload;
    },
    setUpdateUserProfile(state, action) {
      const index = state.data.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = {
          ...state.data[index],
          ...action.payload.data
        }
      }
    },
  },
});

export const { setUserData, setStatus, resetStatus, setToken, setProfile, setUpdateUserProfile, setUserList, setSearchUser, setSingleUser } = authSlice.actions;
export default authSlice.reducer;

//signup
export function register(data) {
  return async function registerUserThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await API.post("/api/register", data);
      if (response.status === 200) {
        dispatch(setUserData(response.data.data));
        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        dispatch(setStatus(STATUS.ERROR));
      }
    } catch (err) {
      dispatch(setStatus(STATUS.ERROR));
    }
  };
}

// login
export function login(data) {
  return async function loginThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await API.post("/api/login", data);

      if (response.status === 200) {
        const { token, data: userData } = response.data;

        dispatch(setProfile(userData));
        dispatch(setToken(token));


        localStorage.setItem('token', token);
        localStorage.setItem('role', userData.role);


        dispatch(setStatus(STATUS.SUCCESS));
        return userData;
      } else {
        dispatch(setStatus(STATUS.ERROR));
        return null;
      }
    } catch (err) {
      dispatch(setStatus(STATUS.ERROR));
      return null;
    }
  };
}

//profile
export function userProfile() {
  return async function userProfileThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await APIAuthenticated.get("/api/profile");
      if (response.status === 200) {
        const { data } = response.data;
        dispatch(setProfile(data));
        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        dispatch(setStatus(STATUS.ERROR));
      }
    } catch (err) {
      dispatch(setStatus(STATUS.ERROR));
    }
  }
}

//update user
// update user
export function updateUserProfile({ userData }) {
  return async function updateUserProfileThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await APIAuthenticated.patch(
        `/api/profile/update`,
        userData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        dispatch(setProfile(response.data.data));
        dispatch(setStatus(STATUS.SUCCESS));
        return response.data;
      }
    } catch (error) {
      console.error("Update failed:", error);
      dispatch(setStatus(STATUS.ERROR));
      throw error;
    }
  };
}


//profile
export function ListAllUser() {
  return async function ListAllUserThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await API.get("/api/allUser");
      if (response.status === 200) {
        dispatch(setUserList(response.data));
        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        dispatch(setStatus(STATUS.ERROR));
      }
    } catch (err) {
      dispatch(setStatus(STATUS.ERROR));
    }
  }
}

//profile
export function fetchSingleUser(id) {
  return async function fetchSingleUserThunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await API.get(`/api/singleUser/${id}`);
      console.log("Response : ", response)
      if (response.status === 200) {
        dispatch(setSingleUser(response.data.data));
        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        dispatch(setStatus(STATUS.ERROR));
      }
    } catch (err) {
      dispatch(setStatus(STATUS.ERROR));
    }
  }
}


// 
export function searchUserDetails(query) {
  return async function searchUserDetailsTHunk(dispatch) {
    dispatch(setStatus(STATUS.LOADING));
    try {
      const response = await APIAuthenticated.get(`/api/search?q=${query}`);
      console.log("Response on the search on the state : ", response)
      if (response.status === 200) {
        dispatch(setSearchUser(response.data.data));
        dispatch(setStatus(STATUS.SUCCESS));
      } else {
        dispatch(setStatus(STATUS.ERROR));
      }
    } catch (err) {
      console.error("Error fetching search results:", err);
      dispatch(setStatus(STATUS.ERROR));
    }
  };
}