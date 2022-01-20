import Endpoint from "./camel/Endpoint";

require('hard-rejection')();

import {scribe} from "../typedefs/core";

export {scribe} from "../typedefs/core";

import matcher = require('matcher');
import path = require('path');
import fs = require("fs");

import d = require("./utils/docblocks");
import tools = require('./tools');
import Writer = require("./writer");
import Extractor = require("./extractor");
import OutputEndpointData = require("./camel/OutputEndpointData");
import camel = require('./camel/camel');

const defaultOptions = {force: false, noExtraction: false, verbose: false};
process.env.SCRIBE_VERSION = process.env.SCRIBE_VERSION || require('../package.json').version;

class Scribe {
    constructor(
        public config: scribe.Config,
        public router: scribe.SupportedRouters,
        public endpoints: scribe.Route[],
        private serverStartCommand?: string,
        private options = defaultOptions
    ) {
        tools.setVerbosity(options.verbose);
        // Reset this map (useful for tests)
        camel.groupFileNames = {};
    }

    async generate() {
        if (this.router === 'express' && !this.serverStartCommand && !this.options.noExtraction) {
            tools.warn(
                "You have response calls turned on, but we couldn't find a way to start your server.\n"
                + "You can either start your server manually, or specify its file path with the `--server` flag, \n"
                + "for example, `--server index.js`."
            );
        }

        let groupedEndpoints: Group[] = [];
        if (this.options.force) {
            tools.info(`Extracting API details...`);
            groupedEndpoints = await this.extractEndpointsInfoAndWriteToDisk(false);
            await this.extractAndWriteApiDetailsToDisk(!this.options.force);
            tools.info(`Done.`);
        } else if (!this.options.noExtraction) {
            tools.info(`Extracting API details...`);
            groupedEndpoints = await this.extractEndpointsInfoAndWriteToDisk(true);
            await this.extractAndWriteApiDetailsToDisk(!this.options.force);
            tools.info(`Done.`);
        } else {
            if (!fs.existsSync(camel.camelDir)) {
                tools.error(`Can't use --no-extraction because there's no data in the ${camel.camelDir} directory.`);
                process.exit(1);
            }
            tools.info(`Loading API details from .scribe folder...`);
            groupedEndpoints = camel.loadEndpointsIntoGroups(camel.camelDir);
            tools.success("Done.");
        }

        const userDefinedEndpoints = camel.loadUserDefinedEndpoints(camel.camelDir);
        groupedEndpoints = this.mergeUserDefinedEndpoints(groupedEndpoints, userDefinedEndpoints);

        console.log();
        tools.info(`Writing docs...`);

        const writer = new Writer(this.config);
        await writer.writeDocs(groupedEndpoints);

        if (Extractor.encounteredErrors) {
            tools.warn('Generated docs, but encountered some errors while processing routes.');
            tools.warn('Check the output above for details.');
            return;
        }

        console.log();
        tools.success(`Done. Your docs are in ${path.resolve(this.config.outputPath)}`)
    }
