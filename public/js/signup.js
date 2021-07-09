console.log("all okk");
const submit = document.getElementById("submit");
function validation() {
  var name = document.getElementById("name").value.trim();
  var branchName = document.getElementById("BranchName").value.trim();
  var phoneNumber = document.getElementById("phoneNumber").value.trim();
  var password = document.getElementById("password").value.trim();
  var conform = document.getElementById("passwordConfirmation").value.trim();
  var email = document.getElementById("email").value.trim();
  var c = document.getElementById("checking");
  if (
    name === "" &&
    branchName === "" &&
    phoneNumber === "" &&
    password === "" &&
    conform === "" &&
    email === ""
  ) {
    c.innerHTML = "<b>Fill the form</b>";
    c.classList.add("alert-danger");
    return false;
  }
  if (name === "" || name.length <= 2) {
    c.innerHTML = "<b>**Enter Your Name Correctly **</b>";
    c.classList.add("alert-danger");
    return false;
  }

  var letters = /^[ A-Za-z]+$/;
  if (!name.match(letters)) {
    c.innerHTML = "<b>Correctly fill your name</b>";
    c.classList.add("alert-danger");
    return false;
  }

  if (branchName === "") {
    c.innerHTML = "<b>Enter Your branch Name </b>";
    c.classList.add("alert-danger");
    return false;
  }

  if (password === "") {
    c.innerHTML = "<b>** Enter Password</b>";
    c.classList.add("alert-danger");
    return false;
  }

  if (conform === "") {
    c.innerHTML = "<b>**Enter Conformation BOX**</b>";
    c.classList.add("alert-danger");
    return false;
  }

  if (isNaN(phoneNumber) == true) {
    c.innerHTML = "<b>Wrong NUMBER</b>";
    c.classList.add("alert-danger");
    return false;
  }

  if (phoneNumber === "" || phoneNumber.length != 10) {
    c.innerHTML = "<b>Enter your Number Correctly</b>";
    c.classList.add("alert-danger");
    return false;
  }

  if (password != conform) {
    c.innerHTML = "<b>Check Your password</b>";
    c.classList.add("alert-danger");
    return false;
  }

  if (password.length < 6) {
    c.innerHTML = "<b>Password is to Short</b>";
    c.classList.add("alert-danger");
    return false;
  }
  if (email === "") {
    c.innerHTML = "<b>Enter Your Email id </b>";
    c.classList.add("alert-danger");
    return false;
  }
  if (email.indexOf("@") <= 0) {
    c.innerHTML = "<b>Invalid Email id</b>";
    c.classList.add("alert-danger");
    return false;
  }
  if (
    email.charAt(email.length - 4) != "." &&
    email.charAt(email.length - 3) != "."
  ) {
    c.innerHTML = "<b>Invalid Email id</b>";
    c.classList.add("alert-danger");
    return false;
  }
  return true;
}
submit.addEventListener("click", (event) => {
  event.preventDefault();

  var name = document.getElementById("name");
  var branchName = document.getElementById("BranchName");
  var phoneNumber = document.getElementById("phoneNumber");
  var password = document.getElementById("password");
  var conform = document.getElementById("passwordConfirmation");
  var email = document.getElementById("email");

  if (validation()) {
    fetch("http://localhost:3000/signup", {
      method: "POST",
      body: {
        name,
        branchName,
        phoneNumber,
        password,
        conform,
        email,
      },
    }).then((res) => {
      console.log(res);

      swal(
        "You have Successfully Registered!",
        "You clicked the button!",
        "success"
      );
      name.value = "";
      branchName.value = "";
      phoneNumber.value = "";
      password.value = "";
      conform.value = "";
      email.value = "";

      var c = document.getElementById("checking");
      c.classList.remove("alert-danger");
      c.innerHTML = "";
    });
  }
});