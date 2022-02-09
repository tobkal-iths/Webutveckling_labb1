
// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("adminBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  reset()
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    reset()
  }
}

function reset() {
  // Reset modal values
  document.getElementById("modalInputTitle").value = ""
  document.getElementById("modalInputImg").value = ""
  document.getElementById("modalInputImgalt").value = ""
  document.getElementById("modalInputPitch").value = ""
  document.getElementById("modalInputInfo").value = ""
  document.getElementById("modalInputLength").value = 1
  document.getElementById("modalInputPrice").value = 0
  document.getElementById("modalInputActive").checked = true
}