var supplierId01 = null;

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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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
            loadTable();
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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
            loadTable();
            $("#btnResetSupplier").click();
        },
        error: function (xhr, exception) {
            console.log(xhr)
            console.log(exception.text)
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
    $("#category").val("Category")
    $("#supplierContact1").val("");
    $("#supplierContact2").val("");
    $("#supplierAddress").val("");
    $("#supplierEmail").val("");
})
/**
 * Supplier delete
 * */
$("#btnDeleteSupplier").click(function () {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                method:"DELETE",
                contentType:"application/json",
                url:"http://localhost:8080/shoe/api/v1/supplier/"+supplierId01,
                async:true,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function (data) {
                    Swal.fire(
                        'Success!',
                        'Supplier has been deleted successfully!',
                        'success'
                    );
                    loadTable();
                    $("#btnResetSupplier").click();
                },
                error: function (xhr, exception) {
                    Swal.fire(
                        'Error!',
                        'Supplier has been deleted unsuccessfully!',
                        'error'
                    );
                }
            })
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your imaginary file is safe :)",
                icon: "error"

            });
        }

    });
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