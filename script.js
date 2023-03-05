// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD85BAby3T_pwJmZU5hG0FEC_Q3N_g76dg",
  authDomain: "arshipper-39149.firebaseapp.com",
  projectId: "arshipper-39149",
  storageBucket: "arshipper-39149.appspot.com",
  messagingSenderId: "436773361855",
  appId: "1:436773361855:web:65c7f1edb60eb352e40e0a",
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// Get the necessary elements from the DOM
const imageForm = document.querySelector("#image-form");
const imageInputs = document.querySelector("#image-inputs");
const addImageButton = document.querySelector("#add-image");

// Track the number of image input fields on the page
let numImageFields = 1;

// Add an event listener to the "Add Image" button
addImageButton.addEventListener("click", () => {
  // Create a new input element and label
  const newInput = document.createElement("input");
  const newLabel = document.createElement("label");
  newInput.type = "file";
  newInput.name = `image-${++numImageFields}`;
  newInput.id = `image-${numImageFields}`;
  newInput.className = "form-control-file image-file";
  newLabel.htmlFor = `image-${numImageFields}`;
  newLabel.className = "form-label";
  newLabel.textContent = `Image ${numImageFields}:`;

  // Add the new input and label to the DOM
  const newDiv = document.createElement("div");
  newDiv.className = "mb-3";
  newDiv.appendChild(newLabel);
  newDiv.appendChild(newInput);
  imageInputs.appendChild(newDiv);

  // Add a change event listener to the new input field
  newInput.addEventListener("change", (event) => {
    console.log(event.target.files[0]);
  });
});

// Add an event listener to the form submission
imageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Collect all file input elements
  const fileInputs = document.querySelectorAll(".image-file");

  // Upload each selected file to Firebase Storage
  const uploadPromises = [];
  for (const input of fileInputs) {
    const fileList = input.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      const storageRef = storage.ref(`images/${file.name}`);
      const uploadTask = storageRef.put(file);
      uploadPromises.push(uploadTask);
    }
  }

  // Wait for all uploads to complete and log the download URLs
  const downloadURLs = [];
  try {
    const uploadSnapshots = await Promise.all(uploadPromises);
    for (const snapshot of uploadSnapshots) {
      const downloadURL = await snapshot.ref.getDownloadURL();
      downloadURLs.push(downloadURL);
    }
    console.log("Download URLs:", downloadURLs);

    // Retrieve existing data from local storage or initialize an empty array
    const storedData = JSON.parse(localStorage.getItem("imageData")) || [];

    // Add the new data to the existing array
    const newData = storedData.concat(downloadURLs);

    // Show length in #files
    for (let i = 1; i <= 6; i++) {
      const filesP = document.getElementById(`files${i}`);
      if (filesP) {
        filesP.textContent = `${newData.length}`;
      }
    }

    for (let i = 1; i <= 8; i++) {
      const filesC = document.getElementById(`files1.${i}`);
      filesC.textContent = `${newData.length}`;
    }

    // Show data in modal
    const modalBody = document.querySelector(".modal-body");
    for (const url of newData) {
      const img = document.createElement("img");
      img.src = url;
      img.style.marginTop = "10px";
      img.style.width = "50px";
      img.style.height = "50px";
      modalBody.appendChild(img);
    }
    if (newData.length > 0) {
      oldP.style.marginTop = "15px";
      oldP.textContent = "Old Image";
    }

    // Store the updated array back in local storage
    localStorage.setItem("imageData", JSON.stringify(newData));
    const modal = document.getElementById("staticBackdrop");
    const bootstrapModal = bootstrap.Modal.getInstance(modal);

    alert("Images uploaded successfully!");
    bootstrapModal.hide();
  } catch (error) {
    console.error("Upload failed:", error);
  }
});

const oldP = document.getElementById("oldImage");

// Retrieve data from localStorage and set the text content of the 'files' p element
const storedData = JSON.parse(localStorage.getItem("imageData")) || [];
for (let i = 1; i <= 6; i++) {
  const filesP = document.getElementById(`files${i}`);
  if (filesP) {
    filesP.textContent = `${storedData.length}`;
  }
}

for (let i = 1; i <= 8; i++) {
  const filesC = document.getElementById(`files1.${i}`);
  filesC.textContent = `${storedData.length}`;
}

if (storedData.length > 0) {
  oldP.style.marginTop = "15px";
  oldP.textContent = "Old Image";
}
const modalBody = document.querySelector(".modal-body");
for (const url of storedData) {
  const img = document.createElement("img");
  img.src = url;

  img.style.width = "80px";
  img.style.height = "80px";
  modalBody.appendChild(img);
}
