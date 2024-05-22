let unitPriceCost = 0;
let unitPriceAllCost = 0;
let orderItemPic = null;

/**
 * Load Customer Id
 **/
const loadCustomerId = () => {
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/customer",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (customer) {
            var selectElement = $("#cmbCustomerId");
            selectElement.empty();
            var option = $("<option>")
                .text("Customer Id")
            selectElement.append(option);
            customer.forEach(function (customer) {
                var option = $("<option>")
                    .val(customer.code)
                    .text(customer.code);
                selectElement.append(option);
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
};
/**
 * Load Customer Data
 **/
$("#cmbCustomerId").on("change", function() {
    var selectedValue = $(this).val();

    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/customer",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (customer) {
            customer.forEach(function (customer) {
                if (selectedValue === customer.code){
                    console.log(customer)
                    $("#customerName").val(customer.name)
                    $("#customerLevel").val(customer.level)
                    $("#totalPoint").val(customer.totalPoints)
                    $("#customerEmail").val(customer.email)
                    $("#customerContact").val(customer.contact)
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
});
/**
 * Load Item Id
 **/
const loadItemIdOrder = () => {
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/item",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (item) {
            var selectElement = $("#cmbOrderItemCode");
            selectElement.empty();
            var option = $("<option>")
                .text("Shoe Code")
            selectElement.append(option);
            item.forEach(function (item) {
                var option = $("<option>")
                    .val(item.shoeCode)
                    .text(item.shoeCode);
                selectElement.append(option);
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
};
/**
 * Load Item Data
 **/
$("#cmbOrderItemCode").on("change", function() {
    var selectedValue = $(this).val();

    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/item",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (item) {
            item.forEach(function (item) {
                if (selectedValue === item.shoeCode){
                    $("#itemOrderDescription").val(item.description)
                    category = item.verities
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
});
/**
 * Load Qty on hand and price
 **/
$("#itemOrderSize").on('input', function(event) {
    var size = $("#itemOrderSize").val();
    var shoeCode = $("#cmbOrderItemCode").val();
    $.ajax({
        url: "http://localhost:8080/shoe/api/v1/inventory/getAllSizeQty",
        method: 'GET',
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {
            shoeCode: shoeCode,
            size: size
        },
        success: function (item) {
            $("#qtyOnHandOrder").val(item.qty)
            $("#itemPrice").val(item.unitPriceSale)
            unitPriceCost = item.unitPriceBuy;
            orderItemPic = item.pic
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
        }
    });
});
/**
 * Load Balance
 **/
$("#orderCash").on('input', function(event) {
    var cash = parseInt($("#orderCash").val());
    var total = parseInt($("#orderSubTotal").val());
    $("#orderBalance").val(total-cash);
});
/**
 * Load Sub Total
 **/
$("#orderDiscount").on('input', function(event) {
    var total = parseInt($("#orderTotal").val());
    var discount = parseInt($("#orderDiscount").val());
    $("#orderSubTotal").val(total-discount);
});
/**
 * Load Table
 **/
$("#btnAddToCartOrder").on("click", () => {

    let shoeCode = $("#cmbOrderItemCode").val();
    let description = $("#itemOrderDescription").val();
    let size = $("#itemOrderSize").val();
    let unitPrice =parseInt($("#itemPrice").val());
    let qty = parseInt($("#buyQtyOrder").val());
    let total = qty*unitPrice;

    let shoeCodeExistOrder = false;

    $("#tblOrder tr").each(function() {
        if ($(this).find("td:first").text() === shoeCode  && $(this).find("td:nth-child(3)").text() === size) {
            shoeCodeExistOrder = true;
            let existingQty = parseInt($(this).find("td:nth-child(5)").text());
            let existingTotal = parseFloat($(this).find("td:nth-child(6)").text());
            $(this).find("td:nth-child(5)").text(existingQty + qty);
            $(this).find("td:nth-child(6)").text(existingTotal + total);
            netTotalOrder(total)
            netCostOrder(qty,unitPriceCost)
            clearItemData();
            return false;
        }
    });

    if (!shoeCodeExistOrder) {
        let newRow = $("<tr>").append(
            $("<td>").text(shoeCode),
            $("<td>").text(description),
            $("<td>").text(size),
            $("<td>").text(unitPrice),
            $("<td>").text(qty),
            $("<td>").text(total),
            $("<td style='display:none;'>").text(orderItemPic),
        );
        $("#tblOrder").append(newRow);
        netCostOrder(qty,unitPriceCost)
        netTotalOrder(total)
        clearItemData();
    }
});
/**
 * Place Order
 **/
$("#btnPurchaseOrder").on("click", () => {
    var subTotal = parseInt($("#orderSubTotal").val());
    var point = subTotal / 800;

    var orderDTO = {
        customerName :  $("#customerName").val(),
        amount: subTotal,
        date:$("#orderDate").val(),
        payment:$("#paymentMethod").val(),
        point: point,
        userName:userName,
        profit:subTotal - unitPriceAllCost
    };

    var orderItemDTOS = getOrderDetailArray();
    var postData = {
        customerCode:$("#cmbCustomerId").val(),
        orderDTO: orderDTO,
        orderItemDTOS: orderItemDTOS,
    };

    console.log(postData)

    $.ajax({
        method:"POST",
        contentType:"application/json",
        url:"http://localhost:8080/shoe/api/v1/orders",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data:JSON.stringify(postData),
        success: function() {
            Swal.fire(
                'Success!',
                'Order has been saved successfully!',
                'success'
            );
            clearItemData();
            clearCustomerData();
        },
        error: function() {
            Swal.fire(
                'Error!',
                'Order has been saved unsuccessfully!',
                'error'
            );
        }
    });
});
/**
 * Generate Total
 **/
const netTotalOrder = (total) => {
    let netTotal = parseFloat($("#orderTotal").val());
    let newTotal = (netTotal+total);
    $("#orderTotal").val(newTotal);
}
const netCostOrder = (qty,unitPriceCost) => {
    let netCost = unitPriceAllCost;
    let addCost = (qty*unitPriceCost);
    unitPriceAllCost = netCost + addCost;
}
/**
 * Clear Text Field
 **/
const clearItemData = () => {
    loadItemIdOrder()
    $("#itemOrderDescription").val("");
    $("#itemOrderSize").val("");
    $("#itemPrice").val("");
    $("#qtyOnHandOrder").val("");
    $("#buyQtyOrder").val("");
}
const clearCustomerData = () => {
    loadCustomerId()
    $("#customerName").val("");
    $("#customerLevel").val("");
    $("#totalPoint").val("");
    $("#customerEmail").val("");
    $("#customerContact").val("");
    $("#orderTotal").val("0");
    $("#orderDiscount").val("");
    $("#orderSubTotal").val("");
    $("#orderCash").val("");
    $("#orderBalance").val("");
    $("#paymentMethod").val("Payment");
    $("#tblOrder").empty();
}
/**
 * Get OrderDetail Array
 **/
function getOrderDetailArray() {
    var orderDetailArray = [];

    $('#tblOrder tr').each(function() {
        var orderDetailDTO = {
            shoeCode:$(this).find('td:eq(0)').text(),
            description: $(this).find('td:eq(1)').text(),
            size: $(this).find('td:eq(2)').text(),
            unitPrice: parseFloat($(this).find('td:eq(3)').text()),
            qty: parseInt($(this).find('td:eq(4)').text()),
            pic: $(this).find('td:eq(6)').text(),
        };

        orderDetailArray.push(orderDetailDTO);
    });

    return orderDetailArray;
}

