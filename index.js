
//TODO: Upload to Netlify
//TODO: Add Nav buttons - set display none for mobile
//TODO: Nav buttons filter products on page 
//TODO: Split up classes
//TODO: Create menu class
//TODO: Create footer
// FIX: cartTotal bug - weird decimal

let cart = [];
const body = document.querySelector("body");
const nav = document.querySelector(".navbar");
const cartOverlayDOM = document.querySelector(".cart-overlay");
const cartDOM = document.querySelector(".cart");
const cartBtn = document.querySelector(".cart-btn");
const cartItemCount = document.querySelector(".cart-items");
const closeCartBtn = document.querySelector(".close-cart");
const cartItemContainer = document.querySelector(".cart-item-container");
const productContainer = document.querySelector(".product-container");
const clearCartBtn = document.querySelector(".clear-cart");
const cartTotalDOM = document.querySelector(".cart-total");

//Buttons added dynamically
let addToCartBtns;
let removeFromCartBtn;
let upQuantityBtn;
let downQuantityBtn;

class Product {
	static async getProducts() {
		try {
			let result = await fetch("./products.json").then((res) =>
				res.json()
			);
			let products = result.items.map((result) => {
				let id = parseInt(result.sys.id);
				let img = result.fields.image.fields.file.url;
				let { title, price } = result.fields;

				return { id, img, title, price };
			});
			return products;
		} catch (err) {
			console.log(err);
		}
	}
}

class UI {
	static displayPageProducts(products) {
		let productsHTML = products
			.map((product) => {
				return `
                <li>
                <article id=${product.id} class="product">
                <div class="img-container">
                <img
                src="${product.img}"
                alt="${product.title}"
                class="product-img"
                />
                <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart"></i>
                add to bag
                </button>
                </div>
                <h3>${product.title}</h3>
                <h4>£${product.price}</h4>
                </article>
                </li>
                `;
			})
			.join("");

		productContainer.innerHTML = productsHTML;
	}

	static toggleDisableButton() {
		addToCartBtns.forEach((btn) => {
			let id = parseInt(btn.dataset.id);
			let inCart = cart.find((product) => product.id === id);
			if (inCart) {
				btn.innerHTML = "In Cart";
				btn.disable = true;
			} else {
				btn.innerHTML = "Add to Bag";
				btn.disable = true;
			}
		});
	}
}

class Menu {
	//TODO EXT: create show menu function
	//TODO EXT: create hide menu function
}

class Cart {
	static showCart() {
		cartOverlayDOM.classList.add("transparentBcg");
		cartDOM.classList.add("showCart");
	}

	static hideCart() {
		cartOverlayDOM.classList.remove("transparentBcg");
		cartDOM.classList.remove("showCart");
	}

	static displayCartProducts() {
		let productHTML = cart
			.map((product) => {
				return `
                    <div id=${product.id} class="cart-item">
                    <img src="${product.img}" alt="product" />
                    <div class="product-details">
                    <h4>${product.title}</h4>
                <h5>${product.price}</h5>
                <span class="remove-item" data-id=${product.id}>remove</span>
                </div>
                <div class="item-amount-controls">
                <i class="fas fa-chevron-up">up</i>
                <p class="item-amount">${product.amount}</p>
                <i class="fas fa-chevron-down">down</i>
                </div>
                </div>
                `;
			})
			.join("");
		cartItemContainer.innerHTML = productHTML;
	}

	static addToCart(e) {
		Product.getProducts().then((products) => {
			let productID = parseInt(e.target.dataset.id);
			let product = {
				...products.find((product) => product.id === productID),
				amount: 1,
			};

			let inCart = cart.find((product) => product.id === productID);

			if (!inCart) cart.push(product);

			Cart.setCartValues();
			Cart.displayCartProducts();
			Storage.setCartProducts();
			UI.toggleDisableButton();
		});
	}
	static removeFromCart(e) {
		cart = cart.filter(
			(product) => product.id !== parseInt(e.target.dataset.id)
		);
		Cart.setCartValues();
		Cart.displayCartProducts();
		Storage.setCartProducts();
		UI.toggleDisableButton();
	}
	static increaseProductQuantity(e) {
		console.log("increase");
		let productID = parseInt(e.target.parentNode.parentNode.id);
		let product = cart.find((product) => product.id === productID);
		let index = cart.findIndex((product) => product.id === productID);
		product.amount++;
		product = product;
		cart[index] = product;

		Cart.setCartValues();
		Cart.displayCartProducts();
	}

	static decreaseProductQuantity(e) {
		console.log("decrease");
		let productID = parseInt(e.target.parentNode.parentNode.id);
		let product = cart.find((product) => product.id === productID);
		let index = cart.findIndex((product) => product.id === productID);

		if (product.amount > 1) product.amount--;
		product = product;
		cart[index] = product;

		Cart.setCartValues();
		Cart.displayCartProducts();
	}

	static setCartValues() {
		cartItemCount.innerHTML = cart.reduce((a, c) => {
			return a + c.amount;
		}, 0);

		cartTotalDOM.innerHTML = parseFloat(
			cart
				.reduce((a, c) => {
					return a + c.amount * c.price;
				}, 0)
				.toFixed(2)
		);
	}
	static clearCart() {
		cart = [];
		Cart.setCartValues();
		Cart.displayCartProducts();
		Storage.clearLs();
	}
}

class Storage {
	static setCartProducts() {
		localStorage.setItem("products", JSON.stringify(cart));
	}
	static getCartProducts() {
		cart = JSON.parse(localStorage.getItem("products")) || [];
	}

	static clearLs() {
		localStorage.clear();
	}
}

document.addEventListener("DOMContentLoaded", () => {
	if (localStorage.getItem("products")) {
		Storage.getCartProducts();
		Cart.setCartValues();
		Cart.displayCartProducts();
	}

	Cart.displayCartProducts();
	Product.getProducts().then((products) => {
		UI.displayPageProducts(products);
	});
	cartBtn.addEventListener("click", Cart.showCart);

	closeCartBtn.addEventListener("click", Cart.hideCart);

	clearCartBtn.addEventListener("click", Cart.clearCart);
});

productContainer.addEventListener(
	"load",
	() => {
		addToCartBtns = document.querySelectorAll(".bag-btn");

		for (let btn of addToCartBtns)
			btn.addEventListener("click", Cart.addToCart);
		UI.toggleDisableButton();
	},
	true
);

cartItemContainer.addEventListener(
	"load",
	() => {
		removeFromCartBtn = document.querySelectorAll(".remove-item");
		upQuantityBtn = document.querySelectorAll("i.fas.fa-chevron-up");
		downQuantityBtn = document.querySelectorAll("i.fas.fa-chevron-down");

		removeFromCartBtn.forEach((btn) =>
			btn.addEventListener("click", Cart.removeFromCart)
		);
		upQuantityBtn.forEach((btn) =>
			btn.addEventListener("click", Cart.increaseProductQuantity)
		);
		downQuantityBtn.forEach((btn) =>
			btn.addEventListener("click", Cart.decreaseProductQuantity)
		);
	},
	true
);

document.addEventListener("scroll", () => {
	if (window.scrollY > window.innerHeight * 0.66) {
		nav.classList.add("box-shadow");
	} else {
		nav.classList.remove("box-shadow");
	}
});
