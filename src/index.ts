import { Client } from './client';

export function createClient(url: string) {
	return new Client(url);
}
