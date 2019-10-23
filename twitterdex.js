const fetch = require('node-fetch');
const fs = require('fs');
const Handlebars = require('handlebars');
const dotenv = require('dotenv');
dotenv.config();

// Twitter dependency
const Twit = require('twit');
const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
    // timeout_ms: 60 * 1000
})

// Formstack variables
const formId = '3315786';
const oauth_token = process.env.API_FS;

function getPageNos() {
    return new Promise(resolve => {
        fetch(`https://www.formstack.com/api/v2/form/${formId}/submission.json?oauth_token=${oauth_token}`)
            .then(response => response.json())
            .then(myJson => resolve(myJson.pages))
    })
}

async function getFormData(numberOfPages) {
    let data = [];
    for (let i = 1; i <= numberOfPages; i++) {
        let raw = await fetch(`https://www.formstack.com/api/v2/form/${formId}/submission.json?page=${i}&data=1&oauth_token=${oauth_token}`)
        let res = await raw.json();
        data.push(res.submissions);
    }
    return data.reduce((acc, cv) => acc.concat(cv), []);
}

function checkForDuplicates(data) {
    const urlCheck = [];

    data.forEach(item => urlCheck.push(item.data[73001016].value));

    const duplicatesArr = urlCheck.filter((item, index) => urlCheck.indexOf(item) != index);

    if (duplicatesArr.length === 0) {
        return 0;
    } else {
        let duplicatesDataArr = [];

        duplicatesArr.forEach(item => {
            const index = urlCheck.indexOf(item);
            const id = data[index].id;
            const name = data[index].data[73000979].value;
            const firstName = name.match(/\s(\w+)\n/);
            const lastName = name.match(/\s\w+$/);

            duplicatesDataArr.push({
                index,
                id,
                'name': firstName[1] + lastName[0]
            })
        })
        return duplicatesDataArr;
    }
}

async function deleteDuplicates(usersToDelete) {
    return new Promise((resolve, reject) => {
        if (usersToDelete !== 0) {
            //do deletion
            resolve('duplicatesDeleted')
        } else {
            resolve(true)
        }
    })
}

function getTwitterData(userData) {

}

function getTwitterEmbedCode(tweetId) {

}

async function createTwitterdex() {
    const numberOfPages = await getPageNos();
    const data = await getFormData(numberOfPages);
    const duplicates = checkForDuplicates(data);

}

createTwitterdex();