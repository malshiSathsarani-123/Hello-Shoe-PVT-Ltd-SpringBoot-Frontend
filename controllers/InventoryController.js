var category = null;
var picDecodeInventory = null;

/**
 * Load Supplier Id
 **/
const loadSupplierId = () => {
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/supplier",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (supplier) {
            var selectElement = $("#cmbSupplierId");
            selectElement.empty();
            var option = $("<option>")
                .text("Supplier Id")
            selectElement.append(option);
            supplier.forEach(function (supplier) {
                var option = $("<option>")
                    .val(supplier.code)
                    .text(supplier.code);
                selectElement.append(option);
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
};
/**
 * Load Supplier Data
 **/
$("#cmbSupplierId").on("change", function() {
    var selectedValue = $(this).val();

    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/supplier",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (supplier) {
            supplier.forEach(function (supplier) {
                if (selectedValue === supplier.code){
                    $("#supplierName").val(supplier.name)
                    $("#supplierOrderAddress").val(supplier.address)
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
const loadItemId = () => {
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/item",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (item) {
            var selectElement = $("#cmbItemCode");
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
$("#cmbItemCode").on("change", function() {
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
                    $("#itemName").val(item.description)
                    console.log(item)
                    picDecodeInventory = item.pic
                    base64DecoderInventory(picDecodeInventory)
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
 * Load Qty on hand
 **/
$("#shoeSize").on('input', function(event) {
    var size = $("#shoeSize").val();
    var shoeCode = $("#cmbItemCode").val();
    $.ajax({
        url: "http://localhost:8080/shoe/api/v1/inventory/getSizeQty",
        method: 'GET',
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data: {
            shoeCode: shoeCode,
            size: size
        },
        success: function(response) {
            $("#qtyOnHand").val(response);
        },
        error: function(xhr, status, error) {
            console.error("Error:", error);
        }
    });
});

/**
 * Get balance
 **/
$("#inventoryCash").on('input', function(event) {
    var cash = parseInt($("#inventoryCash").val());
    var total = parseInt($("#inventoryTotal").val());
    $("#inventoryBalance").val(total-cash);
});




$("#btnAddToCart").on("click", () => {

    let shoeCode = $("#cmbItemCode").val();
    let description = $("#itemName").val();
    let category1 = category;
    let size = $("#shoeSize").val();
    let unitPriceBuy =parseInt($("#buyPrice").val());
    let profitMarginValue = $("#profitMargin").val();
    let profitMargin = profitMarginValue/100;
    let exceptedProfit=unitPriceBuy*profitMargin;
    let unitPriceSale = unitPriceBuy+exceptedProfit;
    let status = "available";
    let qty = parseInt($("#buyQty").val());
    let total = qty*unitPriceBuy;
    let pic = picDecodeInventory

    let shoeCodeExists = false;

    $("#tblInventory tr").each(function() {
        if ($(this).find("td:first").text() === shoeCode  && $(this).find("td:nth-child(4)").text() === size) {
            shoeCodeExists = true;
            let existingQty = parseInt($(this).find("td:nth-child(10)").text());
            let existingTotal = parseFloat($(this).find("td:nth-child(11)").text());
            $(this).find("td:nth-child(10)").text(existingQty + qty);
            $(this).find("td:nth-child(11)").text(existingTotal + total);
            netTotal(total)
            clear();
            return false;
        }
    });

    if (!shoeCodeExists) {
        let newRow = $("<tr>").append(
            $("<td>").text(shoeCode),
            $("<td>").text(description),
            $("<td>").text(category1),
            $("<td>").text(size),
            $("<td>").text(unitPriceBuy),
            $("<td style='display:none;'>").text(unitPriceSale),
            $("<td style='display:none;'>").text(exceptedProfit),
            $("<td style='display:none;'>").text(profitMargin),
            $("<td style='display:none;'>").text(status),
            $("<td>").text(qty),
            $("<td>").text(total),
            $("<td>").text(pic),
        );
        $("#tblInventory").append(newRow);
        netTotal(total)
        clear();
    }
});
/**
 * Inventory Save
 **/
$("#btnPurchase").click(function () {
var postData = createInventoryDtoList();
    $.ajax({
        method:"POST",
        contentType:"application/json",
        url:"http://localhost:8080/shoe/api/v1/inventory",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data:JSON.stringify(postData),
        success: function (data) {
            Swal.fire(
                'Success!',
                'Item has been saved successfully!',
                'success'
            );
            loadSupplierId()
            $("#supplierName").val("");
            $("#suppliesDate").val("");
            $("#supplierOrderAddress").val("");
            $("#tblInventory").empty();
            $("#inventoryCash").val("");
            $("#inventoryBalance").val("");
            $("#inventoryTotal").val(0);
            $("#qtyOnHand").val(0);
        },
        error: function (xhr, exception) {
            Swal.fire(
                'Error!',
                'Item has been saved unsuccessfully!',
                'error'
            );
        }
    })
});
const clear = () => {
    loadItemId();
    $("#itemName").val("");
    $("#shoeSize").val("");
    $("#buyPrice").val("");
    $("#profitMargin").val("");
    $("#buyQty").val("");
    $("#shoePic").val("");
    $("#qtyOnHand").val("");
    document.getElementById('inventoryPicView').style.display = 'none';
}

const netTotal = (total) => {
    let netTotal = parseFloat($("#inventoryTotal").val());
    let newTotal = (netTotal+total);
    $("#inventoryTotal").val(newTotal);

}
const createInventoryDtoList = () => {
var inventoryDtoList = [];

$('#tblInventory tr').each(function() {
    var inventoryDto = {
        shoeCode: $(this).find('td:eq(0)').text(),
        description: $(this).find('td:eq(1)').text(),
        category: $(this).find('td:eq(2)').text(),
        size: $(this).find('td:eq(3)').text(),
        unitPriceBuy: $(this).find('td:eq(4)').text(),
        unitPriceSale: $(this).find('td:eq(5)').text(),
        expectedProfit: $(this).find('td:eq(6)').text(),
        profitMargin: $(this).find('td:eq(7)').text(),
        status: $(this).find('td:eq(8)').text(),
        qty: $(this).find('td:eq(9)').text(),
        pic: $(this).find('td:eq(11)').text(),
        buyDate: $('#suppliesDate').val(),
        supplierId: $('#cmbSupplierId').val(),
        supplierName: $('#supplierName').val()
    };

    inventoryDtoList.push(inventoryDto);
});
return inventoryDtoList;
}


// var enc_file_shoe = document.getElementById('shoePic')

// // for encoding
// document.getElementById('shoePic').addEventListener('change', function(event) {
//     // if(enc_file.value !== '' || enc_text.value !== ''){
//     if(enc_file_shoe.value !== ''){
//         if(enc_file_shoe.value !== ''){
//             base64EncoderInventory(enc_file_shoe.files[0])
//         }else{
//             const http = new XMLHttpRequest();
//             http.onload = () => {
//                 base64EncoderInventory(http.response)
//             }
//             http.responseType = 'blob'
//             http.open('GET', enc_text.value, true)
//             http.send()
//         }
//     }
// });
//
// // encode function
// function base64EncoderInventory(blob){
//     var reader = new FileReader();
//     reader.readAsDataURL(blob)
//     reader.onloadend = () => {
//         picDecodeItem = reader.result
//         base64DecoderInventory(picDecodeItem)
//     }
// }

function base64DecoderInventory(base64){
    const http = new XMLHttpRequest();
    http.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
            document.getElementById('inventoryPicView').src = reader.result;
            document.getElementById('inventoryPicView').style.display = 'block';
        };
        reader.readAsDataURL(http.response);
    }
    http.responseType = 'blob';
    http.open('GET', base64, true);
    http.send();
}