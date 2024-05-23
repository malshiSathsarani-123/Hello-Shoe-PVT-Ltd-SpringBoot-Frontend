var orderItemCode = null;
$("#orderId").on("input", function() {
    var selectedValue = $(this).val();

    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/orders",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (order) {
            order.forEach(function (order) {
                if (selectedValue === order.code){
                    $("#customerIdReturn").val(order.customerId)
                    $("#customerNameReturn").val(order.customerName)
                    loadCustomerDataReturn(order.customerId)
                    loadItemCodeReturn(selectedValue)
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
});

function loadCustomerDataReturn(customerId) {
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/customer",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (customer) {

            customer.forEach(function (customer) {
                if (customerId === customer.code){
                    $("#customerLevelReturn").val(customer.level)
                    $("#totalPointReturn").val(customer.totalPoints)
                    $("#customerEmailReturn").val(customer.email)
                    $("#customerContactReturn").val(customer.contact)

                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
}
function loadItemCodeReturn(orderId) {
        $.ajax({
            method: 'GET',
            url: "http://localhost:8080/shoe/api/v1/orders/getShoeCode/"+orderId,
            async:true,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (item) {
                console.log(item)
                var selectElement = $("#cmbReturnItemCode");
                selectElement.empty();
                var option = $("<option>")
                    .text("Shoe Code")
                selectElement.append(option);
                item.forEach(function (item) {
                    var option = $("<option>")
                        .val(item)
                        .text(item);
                    selectElement.append(option);
                });
            },
            error: function (xhr, status, error) {
                console.error("Failed to fetch item data. Status code:");
            }
        });
}
/**
 * Load Item Data
 **/
$("#cmbReturnItemCode").on("change", function() {
    var selectedValue = $(this).val();

    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/orders/getOrderItem",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {
            orderCode:$("#orderId").val(),
            shoeCode: $("#cmbReturnItemCode").val()
        },
        success: function (item) {
            $("#itemReturnSize").val(item[0])
            $("#itemReturnDescription").val(item[1])
            $("#itemPriceReturn").val(item[2])
            $("#qtyOnReturnOrder").val(item[3])
            orderItemCode = item[4]
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
});
$("#btnAddToCartReturn").on("click", () => {

    let shoeCode = $("#cmbReturnItemCode").val();
    let description = $("#itemReturnDescription").val();
    let size = $("#itemReturnSize").val();
    let unitPrice =parseInt($("#itemPriceReturn").val());
    let qty = parseInt($("#buyReturnOrder").val());
    let total = qty*unitPrice;

    let shoeCodeExistOrder = false;

    $("#tblReturn tr").each(function() {
        if ($(this).find("td:first").text() === shoeCode  && $(this).find("td:nth-child(3)").text() === size) {
            shoeCodeExistOrder = true;
            let existingQty = parseInt($(this).find("td:nth-child(5)").text());
            let existingTotal = parseFloat($(this).find("td:nth-child(6)").text());
            $(this).find("td:nth-child(5)").text(existingQty + qty);
            $(this).find("td:nth-child(6)").text(existingTotal + total);
            netTotalReturn(total)
            clearItemDataReturn();
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
            $("<td>").text(orderItemCode),
        );
        $("#tblReturn").append(newRow);
        netTotalReturn(total)
        clearItemDataReturn();
    }
});
/**
 * Return Order
 **/
$("#btnReturn").on("click", () => {
    var total = parseInt($("#returnTotal").val());
    var point = total / 800;

    var orderItemDTOS = getReturnDetailArray();
    var postDataReturn = {
        customerCode:$("#customerIdReturn").val(),
        point : point,
        orderCode: $("#orderId").val(),
        orderItemDTOS: orderItemDTOS,
    };
    console.log(postDataReturn)
    $.ajax({
        method:"POST",
        contentType:"application/json",
        url:"http://localhost:8080/shoe/api/v1/orders/return",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data:JSON.stringify(postDataReturn),
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
const netTotalReturn = (total) => {
    let netTotal = parseFloat($("#returnTotal").val());
    let newTotal = (netTotal+total);
    $("#returnTotal").val(newTotal);
}
/**
 * Clear Text Field
 **/
const clearItemDataReturn = () => {
    loadItemCodeReturn($("#orderId").val())
    $("#itemReturnDescription").val("");
    $("#itemPriceReturn").val("");
    $("#qtyOnReturnOrder").val("");
    $("#buyReturnOrder").val("");
    $("#itemReturnSize").val("");
}

function getReturnDetailArray() {
    var returnDetailArray = [];

    $('#tblReturn tr').each(function() {
        var returnDetailDTO = {
            shoeCode:$(this).find('td:eq(0)').text(),
            description: $(this).find('td:eq(1)').text(),
            size: $(this).find('td:eq(2)').text(),
            unitPrice: parseFloat($(this).find('td:eq(3)').text()),
            qty: parseInt($(this).find('td:eq(4)').text()),
            id: $(this).find('td:eq(6)').text(),
        };

        returnDetailArray.push(returnDetailDTO);
    });

    return returnDetailArray;
}
