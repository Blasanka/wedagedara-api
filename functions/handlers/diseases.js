const { admin, db } = require("../util/admin");

const firebaseConfig = require("../util/config");

const { validateAddDiseaseData } = require("../util/validators");

exports.getAllDiseases = (req, res) => {
  try {
    db.ref("/diseases").on("value", snapshot => {
      if (snapshot.exists()) {
        let diseases = [];
        snapshot.forEach(doc => {
          let docData = doc.val();
          diseases.push({
            name: docData.name,
            description: docData.description,
            cause: docData.cause,
            solution: docData.solution,
            medication_goods: docData.medication_goods,
            prepare_method: docData.prepare_method
          });
        });
        return res.json(diseases);
      } else {
        return res.status(400).json({ message: "No diseases found" });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.code });
  }
};

exports.postOneDisease = (req, res) => {
  const docData = req.body;
  const newMedi = {
    name: docData.name,
    description: docData.description,
    cause: docData.cause,
    solution: docData.solution,
    medication_goods: docData.medication_goods,
    prepare_method: docData.prepare_method,
    created_at: new Date().toISOString()
  };

  const { valid, errors } = validateAddMediData(newMedi);

  if (!valid) return res.status(400).json(errors);

  const docRef = db.ref("diseases");
  const newRef = docRef.push();
  newMedi.id = newRef.key;
  docRef.child(newRef.key).set(newMedi, err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong!" });
    } else {
      console.log("Successfully submitted!");
      return res.status(200).json({ message: "Successfully submitted!" });
    }
  });
};

exports.getDisease = (req, res) => {
  let diseaseData = {};
  db.ref(`/diseases/${req.params.diseaseId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Disease not found!" });
      }
      diseaseData = doc.data();
      diseaseData.doctorId = doc.id;
      return res.json(diseaseData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.deleteDisease = (req, res) => {
  const document = db.doc(`/diseases/${req.params.diseaseId}`);

  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Disease not found!" });
      }
      if (req.user.handle !== doc.data().userHandle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      return res.json({ message: "Doctor deleted successfully!" });
    })
    .catch(err => {
      return res.status(500).json({ error: err.code });
    });
};
