// import * as products from "./products.json";

// const productContainer = document.querySelector(".product-container");
// productContainer.innerHTML = for (let product of products) { return `<li>${product.name}</li>`};

// console.log({products, productContainer})
const cart = [];
const cartOverlayDOM = document.querySelector(".cart-overlay");
const cartDOM = document.querySelector(".cart");
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const cartItemContainer = document.querySelector(".cart-item-container");
const productContainer = document.querySelector(".product-container");

class Product {
	//TODO: get products
	static async getProducts() {
		try {
			let result = await fetch("./products.json").then((res) =>
				res.json()
			);
			let products = result.items.map((result) => {
				let id = result.sys.id;
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
	static displayProducts(product) {
        if (!product) return;
        //FIX: If product id exists in cart return 
		cart.push(product);
		console.log({ product });
		try {
			let productHTML = cart.map((product) => {
				return `
                            <div class="cart-item">
                                <img src="${product.img}" alt="product" />
                                <div class="product-details">
                                    <h4>${product.title}</h4>
                                    <h5>${product.price}</h5>
                                    <span class="remove-item">remove</span>
                                </div>
                                <div class="item-amount-controls">
                                    <i class="fas fa-chevron-up">up</i>
                                    <p class="item-amount">0</p>
                                    <i class="fas fa-chevron-down">down</i>
                                </div>
                            </div>
            `;
			}).join("");
			cartItemContainer.innerHTML = productHTML;
		} catch (err) {
			console.log(err);
		}
	}
	//TODO: create add to cart function
	static addToCart(e) {
        //FIX: update button CSS so show item is in basket 
		Product.getProducts().then((products) => {
			let product = products.filter(
				(product) => product.id === e.target.dataset.id
			)[0];

			console.log({ products, product });

			Cart.displayProducts(product);
		});
		// const productsDOM = document.querySelectorAll(".product");
		// // [0].outerHTML;
		// cartItemContainer.innerHTML += product;
		// return console.log("Veiny BBC", e.target, product);
		// return console.log({ e });
	}
	//TODO: create remove from cart function
	//TODO: create increase/decrease quantity function
	//TODO: create total cart function
	//TDO: create clear cart function
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

	// Cart.addToCart()
	// const productsDOM = document.querySelector(".product-container").childNodes;

	// let filterDOM = [...productsDOM].filter((child) => console.log({ child }));
	// console.log({ productsDOM, filterDOM });
	// let addToCartBtn = [];

	// productsDOM.forEach((li) =>
	// 	addToCartBtn.push(li.querySelector("article div button.bag-btn"))
	// );

	// console.log({ addToCartBtn });
	// for (let productDOM of productsDOM) {
	// 	console.log({ productDOM });
	// 	productDOM.addEventListener("click", (e) => cart.addToCart(e));
	// }
	document.addEventListener(
		"click",
		(e) => {
			// function hasClass(elem, className) {
			//     return elem.classList.contains(className);
			// }

			// if (hasClass(e.target, "product")) {
			//     cart.addToCart();
			// }
			if (e.currentTarget.hasChildNodes) {
				const addToCartBtns = document.querySelectorAll(".bag-btn");

				for (let btn of addToCartBtns)
					btn.addEventListener("click", Cart.addToCart);
				console.log({ addToCartBtns });
			}
			// e.stopPropagation();
			// console.log({ e });
			// console.log(e.target, e.currentTarget);
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
