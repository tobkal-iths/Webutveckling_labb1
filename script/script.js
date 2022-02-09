// Variables
const courses = []
const cart = []

// Classes
class Course {
    constructor(object) {
        this.id = object.id
        this.title = object.title
        this.img = object.img
        this.imgalt = object.imgalt
        this.pitch = object.pitch
        this.info = object.info
        this.length = object.length
        this.price = object.price
        this.active = object.active
        this.purchases = object.purchases
    }
}

// On load
onload = function() {
    navigate('pages/start.html')
    loadCourses()
    updateCartText()
}

// Load courses
async function loadCourses() {
    let response = await fetch('json/courses.json')
    console.log(response)

    if (response.ok) { // if HTTP-status is 200-299
    // get the response body (the method explained below)
        let json = await response.json()
        jsonToCourses(json)
    } else {
    alert("HTTP-Error: " + response.status)
    }
}

function jsonToCourses(json) {
    for (let i = 0; i < json.length; i++) {
        courses.push(new Course(json[i]))
    }
}

// Navigation
async function navigate(path, callback1 = null, callback2 = null) {
    await fetch(path)
    .then(data => data.text())
    .then(html => document.getElementById('contentArea').innerHTML = html)

    if (callback1 !== null) {
        callback1();
        if (callback2 !== null) callback2()
    }
}

//Make popular course cards
function makePopularCards() {
    let html = ''
    let tmp = courses.sort(function(a, b) {return b.purchases-a.purchases}).slice(0, 3)
    for (let i = 0; i < tmp.length; i++) {
        html += makeCourseCard(tmp[i])
    }
    document.getElementById('popular-cards').innerHTML = html
}

//Make active course cards
function makeActiveCards() {
    let html = ''
    for (let i = 0; i < courses.length; i++) {
        if (courses[i].active) html += makeCourseCard(courses[i])
    }
    document.getElementById('active-cards').innerHTML = html
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
    </div>`
}

//Make cart items
function makeCartItems() {
    let html = '';
    for (let i = 0; i < cart.length; i++) {
        html += makeCartItem(cart[i]);
    }
    document.getElementById('cart-list').innerHTML = html
}

//Make cart item
function makeCartItem(id) {
    let course = courses.find(c => c.id === id)
    return `
    <div class="cart-item">
        <p>${course.title}</p>
        <p>${course.price} spänn</p>
        <button class="cart-btn" onclick="removeCourseFromCart(${id})" type="button">Ta bort</button>
    </div>`
}

// Add course to cart
function addCourseToCart(id) {
    if (cart.includes(id)) {
        alert('Du har redan lagt till den kursen i kundvagnen.')
        return
    }
    cart.push(id)
    updateCartText()
}

// Remove course from cart
function removeCourseFromCart(id) {
    if (cart.includes(id)) {
        cart.splice(cart.indexOf(id), 1)
        updateCartText()
        makeCartItems()
    }
}

//Update cart button text
function updateCartText() {
    document.getElementById('cart-btn').innerHTML = `Kundvagn (${cart.length})`
}

// Add course to cart
function addNewCourse() {
    alert('Lägg till ny kurs')
}

// Add course to cart
function finalizePurchase() {
    cart.length = 0
    updateCartText()
    makeCartItems()
    alert('Tack för köpet!')
}

// ModalAccept

function modalAccept(message) {
    // Get data from modal
    const modal = document.getElementById("myModal")
    const title = document.getElementById("modalInputTitle")
    const img = document.getElementById("modalInputImg")
    const imgalt = document.getElementById("modalInputImgalt")
    const pitch = document.getElementById("modalInputPitch")
    const info = document.getElementById("modalInputInfo")
    const length = document.getElementById("modalInputLength")
    const price = document.getElementById("modalInputPrice")
    const active = document.getElementById("modalInputActive")

    // Make object from data
    let courseObj = {
        id: courses.length + 1,
        title: title.value != "" ? title.value : "Ny kurs",
        img: img.value != "" ? img.value : "img/placeholder.avif",
        imgalt: imgalt.value,
        pitch: pitch.value != "" ? pitch.value : "Den här kursen saknar beskrivning!",
        info: info.value != "" ? info.value : "",
        length: length.value !== NaN && length.value > 0 ? length.value : 1,
        price: price.value !== NaN && price.value >= 0 ? price.value : 0,
        active: active.checked,
        purchases: 0
    }

    // Instantiate class and add to course list
    courses.push(new Course(courseObj))

    // Reset modal values
    title.value = ""
    img.value = ""
    imgalt.value = ""
    pitch.value = ""
    info.value = ""
    length.value = 1 
    price.value = 0
    active.checked = true
    
    // close modal
    modal.style.display = "none";

    // Reload cards
    makePopularCards();
    makeActiveCards();
}