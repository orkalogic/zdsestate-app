import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import PageNotFound from "./pages/PageNotFound";
import Header from "./components/Shared/Header";
import ProtectedRoute from "./utils/ProtectedRoute";
import Listings from "./pages/Listings";
import CreateListing from "./pages/CreateListing";

const App = () => (
  <>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Those are my protected route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/listings" element={<Listings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  </>
);

export default App;
