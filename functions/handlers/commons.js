const { db } = require("../util/admin");

exports.getAllMarkers = (req, res) => {
  locations = [];
  try {
    db.ref("/doctors").on("value", (snapshot) => {
      if (snapshot.exists()) {
        let doctors = [];
        snapshot.forEach((doc) => {
          let docData = doc.val();
          doctors.push({
            id: docData.id,
            latitude: docData.latitude,
            longitude: docData.longitude,
          });
        });
        locations = doctors;
      }
    });
    db.ref("/places").on("value", (snapshot) => {
      if (snapshot.exists()) {
        let places = [];
        snapshot.forEach((doc) => {
          let docData = doc.val();
          places.push({
            id: docData.id,
            latitude: docData.latitude,
            longitude: docData.longitude,
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

exports.getDoctorsMarkers = (req, res) => {
  try {
    db.ref("/doctors").on("value", (snapshot) => {
      if (snapshot.exists()) {
        let doctors = [];
        snapshot.forEach((doc) => {
          let docData = doc.val();
          doctors.push({
            id: docData.id,
            latitude: docData.latitude,
            longitude: docData.longitude,
          });
        });
        return res.json(doctors);
      } else {
        return res.status(400).json({ message: "No doctors found" });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

exports.getMedicationMarkers = (req, res) => {
  try {
    db.ref("/medication").on("value", (snapshot) => {
      if (snapshot.exists()) {
        let medication = [];
        snapshot.forEach((doc) => {
          let docData = doc.val();
          medication.push({
            id: docData.id,
            latitude: docData.latitude,
            longitude: docData.longitude,
          });
        });
        return res.json(medication);
      } else {
        return res.status(400).json({ message: "No medication found" });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

exports.getPlacesMarkers = (req, res) => {
  try {
    db.ref("/places").on("value", (snapshot) => {
      if (snapshot.exists()) {
        let places = [];
        snapshot.forEach((doc) => {
          let docData = doc.val();
          places.push({
            id: docData.id,
            latitude: docData.latitude,
            longitude: docData.longitude,
          });
        });
        return res.json(places);
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
      .on("value", (snapshot) => {
        let doctors = [];
        if (snapshot.exists()) {
          snapshot.forEach((doc) => {
            let docData = doc.val();
            doctors.push({
              id: docData.id,
              description: docData.description,
              image_url: docData.image_url,
              location: docData.location,
              name: docData.name,
              phone_number: docData.phone_number,
              type: "doctors",
            });
          });
        }
        searches.push(...doctors);
      });
    db.ref(`/places/`)
      .orderByChild("search_name")
      .startAt(req.params.text)
      .endAt(req.params.text + "\uf8ff")
      .on("value", (snapshot) => {
        let places = [];
        if (snapshot.exists()) {
          snapshot.forEach((doc) => {
            let docData = doc.val();
            places.push({
              id: docData.id,
              description: docData.description,
              image_url: docData.image_url,
              duration: docData.duration,
              name: docData.name,
              phone_number: docData.phone_number,
              type: "places",
            });
          });
        }
        searches.push(...places);
      });
    db.ref(`/diseases/`)
      .orderByChild("search_name")
      .startAt(req.params.text)
      .endAt(req.params.text + "\uf8ff")
      .on("value", (snapshot) => {
        let diseases = [];
        if (snapshot.exists()) {
          snapshot.forEach((doc) => {
            let docData = doc.val();
            diseases.push({
              id: docData.id,
              name: docData.name,
              description: docData.description,
              cause: docData.cause,
              prepare_method: docData.prepare_method,
              solution: docData.solution,
              medication_goods: docData.medication_goods,
              type: "diseases",
            });
          });
        }
        searches.push(...diseases);
      });
    db.ref(`/medication/`)
      .orderByChild("search_name")
      .startAt(req.params.text)
      .endAt(req.params.text + "\uf8ff")
      .on("value", (snapshot) => {
        let medication = [];
        if (snapshot.exists()) {
          snapshot.forEach((doc) => {
            let docData = doc.val();
            medication.push({
              id: docData.id,
              description: docData.description,
              image_url: docData.image_url,
              location: docData.location,
              name: docData.name,
              type: "medication",
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

exports.getStatistics = (req, res) => {
  db.ref("/").on("value", (snapshot) => {
    if (snapshot.exists()) {
      console.log("There are " + snapshot.numChildren() + " messages");
      const docD = snapshot.val();
      return res.json({
        diseases: Object.keys(docD.diseases).length,
        doctors: Object.keys(docD.doctors).length,
        places: Object.keys(docD.places).length,
        medication: Object.keys(docD.medication).length,
      });
    } else {
      return res
        .status(404)
        .json({ diseases: 0, doctors: 0, places: 0, medication: 0 });
    }
  });
};
