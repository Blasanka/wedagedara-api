const functions = require("firebase-functions");
const app = require("express")();

const cors = require("cors");
app.use(cors());

const {
  getAllDoctors,
  postOneDoctor,
  uploadDoctorImage,
  updateDoctorImage,
  getDoctor,
  deleteDoctor
} = require("./handlers/doctors");

const { getAllMedications } = require("./handlers/medication");

const { getAllPlaces } = require("./handlers/places");

const {
  login,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/users");
const FBAuth = require("./util/fbAuth");

// doctor routes
app.get("/doctors", getAllDoctors);
app.post("/doctor", postOneDoctor);
app.post("/doctor/image", uploadDoctorImage);
app.post("/doctor/update_image", updateDoctorImage);
app.get("/doctor/:doctorId", getDoctor);
app.delete("/doctor/:doctorId", FBAuth, deleteDoctor);

// medication routes
app.get("/medications", getAllMedications);

// places routes
app.get("/places", getAllPlaces);

// Users handle route
app.post("/login", login);
app.get("/user", FBAuth, getAuthenticatedUser);

// This is the api url patter when we use export.api -> https:baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);
