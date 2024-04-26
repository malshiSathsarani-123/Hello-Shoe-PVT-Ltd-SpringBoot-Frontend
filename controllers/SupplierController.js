var supplierId01 = null;

document.addEventListener('DOMContentLoaded', function () {
    loadSupplierData();
});
/**
 * Search Supplier Data
 * */
$('#searchSupplierId').on("keyup", function () {
    let value = $(this).val().toLowerCase();
    $("tbody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});
/**
 * Load Supplier Data
 * */
const loadSupplierData = () => {
    var tableBody = $('#supplierTable');
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/supplier",
        async:true,
        success: function (item) {
            tableBody.empty();

            item.forEach(function (item) {
                var row = $('<tr>');

                row.append($('<td>').text(item.code));
                row.append($('<td>').text(item.name));
                row.append($('<td>').text(item.category));
                row.append($('<td>').text(item.address));
                row.append($('<td>').text(item.contact1));
                row.append($('<td>').text(item.contact2));
                row.append($('<td>').text(item.email));

                tableBody.append(row);
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
};
/**
 * Supplier Save
 * */
$("#btnSaveSupplier").click(function () {
    let name = $("#txtSupName").val();
    let category = $("#category").val();
    let contact1 = $("#supplierContact1").val();
    let contact2 = $("#supplierContact2").val();
    let address = $("#supplierAddress").val();
    let email = $("#supplierEmail").val();
    $.ajax({
        method:"POST",
        contentType:"application/json",
        url:"http://localhost:8080/shoe/api/v1/supplier",
        async:true,
        data:JSON.stringify({
            name:name,
            category:category,
            contact1:contact1,
            contact2:contact2,
            address:address,
            email:email
        }),
        success: function (data) {
            Swal.fire(
                'Success!',
                'Supplier has been saved successfully!',
                'success'
            );
            loadSupplierData()
            $("#btnResetSupplier").click();
        },
        error: function (xhr, exception) {
            Swal.fire(
                'Error!',
                'Supplier has been saved unsuccessfully!',
                'error'
            );
        }
    })
});
/**
 * Supplier update
 * */
$("#btnUpdateSupplier").click(function () {
    let name = $("#txtSupName").val();
    let category = $("#category").val();
    let contact1 = $("#supplierContact1").val();
    let contact2 = $("#supplierContact2").val();
    let address = $("#supplierAddress").val();
    let email = $("#supplierEmail").val();
    $.ajax({
        method:"PUT",
        contentType:"application/json",
        url:"http://localhost:8080/shoe/api/v1/supplier",
        async:true,
        data:JSON.stringify({
            code:supplierId01,
            name:name,
            category:category,
            contact1:contact1,
            contact2:contact2,
            address:address,
            email:email
        }),
        success: function (data) {
            Swal.fire(
                'Success!',
                'Supplier has been saved successfully!',
                'success'
            );
            loadSupplierData()
            $("#btnResetSupplier").click();
        },
        error: function (xhr, exception) {
            Swal.fire(
                'Error!',
                'Supplier has been saved unsuccessfully!',
                'error'
            );
        }
    })
});

/**
 * clear input fields Values Method
 * */
$("#btnResetSupplier").click(function () {
    $("#txtSupName").val("");
    $("#category").val("");
    $("#supplierContact1").val("");
    $("#supplierContact2").val("");
    $("#supplierAddress").val("");
    $("#supplierEmail").val("");
})
/**
 * Supplier delete
 * */
$("#btnDeleteSupplier").click(function () {
    $.ajax({
        method:"DELETE",
        contentType:"application/json",
        url:"http://localhost:8080/shoe/api/v1/supplier/"+supplierId01,
        async:true,
        success: function (data) {
            Swal.fire(
                'Success!',
                'Supplier has been saved successfully!',
                'success'
            );
            loadSupplierData()
            $("#btnResetSupplier").click();
        },
        error: function (xhr, exception) {
            Swal.fire(
                'Error!',
                'Supplier has been saved unsuccessfully!',
                'error'
            );
        }
    })
});
/**
 * Table Click Action
 * */
$(document).ready(function () {
    $("#supplierTable").on("click", "tr", function () {
        var code = $(this).find("td:eq(0)").text();
        var name = $(this).find("td:eq(1)").text();
        var category = $(this).find("td:eq(2)").text();
        var address = $(this).find("td:eq(3)").text();
        var contact1 = $(this).find("td:eq(4)").text();
        var contact2 = $(this).find("td:eq(5)").text();
        var email = $(this).find("td:eq(6)").text();

        supplierId01 = code;
        $("#txtSupName").val(name);
        $("#category").val(category);
        $("#supplierAddress").val(address);
        $("#supplierContact1").val(contact1);
        $("#supplierContact2").val(contact2);
        $("#supplierEmail").val(email);
    });
});