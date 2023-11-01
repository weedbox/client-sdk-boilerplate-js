import { Client } from '../client';

interface AuthenticateResponse {
	success: boolean;
	userID: string;
}

class Auth {
	client: Client;
	authdata: any;
	constructor(client: Client) {
		this.client = client;
		this.authdata = {};
	}

	async authenticate(token: string): Promise<AuthenticateResponse> {
		let res = await this.client.invokeMethod('Auth.Authenticate', [ token ]);

		if (res.success) {
			this.authdata = res.data;
		}

		return res;
	}
}

export {
	Auth,

	// interfaces
	AuthenticateResponse,
}
