import { OAuth2Server } from "oauth2-mock-server";

const server = new OAuth2Server();

async function start() {
	// Generate RSA key for signing tokens
	await server.issuer.keys.generate("RS256");

	// Start server on port 8080
	await server.start(8080, "localhost");

	console.log("OAuth2 Mock Server running on http://localhost:8080");
	console.log("Endpoints:");
	console.log("  Authorization: http://localhost:8080/authorize");
	console.log("  Token: http://localhost:8080/token");
	console.log("  JWKS: http://localhost:8080/.well-known/jwks.json");
	console.log(
		"  OpenID Config: http://localhost:8080/.well-known/openid-configuration",
	);
	console.log("\nPress Ctrl+C to stop the server");
}

start().catch(console.error);
