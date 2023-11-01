import { System } from './system';
import { Auth } from './auth';
import { Messaging } from './messaging';
import { Group } from './group';

interface PackageList {
	[key: string]: any;
}

let Packages: PackageList = {
	System,
	Auth,
	Messaging,
	Group,
} as PackageList;

export default Packages
