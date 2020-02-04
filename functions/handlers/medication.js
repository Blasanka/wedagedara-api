const { admin, db } = require("../util/admin");

const firebaseConfig = require("../util/config");

const { validateAddMediData } = require("../util/validators");

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

exports.postOneMedication = (req, res) => {
  const docData = req.body;
  const newMedi = {
    image_url:
      docData.image_url ||
      "https://firebasestorage.googleapis.com/v0/b/wedagedara-717e9.appspot.com/o/no_user.png?alt=media",
    name: docData.name,
    location: docData.location,
    description: docData.description,
    search_name: docData.search_name,
    search_location: docData.search_location,
    created_at: new Date().toISOString()
  };

  const { valid, errors } = validateAddMediData(newMedi);

  if (!valid) return res.status(400).json(errors);

  const docRef = db.ref("medication");
  const newRef = docRef.push();
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

exports.uploadMedicationImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  let imageFileName;
  let imageToBeUploaded;

  const busboy = new BusBoy({ headers: req.headers });
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname);
    console.log(filename);
    console.log(mimetype);
    const fileSplitted = filename.split(".");
    const imageExtension = fileSplitted[fileSplitted.length - 1];
    imageFileName = `${Math.round(Math.random() * 10000000)}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket(firebaseConfig.storageBucket)
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return imageUrl;
      })
      .then(url => {
        return res.json({ image_url: url });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};
