/**
 * Item Save
 * */
$("#btnSaveItem").click(function () {
    let description = $("#itemDescription").val();
    let itemGender = $("#itemGender").val();
    let occasion = $("#occasion").val();
    let verities = $("#verities").val();
    $.ajax({
        method:"POST",
        contentType:"application/json",
        url:"http://localhost:8080/shoe/api/v1/item",
        async:true,
        data:JSON.stringify({
            description:description,
            itemGender:itemGender,
            occasion:occasion,
            verities:verities
        }),
        success: function (data) {
            Swal.fire(
                'Success!',
                'Item has been saved successfully!',
                'success'
            );
            loadSupplierData()
            $("#btnResetSupplier").click();
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