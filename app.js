const iconCart = document.querySelector('.icon-cart');
const closeCart = document.querySelector('.close');
const cartTab = document.querySelector('.carttab');
const listproductHTML = document.querySelector('.listproduct');
const listCartHTML = document.querySelector('.listcart');
const iconCartSpan = document.querySelector('.icon-cart span');

let listproduct = [];
let carts = [];

iconCart.addEventListener('click', () => {
  cartTab.classList.add('active');
});

closeCart.addEventListener('click', () => {
  cartTab.classList.remove('active');
});

const adddatatoHTML = () => {
  listproductHTML.innerHTML = '';
  listproduct.forEach(product => {
    let newproduct = document.createElement('div');
    newproduct.classList.add('item');
    newproduct.dataset.id = product.id;
    newproduct.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h2>${product.name}</h2>
      <div class="price">$${product.price}</div>
      <button class="addcart">ADD TO CART</button>`;
    listproductHTML.appendChild(newproduct);
  });
};

listproductHTML.addEventListener('click', (event) => {
  if (event.target.classList.contains('addcart')) {
    let product_id = parseInt(event.target.parentElement.dataset.id);
    addToCart(product_id);
  }
});

const addToCart = (product_id) => {
  let position = carts.findIndex(item => item.product_id === product_id);
  if (position < 0) {
    carts.push({ product_id, quantity: 1 });
  } else {
    carts[position].quantity += 1;
  }
  addCartToHTML();
};

const addCartToHTML = () => {
  listCartHTML.innerHTML = '';
  let totalQuantity = 0;

  carts.forEach(cart => {
    const product = listproduct.find(p => p.id === cart.product_id);
    totalQuantity += cart.quantity;

    let newCart = document.createElement('div');
    newCart.classList.add('item');
    newCart.dataset.id = cart.product_id;
    newCart.innerHTML = `
      <div class="image">
        <img src="${product.image}" alt="cart image" />
      </div>
      <div class="name">${product.name}</div>
      <div class="totalprice">$${product.price * cart.quantity}</div>
      <div class="quantity">
        <span class="minus">&lt;</span>
        <span>${cart.quantity}</span>
        <span class="plus">&gt;</span>
      </div>`;
    listCartHTML.appendChild(newCart);
  });

  iconCartSpan.innerText = totalQuantity;
};

// Handle quantity increase/decrease
listCartHTML.addEventListener('click', (e) => {
  const parent = e.target.closest('.item');
  if (!parent) return;

  const id = parseInt(parent.dataset.id);
  const index = carts.findIndex(c => c.product_id === id);

  if (e.target.classList.contains('plus')) {
    carts[index].quantity++;
  } else if (e.target.classList.contains('minus')) {
    carts[index].quantity--;
    if (carts[index].quantity <= 0) {
      carts.splice(index, 1);
    }
  }
  addCartToHTML();
});

const initApp = () => {
 fetch('public/products.json')


    .then(res => res.json())
    .then(data => {
      listproduct = data;
      adddatatoHTML();
    })
    .catch(err => console.error('Failed to fetch products:', err));
};
// Checkout Button - Store cart and redirect
document.querySelector('.checkout').addEventListener('click', () => {
  if (carts.length > 0) {
    localStorage.setItem('cartItems', JSON.stringify(carts));
    window.location.href = 'confirmation.html';
  } else {
    alert('Your cart is empty!');
  }
});


initApp();
