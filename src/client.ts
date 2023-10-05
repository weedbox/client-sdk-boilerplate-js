import EventEmitter from './eventemitter';
import { JSONRPC, Notification } from './jsonrpc2';
import Packages from './packages';

class Client extends EventEmitter {
	[index: string]: any;

	serverUrl: string;
	ws: any;
	finished: boolean;
	jsonrpc: JSONRPC;
	reconnectTimer: ReturnType<typeof setTimeout>;
	healthcheckTimer: ReturnType<typeof setTimeout>;

	constructor(url: string) {
		super();
		this.finished = false;
		this.serverUrl = url;
		this.jsonrpc = new JSONRPC();
		this.reconnectTimer = setTimeout(() => '', 0);
		this.healthcheckTimer = setTimeout(() => '', 0);

		// Loading packages
		for (let name in Packages) {
			let pkg = Packages[name];
			this[name] = new pkg(this);
		}

		// Initializing RPC events
		this.initRPC();
	}

	healthcheck() {

		clearTimeout(this.healthcheckTimer);

		this.healthcheckTimer = setTimeout(async () => {

			console.log('ping');

			try {
				await this.System.ping();
			} catch(e) {
				console.error('System.ping: timeout.');

				// Attempt to reconnect
				this.reconnect(1000);

				return;
			}

			this.healthcheck();

		}, 1000);
	}

	initRPC() {

		this.jsonrpc.on('notification', (msg: Notification) => {
			let args: [string, ...any[]] = [ 'event', msg ];
			this.emit.apply(this, args);
		});

		this.jsonrpc.on('invoke', (job: any) => {

			if (this.ws.readyState != WebSocket.OPEN) {
				this.jsonrpc.closeJob(job, {}, new Error('Connection is not ready'))
				return;
			}

			this.ws.send(JSON.stringify(job));
		})
	}

	reconnect(timeout:number = 0) {

		this.disconnect();

		setTimeout(() => {
			this.connect();
		}, timeout)
	}

	disconnect() {
		clearTimeout(this.reconnectTimer);
		this.finished = false;
		this.ws.close();
	}

	createConnection(url: string): Promise<boolean> {

		return new Promise((resolve: (value: boolean) => void, reject: (value: Error) => void) => {

			this.ws = new WebSocket(url);

			this.ws.onopen = () => {

				this.healthcheck();

				this.emit('connected');

				resolve(true);
			};

			this.ws.onmessage = (evt: MessageEvent) => {
				this.receiveMessage(evt.data)
			};

			this.ws.onerror = (e: Error) => {
				this.emit('error');
				reject(e);
			};

			this.ws.onclose = (evt: MessageEvent) => {

				clearTimeout(this.healthcheckTimer);

				this.emit('disconnected');

				// try to reconnect after 3 seconds
				if (!this.finished) {
					this.reconnectTimer = setTimeout(() => {
						this.connect();
					}, 3000);
				}
			};

		});
	}

	connect() {
		this.finished = false;
		return this.createConnection(this.serverUrl);
	}

	receiveMessage(data: string) {
		this.jsonrpc.receive(data);
	}

	invokeMethod(methodName: string, params: Array<any> = [], timeout?: number) {
		return this.jsonrpc.invokeMethod(methodName, params, timeout);
	}
}

const Event = Notification;

export {
	Client,
	Event,
}
