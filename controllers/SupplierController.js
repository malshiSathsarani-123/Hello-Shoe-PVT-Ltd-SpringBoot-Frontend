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
            // loadCustomerData();
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