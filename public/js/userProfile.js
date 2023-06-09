const profileUsername = document.querySelector('#user-full-name');
const profileEmail = document.querySelector('#email')
const profilePetsAdopted = document.querySelector('#pets-adopted');
const profielFirstName = document.querySelector('#first-name');
const profileLastName = document.querySelector('#last-name');
const profileGender = document.querySelector('#gender');
const profileAddress = document.querySelector('#address');
const profilePhoneNumber = document.querySelector('#phone');
const profileCurrentPets = document.querySelector('#current-pets');
const profileAvatar = document.querySelector('#avatar');

const profileModal = $('#exampleModal');
const editFirstName = document.querySelector('#edit-first-name');
const editLastName = document.querySelector("#edit-last-name");
// const editGender = document.getElementsByName('edit-gender');
const editGenderFemale = document.querySelector("#edit-gender-female");
const editGenderMale = document.querySelector('#edit-gender-male');
const editAddress = document.querySelector("#edit-address");
const editPhone = document.querySelector("#edit-phone");
const editCurrentPets = document.querySelector("#edit-current-pets");
const saveChangeBtn = document.querySelector('#save-changes');
// const editMyBio = document.querySelector('#edit-my-bio');


const profilePageRender = async () => { 
  try {
    const response = await fetch(`/api/users/profile`);
    const userData = await response.json();
    const { email, first_name, last_name, gender, address, phone_number, currentPets ,petsAdopted} = userData;
    profileUsername.textContent = `${first_name} ${last_name}`;
    profileEmail.textContent = email;
    profilePetsAdopted.textContent = petsAdopted;
    profielFirstName.textContent = first_name;
    profileLastName.textContent = last_name;
    profileGender.textContent = gender;
    profileAddress.textContent = address;
    profilePhoneNumber.textContent = phone_number;
    profileCurrentPets.textContent = currentPets;
    editFirstName.setAttribute('value', first_name);
    editLastName.setAttribute('value', last_name);
    if (gender === 'female') {
      profileAvatar.setAttribute("src", "../assets/images/avatar-female.png");
      editGenderFemale.checked=true;
    } else { 
      profileAvatar.setAttribute("src", "../assets/images/avatar-male.png");
      editGenderMale.checked=true;
    }
    editAddress.setAttribute("value", address);
    editPhone.setAttribute("value", phone_number);
    editCurrentPets.setAttribute("value", currentPets);
  } catch (err) { 
    document.location.replace("../404.html");
    // console.log(err);
  }
    
}


const editProfileHandler = async (event) => { 
    event.preventDefault();

    const first_name = editFirstName.value.trim();
  const last_name = editLastName.value.trim();
  var gender;
    if (document.getElementById("edit-gender-female").checked) {
      gender = "female";
    } else {
       gender = "male";
    }

    const address = editAddress.value.trim();
    const phone_number = editPhone.value.trim();
    const currentPets = editCurrentPets.value.trim();

    const response = await fetch('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ first_name, last_name, gender, address, phone_number, currentPets }),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, hide the modal
        profileModal.modal('hide');
        document.location.replace('/html/userProfile.html');

    } else {
      alert(response.statusText);
    }
}

saveChangeBtn.addEventListener('click', editProfileHandler)

profilePageRender();

const user = document.querySelector("#user");
const signOutBtn = document.querySelector("#sign-out");
const loginBtn = $("#login-btn");
const signupBtn = $("#signup-btn");
const partition = document.querySelector("#partition");


const navBarRender = async () => {
  const session = await fetch("/api/users/status");
  const sessionData = await session.json();
  console.log(sessionData);
  if (sessionData.logged_in) {
    loginBtn.hide();
    signupBtn.hide();
    console.log(sessionData.user_email);
    user.textContent = `${sessionData.user_email}`;
    signOutBtn.textContent = "Sign out";
    partition.textContent = " | ";
  }
};

const signOut = async () => {
  const response = await fetch("/api/users/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    alert(response.statusText);
  }
};

signOutBtn.addEventListener("click", signOut);


//Home button
const homeBtn = document.querySelector(".home-btn")

homeBtn.addEventListener("click", () => {
  window.location.href = "/index.html";
});

//Searchbar
const searchbar = document.querySelector(".searchpet")
const searchtext = document.querySelector("#search-query")
searchbar.addEventListener("submit", function(event){
  event.preventDefault();
  fetchPetByBreed(searchtext.value)
})

