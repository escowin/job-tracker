// actions | graphql typedefs analogue
// - defines types of events that can be emitted to update state. 
// - only predefined actions can update state

// bypass apollo server |
// - current: cache relies on retrieving User & Job data from server to update
// - goal: store data retrieved for jobs by apollo in this global state. allows for offline capabilities & data persistence
export const UPDATE_JOBS = "UPDATE_JOBS"
export const UPDATE_CURRENT_JOB = "UPDATE_CURRENT_JOB"
export const CURRENT_USER = "CURRENT_USER"
export const SELECTED_EDIT = "SELECTED_EDIT"
// export const MIN_WIDTH = "MIN_WIDTH"
