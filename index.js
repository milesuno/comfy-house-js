// import * as products from "./products.json";

// const productContainer = document.querySelector(".product-container");
// productContainer.innerHTML = for (let product of products) { return `<li>${product.name}</li>`};

// console.log({products, productContainer})
let cart = [];
const cartOverlayDOM = document.querySelector(".cart-overlay");
const cartDOM = document.querySelector(".cart");
const cartBtn = document.querySelector(".cart-btn");
const cartItemCount = document.querySelector(".cart-items");
const closeCartBtn = document.querySelector(".close-cart");
const cartItemContainer = document.querySelector(".cart-item-container");
let addToCartBtns;
const productContainer = document.querySelector(".product-container");
const clearCartBtn = document.querySelector(".clear-cart");
const cartTotalDOM = document.querySelector(".cart-total");

class Product {
	//TODO: get products
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
	//TODO: Display all products in products.json - create HTML, Append el to parent container
	displayProducts(products) {
		// console.log({ products });
		try {
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
		} catch (err) {
			console.log(err);
		}
	}
}

class Menu {
	//TODO EXT: create show menu function
	//TODO EXT: create hide menu function
}

class Cart {
	//TODO: create show cart function
	showCart() {
		cartOverlayDOM.classList.add("transparentBcg");
		cartDOM.classList.add("showCart");
	}

	//TODO: create hide cart function
	hideCart() {
		cartOverlayDOM.classList.remove("transparentBcg");
		cartDOM.classList.remove("showCart");
	}

	//TODO: Display all products in Cart
	static displayProducts() {
		// if (!product) return;
		try {
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
		} catch (err) {
			console.log(err);
		}
		// removeFromCartBtn.addEventListener("click", Cart.removeFromCart);
	}

	//TODO: create add to cart function
	static addToCart(e) {
		//FIX: update button CSS so show item is in basket
		Product.getProducts().then((products) => {
			addToCartBtns.forEach((btn) => {
				btn.innerHTML = "In Cart";
				btn.disable = true;
			});

			let product = products.filter(
				(product) => product.id === parseInt(e.target.dataset.id)
			)[0];
			product.amount = 1;
			console.log({ products, product });

			if (cart.length === 0) cart.push(product);

			if (!cart.some((cartProduct) => cartProduct.id === product.id))
				cart.push(product);

			Cart.setCartValues();
			Cart.displayProducts();
		});
	}
	//TODO: create remove from cart function
	static removeFromCart(e) {
		cart = cart.filter(
			(product) => product.id !== parseInt(e.target.dataset.id)
        );
        Cart.setCartValues();
		Cart.displayProducts();
	}
	//TODO: create increase/decrease quantity function
	static increaseProductQuantity(e) {
		console.log("increase");
		let productID = parseInt(e.target.parentNode.parentNode.id);
		//find product in cart
		let product = cart.filter((product) => product.id === productID)[0];
		let index = cart.indexOf(product);
		product.amount++;
		product = product;
		cart[index] = product;

		Cart.setCartValues();
		Cart.displayProducts();
	}

	static decreaseProductQuantity(e) {
		console.log("decrease");
		let productID = parseInt(e.target.parentNode.parentNode.id);
		//find product in cart
		let product = cart.filter((product) => product.id === productID)[0];
		let index = cart.indexOf(product);
        
        if (product.amount > 1) product.amount--;
		product = product;
		cart[index] = product;

		Cart.setCartValues();
		Cart.displayProducts();
	}

	//TODO: create total cart function
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
	//TDO: create clear cart function
	static clearCart() {
		cart = [];
		Cart.displayProducts();
	}
}

class Storage {
	//TODO: Add cart items to ls
	//TODO: Get cart items from ls
	//TODO: Clear cart items from ls
}

document.addEventListener("DOMContentLoaded", () => {
	let products = new Product();
	let ui = new UI();
	let cart = new Cart();

	Cart.displayProducts();
	products = Product.getProducts().then((products) =>
		ui.displayProducts(products)
	);

	productContainer.addEventListener(
		"click",
		(e) => {
			if (e.currentTarget.hasChildNodes) {
				addToCartBtns = document.querySelectorAll(".bag-btn");

				for (let btn of addToCartBtns)
					btn.addEventListener("click", Cart.addToCart);
				// console.log({ addToCartBtns });
			}
		},
		true
	);

	cartItemContainer.addEventListener(
		"click",
		(e) => {
			if (e.currentTarget.hasChildNodes) {
				let removeFromCartBtn = document.querySelectorAll(
					".remove-item"
				);
				let upQuantityBtn = document.querySelectorAll(
					"i.fas.fa-chevron-up"
				);
				let downQuantityBtn = document.querySelectorAll(
					"i.fas.fa-chevron-down"
				);
				console.log({ removeFromCartBtn });

				removeFromCartBtn.forEach((btn) =>
					btn.addEventListener("click", Cart.removeFromCart)
				);
				upQuantityBtn.forEach((btn) =>
					btn.addEventListener("click", Cart.increaseProductQuantity)
				);
				downQuantityBtn.forEach((btn) =>
					btn.addEventListener("click", Cart.decreaseProductQuantity)
				);
			}
		},
		true
	);
});

cartBtn.addEventListener("click", () => {
	let cart = new Cart();
	cart.showCart();
});

closeCartBtn.addEventListener("click", () => {
	let cart = new Cart();
	cart.hideCart();
});

clearCartBtn.addEventListener("click", Cart.clearCart);
