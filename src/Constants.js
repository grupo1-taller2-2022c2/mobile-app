import Constants from "expo-constants";

export const SIGNIN_EP = "/token";
export const SIGNUP_EP = "/users/signup";
export const GOOGLE_SIGNUP_IF_NEW_EP = "/users/google_sign_up_if_new";
export const ME_EP = "/passengers/me/"
export const DRIVER_ME_EP = "/drivers/me/"
export const ADD_VEHICLE_EP = "/drivers/vehicle"
export const TRIP_COST_EP = "/trips/cost/"
export const START_DRIVER_LOOKUP_EP = "/trips/driver_lookup/"
export const CREATE_TRIP_EP = "/trips/"
export const TRIPS_EP = "/trips/"
export const UPDATE_LOCATION_EP = "/drivers/last_location"
export const ASSIGNED_TRIP_EP = "/drivers/assigned_trip/"
export const NOTIF_TOKEN_EP = "/notifications/token/"
export const PASSENGER_RATE_EP = "/passengers/ratings"
export const DRIVER_RATE_EP = "/drivers/ratings"
export const USERS_URI = "/users/"
export const WALLETS_URI = "/wallet/"
export const WALLET_WITHDRAWAL_URI = "/wallet/withdrawals/"
export const EDIT_PROF_EP = "/passengers/";
export const EDIT_DRIVER_PROF_EP = "/drivers/";


export const GOOGLE_MAPS_APIKEY = "AIzaSyD3H-dhvbdSHcltS1cJQp10oty-xO9faPE";
export const GOOGLE_DISTANCE_MATRIX_URL = "https://maps.googleapis.com/maps/api/distancematrix/json"

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_UNAUTHORIZED = 401;
export const HTTP_STATUS_DOESNT_EXIST = 404;
export const HTTP_STATUS_VALID_ERROR = 422;
export const USER_ALREADY_EXISTS = 409;

export const SESSION_EXPIRED_MSG = "Session expired: Please sign in again";
export const GENERIC_ERROR_MSG = "Something went wrong!";

export const INITIALIZE_TRIP = "Initialize";
export const DENY_TRIP = "Deny";
export const ACCEPT_TRIP = "Accept";
export const FINALIZE_TRIP = "Finalize";

export const GATEWAY_URL = Constants.manifest.extra.GATEWAY_URL;