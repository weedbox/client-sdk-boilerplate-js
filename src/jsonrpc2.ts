import EventEmitter from './eventemitter';

interface Job {
	jsonrpc: string;
	id: number;
	method: string;
	params: any;
}

interface Notification {
	eventName: string;
	params: any[];
}

class JSONRPC extends EventEmitter {
	version: string;
	timeout: number;
	counter: number;
	jobs: Map<number, Job>;

	constructor() {
		super();

		this.version = '2.0';
		this.timeout = 30000;
		this.counter = 0;
		this.jobs = new Map();
	}

	receive(rawData: string) {

		let data = JSON.parse(rawData);

		// Notification
		if (!data.id) {

			let notification = {
				eventName: data.method,
				params: data.params,
			} as Notification;

			if (data.params instanceof Array) {
				notification.params = data.params;
			} else {
				notification.params = [ data.params ];
			}

			this.emit('notification', notification);
			return;
		}

		// Find job
		let job: Job | undefined = this.jobs.get(data.id);
		if (!job)
		  return;

		this.closeJob(job, data, data.error)
	}

	generateID() : number {
		return ++this.counter;
	}

	closeJob(job: Job, data: any, err: Error) {
		this.unregisterJob(job.id);
		this.emit('cb_' + job.id, data, err);
	}

	registerJob(job: Job) {
		this.jobs.set(job.id, job);
	}

	unregisterJob(id: number) {
		this.jobs.delete(id);
	}

	invokeMethod(method: string, params: Array<any> = [], timeout: number = this.timeout): Promise<any> {

		let id : number = this.generateID();

		// Prepare job
		let job = {} as Job;
		job.jsonrpc = this.version;
		job.id = id;
		job.method = method;
		job.params = params;

		this.registerJob(job);

		return new Promise((resolve: (value: any) => void, reject: (value: any) => void) => {

			// Timeout
			let timer = setTimeout(() => {
				this.unregisterJob(id);
				this.removeAllListeners('cb_' + id);
				reject(new Error('Timeout'));
			}, timeout);

			// Waiting for jobback
			this.once('cb_' + id, (data: any, err: Error) => {

				clearTimeout(timer);

				if (err)
					return reject(err);

				resolve(data.result);
			});

			this.emit('invoke', job);
		});
	}
}

export {
	JSONRPC,
	Notification
}