//Grab necessary HTML elements for dynamic rendering
const categoriesDiv = document.querySelector(".categories") // to hide and unhide
const content = document.querySelector(".content") // content gets generated and deleted here

//Generate cards for a specific pet CATEGORY using data from a get request
categoryCards = document.querySelectorAll(".category-card")
categoryCards.forEach(categoryCard => {
  categoryCard.addEventListener('click', function(event){
    event.preventDefault()
    fetch('/api/pets', {
        method: 'GET',
        })
        .then((res) => res.json())
        .then((data) => {
            console.log('Successful GET request:', data);
  
            //hide the categories div and view all pets div
            categoriesDiv.setAttribute("style", "display: none")
            // var viewAll = document.querySelector("#view-all")
            // viewAll.setAttribute("style", "display: none")
  
            while (content.firstChild) {
              content.removeChild(content.firstChild);
            }
            //**generate html based off retrieved data**//
  
            //create pet cards (<a> tags) here
            for(var i=0; i < data.length; i++){
              if(data[i].category_id == categoryCard.dataset.id){
                let card = document.createElement('a')
                card.classList.add('pet-card')
       
                //generate pet image
                let petImage = document.createElement('img')
                petImage.setAttribute("src", `${data[i].Picture}`)
        
                //generate pet name
                let petName = document.createElement('p')
                petName.textContent = data[i].pet_name

                //add pet id to each <a> tag 
                card.setAttribute('data-id', `${data[i].id}`)
  
                //add event listener to clear content and generate individual pet details
                card.addEventListener("click", () => {
                  let petId = card.dataset.id
                  fetchPetData(petId)
                })
                
                //append newly generated html elements to the webpage
                card.appendChild(petImage)
                card.appendChild(petName)
                content.appendChild(card)

                // const url = window.location;
                // console.log(url);
                // const arr = url.pathname.split('/');
                // arr.pop();
                // arr.pop();
                // arr.push("index.html");
                // const newUrl = url.origin+arr.join('/');
                // history.pushState('', '', newUrl);

              }
            }
        })
        .catch((error) => {
            console.error('Error in GET request:', error);
        });        
    })
  })

//Function to generate card for a SINGLE PET using data from a get request
//(used as an event listener added to generated pet cards to make them clickable)

