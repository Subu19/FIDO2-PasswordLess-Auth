import * as webauthn from "./webauthn.js";

async function registerUser() {
  if (document.getElementById("username").value.trim() != "")
    axios
      .post("/getchallenge", {
        withId: false,
        username: document.getElementById("username").value.trim(),
      })
      .then(async (res) => {
        const registration = await webauthn.client.register(
          document.getElementById("username").value,
          res.data.challenge,
          {
            authenticatorType: "auto",
            userVerification: "required",
            timeout: 60000,
            attestation: false,
            userHandle: "recommended to set it to a random 64 bytes value",
            debug: false,
          }
        );

        axios
          .post("/register", {
            registration: registration,
            clientId: res.data.clientId,
          })
          .then((res) => {
            console.log(res);
            res.data.message
              ? showInfo(res.data.message)
              : showAlert(res.data.err);
          });
      });
  else {
    showAlert("Dont you have a name?");
  }
}

async function loginUser() {
  if (document.getElementById("username").value.trim() != "")
    axios
      .post("/getchallenge", {
        withId: true,
        username: document.getElementById("username").value.trim(),
      })
      .then(async (res) => {
        const authentication = await webauthn.client.authenticate(
          [res.data.cId],
          res.data.challenge,
          {
            authenticatorType: "auto",
            userVerification: "required",
            timeout: 60000,
          }
        );

        axios
          .post("/login", {
            authentication: authentication,
            clientId: res.data.clientId,
            username: document.getElementById("username").value.trim(),
          })
          .then((res) => {
            if (res.data.message == "success") {
              location.pathname = "/secret";
            } else {
              showAlert(res.data.err || "Login failed! Please try again!");
            }
          });
      });
  else {
    showAlert("Dont you have a name?");
  }
}

functions.loginUser = loginUser;
functions.registerUser = registerUser;
