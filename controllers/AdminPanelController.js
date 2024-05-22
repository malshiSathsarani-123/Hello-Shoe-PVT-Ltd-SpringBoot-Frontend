/**
 * Load Admin Panel
 **/
$("#selectedDate").on("change", function() {
    var selectedValue = $(this).val();

    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/adminPanel/"+selectedValue,
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (admin) {
            loadAdminTable(admin);
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
});


function loadAdminTable(admin) {
    base64DecoderAdmin(admin.itemPic)
    document.getElementById('total-sales').textContent = admin.totalSales;
    document.getElementById('total-profit').textContent = admin.totalProfit;
    document.getElementById('most-sale-item').textContent = admin.mostSaleItem;
    document.getElementById('most-sale-item-qty').textContent = admin.saleItemQty;
}

function base64DecoderAdmin(base64){
    const http = new XMLHttpRequest();
    http.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
            document.getElementById('most-sale-item-image').src = reader.result;
        };
        reader.readAsDataURL(http.response);
    }
    http.responseType = 'blob';
    http.open('GET', base64, true);
    http.send();
}