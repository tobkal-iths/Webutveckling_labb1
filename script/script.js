// Variables
const courses = [];

// On load
onload = function() {
    navigate('pages/start.html');
    loadCourses();
}

// Navigation
async function navigate(path, callback1 = null, callback2 = null) {
    await fetch(path)
    .then(data => data.text())
    .then(html => document.getElementById('contentArea').innerHTML = html);

    if (callback1 !== null) {
        
        callback1();
        if (callback2 !== null) callback2();
    }
}

// Load courses
async function loadCourses() {
    let response = await fetch('json/courses.json');

    if (response.ok) { // if HTTP-status is 200-299
    // get the response body (the method explained below)
        let json = await response.json();
        jsonToCourses(json);
    } else {
    alert("HTTP-Error: " + response.status);
    }
}

function jsonToCourses(json) {
    for (let i = 0; i < json.length; i++) {
        courses.push(json[i]);
    }
}

//Make popular course cards
function makePopularCards() {
    let html = '';
    console.log(`courses: ${courses}`);
    let tmp = courses.sort(function(a, b){return b.purchases-a.purchases}).slice(0, 3);
    console.log(`tmp: ${tmp}`);
    for (let i = 0; i < tmp.length; i++) {
        html += makeCourseCard(tmp[i]);
    }
    console.log(`html: ${html}`);
    document.getElementById('popular-cards').innerHTML = html;
}

//Make ongoing course cards
function makeOngoingCards() {
    let html = '';
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].ongoing == true) html += makeCourseCard(courses[i]);
    }
    document.getElementById('ongoing-cards').innerHTML = html;
}

//Make course card
function makeCourseCard(course) {
    return `<div class="card"><h1>${course.name}</h1><img src="${course.img}" alt="${course.imgalt}"><h2>${course.pitch}</h2><p>${course.info}</p><p class="card-signature">fr. ${course.price} spänn</p></div>`
}