import {
  UPDATE_CURRENT_JOB,
  UPDATE_JOBS,
  CURRENT_USER,
  SELECTED_EDIT,
} from "../utils/actions";
import { reducer } from "../utils/reducers";

// initial state of logged in app
const initialState = {
  user: "username",
  jobs: [{ role: "software engineer", company: "deloitte" }],
  currentJob: "1",
  selectedEdit: false,
};

test("UPDATE_JOBS", () => {
  // reducers parameters: current state object, action to update state type-value object
  // - type: determines action
  // - value: new data to use in action
  let newState = reducer(initialState, {
    type: UPDATE_JOBS,
    jobs: [{}, {}],
  });
  expect(newState.jobs.length).toBe(2);
  expect(initialState.jobs.length).toBe(1);
});

test("UPDATE_CURRENT_JOB", () => {
  let newState = reducer(initialState, {
    type: UPDATE_CURRENT_JOB,
    currentJob: "2",
  });
  expect(newState.currentJob).toBe("2");
  expect(initialState.currentJob).toBe("1");
});

test("SELECTED_EDIT", () => {
  let newState = reducer(initialState, {
    type: SELECTED_EDIT,
    selectedEdit: true,
  });
  expect(newState.selectedEdit).toEqual(true);
  expect(initialState.selectedEdit).toEqual(false);
});

test("CURRENT_USER", () => {
  let newState = reducer(initialState, {
    type: CURRENT_USER,
    user: "user2",
  });
  expect(newState.user).toBe("user2");
  expect(initialState.user).toBe("username");
});
