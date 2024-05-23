var itemCode = null;
var picDecodeItem = null;
// document.addEventListener('DOMContentLoaded', function () {
//     loadItemData();
// });
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
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
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data:JSON.stringify({
            description:description,
            itemGender:itemGender,
            pic:picDecodeItem,
            occasion:occasion,
            verities:verities
        }),
        success: function (data) {
            Swal.fire(
                'Success!',
                'Item has been saved successfully!',
                'success'
            );
            loadTable();
            $("#btnResetItem").click();
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
/**
 * clear input fields Values Method
 * */
$("#btnResetItem").click(function () {

    $("#itemDescription").val("");
    $("#itemGender").val("Gender");
    $("#occasion").val("Occasion");
    $("#verities").val("Verities");
    document.getElementById('itemPicView').style.display = 'none';

})
/**
 * Item delete
 * */
$("#btnDeleteItem").click(function () {
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
                url:"http://localhost:8080/shoe/api/v1/item/"+itemCode,
                async:true,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function (data) {
                    Swal.fire(
                        'Success!',
                        'Item has been deleted successfully!',
                        'success'
                    );
                    loadTable();
                    $("#btnResetItem").click();
                },
                error: function (xhr, exception) {
                    Swal.fire(
                        'Error!',
                        'Item has been deleted unsuccessfully!',
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
    $("#itemTable").on("click", "tr", function () {
        var code = $(this).find("td:eq(0)").text();
        var description = $(this).find("td:eq(1)").text();
        var itemGender = $(this).find("td:eq(2)").text();
        var occasion = $(this).find("td:eq(3)").text();
        var verities = $(this).find("td:eq(4)").text();

        itemCode = code;
        $("#itemDescription").val(description);
        $("#itemGender").val(itemGender);
        $("#occasion").val(occasion);
        $("#verities").val(verities);

    });
});

var enc_file = document.getElementById('shoePic')

// for encoding
document.getElementById('shoePic').addEventListener('change', function(event) {
    // if(enc_file.value !== '' || enc_text.value !== ''){
    if(enc_file.value !== ''){
        if(enc_file.value !== ''){
            base64EncoderItem(enc_file.files[0])
        }else{
            const http = new XMLHttpRequest();
            http.onload = () => {
                base64EncoderItem(http.response)
            }
            http.responseType = 'blob'
            http.open('GET', enc_text.value, true)
            http.send()
        }
    }
});

// encode function
function base64EncoderItem(blob){
    var reader = new FileReader();
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
        picDecodeItem = reader.result
        base64DecoderItem(picDecodeItem)
    }
}

function base64DecoderItem(base64){
    const http = new XMLHttpRequest();
    http.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
            document.getElementById('itemPicView').src = reader.result;
            document.getElementById('itemPicView').style.display = 'block';
        };
        reader.readAsDataURL(http.response);
    }
    http.responseType = 'blob';
    http.open('GET', base64, true);
    http.send();
}