function fetchPetData(id) {
  fetch(`/api/pets/${id}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Successful GET request:", data);

      //hide the categories div and view all pets div
      categoriesDiv.setAttribute("style", "display: none");
      // var viewAll = document.querySelector("#view-all");
      // viewAll.setAttribute("style", "display: none");

      // delete any existing content in the content page
      while (content.firstChild) {
        content.removeChild(content.firstChild);
      }

      //**generate html based off retrieved data**//

      //pet image
      let petImage = document.createElement("img");
      petImage.setAttribute("src", `${data.Picture}`);
      petImage.setAttribute(
        "style",
        "width: 24rem; border-radius: 20px ; margin-bottom: 1.7%; "
      );

      //pet name
      let petName = document.createElement("h2");
      petName.textContent = data.pet_name;

      //pet details
      let petAge = document.createElement("p");
      petAge.textContent = `Age: ${data.Age}`;

      let petDescription = document.createElement("p");
      petDescription.textContent = data.Description;

      let petBreed = document.createElement("p");
      petBreed.textContent = `Breed: ${data.breed.breed_name}`;

      let petCategory = document.createElement("p");
      petCategory.textContent = data.category_name;

      let petSize = document.createElement("p");
      petSize.textContent = `Size: ${data.Size}`;

      let petSex = document.createElement("p");
      petSex.textContent = `Sex: ${data.Sex}`;

      let petCost = document.createElement("p");
      petCost.textContent = `Cost: $${data.Cost}`;

      let petLocation = document.createElement("p");
      petLocation.textContent = `Location: ${data.Location}`;

      document.querySelectorAll(".pet-details p").forEach((p) => {
        p.setAttribute(
          "style",
          "padding-left: 5%; font-size: large; align-self: end;"
        );
      });
      //APPEND EVERYTHING
      let petDetailsDiv = document.createElement("div");
      petDetailsDiv.classList.add("petDetailsDiv");
      petDetailsDiv.setAttribute(
        "style",
        "width: 100%; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; margin-bottom: 2%"
      );

      let petPhotoDiv = document.createElement("div");
      petPhotoDiv.classList.add("petPhotoDiv");
      // petPhotoDiv.setAttribute("style", "margin-left: 2%; padding-right: 5%; width: 30%");

      petPhotoDiv.setAttribute("style", "margin-left: 2%; padding-right: 2.5%"); //TESTING
      petPhotoDiv.appendChild(petImage);

      let infobox = document.createElement("div");
      infobox.classList.add("infobox");
      infobox.setAttribute(
        "style",
        "display: flex; flex-direction: column; justify-content: center; align-items: center;"
      );

      let adoptButton = document.createElement("button");
      adoptButton.textContent = "Adopt!";
      adoptButton.setAttribute(
        "style",
        "text-align: center; display: flex; justify-content: center; padding: 2%; padding-left: 2.5%; padding-right: 2.5%; border-radius: 6px; border-style: none; box-sizing: border-box; color: black; background-color: #1ac23c; flex: 1; margin-left: 10px; margin-right: 10px; font-size: large; font-weight: bold; align-text: center"
      );
      adoptButton.addEventListener("mouseover", function () {
        adoptButton.style.backgroundColor = "#04e209ff";
      });
      adoptButton.addEventListener("mouseout", function () {
        adoptButton.style.backgroundColor = "#1ac23c";
      });
      adoptButton.addEventListener("focus", function () {
        adoptButton.style.backgroundColor = "#04e209ff";
      });

      //add click event for adopt button
      const adoptBtnHandler = async () => {
        const response = await fetch(`/api/pets/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const petData = await response.json();
        console.log(petData);
        if (petData.message) {
          console.log(response, 222);
          document.location.href = "/html/login.html";
        } else {
          console.log(response, 111);
          console.log("adopted!");
          //if user is logged in then add the modal html to the page
          const mainContainer = document.querySelector(".main-container");
          const renderAdoptedModal = `<div class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"></h5>
        <button type="button" class="close modal-close-btn" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
    <lord-icon
        src="https://cdn.lordicon.com/tqywkdcz.json"
        trigger="loop"
          style="width:150px;height:150px">
    </lord-icon>
        <p>Thank you for your adoption! Our admin team will get contact with you shortly.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary modal-backToHome-btn" data-dismiss="modal">Back to Home Page</button>
      </div>
    </div>
  </div>
</div>`;
          mainContainer.insertAdjacentHTML("beforeend", renderAdoptedModal);
          //show the modal
          const adoptModal = $(".modal");
          adoptModal.modal("show");
          const backToHome = document.querySelector(".modal-backToHome-btn");
          backToHome.addEventListener("click", () => {
            document.location.replace("/");
          });
          const closeBtn = document.querySelector(".modal-close-btn");
          closeBtn.addEventListener("click", () => {
            console.log(closeBtn);
            adoptButton.textContent = "Adopted!";
            adoptButton.disabled = true;
          });
        }
      };

      adoptButton.addEventListener("click", adoptBtnHandler);

      let backButton = document.createElement("a");
      backButton.href = "./index.html";
      let backBtn = document.createElement("img");
      backBtn.src = "./assets/images/back.png";
      backBtn.setAttribute("style", "width: 58px; height: 58px");
      backButton.appendChild(backBtn);

      let backBtnDiv = document.createElement("div");
      backBtnDiv.classList.add("backBtnDiv");
      backBtnDiv.setAttribute(
        "style",
        "height: 100%; display: flex ; align-items: start"
      );
      backBtnDiv.appendChild(backButton);

      let petTextDiv = document.createElement("div");
      petTextDiv.classList.add("petTextDiv");
      petTextDiv.setAttribute("style", "font-size: 1.2rem;");
      petTextDiv.appendChild(petName);
      petTextDiv.appendChild(petAge);
      petTextDiv.appendChild(petCategory);
      petTextDiv.appendChild(petBreed);
      petTextDiv.appendChild(petDescription);
      petTextDiv.appendChild(petSize);
      petTextDiv.appendChild(petSex);
      petTextDiv.appendChild(petCost);
      petTextDiv.appendChild(petLocation);

      infobox.appendChild(petTextDiv);
      infobox.appendChild(adoptButton);

      let container = document.createElement("div");
      container.classList.add("container");
      // container.setAttribute("style", "display: flex; width: 60%; margin-left: 0; margin-right: 0; margin-bottom: 4%");
      container.setAttribute(
        "style",
        "display: flex; width: 60%; margin-left: 0; margin-right: 0;"
      ); //TESTING
      container.appendChild(infobox);
      container.appendChild(backBtnDiv);

      petDetailsDiv.appendChild(petPhotoDiv);
      petDetailsDiv.appendChild(container);
      content.appendChild(petDetailsDiv);

      // Define a media query
      const mediaQuery = window.matchMedia("(max-width: 768px)");

      // Define a function to handle the media query
      function handleMediaQuery(mediaQuery) {
        if (mediaQuery.matches) {
          // If the screen width is below 768px
          petPhotoDiv.style.cssText =
            "width: 100%; padding-right: 0; display: flex; justify-content: center;";
          container.style.width = "90%";
        } else {
          // If the screen width is above 768px
          // petPhotoDiv.style.width = '30%';
          // petPhotoDiv.style.paddingRight = '5%';
          petPhotoDiv.setAttribute(
            "style",
            "margin-left: 2%; padding-right: 2.5%"
          );
          // container.style.width = '100%';
          container.setAttribute(
            "style",
            "display: flex; width: 60%; margin-left: 0; margin-right: 0;"
          );
        }
      }

      // Call the function once to set the initial state
      handleMediaQuery(mediaQuery);

      // Add a listener to call the function whenever the screen size changes
      mediaQuery.addEventListener("change", handleMediaQuery);

      // Define a media query
      const mq2 = window.matchMedia("(max-width: 500px)");

      // Define a function to handle the media query
      function handleSmallScreen2(mq2) {
        if (mq2.matches) {
          // execute changes for screens with a maximum width of 500 pixels
          petPhotoDiv.style.cssText =
            "width: 100%; padding-right: 0; display: flex; justify-content: center;";
          container.style.width = "90%";

          petImage.setAttribute(
            "style",
            "width: 15rem; border-radius: 20px ; margin-bottom: 4%;"
          );
          petTextDiv.setAttribute("style", "font-size: 0.8rem");
          petName.setAttribute("style", "font-size: 1.2rem");
        } else {
          petImage.setAttribute(
            "style",
            "width: 24rem; border-radius: 20px ; margin-bottom: 1.7%;"
          );
          petPhotoDiv.setAttribute(
            "style",
            "margin-left: 2%; padding-right: 2.5%"
          );
          container.setAttribute(
            "style",
            "display: flex; width: 60%; margin-left: 0; margin-right: 0;"
          );
        }
      }

      handleSmallScreen2(mq2); // call the function once to check the initial state

      mq2.addEventListener("change", handleSmallScreen2); // add the listener function to the media query
    })
    .catch((error) => {
      console.error("Error in GET request:", error);
    });
}  


