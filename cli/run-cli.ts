#!/usr/bin/env node
const message: string = "Hello world"
console.log(message)

const [,, ...args] = process.argv