const { db } = require("../util/admin");

// const firebaseConfig = require("../util/config");

const { validateAddDiseaseData } = require("../util/validators");

exports.getAllDiseases = (req, res) => {
  try {
    db.ref("/diseases").on("value", snapshot => {
      if (snapshot.exists()) {
        let diseases = [];
        snapshot.forEach(doc => {
          let docData = doc.val();
          diseases.push({
            id: docData.id,
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
  const newDisease = {
    name: docData.name,
    description: docData.description,
    cause: docData.cause,
    solution: docData.solution,
    medication_goods: docData.medication_goods,
    prepare_method: docData.prepare_method,
    created_at: new Date().toISOString()
  };

  const { valid, errors } = validateAddDiseaseData(newDisease);

  if (!valid) return res.status(400).json(errors);

  const docRef = db.ref("diseases");
  const newRef = docRef.push();
  newDisease.id = newRef.key;
  docRef.child(newRef.key).set(newDisease, err => {
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

exports.updateDisease = (req, res) => {
  const docData = req.body;
  const updatedDoc = {
    id: req.params.id,
    name: docData.name,
    description: docData.description,
    cause: docData.cause,
    solution: docData.solution,
    medication_goods: docData.medication_goods,
    prepare_method: docData.prepare_method,
    updated_at: new Date().toISOString()
  };

  const { valid, errors } = validateAddDiseaseData(updatedDoc);

  if (!valid) return res.status(400).json(errors);

  const docRef = db.ref("diseases");
  docRef.child(req.params.id).set(updatedDoc, err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong!" });
    } else {
      console.log("Successfully updated!");
      return res.status(200).json({ message: "Successfully updated!" });
    }
  });
};

exports.deleteDisease = (req, res) => {
  const node = db.ref(`/diseases/${req.params.id}`);
  node
    .remove()
    .then(() => {
      return res.status(200).json({ message: "Disease successfully deleted!" });
    })
    .catch(error => {
      console.log(error);
      return res.status(404).json({ error: "Disease not found!" });
    });
};