//Generate cards for a specific pet BREED using data from a get request (UNFINISHED)
function fetchPetByBreed(breedname){
  fetch('/api/pets/', {
    method: 'GET'
    })
    .then((res) => res.json())
    .then((data) => {
        console.log('Successful GET request:', data);

        //hide the categories div and view all pets div
        categoriesDiv.setAttribute("style", "display: none")
        // var viewAll = document.querySelector("#view-all")
        // viewAll.setAttribute("style", "display: none")

        while (content.firstChild) {
          content.removeChild(content.firstChild);
        }

        //**generate html based off retrieved data**//

        //create pet cards (<a> tags) here
        let check = false
        for(var i=0; i < data.length; i++){
          if(data[i].breed.breed_name.toLowerCase() == breedname.toLowerCase()){
            check = true
            let card = document.createElement('a')
            card.classList.add('pet-card')
   
            //generate pet image
            let petImage = document.createElement('img')
            petImage.setAttribute("src", `${data[i].Picture}`)
    
            //generate pet name
            let petName = document.createElement('p')
            petName.textContent = data[i].pet_name
            
            //add pet id to each <a> tag 
            card.setAttribute('data-id', `${data[i].id}`)

            //add event listener to clear content and generate individual pet details
            card.addEventListener("click", () => {
              let petId = card.dataset.id
              fetchPetData(petId)
            })
            
            //append newly generated html elements to the webpage
            card.appendChild(petImage)
            card.appendChild(petName)
            content.appendChild(card)
          }         
        }
        if (!check){
            let noResults = document.createElement('h2')
            noResults.textContent = "Breed not found! Please try again, or return home."
            content.appendChild(noResults)
            return
        }
        else{
          return
        }
    })
    .catch((error) => {
        console.error('Error in GET request:', error);
    });        
}


navBarRender();