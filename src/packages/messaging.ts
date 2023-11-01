import { Client } from '../client';

interface Message {
	id: string;
	type: string;
	meta: MessageMeta;
	payload: any;
}

interface MessageMeta {
	sender: string;
	group: string;
	content_type: string;
	created_at: number;
	ref: Message;
}

class Messaging {
	client: Client;
	constructor(client: Client) {
		this.client = client;
	}

	ready(): Promise<void> {
		return this.client.invokeMethod('Messaging.Ready', []);
	}

	send(msg: Message): Promise<void> {
		return this.client.invokeMethod('Messaging.Send', [ msg ]);
	}
}

export {
	Messaging,
}
