let showInventoryBtn = document.querySelector(".showInventory")
let curdProduct = document.querySelector(".curd-product")
let all_inputs = document.querySelectorAll(".row input")
let allCalcInputs = document.querySelectorAll(".calc input")
let importantInputs = document.querySelectorAll(".important")
let name_product =document.getElementById("name_product")
let category_product =document.getElementById("category_product")
let number_product =document.getElementById("number_product")
let image_product =document.getElementById("image_product")
let net_cost_product =document.getElementById("net_cost")
let discount_product =document.getElementById("discount_product")
let cost_product =document.getElementById("cost_product")
let net_sales_product =document.getElementById("net_sales")
let tax_product =document.getElementById("tax")
let price_product =document.getElementById("price")
let net_profit_product =document.getElementById("net_profit")
let btn_Add_product = document.getElementById("add_product")
let btn_clear_product = document.getElementById("clear_product")
let search = document.getElementById("search")
let alert_message = document.querySelector(".alert_message")
let table = document.getElementById('table')
let tbody = document.getElementById('tbody')
let body = document.body
let layout = document.querySelector(".layout")
//====================== local sotrage =====================================
let editIndex = null
let products;
if(localStorage.data != null){
    products = JSON.parse(localStorage.data)
    showData()
}
else{
    products = []
}
//====================== check LocalStorage =================================
function check(){
    if(tbody.childElementCount == 0 && localStorage.data == null || products ==""){
        alert_message.classList.remove("none")
        table.classList.add("none")
    }
    else{
        alert_message.classList.add("none")
        table.classList.remove("none")
    }
}
check()
//====================== checkImportant Inputs =============================
function validateInputs(){
    let isvalid  = true
    importantInputs.forEach(input =>{
        if (input.nextElementSibling && input.nextElementSibling.classList.contains("error-msg")) {
            input.nextElementSibling.remove();
        }
        if(input.value.trim() ===""){
            isvalid = false;
            let error = document.createElement("span");
            error.classList.add("error-msg");
            error.textContent = "مطلوب";
            error.style.color = "red";
            error.style.fontSize = "12px";
            input.after(error);
        }
    })
    return isvalid
}
importantInputs.forEach(input =>{
    input.addEventListener("input",()=>{
        if (input.nextElementSibling && input.nextElementSibling.classList.contains("error-msg")) {
            input.nextElementSibling.remove();
        }
    })
})
//====================== checkCalcInputs =======================================
function checkCalcInputs() {
    let hasText = false;
    allCalcInputs.forEach((i) => {
        if (isNaN(i.value)) {
            i.classList.add("border-danger");
            hasText = true
        }
        else {
            i.classList.remove("border-danger");
        }
    });
    return hasText;
}
//===================== createData ===========================================
function createData(){
    if(!validateInputs())return;
    btn_Add_product.innerHTML = `اضافة المنتج`
    let createProducts = {
        name : name_product.value,
        category : category_product.value,
        image : image_product.value,
        number : number_product.value,
        costProduct : cost_product.value,
        discount : discount_product.value,
        netCostProduct : net_cost_product.value,
        price : price_product.value,
        tax : tax_product.value,
        netSales : net_sales_product.value,
        netProfitProduct : net_profit_product.value,
    }
    if(editIndex !== null){
        products[editIndex] = createProducts;
        editIndex = null;
        btn_Add_product.innerHTML = `اضافة المنتج`;
    }else {
        products.push(createProducts);
    }
    localStorage.setItem("data",JSON.stringify(products))
    showInventory()
    showData()
    clear()
}
//====================== calc =================================================
function calcNetProfit(){
    // Net Cost
    if(checkCalcInputs())return;
    function netCost(){
        let costProduct = cost_product.value;
        let discount = discount_product.value;
        let netCost = costProduct - (costProduct * (discount / 100))
        net_cost_product.value = netCost * number_product.value
    }
    // Net Price 
    function netPrice(){
        let price = +price_product.value;
        let tax = +tax_product.value;
        let totalPrice = price + (price * (tax / 100));
        net_sales_product.value = totalPrice * +number_product.value;
    }
    // Net Profit
    function netProfit(){
        net_profit_product.value = +net_sales_product.value -  +net_cost_product.value;
        if(+net_cost_product.value > +net_sales_product.value){
            net_profit_product.classList.add("bg-danger")
        }else{
            net_profit_product.classList.remove("bg-danger")
            net_profit_product.classList.add("profit")
        }
    }
    netCost()
    netPrice()
    netProfit()
}
allCalcInputs.forEach((input) => {
    input.addEventListener("keyup", calcNetProfit);
});
//====================== showData =============================================
function showData(product = products){
    tbody.innerHTML =""
    product.forEach((i,index)=>{
        tbody.innerHTML +=`
        <tr>
        <td data-label="ID">${index + 1}</td>
        <td data-label="Name">${i.name}</td>
        <td data-label="Category">${i.category}</td>
        <td data-label="Image"><img src="${i.image}" onerror="this.src='images/Group-Project-2.jpg'" style="max-width:55px"></td>
        <td data-label="Price">${i.netSales / i.number}</td>
        <td data-label="Count">${i.number}</td>
        <td data-label="Eye"><span><i onclick="show_model_data(${index})" class="fa-solid fa-eye Eye" style="color: #82f263"></i></span></td>
        <td data-label="Edit"><span><i class="fa-solid fa-pen-to-square text-info edit" data-index="${index}"></i></span></td>
        <td data-label="Delete"><span><i class="fa-solid fa-trash-can text-danger delete" data-index="${index}"></i></span></td>
        </tr>
        `
        check()
    })
}
//==================== showInventory ==============================
let inventory = "show"
function showInventory(){
    if(inventory == "hidden"){
        showInventoryBtn.innerHTML = `اخفاء`
        curdProduct.classList.remove("none")
        inventory = "show"
    }
    else{
        showInventoryBtn.innerHTML = `اضافة`
        curdProduct.classList.add("none")
        inventory = "hidden"
    }
}
showInventory()
showInventoryBtn.addEventListener("click",showInventory)
//==================== search =====================================
search.addEventListener("keyup",()=>{
    let searchProduct = products.filter((i)=>
        i.name.includes(search.value)
    )
    showData(searchProduct)
})
//==================== clear ========================================
function clear(){
    all_inputs.forEach((i)=>{
        i.value =""
    })
    let defaultValue = "اختر من القائمة"
    category_product.value = defaultValue
    number_product.value = 1
}
btn_clear_product.addEventListener("click",clear)
//==================== add ==========================================
btn_Add_product.addEventListener("click",createData)
//==================== delete =======================================
tbody.addEventListener("click",(e)=>{
    if(e.target.classList.contains("delete")){
        let row = e.target.dataset.index
        products.splice(row,1);
        localStorage.setItem("data",JSON.stringify(products))
        showData()
        check()
    }
})
//=================== ShowDetils ============================================
let show_model_data = (index)=>{
    layout.classList.remove("none")
    layout.innerHTML = `
    <div class="modal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 class="modal-title">${products[index].name}</h3>
                            <i onclick="close_model_data()" class="fa-solid fa-close"></i>
                        </div>
                        <div class="modal-body">
                            <img src="${products[index].image}" width="120">
                            <hr>
                            <h5>اسم المنتج : ${products[index].name}</h5>
                            <h5>نوع المنتج : ${products[index].category}</h5>
                            <h5>العدد : ${products[index].number}</h5>
                            <h5>تكلفة المنتج : ${products[index].costProduct}</h5>
                            <h5>خصم الشراء : %${products[index].discount}</h5>
                            <h5> صافي التكلفة: ${products[index].netCostProduct}</h5>
                            <h5>سعر المنتج : ${products[index].price}</h5>
                            <h5>الضريبة علي المنتج : %${products[index].tax}</h5>
                            <h5>اجمالي سعر البيع : ${products[index].netSales}</h5>
                            <h5>صافي الربح : ${products[index].netProfitProduct}</h5>
                        </div>
                        <div class="modal-footer">
                            <button type="button" onclick="close_model_data()" class="btn btn-secondary"
                                data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div> 
    `
}
let close_model_data = ()=>{
    layout.classList.add("none")
    layout.innerHTML="";
}
//=================== edit ===========================================
tbody.addEventListener("click",(e)=>{
    if(e.target.classList.contains("edit")){
        curdProduct.classList.remove("none")
        showInventoryBtn.innerHTML = "اخفاء"
        inventory = "show"
        let row = e.target.dataset.index
        name_product.value = products[row].name;
        category_product.value = products[row].category;
        image_product.value = products[row].image;
        net_sales_product.value = products[row].netSales;
        number_product.value = products[row].number;
        cost_product.value = products[row].costProduct;
        net_cost_product.value = products[row].netCostProduct;
        discount_product.value = products[row].discount;
        price_product.value = products[row].price;
        net_profit_product.value = products[row].netProfitProduct;
        btn_Add_product.innerHTML = `حفظ التعديلات`
        editIndex = row;       
    }
})
//=====================================================================