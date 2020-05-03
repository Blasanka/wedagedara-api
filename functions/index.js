const functions = require("firebase-functions");
const app = require("express")();

const cors = require("cors");
app.use(cors());

const {
  getAllDiseases,
  postOneDisease,
  getDisease,
  deleteDisease,
  updateDisease,
} = require("./handlers/diseases");

const {
  getAllDoctors,
  postOneDoctor,
  updateDoctor,
  uploadDoctorImage,
  updateDoctorImage,
  getDoctor,
  deleteDoctor,
} = require("./handlers/doctors");

const {
  getAllMedications,
  postOneMedication,
  uploadMedicationImage,
  deleteMedication,
  updateMedication,
} = require("./handlers/medication");

const {
  getAllPlaces,
  postOnePlace,
  uploadPlaceImage,
  deletePlace,
  updatePlace,
} = require("./handlers/places");

const {
  getAllMarkers,
  getDoctorsMarkers,
  getMedicationMarkers,
  getPlacesMarkers,
  getSearchResult,
  getStatistics,
} = require("./handlers/commons");

const {
  login,
  // addUserDetails,
  getAuthenticatedUser,
} = require("./handlers/users");
const FBAuth = require("./util/fbAuth");

app.get("/diseases", getAllDiseases);
app.post("/disease", postOneDisease);
app.get("/disease/:doctorId", getDisease);
app.delete("/disease/:id", deleteDisease);
app.put("/disease/:id", updateDisease);

// doctor routes
app.get("/doctors", getAllDoctors);
app.post("/doctor", postOneDoctor);
app.post("/doctor/image", uploadDoctorImage);
app.post("/doctor/update_image", updateDoctorImage);
app.get("/doctor/:doctorId", getDoctor);
app.delete("/doctor/:id", deleteDoctor); //FBAuth
app.put("/doctor/:id", updateDoctor);

// medication routes
app.get("/medications", getAllMedications);
app.post("/medication", postOneMedication);
app.post("/medication/image", uploadMedicationImage);
app.delete("/medication/:id", deleteMedication); //FBAuth
app.put("/medication/:id", updateMedication);

// places routes
app.get("/places", getAllPlaces);
app.post("/place", postOnePlace);
app.post("/place/image", uploadPlaceImage);
app.delete("/place/:id", deletePlace); //FBAuth
app.put("/place/:id", updatePlace);

// all the markers for map
app.get("/locations", getAllMarkers);
app.get("/locations/doctors", getDoctorsMarkers);
app.get("/locations/medications", getMedicationMarkers);
app.get("/locations/places", getPlacesMarkers);

// search anything route
app.get("/search/:text", getSearchResult);

app.get("/stats", getStatistics);

// Users handle route
app.post("/login", login);
app.get("/user", FBAuth, getAuthenticatedUser);
// app.post("/signup", addUserDetails);

// This is the api url patter when we use export.api -> https:baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);
