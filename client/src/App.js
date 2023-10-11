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

// mobile display
import AddJob from "./pages/AddJob";

import "./assets/css/index.css";

// apollo server | graphql
const httpLink = createHttpLink({ uri: "/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// addressing warning: cache data may be lost when replacing the notes field of a Job object.
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
};

// instantiated apollo client & creates api endpoint connections
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: customMergeFunction,
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/job/:id" element={<Job />} />
              <Route path="/add-job" element={<AddJob />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/login"
                element={<Login doc={"user"} type={"login"} />}
              />
              <Route
                path="/signup"
                element={<Login doc={"user"} type={"sign-up"} />}
              />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
