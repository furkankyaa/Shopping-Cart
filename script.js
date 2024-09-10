// query variables (değişkenleri sorgulama)
const cartBtn = document.querySelector(".cart-btn");
const clearcartBtn = document.querySelector(".btn-clear");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".total-value");
const cartContent = document.querySelector(".cart-list");
const productDOM = document.querySelector("#products-dom");
// const productDOM = document.getElementById("products-dom");

let cart = [];
let buttonsDOM = [];


class Product {

  async getProducts() {

    //  Bu bir promiss yapısıdır daha sonra incelenebilir..
    try {

      //  let result = await fetch("./data.json");
      let result = await fetch("https://66deeec7de4426916ee2fe9f.mockapi.io/products");
      let data = await result.json();
      let products = data;
      return products;
    } catch (error) {

      console.log(error);
    }
305 + 58 + 24
  }
}

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach(item => {

      result += ` 
            <div class="col-lg-4 col-md-6">
            <div class="product">
              <div class="product-image">
                <img
                  src="${item.image}"
                  alt="product"
                  
                />
              </div>
            
              <div class="product-hover">
                <span class="product-title">${item.title} </span>
                <span class="product-price"> $ ${item.price.toFixed(2)} </span>
                <button class="btn-add-to-cart" data-id="${item.id}">
                  <i class="fas fa-cart-shopping"></i>
                </button>
              </div>
              
            </div>
         
          </div>
            `
    });

    productDOM.innerHTML = result;
  }
  getBagButton() {
    const buttons = [...document.querySelectorAll(".btn-add-to-cart")];
    buttonsDOM = buttons;

    buttons.forEach(button => {

      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.setAttribute("disabled", "disabled");
        button.opacity = ".3";
      } else {

        button.addEventListener("click", event => {

          event.target.disabled = true;
          event.target.style.opacity = ".3";
          //* get product from product localstorage ekleme başlıyor 

          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          // * add product to cart (ürünü karta ekeleme işlemi)
          cart = [...cart, cartItem];
          // * save cart localstorage (cartımızı localStorage kaydediyoruz)
          Storage.saveCart(cart);
          // * Storage cart number ekleme
          this.saveCartValues(cart);
          // * display add cart (ekrana sepeti yazdırma)
          this.addCartItem(cartItem);
          // * show the cart (cartı göster)
          this.showCart();


        })
      }

    });

  }

  saveCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map(item => {
      // ürün fiyatı çarpı ürünadet
      tempTotal += item.price * item.amount;
      // ürünadet toplanıyor
      itemsTotal += item.amount;
    });
    //parseFloat (php deki gibi küsürlü fiyatları yuvarlıyor)  
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;


  }

  addCartItem(item) {
    const li = document.createElement("li");
    li.classList.add("cart-list-item");
    li.innerHTML = ` 
    
     <div class="cart-left">
       <div class="cart-left-image">
         <img
           src=${item.image}
           alt=${item.title}
           class="img-fluid"
         />
       </div>
       <div class="cart-left-info">
         <a class="cart-left-info-title" href="#">${item.title}</a>
         <span class="cart-left-info-price">$ ${item.price.toFixed(2)}</span>
       </div>
     
     </div>
    
     <div class="cart-right">
       <div class="cart-right-quantity">
         <button class="quantity-minus" data-id=${item.id}>
           <i class="fas fa-minus"></i>
         </button>
         <span class="quantity">${item.amount}</span>
         <button class="quantity-plus" data-id=${item.id}>
           <i class="fas fa-plus"></i>
         </button>
       </div>
    
       <div class="cart-right-remove">
         <button class="cart-remove-btn" data-id=${item.id}>
           <i class="fas fa-trash"></i>
         </button>
       </div>
      
     </div>

     `;
    //  burada ekleneni displayde gösteriyoruz
    cartContent.appendChild(li);
  }

  showCart() {

    cartBtn.click();

  }

  setupAPP() {
    cart = Storage.getCart();
    this.saveCartValues(cart);
    this.populateCart(cart);

  }
  populateCart(cart) {

    cart.forEach(item => this.addCartItem(item));

  }
   cartLogic(){ 
    clearcartBtn.addEventListener("click", ()=>{ 
            this.clearCart();
    });


          cartContent.addEventListener("click", event =>{ 
           if(event.target.classList.contains("cart-remove-btn")){ 
             let removeItem = event.target;
             let  id = removeItem.dataset.id;
             removeItem.parentElement.parentElement.parentElement.remove();
             this.removeItem(id);
            
           }else if(event.target.classList.contains("quantity-minus")){ 
             let lowerAmount = event.target;
             let id = lowerAmount.dataset.id;
             let tmpItem = cart.find(item => item.id === id);
             tmpItem.amount = tmpItem.amount -1;
             if(tmpItem.amount > 0){ 
              // ürün eksiltiyorz
                Storage.saveCart(cart);
                // eksilen ürün cart ta fiyatı yeniden hesaplıyoruz
                this.saveCartValues(cart);
                // ürün sayısını güncelliyoruz
                lowerAmount.nextElementSibling.innerText = tmpItem.amount; 

             }else{ 
              lowerAmount.parentElement.parentElement.parentElement.remove();
              this.removeItem(id);

             }
           
            }else if(event.target.classList.contains("quantity-plus")){ 

              let addAmount = event.target;
              let id = addAmount.dataset.id;
              let tmpItem = cart.find(item => item.id === id);
              tmpItem.amount = tmpItem.amount +1;

                           // ürün ekliyoruz
                           Storage.saveCart(cart);
                           // eksilen ürün cart ta fiyatı yeniden hesaplıyoruz
                           this.saveCartValues(cart);
                           // ürün sayısını güncelliyoruz
                      
                addAmount.previousElementSibling.innerText = tmpItem.amount;
             
           }

          }); 

  // console.log(id);
   }

   clearCart(){ 
      let cartItem = cart.map(item=>item.id);
      cartItem.forEach(id => this.removeItem(id));
       while(cartContent.children.length > 0){ 
              cartContent.removeChild(cartContent.children[0]);

       }

   }

   removeItem(id){ 
         cart = cart.filter(item=>item.id !==id);
         this.saveCartValues(cart);
         Storage.saveCart(cart);
         let button = this.getSingleButton(id);
         button.disabled = false;
         button.style.opacity = 1;
   }

   getSingleButton(id){ 
    return buttonsDOM.find(button => button.dataset.id === id);

   }



}

class Storage {

  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);

  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));

  }

  static getCart() {

    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

  }




}
//  bu bir fonksiyon yazılım çeşididir 
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Product();

 
  ui.setupAPP();
  products.getProducts().then(products => {

    ui.displayProducts(products);
    Storage.saveProducts(products);
    // Storage.getProduct(products);
  }).then(() => {
    ui.getBagButton();
    ui.cartLogic();

  })



});