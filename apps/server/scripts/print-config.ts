/**
 * Script that is used to asynchronously configure the drizzle ORM.
 * The configuration is usually stored in a JSON/YAML and the entire application is built around async resolving and loading of configuration. 
 * But top-level await is not supported by the drizzle.config.ts and drizzle-kit tool directly.
 * By loading it here we can rely on the import behaviour to await the configuration beforehand.
 * 
 * Here we load the config and print it.
 */

import {ConfigurationLoader, defaultConfigOptions} from "../src/index.js";

const loader = new ConfigurationLoader(defaultConfigOptions);
console.log(JSON.stringify(await loader.loadConfig()));