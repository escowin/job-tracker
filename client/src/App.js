// SEQUENCE:
// 1. Import necessary libraries and components.
// 2. Create Apollo client for API endpoint connections.
// 3. Define custom merge functions for specific types.
// 4. Define the main function App.
// 5. Provides the necessary routing for different pages.

// FOR:
// - Loop over routes and define corresponding components.

// IF-THEN-ELSE:
// - Check for the presence of a token before setting the authorization header.

// Invoking classes or calling functions:
// - Call the ApolloProvider with the defined client.

// Handling exceptions:
// - Handle any possible exceptions during the process.

import { ApolloProvider, ApolloClient, createHttpLink } from "@apollo/client";
import { InMemoryCache } from "@apollo/client/cache";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Job from "./pages/Job";
import Page404 from "./pages/Page404";
import Profile from "./pages/Profile";
import AddJob from "./pages/AddJob";
import "./assets/css/index.css";

// Apollo client variables
const httpLink = createHttpLink({ uri: "/graphql" });

// JWT Authentication
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Client side cache handling
const customMergeFunction = {
  Job: {
    fields: {
      notes: {
        merge(existing = [], incoming) {
          return incoming;
        },
      },
    },
  },
  User: {
    fields: {
      resumes: {
        merge(existing = [], incoming) {
          return [...incoming];
        },
      },
    },
  },
};

// Instantiates Apollo client & creates API endpoint connections
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: customMergeFunction,
  }),
});

// Routing source of truth
const routes = [
  { path: "/", element: <Home /> },
  { path: "/job/:id", element: <Job /> },
  { path: "/add-job", element: <AddJob /> },
  { path: "/profile", element: <Profile /> },
  { path: "/login", element: <Login doc={"user"} type={"login"} /> },
  { path: "/signup", element: <Login doc={"user"} type={"sign-up"} /> },
  { path: "*", element: <Page404 /> },
];

// Objects of 'routes' array are mapped to maintain a concise JSX return
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              {routes.map((route, i) => (
                <Route key={i} path={route.path} element={route.element} />
              ))}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
