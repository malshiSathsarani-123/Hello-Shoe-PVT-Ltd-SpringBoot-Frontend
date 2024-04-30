var itemCode = null;

document.addEventListener('DOMContentLoaded', function () {
    loadItemData();
});
/**
 * Search Supplier Data
 * */
$('#searchItemId').on("keyup", function () {
    let value = $(this).val().toLowerCase();
    $("tbody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});
/**
 * Load Item Data
 * */
const loadItemData = () => {
    var tableBody = $('#itemTable');
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/item",
        async:true,
        success: function (item) {
            tableBody.empty();

            item.forEach(function (item) {
                var row = $('<tr>');

                row.append($('<td>').text(item.shoeCode));
                row.append($('<td>').text(item.description));
                row.append($('<td>').text(item.itemGender));
                row.append($('<td>').text(item.occasion));
                row.append($('<td>').text(item.verities));

                tableBody.append(row);
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
};
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
            loadItemData()
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