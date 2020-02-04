const functions = require("firebase-functions");
const app = require("express")();

const cors = require("cors");
app.use(cors());

const {
  getAllDiseases,
  postOneDisease,
  getDisease,
  deleteDisease
} = require("./handlers/diseases");

const {
  getAllDoctors,
  postOneDoctor,
  uploadDoctorImage,
  updateDoctorImage,
  getDoctor,
  deleteDoctor
} = require("./handlers/doctors");

const {
  getAllMedications,
  postOneMedication,
  uploadMedicationImage
} = require("./handlers/medication");

const {
  getAllPlaces,
  postOnePlace,
  uploadPlaceImage
} = require("./handlers/places");

const {
  login,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/users");
const FBAuth = require("./util/fbAuth");

app.get("/diseases", getAllDiseases);
app.post("/disease", postOneDisease);
app.get("/disease/:doctorId", getDoctor);
app.delete("/disease/:diseaseId", FBAuth, deleteDisease);

// doctor routes
app.get("/doctors", getAllDoctors);
app.post("/doctor", postOneDoctor);
app.post("/doctor/image", uploadDoctorImage);
app.post("/doctor/update_image", updateDoctorImage);
app.get("/doctor/:doctorId", getDoctor);
app.delete("/doctor/:doctorId", FBAuth, deleteDoctor);

// medication routes
app.get("/medications", getAllMedications);
app.post("/medication", postOneMedication);
app.post("/medication/image", uploadMedicationImage);

// places routes
app.get("/places", getAllPlaces);
app.post("/place", postOnePlace);
app.post("/place/image", uploadPlaceImage);

// Users handle route
app.post("/login", login);
app.get("/user", FBAuth, getAuthenticatedUser);

// This is the api url patter when we use export.api -> https:baseurl.com/api/
exports.api = functions.region("asia-east2").https.onRequest(app);
