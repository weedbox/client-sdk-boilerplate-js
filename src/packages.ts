import { System } from './packages/system';
import { Auth } from './packages/auth';

interface PackageList {
	[key: string]: any;
}

let Packages: PackageList = {
	System,
	Auth,
} as PackageList;

export default Packages
