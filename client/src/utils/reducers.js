// reducers | graphql resolvers analogue
// - update state functions
// - performs logic to carry out the emitted actions
import { useReducer } from "react";
import {
  UPDATE_CURRENT_JOB,
  UPDATE_JOBS,
  CURRENT_USER,
  SELECTED_EDIT,
} from "./actions";

// reducers parameters: current state object, action to update state type-value object
// - type: determines action
// - value: new data
export const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_JOBS:
      return {
        ...state,
        jobs: [...action.jobs],
      };
    case UPDATE_CURRENT_JOB:
      return {
        ...state,
        currentJob: action.currentJob,
      };
    case SELECTED_EDIT:
      return {
        ...state,
        selectedEdit: action.selectedEdit,
      };
    case CURRENT_USER:
      return {
        ...state,
        user: action.user,
      };
    // non pre-defined action.type returns original state
    default:
      return state;
  }
};

export function useJobReducer(initialState) {
  return useReducer(reducer, initialState);
}
