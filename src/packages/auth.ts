import { Client } from '../client';

interface AuthenticateResponse {
	success: boolean;
	userID: string;
}

class Auth {
	client: Client;
	constructor(client: Client) {
		this.client = client;
	}

	authenticate(token: string): Promise<AuthenticateResponse> {
		return this.client.invokeMethod('Auth.Authenticate', [ token ]);
	}
}

export {
	Auth,

	// interfaces
	AuthenticateResponse,
}
