const { admin, db } = require("../util/admin");

const firebaseConfig = require("../util/config");

const { validateAddPlaceData } = require("../util/validators");

exports.getAllMarkers = (req, res) => {
  locations = [];
  try {
    db.ref("/doctors").on("value", snapshot => {
      if (snapshot.exists()) {
        let doctors = [];
        snapshot.forEach(doc => {
          let docData = doc.val();
          doctors.push({
            id: docData.id,
            latitude: docData.latitude,
            longitude: docData.longitude
          });
        });
        locations = doctors;
      }
    });
    db.ref("/places").on("value", snapshot => {
      if (snapshot.exists()) {
        let places = [];
        snapshot.forEach(doc => {
          let docData = doc.val();
          places.push({
            id: docData.id,
            latitude: docData.latitude,
            longitude: docData.longitude
          });
        });
        return res.json(locations.concat(places));
      } else {
        return res.status(400).json({ message: "No place found" });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

exports.getSearchResult = (req, res) => {
  searches = [];
  try {
    db.ref(`/doctors/`)
      .orderByChild("search_name")
      .startAt(req.params.text)
      .endAt(req.params.text + "\uf8ff")
      .on("value", snapshot => {
        let doctors = [];
        if (snapshot.exists()) {
          snapshot.forEach(doc => {
            let docData = doc.val();
            doctors.push({
              id: docData.id,
              description: docData.description,
              image_url: docData.image_url,
              location: docData.location,
              name: docData.name,
              phone_number: docData.phone_number,
              type: "doctors"
            });
          });
        }
        searches.push(...doctors);
      });
    db.ref(`/places/`)
      .orderByChild("search_name")
      .startAt(req.params.text)
      .endAt(req.params.text + "\uf8ff")
      .on("value", snapshot => {
        let places = [];
        if (snapshot.exists()) {
          snapshot.forEach(doc => {
            let docData = doc.val();
            places.push({
              id: docData.id,
              description: docData.description,
              image_url: docData.image_url,
              duration: docData.duration,
              name: docData.name,
              phone_number: docData.phone_number,
              type: "places"
            });
          });
        }
        searches.push(...places);
      });
    db.ref(`/diseases/`)
      .orderByChild("search_name")
      .startAt(req.params.text)
      .endAt(req.params.text + "\uf8ff")
      .on("value", snapshot => {
        let diseases = [];
        if (snapshot.exists()) {
          snapshot.forEach(doc => {
            let docData = doc.val();
            diseases.push({
              id: docData.id,
              name: docData.name,
              description: docData.description,
              cause: docData.cause,
              prepare_method: docData.prepare_method,
              solution: docData.solution,
              medication_goods: docData.medication_goods,
              type: "diseases"
            });
          });
        }
        searches.push(...diseases);
      });
    db.ref(`/medication/`)
      .orderByChild("search_name")
      .startAt(req.params.text)
      .endAt(req.params.text + "\uf8ff")
      .on("value", snapshot => {
        let medication = [];
        if (snapshot.exists()) {
          snapshot.forEach(doc => {
            let docData = doc.val();
            medication.push({
              id: docData.id,
              description: docData.description,
              image_url: docData.image_url,
              location: docData.location,
              name: docData.name,
              type: "medication"
            });
          });
        }
        searches.push(...medication);
        return res.json(searches);
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code, message: "No data found" });
  }
};
