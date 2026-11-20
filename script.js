const foods = [
  {id:1,name:"Маргарита Пицца",category:"pizza",categoryName:"Пицца",description:"Тонкое тесто, сыр, помидор",price:1700,image:"https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=85"},
  {id:2,name:"Сырный Пицца",category:"pizza",categoryName:"Пицца",description:"Тонкое тесто, нежный сыр",price:1900,image:"https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=85"},
  {id:3,name:"Пеперони Пицца",category:"pizza",categoryName:"Пицца",description:"Тонкое тесто, сыр, колбаса",price:2000,image:"https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=85"},
  {id:4,name:"Грибной Пицца",category:"pizza",categoryName:"Пицца",description:"Тонкое тесто, сыр, грибы",price:2100,image:"https://images.unsplash.com/photo-1573821663912-6df460f9c684?auto=format&fit=crop&w=800&q=85"},
  {id:5,name:"Цезарь Пицца",category:"pizza",categoryName:"Пицца",description:"Курица, сыр, соус и свежая зелень",price:2200,image:"https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85"},
  {id:6,name:"Куриные крылышки",category:"chicken",categoryName:"Чикен",description:"Хрустящие крылышки с фирменными специями",price:1800,image:"https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=85"},
  {id:7,name:"Куриные стрипсы",category:"chicken",categoryName:"Чикен",description:"Сочные кусочки курицы в хрустящей панировке",price:1600,image:"https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=85"},
  {id:8,name:"Чикен сет",category:"chicken",categoryName:"Чикен",description:"Аппетитная курица с золотистой корочкой",price:2500,image:"https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=85"},
  {id:9,name:"Классический Лаваш",category:"lavash",categoryName:"Лаваш",description:"Курица, овощи и фирменный соус",price:1500,image:"https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=85"},
  {id:10,name:"Сырный Лаваш",category:"lavash",categoryName:"Лаваш",description:"Курица, расплавленный сыр и соус",price:1700,image:"https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=85"},
  {id:11,name:"Чизбургер",category:"burger",categoryName:"Бургер",description:"Говяжья котлета, сыр, салат и соус",price:1900,image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85"},
  {id:12,name:"Двойной Бургер",category:"burger",categoryName:"Бургер",description:"Две сочные котлеты, сыр и фирменный соус",price:2500,image:"https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=800&q=85"}
];

const grid = document.getElementById("menuGrid");
const emptyState = document.getElementById("emptyState");
const filters = document.querySelectorAll(".filter");
const modal = document.getElementById("foodModal");
let activeCategory = "all";
let selectedFood = null;
let detailQuantity = 1;
const cart = new Map();

function formatPrice(price){ return new Intl.NumberFormat("ru-RU").format(price) + " ₸"; }

function renderMenu(){
  const visibleFoods = activeCategory === "all" ? foods : foods.filter(food => food.category === activeCategory);
  grid.innerHTML = visibleFoods.map((food,index) => {
    const quantity = cart.get(food.id)?.quantity || 0;
    return `
    <article class="food-card ${quantity > 0 ? "is-in-cart" : ""}" tabindex="0" role="button" aria-label="Подробнее: ${food.name}" data-id="${food.id}" style="animation-delay:${index*35}ms">
      <div class="food-image"><img src="${food.image}" alt="${food.name}" loading="lazy" onerror="this.src='https://placehold.co/600x450/2b293b/ffc629?text=MMM+Burger'"></div>
      <div class="food-content">
        <div class="food-title-row">
          <h3>${food.name}</h3>
          <span class="in-cart-indicator ${quantity > 0 ? "visible" : ""}" aria-label="${quantity > 0 ? "В корзине" : "Не добавлено"}">
            ${quantity > 0 ? `✓ В корзине · ${quantity}` : ""}
          </span>
        </div>
        <p>${food.description}</p>
        <strong class="price">${formatPrice(food.price)}</strong>
        <div class="card-cart-controls" aria-label="Количество ${food.name}">
          <button class="card-qty-btn minus" type="button" data-card-action="minus" data-id="${food.id}" aria-label="Убрать одну порцию" ${quantity === 0 ? "disabled" : ""}>−</button>
          <span class="card-qty-value">${quantity}</span>
          <button class="card-qty-btn plus" type="button" data-card-action="plus" data-id="${food.id}" aria-label="Добавить одну порцию">+</button>
        </div>
      </div>
    </article>`;
  }).join("");
  emptyState.hidden = visibleFoods.length !== 0;
}

filters.forEach(button => {
  button.addEventListener("click", () => {
    filters.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderMenu();
  });
});

function openFood(food){
  document.getElementById("modalImage").src = food.image;
  document.getElementById("modalImage").alt = food.name;
  document.getElementById("modalCategory").textContent = food.categoryName;
  document.getElementById("modalTitle").textContent = food.name;
  document.getElementById("modalDescription").textContent = food.description;
  document.getElementById("modalPrice").textContent = formatPrice(food.price);
  selectedFood = food;
  detailQuantity = 1;
  document.getElementById("detailQty").textContent = detailQuantity;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
}

function updateVisibleCardStates(){
  grid.querySelectorAll(".food-card").forEach(card=>{
    const id = Number(card.dataset.id);
    const quantity = cart.get(id)?.quantity || 0;
    const indicator = card.querySelector(".in-cart-indicator");
    const value = card.querySelector(".card-qty-value");
    const minus = card.querySelector('[data-card-action="minus"]');

    card.classList.toggle("is-in-cart", quantity > 0);
    if(indicator){
      indicator.textContent = quantity > 0 ? `✓ В корзине · ${quantity}` : "";
      indicator.classList.toggle("visible", quantity > 0);
      indicator.setAttribute("aria-label", quantity > 0 ? "В корзине" : "Не добавлено");
    }
    if(value) value.textContent = quantity;
    if(minus) minus.disabled = quantity === 0;
  });
}

function updateCart(){
  const count = [...cart.values()].reduce((sum,item)=>sum+item.quantity,0);
  document.getElementById("cartCount").textContent = count;
  const items = [...cart.values()];
  const cartItems = document.getElementById("cartItems");
  const empty = document.getElementById("cartEmpty");
  const summary = document.getElementById("cartSummary");
  empty.hidden = items.length > 0;
  summary.hidden = items.length === 0;
  cartItems.innerHTML = items.map(item => `
    <div class="cart-row">
      <img src="${item.food.image}" alt="${item.food.name}">
      <div>
        <h3>${item.food.name}</h3>
        <div class="cart-unit-price">${formatPrice(item.food.price)} / порция</div>
        <div class="cart-qty">
          <button data-cart-action="minus" data-id="${item.food.id}" aria-label="Уменьшить">−</button>
          <span>${item.quantity}</span>
          <button data-cart-action="plus" data-id="${item.food.id}" aria-label="Увеличить">+</button>
          <button class="remove-item" data-cart-action="remove" data-id="${item.food.id}" aria-label="Удалить">×</button>
        </div>
      </div>
      <strong class="cart-line-total">${formatPrice(item.food.price * item.quantity)}</strong>
    </div>`).join("");
  const total = items.reduce((sum,item)=>sum+item.food.price*item.quantity,0);
  document.getElementById("cartTotal").textContent = formatPrice(total);
  updateVisibleCardStates();
}

let toastTimer;
function showCartToast(message){
  const toast = document.getElementById("cartToast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"),1800);
}

