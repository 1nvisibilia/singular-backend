const frontEndURL = process.env.FRONTEND_SERVICE || "https://localhost:8000";

module.exports = `
<h1> 401 (Unauthorized) </h1>

<hr />

<p>You are trying to reach the backend service of the application Singular, which is only accesible through the socket and 
web API interfaces.<p>
<p>If you meant to access the game application <b><i>Singular</i></b>: <a href="${frontEndURL}">${frontEndURL}</a></p>
`;