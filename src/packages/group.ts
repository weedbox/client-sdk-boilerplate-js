import { Client } from '../client';
import { Message } from './messaging';

interface GetGroupsResponse {
	groups: GroupInfo[];
}

interface GroupInfo {
	id: string;
	name: string;
	class: string;
	meta: GroupMeta;
}

interface GroupMeta {
	desc: string,
	labels: string[];
}

interface History {
	seq: number;
	message: Message;
}

interface GroupHistory {
	histories: History[];
}

class Group {
	client: Client;
	constructor(client: Client) {
		this.client = client;
	}

	async getPublicGroupInfo(): Promise<GroupInfo> {

		let res = await this.client.invokeMethod('Group.GetGroups', [ 'system' ]);

		// Find public group
		let group = null;
		for (let i in res.groups) {
			if (res.groups[i].name == 'Public') {
				group = res.groups[i];
			}
		}

		return group;
	}

	getGroups(groupClass: string): Promise<GetGroupsResponse> {
		return this.client.invokeMethod('Group.GetGroups', [ groupClass ]);
	}

	enter(groupID: string): Promise<void> {
		return this.client.invokeMethod('Group.Enter', [ groupID ]);
	}

	getHistories(groupID: string): Promise<GroupHistory> {
		return this.client.invokeMethod('Group.GetHistories', [ groupID ]);
	}
}

export {
	Group,

	// interfaces
	GetGroupsResponse,
	GroupInfo,
	GroupMeta,
}
