
interface Topic {
	listeners: Map<any, EventListener>,
}

interface EventListener {
	isOnce: boolean,
	handler(...args: any[]): void,
}

export default class EventEmitter {
	private topics: Map<string, Topic>;
	constructor() {
		this.topics = new Map();
	}

	on(eventName: string, handler: (...args: any[]) => void) {

		// Trying to get existing topic info
		let topic: Topic | undefined = this.topics.get(eventName);

		// Doesn't exist
		if (!topic) {
			topic = {} as Topic;
			topic.listeners = new Map();
			this.topics.set(eventName, topic);
		}

		// Create a new listener
		let listener = {} as EventListener;
		listener.isOnce = false;
		listener.handler = handler;

		// Add to list
		topic.listeners.set(handler, listener);
	}

	once(eventName: string, handler: (...args: any[]) => void) {

		// Trying to get existing topic info
		let topic: Topic | undefined = this.topics.get(eventName);

		// Doesn't exist
		if (!topic) {
			topic = {} as Topic;
			topic.listeners = new Map();
			this.topics.set(eventName, topic);
		}

		// Create a new listener
		let listener = {} as EventListener;
		listener.isOnce = true;
		listener.handler = handler;

		// Add to list
		topic.listeners.set(handler, listener);
	}

	emit(eventName: string, ...restOfParams: any[]) {

		let topic: Topic | undefined = this.topics.get(eventName);

		// Do nothing if no listener
		if (!topic) {
			return;
		}

		// Trigger all listeners
		for (let listener of topic.listeners.values()) {

			// Remove listener which works at once
			if (listener.isOnce) {
				topic.listeners.delete(listener);
			}

			// Invoke
			listener.handler.apply(this, restOfParams);
		}
	}

	removeAllListeners(eventName: string) {
		this.topics.delete(eventName);
	}

}
