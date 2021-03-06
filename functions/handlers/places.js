const { admin, db } = require("../util/admin");

const firebaseConfig = require("../util/config");

const { validateAddPlaceData } = require("../util/validators");

exports.getAllPlaces = (req, res) => {
  try {
    db.ref("/places").on("value", (snapshot) => {
      if (snapshot.exists()) {
        let places = [];
        snapshot.forEach((doc) => {
          let docData = doc.val();
          places.push({
            id: docData.id,
            name: docData.name,
            description: docData.description,
            latitude: docData.latitude,
            longitude: docData.longitude,
            image_url: docData.image_url,
            phone_number: docData.phone_number,
            duration: docData.duration,
            searchPlaceName: docData.search_place_name,
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

exports.postOnePlace = (req, res) => {
  const docData = req.body;
  const newPlace = {
    image_url:
      docData.image_url ||
      "https://firebasestorage.googleapis.com/v0/b/wedagedara-717e9.appspot.com/o/no_user.png?alt=media",
    name: docData.name,
    duration: docData.duration,
    description: docData.description,
    latitude: docData.latitude !== undefined ? docData.latitude : null,
    longitude: docData.longitude !== undefined ? docData.longitude : null,
    phone_number: docData.phone_number,
    search_name: docData.search_name,
    search_duration: docData.search_duration,
    created_at: new Date().toISOString(),
  };

  const { valid, errors } = validateAddPlaceData(newPlace);

  if (!valid) return res.status(400).json(errors);

  const docRef = db.ref("places");
  const newRef = docRef.push();
  newPlace.id = newRef.key;
  docRef.child(newRef.key).set(newPlace, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong!" });
    } else {
      console.log("Successfully submitted!");
      return res.status(200).json({ message: "Successfully submitted!" });
    }
  });
};

exports.updatePlace = (req, res) => {
  const docData = req.body;
  const updatedDoc = {
    id: req.params.id,
    image_url:
      docData.image_url ||
      "https://firebasestorage.googleapis.com/v0/b/wedagedara-717e9.appspot.com/o/no_user.png?alt=media",
    name: docData.name,
    duration: docData.duration,
    description: docData.description,
    latitude: docData.latitude !== undefined ? docData.latitude : null,
    longitude: docData.longitude !== undefined ? docData.longitude : null,
    phone_number: docData.phone_number,
    search_name: docData.search_name,
    search_duration: docData.search_duration,
    updated_at: new Date().toISOString(),
  };

  const { valid, errors } = validateAddPlaceData(updatedDoc);

  if (!valid) return res.status(400).json(errors);

  const docRef = db.ref("places");
  docRef.child(req.params.id).set(updatedDoc, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong!" });
    } else {
      console.log("Successfully updated!");
      return res.status(200).json({ message: "Successfully updated!" });
    }
  });
};

exports.deletePlace = (req, res) => {
  const node = db.ref(`/places/${req.params.id}`);
  node
    .remove()
    .then(() => {
      return res
        .status(200)
        .json({ message: "Medical Center successfully deleted!" });
    })
    .catch((error) => {
      console.log(error);
      return res.status(404).json({ error: "Medical Center not found!" });
    });
};

exports.uploadPlaceImage = (req, res) => {
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
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        return imageUrl;
      })
      .then((url) => {
        return res.json({ image_url: url });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};
