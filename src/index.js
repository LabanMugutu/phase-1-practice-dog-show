// Wait for the entire page (DOM) to load before running the script
document.addEventListener("DOMContentLoaded", () => {
  // Get reference to the form and table body
  const form = document.getElementById("dog-form");
  const tableBody = document.getElementById("table-body");

  // This holds the ID of the dog currently being edited
  let currentDogId = null;

  // Fetch all dogs and display them on page load
  fetchDogs();

  // Fetch dogs from the server
  function fetchDogs() {
    fetch("http://localhost:3000/dogs")
      .then(res => res.json())
      .then(dogs => {
        tableBody.innerHTML = ""; // Clear table before inserting
        dogs.forEach(renderDog); // Render each dog
      })
      .catch(err => console.error("Error fetching dogs:", err));
  }

  // Render a dog in the table
  function renderDog(dog) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${dog.name}</td>
      <td>${dog.breed}</td>
      <td>${dog.sex}</td>
      <td>
        <button class="btn btn-sm btn-primary" data-id="${dog.id}">Edit</button>
      </td>
    `;

    // Add event listener to Edit button
    const editBtn = tr.querySelector("button");
    editBtn.addEventListener("click", () => {
      form.name.value = dog.name;
      form.breed.value = dog.breed;
      form.sex.value = dog.sex;
      currentDogId = dog.id;
    });

    tableBody.appendChild(tr);
  }

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload

    if (!currentDogId) return; // Do nothing if no dog selected

    const updatedDog = {
      name: form.name.value,
      breed: form.breed.value,
      sex: form.sex.value,
    };

    // Send PATCH request to update dog on server
    fetch(`http://localhost:3000/dogs/${currentDogId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedDog)
    })
    .then(res => res.json())
    .then(() => {
      currentDogId = null;
      form.reset();
      fetchDogs(); // Refresh the dog list
    })
    .catch(err => console.error("Error updating dog:", err));
  });
});
