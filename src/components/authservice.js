const TOKEN_KEY = "jwtToken";
const TICKET_KEY = "ticket";
const LOCATION_KEY = "location";
const DATE_KEY = "date";
const USER_KEY = "user";

// Token
function getToken() {
  return localStorage.getItem(TOKEN_KEY); // return raw string
}

function storeToken(token = "") {
  localStorage.setItem(TOKEN_KEY, token); // store raw string
}

// Ticket
function getTicket() {
  const tkt = localStorage.getItem(TICKET_KEY);
  return tkt ? JSON.parse(tkt) : null;
}

function storeTicket(tkt = "") {
  const str = JSON.stringify(tkt);
  localStorage.setItem(TICKET_KEY, str);
}

// Location
function getlocation() {
  return localStorage.getItem(LOCATION_KEY);
}

function storelocation(loca) {
  localStorage.setItem(LOCATION_KEY, loca);
}

// Date
function getdate() {
  return localStorage.getItem(DATE_KEY);
}

function storedate(dt) {
  localStorage.setItem(DATE_KEY, dt);
}

// User
function storeUser(userData) {
  const str = JSON.stringify(userData);
  localStorage.setItem(USER_KEY, str);
}

function getUser() {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

// Remove All
function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TICKET_KEY);
  localStorage.removeItem(LOCATION_KEY);
  localStorage.removeItem(DATE_KEY);
  localStorage.removeItem(USER_KEY);
}

export default {
  getToken,
  storeToken,
  removeToken,
  getTicket,
  storeTicket,
  storelocation,
  getlocation,
  storedate,
  getdate,
  storeUser,
  getUser,
};
