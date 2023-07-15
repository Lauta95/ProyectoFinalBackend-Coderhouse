document.getElementById('myForm').onsubmit = e => {
    e.preventDefault()
}

const socket = io()