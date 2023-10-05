import { System } from './system';
import { Auth } from './auth';

interface PackageList {
	[key: string]: any;
}

let Packages: PackageList = {
	System,
	Auth,
} as PackageList;

export default Packages
