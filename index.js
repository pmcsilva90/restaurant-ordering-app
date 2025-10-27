import menuArray from "./data.js";

const foodMenuEl = document.getElementById("food-menu");
const cartEl = document.getElementById("cart");
const checkoutModalEl = document.getElementById("checkout-modal")
const formEl = document.getElementById("pay-form")
const nameInput = document.getElementById("name")
const cardInput = document.getElementById("card-number")
const cvvInput = document.getElementById("cvv")


const cart = [];

function render() {
    const foodMenuHtml = menuArray
        .map((item) => {
            return `
            <div class="food-item">
                <img
                    class="food-item-img"
                    src="images/${item.image}"
                    alt="A ${item.name} graphic."
                    class="item-graphic"
                />
                <div class="food-item-info">
                    <h2 class="food-item-title">${item.name}</h2>
                    <p class="food-item-ingredients">
                        ${item.ingredients.join(", ")}
                    </p>
                    <p class="food-item-price">$${
                        item.price
                    }</p>                
                </div>
                <button 
                    class="add-to-cart-btn" 
                    data-item-id="${item.id}"
                    >+</button>
            </div>
        `;
        })
        .join("");

    foodMenuEl.innerHTML = foodMenuHtml;


    const cartHtmlArray = [];
    let totalPrice = 0
    
    
    if (cart.length > 0){
        cart.forEach((item, index) => {
            cartHtmlArray.push(`
                <div class="cart-item">
                <h3>${item.name}</h3>
                <button class="remove-item" data-item-index="${index}">remove</button>
                <p class="cart-item-price">$${item.price}</p>
                </div>
                `)
            totalPrice += item.price
            })

        const discounts = applyDiscount()

        if (discounts.length > 0){
            discounts.forEach(deal=>{
                cartHtmlArray.push(`
                <div class="cart-item discount">
                <h3>${deal.name}</h3>
                <p class="cart-item-price">$${deal.price}</p>
                </div>
                `)
            totalPrice += deal.price
            })
        }
        
        cartHtmlArray.unshift(`<h2 class="cart-h2">Your order</h2>`)
        cartHtmlArray.push(`
            <div class="total">
                <h3>Total price:</h3>
                <p class="total-price">$${totalPrice.toFixed(2)}</p>
            </div>
            <button id="complete-order-btn" class="complete-order">Complete Order</button>`)
        cartEl.innerHTML = cartHtmlArray.join("");
    } else {
        cartEl.innerHTML = "";

    }
}

function applyDiscount(){
    let pizza = cart.filter(item=> item.id == 0).length
    let hamburger = cart.filter(item=> item.id == 1).length
    let beer = cart.filter(item=> item.id == 2).length

    let pizzaBeerDeal = 0
    let hamburgerBeerDeal = 0

    const mealDeals = []

    if (pizza + hamburger > 0 && beer > 0){
        //pizza and beer deal
        pizzaBeerDeal = Math.min(pizza, beer)
        pizza -= pizzaBeerDeal
        beer -= pizzaBeerDeal
        for (let i = 0; i < pizzaBeerDeal; i++){
            mealDeals.push(
                {
                    name: "Pizza and beer meal deal",
                    price: -parseFloat(((cart[0].price + cart[2].price) * 0.3).toFixed(2))
                }
            )
        }

        //burger and beer deal
        hamburgerBeerDeal = Math.min(hamburger, beer)
        hamburger -= hamburgerBeerDeal
        beer -= hamburgerBeerDeal
        for (let i = 0; i < hamburgerBeerDeal; i++){
            mealDeals.push(
                {
                    name: "Hamburger and beer meal deal",
                    price: -parseFloat(((cart[1].price + cart[2].price) * 0.3).toFixed(2))
                }
            )
        }
    }



    console.log("Pizza and beer combo", pizzaBeerDeal)
    console.log("Burger and beer combo", hamburgerBeerDeal)

    return mealDeals
}

render();


document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
        // console.log(e.target.classList)
        cart.push(
            menuArray.filter(
                (item) => item.id === Number(e.target.dataset.itemId)
            )[0]
        );
        applyDiscount()
        render();
    } else if (e.target.classList.contains("remove-item-btn")){
        cart.splice(Number(e.target.dataset.itemIndex), 1)

        render()
    } else if (e.target.id === "complete-order-btn"){
        checkoutModalEl.style.display = "block"
    } else if (!checkoutModalEl.contains(e.target)){
        checkoutModalEl.style.display = "none"
    } else if (e.target.id === "pay-btn"){
        console.log("button clicked")
    }
});

formEl.addEventListener("submit", e=>{
    e.preventDefault()

    console.log("submitted")

    checkoutModalEl.style.display = "none"    

    cartEl.innerHTML = `
        <div class="checkout-msg-container">
            <p class="checkout-msg">Thanks, ${nameInput.value}! Your order is on its way!</p>
        </div>
    `

    nameInput.value = ""
    cardInput.value = ""
    cvvInput.value = ""
    while (cart.length > 0){
        cart.pop()
    }
})