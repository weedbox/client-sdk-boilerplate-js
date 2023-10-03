import { Client } from '../client';

interface CheckVersionResponse {
	success: boolean;
	reason: string;
	info: VersionInfo;
}

interface VersionInfo {
	version: string;
	url: string;
}

interface GetNoticeResponse {
	messages: string;
	updatedAt: Date;
}

class System {
	client: Client;
	constructor(client: Client) {
		this.client = client;
	}

	checkVersion(platform: string, version: string): Promise<CheckVersionResponse> {
		return this.client.invokeMethod('System.checkVersion', [ platform, version ]);
	}

	getNotice(options: object): Promise<GetNoticeResponse> {
		return this.client.invokeMethod('System.getNotice', [ options ]);
	}

	ping(): Promise<void> {
		return this.client.invokeMethod('System.Ping', [ Date.now() ], 10000);
	}

	ready(): Promise<void> {
		return this.client.invokeMethod('System.Ready', []);
	}
}

export {
	System,

	// interfaces
	CheckVersionResponse,
	VersionInfo,
	GetNoticeResponse,
}
