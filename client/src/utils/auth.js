// auth.js handles jwt authentication functionality
import decode from "jwt-decode";

class AuthService {
  // retrieves data saved in jwt
  getProfile() {
    return decode(this.getToken());
  }

  // checks if the user is still logged in. note: must never be an async function
  loggedIn() {
    // checks if there is a saved jwt that's still valid
    const token = this.getToken();
    // uses type coersion to check if jwt is NOT undefined && NOT expired
    return !!token && !this.isTokenExpired(token);
  }

  // checks if jwt has expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  // retrieves jwt from localStorage
  getToken() {
    // retrieves the user jwt from localStorage
    return localStorage.getItem("id_token");
  }

  // sets jwt to localStorage and reloads page to homepage
  login(idToken) {
    // saves user jwt to localStorage
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  // clears token jwt localStorage and forces logout w/ reload
  logout() {
    // clears user jwt and profile data from localStorage
    localStorage.removeItem("id_token");
    // reloads page and resets the application's state
    window.location.assign("/");
  }
}

const authService = new AuthService()

export default authService;
