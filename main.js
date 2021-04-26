const _ = require('lodash');
const express = require('express');
const jsdom = require('jsdom');
const cors = require('cors');
const fetch = require('node-fetch');
// const JSDOM = jsdom.JSDOM;
const { JSDOM } = jsdom;

const PORT = 3000;

const state = {
    groups: [],
}

async function getDocument(url) {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    return dom.window.document;
}

async function getGroupsList() {
    const document = await getDocument('https://lks.bmstu.ru/schedule/list');
    const groupsElems = [...document.querySelectorAll('.btn.btn-primary.text-nowrap')];
    const groups = groupsElems.map(a => a.textContent.trim())
    return groups;
}

async function updateGroupsList() {
    const groups = await getGroupsList();
    state.groups = groups;
}

async function main() {
    await updateGroupsList();

    const periodMs = 1000 * 60 * 60;
    setInterval(updateGroupsList, periodMs);
    const app = express();
    
    app.use(cors()) 
    app.get('/', (req, res) => {
        res.send(state.groups);
    });
    app.listen(PORT);

    console.log(`App is running on port ${PORT}`);
}

main();