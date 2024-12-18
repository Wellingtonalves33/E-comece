const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const addressInput = document.getElementById("address")
const chekoutBtn = document.getElementById("chekout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const addressWarn = document.getElementById("address-warn")
const cartCount = document.getElementById("cart-count")

let cart = [];

cartBtn.addEventListener('click', () => {
    updateCartModal()
    cartModal.style.display = "flex"
})

closeModalBtn.addEventListener('click', () => {
    cartModal.style.display = "none"
})
cartModal.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})
menu.addEventListener("click", (event) => {

    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        addToCart(name, price)
    }



})
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        existingItem.quantity += 1;

    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal()
}
function updateCartModal() {
    cartItemsContainer.innerHTML = ""
    let total = 0;

    cart.forEach(item => {
        const cartIttemElement = document.createElement("div");
        cartIttemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartIttemElement.innerHTML = `
    <div class="flex items-center justify-between">
    
        <div>
             <p class="font-bold">${item.name}</p>
             <p>Qtd:${item.quantity}</p>
            <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        
            <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>
        
   </div>
    
    `
        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartIttemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-Br", {
        style: "currency",
        currency: "BRL"
    })
    cartCount.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

function  removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index,1);
        updateCartModal()
    }
}
addressInput.addEventListener("input", (event)=>{
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
      
    }
})


chekoutBtn.addEventListener("click", ()=>{
        const isOpen = checkRastauranteOpen();
        if(!isOpen){
            Toastify({  text: "O restaurante está fechado!",
                duration: 3000,
               
              
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "linear-gradient(to right, #00b09b, #96c93d)",
                },}).showToast();
                return;
        }



    if(cart.length === 0 ) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return
    }

    const cartItems = cart.map((item)=>{
        return(
            `${item.name} Quantidade:(${item.quantity}) Preço: R$${item.price} |  `
        )
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone = "+5585997209670"

    window.open(`https://wa.me/${phone}?text=${message} Endereço ${addressInput.value}`,"_blank")
    cart = []
    updateCartModal()
})

function checkRastauranteOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRastauranteOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")

}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500")
}