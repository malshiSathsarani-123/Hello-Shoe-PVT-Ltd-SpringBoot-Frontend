var customerId01 = null;

// document.addEventListener('DOMContentLoaded', function () {
//     loadCustomerData();
// });
/**
 * Search customer Data
 * */
$('#searchCusId').on("keyup", function () {
    let value = $(this).val().toLowerCase();
    $("tbody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});
/**
 * Load Customer Data
 * */
const loadCustomerData = () => {
    var tableBody = $('#customerTable');
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/customer",
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
                row.append($('<td>').text(item.gender));
                row.append($('<td>').text(item.joinDate));
                row.append($('<td>').text(item.level));
                row.append($('<td>').text(item.totalPoints));
                row.append($('<td>').text(item.dob));
                row.append($('<td>').text(item.address));
                row.append($('<td>').text(item.contact));
                row.append($('<td>').text(item.email));
                row.append($('<td>').text(item.recentPurchaseDateAndTime));

                tableBody.append(row);
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
};
/**
 * Customer Save
 * */
$("#btnSaveCustomer").click(function () {
    let name = $("#txtCusName").val();
    let gender = getSelectedRadioButtonValue();
    let joinDate = $("#JoinDate").val();
    let dob = $("#dob").val();
    let level = $("#level").val();
    let contact = $("#contact").val();
    let address = $("#address").val();
    let email = $("#email").val();
    $.ajax({
        method:"POST",
        contentType:"application/json",
        url:"http://localhost:8080/shoe/api/v1/customer",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data:JSON.stringify({
            name:name,
            gender:gender,
            joinDate:joinDate,
            level:level,
            dob:dob,
            address:address,
            contact:contact,
            email:email
        }),
        success: function (data) {
            Swal.fire(
                'Success!',
                'Item has been saved successfully!',
                'success'
            );
            loadCustomerData();
            $("#btnResetCustomer").click();
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
 * Customer Update
 * */
$("#btnUpdateCustomer").click(function () {
    let name = $("#txtCusName").val();
    let gender = getSelectedRadioButtonValue();
    let joinDate = $("#JoinDate").val();
    let dob = $("#dob").val();
    let level = $("#level").val();
    let contact = $("#contact").val();
    let address = $("#address").val();
    let email = $("#email").val();
    $.ajax({
        method:"PUT",
        contentType:"application/json",
        url:"http://localhost:8080/shoe/api/v1/customer",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        data:JSON.stringify({
            code:customerId01,
            name:name,
            gender:gender,
            joinDate:joinDate,
            level:level,
            dob:dob,
            address:address,
            contact:contact,
            email:email
        }),
        success: function (data) {
            Swal.fire(
                'Success!',
                'Item has been saved successfully!',
                'success'
            );
            loadCustomerData();
            $("#btnResetCustomer").click();
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
 * Customer delete
 * */
$("#btnDeleteCustomer").click(function () {
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
                url:"http://localhost:8080/shoe/api/v1/customer/"+customerId01,
                async:true,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function (data) {
                    Swal.fire(
                        'Success!',
                        'Item has been saved successfully!',
                        'success'
                    );
                    loadCustomerData();
                    $("#btnResetCustomer").click();
                },
                error: function (xhr, exception) {
                    Swal.fire(
                        'Error!',
                        'Item has been saved unsuccessfully!',
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

function getSelectedRadioButtonValue() {
    var radioButtons = document.getElementsByName('flexRadioDefault');

    for (var i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].checked) {
            return radioButtons[i].nextElementSibling.textContent.trim();

        }
    }
}
/**
 * clear input fields Values Method
 * */
$("#btnResetCustomer").click(function () {
    $("#txtCusName").val("");
    var radioButtons = document.querySelectorAll('input[name="flexRadioDefault"]');
    radioButtons.forEach(function(radioButton) {
        radioButton.checked = false;
    });
    $("#JoinDate").val("");
    $("#dob").val("");
    $("#level").val("Level");
    $("#contact").val("");
    $("#address").val("");
    $("#email").val("");
})

/**
 * Table Click Action
 * */
$(document).ready(function () {
    $("#customerTable").on("click", "tr", function () {
        var code = $(this).find("td:eq(0)").text();
        var name = $(this).find("td:eq(1)").text();
        var gender = $(this).find("td:eq(2)").text();
        var joinDate = $(this).find("td:eq(3)").text();
        var level = $(this).find("td:eq(4)").text();
        var totalPoint = $(this).find("td:eq(5)").text();
        var dob = $(this).find("td:eq(6)").text();
        var address = $(this).find("td:eq(7)").text();
        var contact = $(this).find("td:eq(8)").text();
        var email = $(this).find("td:eq(9)").text();
        var rpd = $(this).find("td:eq(10)").text();

        customerId01 = code;
        $("#txtCusName").val(name);


        var radioMale = document.getElementById("flexRadioDefault1");
        var radioFemale = document.getElementById("flexRadioDefault2");
        if (gender === "MALE"){
            radioMale.click();
        }else {
            radioFemale.click();
        }
        $("#JoinDate").val(joinDate);
        $("#level").val(level);
        $("#dob").val(dob);
        $("#contact").val(contact);
        $("#address").val(address);
        $("#email").val(email);
    });
});