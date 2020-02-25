const { admin, db } = require("../util/admin");

const firebaseConfig = require("../util/config");

const { validateAddDoctorData } = require("../util/validators");

exports.getAllDoctors = (req, res) => {
  try {
    db.ref("/doctors").on("value", snapshot => {
      if (snapshot.exists()) {
        let doctors = [];
        snapshot.forEach(doc => {
          let docData = doc.val();
          doctors.push({
            id: docData.id,
            image_url: docData.image_url,
            name: docData.name,
            location: docData.location,
            phone_number: docData.phone_number,
            description: docData.description,
            searchName: docData.search_name,
            searchLocation: docData.search_location
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

exports.postOneDoctor = (req, res) => {
  const docData = req.body;
  const newDoctor = {
    image_url:
      docData.image_url ||
      "https://firebasestorage.googleapis.com/v0/b/wedagedara-717e9.appspot.com/o/no_user.png?alt=media",
    name: docData.name,
    location: docData.location,
    description: docData.description,
    phone_number: docData.phone_number,
    search_name: docData.search_name,
    search_location: docData.search_location,
    created_at: new Date().toISOString()
  };

  const { valid, errors } = validateAddDoctorData(newDoctor);

  if (!valid) return res.status(400).json(errors);

  const docRef = db.ref("doctors");
  const newRef = docRef.push();
  newDoctor.id = newRef.key;
  docRef.child(newRef.key).set(newDoctor, err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong!" });
    } else {
      console.log("Successfully submitted!");
      return res.status(200).json({ message: "Successfully submitted!" });
    }
  });
};

exports.updateDoctor = (req, res) => {
  const docData = req.body;
  const updatedDoc = {
    id: req.params.id,
    image_url:
      docData.image_url ||
      "https://firebasestorage.googleapis.com/v0/b/wedagedara-717e9.appspot.com/o/no_user.png?alt=media",
    name: docData.name,
    location: docData.location,
    description: docData.description,
    phone_number: docData.phone_number,
    search_name: docData.search_name,
    search_location: docData.search_location,
    updated_at: new Date().toISOString()
  };

  const { valid, errors } = validateAddDoctorData(updatedDoc);

  if (!valid) return res.status(400).json(errors);

  const docRef = db.ref("doctors");
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

// .then(() => {
//   // const resDoctor = doc;
//   // resDoctor.doctor_id = newRef.key;
//   return res.json({ message: "Successfully submitted!" });
// })
// .catch(err => {
//   console.error(err);
//   return res.status(500).json({ error: "Something went wrong!" });
// })

exports.getDoctor = (req, res) => {
  let doctorData = {};
  db.ref(`/doctors/${req.params.doctorId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Doctor not found!" });
      }
      doctorData = doc.data();
      doctorData.doctorId = doc.id;
      return res.json(doctorData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.deleteDoctor = (req, res) => {
  const node = db.ref(`/doctors/${req.params.id}`);
  node
    .remove()
    .then(() => {
      return res.status(200).json({ message: "Doctor successfully deleted!" });
    })
    .catch(error => {
      console.log(error);
      return res.status(404).json({ error: "Doctor not found!" });
    });
};

//Upload a student profile image
exports.uploadDoctorImage = (req, res) => {
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

exports.updateDoctorImage = (req, res) => {
  const imageUrl = {
    imageUrl: req.body.imageUrl
  };

  db.doc(`doctor/${req.body.doctorId}`)
    .update({ imageUrl })
    .then(() => {
      return res.json({ message: "Image uploaded succesfully!" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong!" });
    });
};
