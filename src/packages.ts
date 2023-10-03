import { System } from './packages/system';

interface PackageList {
	[key: string]: any;
}

let Packages: PackageList = {
	System,
} as PackageList;

export default Packages
