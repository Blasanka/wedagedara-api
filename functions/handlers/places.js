const { admin, db } = require("../util/admin");

const firebaseConfig = require("../util/config");

const { validateAddStudentData } = require("../util/validators");

exports.getAllPlaces = (req, res) => {
  try {
    db.ref("/places").on("value", snapshot => {
      if (snapshot.exists()) {
        let places = [];
        snapshot.forEach(doc => {
          let docData = doc.val();
          places.push({
            placeId: docData.place_id,
            placeName: docData.place_name,
            description: docData.description,
            imageUrl: docData.image_url,
            duration: docData.duration,
            searchPlaceName: docData.search_place_name
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
