import React, { createContext, useContext } from "react";
import { useJobReducer } from "./reducers";
// import {}

// current states:
// - toggles jobForm-jobProfile
// - toggles addForm-EditForm styles
// - toggles minWidth display

// - form states will remain inside components

// store | single source of truth
// state is read-only
// reducer | runned by action result. state is changed through pure functions (new version overwrites old)

// instantiates new Context object. Object contains Prover & Consumer components
// - Provider wraps application, making state data a prop available to all child components
// - Consumer grabs & uses the state data held by the Provider
const StoreContext = createContext();
const { Provider } = StoreContext