function openCart(){
  closeModal();
  document.getElementById("cartModal").classList.add("open");
  document.getElementById("cartModal").setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
}
function closeCart(){
  document.getElementById("cartModal").classList.remove("open");
  document.getElementById("cartModal").setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}

document.getElementById("detailMinus").addEventListener("click",()=>{
  detailQuantity = Math.max(1,detailQuantity-1);
  document.getElementById("detailQty").textContent = detailQuantity;
});
document.getElementById("detailPlus").addEventListener("click",()=>{
  detailQuantity = Math.min(99,detailQuantity+1);
  document.getElementById("detailQty").textContent = detailQuantity;
});
document.getElementById("addToCart").addEventListener("click",()=>{
  if(!selectedFood)return;
  const existing = cart.get(selectedFood.id);
  cart.set(selectedFood.id,{food:selectedFood,quantity:(existing?.quantity || 0)+detailQuantity});
  updateCart();
  closeModal();
  showCartToast(`${selectedFood.name} добавлено в корзину`);
});
document.getElementById("cartTrigger").addEventListener("click",openCart);
document.getElementById("cartModal").addEventListener("click",event=>{
  if(event.target.hasAttribute("data-cart-close"))closeCart();
  const control = event.target.closest("[data-cart-action]");
  if(!control)return;
  const id = Number(control.dataset.id);
  const item = cart.get(id);
  if(!item)return;
  if(control.dataset.cartAction==="plus")item.quantity=Math.min(99,item.quantity+1);
  if(control.dataset.cartAction==="minus")item.quantity=Math.max(1,item.quantity-1);
  if(control.dataset.cartAction==="remove")cart.delete(id);
  updateCart();
});
const customerNameInput = document.getElementById("customerName");
const nameError = document.getElementById("nameError");

