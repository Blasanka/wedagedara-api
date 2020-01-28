const { admin, db } = require("../util/admin");

const firebaseConfig = require("../util/config");

const { validateAddStudentData } = require("../util/validators");

exports.getAllDoctors = (req, res) => {
  try {
    db.ref("/doctors").on("value", snapshot => {
      if (snapshot.exists()) {
        let doctors = [];
        snapshot.forEach(doc => {
          let docData = doc.val();
          doctors.push({
            doctorId: docData.doctor_id,
            fullname: docData.full_name,
            imageUrl: docData.image_url,
            location: docData.location,
            phoneNumber: docData.phone_number,
            searchFullName: docData.search_full_name,
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
  const newStudent = {
    fullname: req.body.fullname,
    nic: req.body.nic,
    index: req.body.index,
    department: req.body.department,
    address: req.body.address,
    email: req.body.email,
    mobile_number: req.body.mobile_number,
    parents_number: req.body.parents_number,
    dob: req.body.dob,
    gender: req.body.gender,
    religion: req.body.religion,
    imageUrl: req.body.imageUrl,
    createdAt: new Date().toISOString()
  };

  const { valid, errors } = validateAddStudentData(newStudent);

  if (!valid) return res.status(400).json(errors);

  return db
    .collection("students")
    .add(newStudent)
    .then(doc => {
      const resStudent = newStudent;
      resStudent.studentId = doc.id;
      return res.json(resStudent);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong!" });
    });
};

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
  const document = db.doc(`/doctors/${req.params.studentId}`);

  document
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Doctor not found!" });
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
        return res.json({ imageUrl: url });
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

  db.doc(`students/${req.body.studentId}`)
    .update({ imageUrl })
    .then(() => {
      return res.json({ message: "Image uploaded succesfully!" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong!" });
    });
};
