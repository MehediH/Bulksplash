#!/usr/bin/env node

const [,, ...args] = process.argv

let bulksplash;

try {
    bulksplash = require(`${process.cwd()}/node_modules/bulksplash/index`);
} catch (e) {
    bulksplash = require('./index');
}

bulksplash(args)