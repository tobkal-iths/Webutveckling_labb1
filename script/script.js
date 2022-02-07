// Variables
const courses = [];
const cart = [];

// Classes
class course {
    constructor(id, title, img, imgalt, pitch, info, length, price, active, purchases) {
        this.id = id;
        this.title = title;
        this.img = img;
        this.imgalt = imgalt;
        this.pitch = pitch;
        this.info = info;
        this.length = length;
        this.price = price;
        this.active = active;
        this.purchases = purchases;
    }
}

// On load
onload = function() {
    navigate('pages/start.html');
    loadCourses();
    updateCartText();
}

// Load courses
async function loadCourses() {
    let response = await fetch('json/courses.json');
    console.log(response);

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

//Make popular course cards
function makePopularCards() {
    let html = '';
    let tmp = courses.sort(function(a, b){return b.purchases-a.purchases}).slice(0, 3);
    for (let i = 0; i < tmp.length; i++) {
        html += makeCourseCard(tmp[i]);
    }
    document.getElementById('popular-cards').innerHTML = html;
}

//Make active course cards
function makeActiveCards() {
    let html = '';
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].active) html += makeCourseCard(courses[i]);
    }
    document.getElementById('active-cards').innerHTML = html;
}

//Make course card
function makeCourseCard(course) {
    return `<div class="card">
        <h1>${course.title}</h1>
        <p class="card-length">Kurslängd: ${course.length} veckor.</p>
        <img src="${course.img}" alt="${course.imgalt}">
        <h2>${course.pitch}</h2>
        <p>${course.info}</p>
        <button class="card-btn" onclick="addCourseToCart(${course.id})" type="button" ${course.active ? '>Köp' : 'disabled>Ej tillgänglig'}</button>
        <p class="card-signature">fr. ${course.price} spänn</p>
    </div>`;
}

//Make cart items
function makeCartItems() {
    let html = '';
    for (let i = 0; i < cart.length; i++) {
        html += makeCartItem(cart[i]);
    }
    document.getElementById('cart-list').innerHTML = html;
}

//Make cart item
function makeCartItem(id) {
    let course = courses.find(c => c.id === id)
    return `
    <div class="cart-item">
        <p>${course.title}</p>
        <p>${course.price}</p>
        <button class="cart-btn" onclick="removeCourseFromCart(${id})" type="button">Ta bort från kundvagn</button>
    </div>`;
}

// Add course to cart
function addCourseToCart(id) {
    if (cart.includes(id)) {
        alert('Du har redan lagt till den kursen i kundvagnen.');
    } else {
        cart.push(id);
    }
    updateCartText();
}

// Remove course from cart
function removeCourseFromCart(id) {
    if (cart.includes(id)) {
        cart.splice(cart.indexOf(id), 1);
        updateCartText();
        makeCartItems();
    }
}

//Update cart button text
function updateCartText() {
    document.getElementById('cart-btn').innerHTML = `Kundvagn (${cart.length})`
}

// Add course to cart
function addNewCourse() {
    alert('Lägg till ny kurs');
}

// Add course to cart
function finalizePurchase() {
    cart.length = 0;
    updateCartText();
    makeCartItems();
    alert('Tack för köpet!');
}