customerNameInput.addEventListener("input",()=>{
  if(customerNameInput.value.trim()){
    customerNameInput.classList.remove("invalid");
    nameError.hidden = true;
  }
});

document.getElementById("checkoutButton").addEventListener("click",()=>{
  const items = [...cart.values()];
  if(!items.length)return;

  const customerName = customerNameInput.value.trim();
  if(!customerName){
    customerNameInput.classList.add("invalid");
    nameError.hidden = false;
    customerNameInput.focus();
    return;
  }

  const total = items.reduce((sum,item)=>sum+item.food.price*item.quantity,0);
  const lines = items.map(item=>`• ${item.food.name} — ${item.quantity} порц. × ${formatPrice(item.food.price)} = ${formatPrice(item.food.price*item.quantity)}`);
  const message = `Здравствуйте! Меня зовут ${customerName}. Хочу оформить заказ:\n\n${lines.join("\n")}\n\nИтого: ${formatPrice(total)}`;
  window.open(`https://wa.me/87788237005?text=${encodeURIComponent(message)}`,"_blank","noopener");
});

function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}
grid.addEventListener("click",event=>{
  const control = event.target.closest("[data-card-action]");
  if(control){
    event.stopPropagation();
    const id = Number(control.dataset.id);
    const food = foods.find(item=>item.id === id);
    if(!food)return;
    const existing = cart.get(id);
    if(control.dataset.cardAction === "plus"){
      cart.set(id,{food,quantity:Math.min(99,(existing?.quantity || 0)+1)});
      updateCart();
      showCartToast(`${food.name} добавлено в корзину`);
    } else if(control.dataset.cardAction === "minus" && existing){
      if(existing.quantity <= 1){
        cart.delete(id);
        updateCart();
        showCartToast(`${food.name} удалено из корзины`);
      } else {
        existing.quantity -= 1;
        updateCart();
        showCartToast(`Количество обновлено: ${existing.quantity}`);
      }
    }
    return;
  }
  const card = event.target.closest(".food-card");
  if(!card)return;
  const food = foods.find(item=>item.id === Number(card.dataset.id));
  if(food)openFood(food);
});
grid.addEventListener("keydown",event=>{
  if(event.target.closest("[data-card-action]"))return;
  if(event.key !== "Enter" && event.key !== " ")return;
  const card = event.target.closest(".food-card");
  if(!card)return;
  event.preventDefault();
  const food = foods.find(item=>item.id === Number(card.dataset.id));
  if(food)openFood(food);
});
modal.addEventListener("click",event=>{if(event.target.hasAttribute("data-close"))closeModal();});
document.addEventListener("keydown",event=>{if(event.key==="Escape"){closeModal();closeCart();}});
document.getElementById("year").textContent = new Date().getFullYear();
renderMenu();
