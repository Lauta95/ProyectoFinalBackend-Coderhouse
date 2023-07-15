const socket = io()


document.getElementById('myForm').onsubmit = e => {
    e.preventDefault()

    const name = document.querySelector('input[name=code]').value
    const title = document.querySelector('input[name=title]').value
    const description = document.querySelector('input[name=description]').value
    const price = parseInt(document.querySelector('input[name=price]').value)
    const thumbnails = document.querySelector('input[name=thumbnails]').value
    const stock = parseInt(document.querySelector('input[name=stock]').value)

    const product = {name, title, description, price, thumbnails, stock}
    socket.emit('new-product', product)
}
