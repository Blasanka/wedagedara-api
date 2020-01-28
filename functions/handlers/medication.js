const { admin, db } = require("../util/admin");

const firebaseConfig = require("../util/config");

const { validateAddStudentData } = require("../util/validators");

exports.getAllMedications = (req, res) => {
  try {
    db.ref("/medication").on("value", snapshot => {
      if (snapshot.exists()) {
        let medications = [];
        snapshot.forEach(doc => {
          let docData = doc.val();
          medications.push({
            name: docData.name,
            description: docData.description,
            imageUrl: docData.image_url,
            location: docData.location
          });
        });
        return res.json(medications);
      } else {
        return res.status(400).json({ message: "No medication found" });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};
