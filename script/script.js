// Variables
const courses = []
const cart = []

// Classes
class Course {
    constructor(object) {
        this.id = object.id
        this.title = object.title
        this.imgavif = object.imgavif
        this.imgpng = object.imgpng
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
    let response = await fetch('assets/json/courses.json')
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
    if (document.getElementById('popular-cards')) {
        const parent = document.getElementById('popular-cards')
        clearChildren(parent)
        const array = courses.sort(function(a, b) {return b.purchases-a.purchases}).slice(0, 3)
        if(array.length > 0) makeCourseCards(parent, array)
    }
}

//Make active course cards
function makeActiveCards() {
    if (document.getElementById('active-cards')) {
        const parent = document.getElementById('active-cards')
        clearChildren(parent)
        const array = []
        for (let i = 0; i < courses.length; i++) {
            if(courses[i].active) array.push(courses[i])
        }
        if(array.length > 0) makeCourseCards(parent, array)
    }
}

//Clear children from parent
function clearChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
}

// Make course cards
function makeCourseCards(parent, array) {
    for (let i = 0; i < array.length; i++) {
        // Create card
        const card = document.createElement("div")
        card.setAttribute("class", "card")

        // Create title and add to card
        const title = document.createElement("h1")
        title.innerText = array[i].title
        card.appendChild(title)

        // Create length paragraph and add to card
        const lengthPara = document.createElement("p")
        lengthPara.innerText = `Kurslängd: ${array[i].length} veckor.`
        card.appendChild(lengthPara)

        // Create picture and add to card
        const picture = document.createElement("picture")
        
        if (array[i].imgavif) {
            const avif = document.createElement("source")
            avif.type = "image/avif"
            avif.srcset = array[i].imgavif
            picture.appendChild(avif)
        }
        const img = document.createElement("img")
        img.src = array[i].imgpng
        if (array[i].imgalt) img.alt = array[i].imgalt
        picture.appendChild(img)

        card.appendChild(picture)

        // Create pitch and add to card
        const pitch = document.createElement("h2")
        pitch.innerText = array[i].pitch
        card.appendChild(pitch)

        // Create info and add to card
        const info = document.createElement("p")
        info.innerText = array[i].info
        card.appendChild(info)

        // Create button and add to card
        const btn = document.createElement("button")
        btn.setAttribute("class", "card-btn")
        btn.setAttribute("onclick", `addCourseToCart(${array[i].id})`)
        btn.setAttribute("type", "button")
        btn.disabled = !array[i].active
        btn.innerText = array[i].active ? "Köp" : "Ej tillgänglig"
        card.appendChild(btn)

        // Create price paragraph and add to card
        const price = document.createElement("p")
        price.setAttribute("class", "card-signature")
        price.innerText =`fr. ${array[i].price} spänn.`
        card.appendChild(price)

        //Add card to parent
        parent.appendChild(card)
    }
}

//Make cart items
function makeCartItems() {
    const parent = document.getElementById('cart-list')
    clearChildren(parent)
    if(cart.length < 1) parent.innerText = 'Kundvagnen är tom...'
    for (let i = 0; i < cart.length; i++) {
        // Hur nullcheckar jag det här?
        const course = courses.find(c => c.id === cart[i])

        // Make item
        const item = document.createElement("div")
        item.setAttribute("class", "cart-item")

        // Make title
        const title = document.createElement("p")
        title.innerText = course.title
        item.appendChild(title)

        // Make title
        const price = document.createElement("p")
        price.innerText = `${course.price} spänn.`
        item.appendChild(price)

        // Create button and add to card
        const btn = document.createElement("button")
        btn.setAttribute("class", "cart-btn")
        btn.setAttribute("onclick", `removeCourseFromCart(${course.id})`)
        btn.setAttribute("type", "button")
        btn.innerText = "Ta bort"
        item.appendChild(btn)

        parent.appendChild(item)
    }
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
        updateCheckoutElements()
    }
}

//Update cart button text
function updateCartText() {
    document.getElementById('cart-btn').innerHTML = `Kundvagn (${cart.length})`
}

function updateCheckoutElements() {
    const checkout = document.getElementById("checkout")
    checkout.style.display = cart.length > 0 ? "grid" : "none"

    document.getElementById("total-count").innerText = `Total: ${getCartTotalPrice()} spänn`
}

// Get total price of items in cart
function getCartTotalPrice() {
    let total = 0
    for (let i = 0; i < cart.length; i++) {
        const price = courses.find(c => c.id === cart[i]).price
        console.log(price)
        if (Number.isNaN(price)) price = 0
        total += Number(price)
    }
    return total
}

// Finalize purchase
function finalizePurchase() {
    cart.splice(0, cart.length)
    updateCartText()
    makeCartItems()
    updateCheckoutElements()
    alert('Tack för köpet!')
}

// ModalAccept
function modalAccept(message) {
    // Get data from modal
    const modal = document.getElementById("myModal")
    const title = document.getElementById("modalInputTitle")
    const imgavif = document.getElementById("modalInputImgavif")
    const imgpng = document.getElementById("modalInputImgpng")
    const imgalt = document.getElementById("modalInputImgalt")
    const pitch = document.getElementById("modalInputPitch")
    const info = document.getElementById("modalInputInfo")
    const length = document.getElementById("modalInputLength")
    const price = document.getElementById("modalInputPrice")
    const active = document.getElementById("modalInputActive")

    // Make object from data
    try {
        console.log(length.value)
        console.log(price.value)

        // Add data verification and alerts?

        let courseObj = {
            id: courses.length + 1,
            title: title.value != "" ? title.value : "Ny kurs",
            imgavif: imgavif.value,
            imgpng: imgpng.value,
            imgalt: imgalt.value,
            pitch: pitch.value != "" ? pitch.value : "Den här kursen saknar beskrivning!",
            info: info.value != "" ? info.value : "",
            length: parseInt(length.value) && parseInt(length.value) > 0 ? parseInt(length.value) : 1,
            price: parseInt(price.value) && parseInt(price.value) >= 0 ? parseInt(price.value) : 0,
            active: active.checked,
            purchases: 0
        }
        console.log(courseObj.length)
        console.log(courseObj.price)

        // Instantiate class and add to course list
        courses.push(new Course(courseObj))
    }
    catch(e) {
        console.error(e.message)
    }

    // Reset modal values
    title.value = ""
    imgavif.value = ""
    imgpng.value = ""
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

// // ModalAccept
// function modalAccept() {
//     const form = document.getElementById("modalForm")
//     console.log(form.submit())
// }