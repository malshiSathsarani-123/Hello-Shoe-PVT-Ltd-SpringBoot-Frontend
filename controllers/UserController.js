let token = '';


var userName = null;

document.addEventListener('DOMContentLoaded', function () {
    loadEmployeeId();
});
/**
 * Save User
 **/
$("#btnSaveUser").click(function () {
    var signupData = {
        employeeCode: $('#signupEmployeeCode').val(),
        name: $('#signupName').val(),
        email: $('#signupEmail').val(),
        password: $('#signingPassword').val(),
        role: $('#signupRole').val()
    };
    $.ajax({
        method:"POST",
        contentType:"application/json",
        url:"http://localhost:8080/shoe/api/v1/auth/signup",
        async:true,
        data: JSON.stringify(signupData),
        success: function (response) {
            token = response.token;
            Swal.fire(
                'Success!',
                'Item has been saved successfully!',
                'success'
            );
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
 * Login
 **/
$("#signingBtn").click(function () {
    loadUserName()
    var signingData = {
        email: $('#signingEmail').val(),
        password: $('#signingPassword').val(),
    };
    $.ajax({
        method:"POST",
        contentType:"application/json",
        url:"http://localhost:8080/shoe/api/v1/auth/signing",
        async:true,
        data: JSON.stringify(signingData),
        success: function (response) {
            token = response.token;
            loadTable()
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
 * Load Employee Id
 **/
const loadEmployeeId = () => {
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/auth/getEmployee",
        async:true,
        success: function (employee) {
            var selectElement = $("#signupEmployeeCode");
            selectElement.empty();
            var option = $("<option>")
                .text("Employee Code")
            selectElement.append(option);
            employee.forEach(function (employee) {
                var option = $("<option>")
                    .val(employee.code)
                    .text(employee.code);
                selectElement.append(option);
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
};
/**
 * Load Employee Data
 **/
$("#signupEmployeeCode").on("change", function() {
    var selectedValue = $(this).val();

    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/auth/getEmployee",
        async:true,
        success: function (employee) {
            employee.forEach(function (employee) {
                if (selectedValue === employee.code){
                    $("#signupName").val(employee.name)
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
});


const loadTable = () => {
    $('#signing-section').css('display', 'none');
    $('#signup-section').css('display', 'none');
    $('#navigation-section').css('display', 'block');
    $('#homeSection').css('display', 'block');
    $('#customerSection').css('display', 'none');
    $('#supplierSection').css('display', 'none');
    $('#employeeSection').css('display', 'none');
    $('#itemSection').css('display', 'none');
    $('#inventorySection').css('display', 'none');

    loadItemIdOrder()
    loadCustomerId()
    loadCustomerData()
    loadEmployeeData()
    loadItemData()
    loadSupplierId();
    loadItemId();
    $("#inventoryTotal").val(0);
    $("#orderTotal").val(0);
    $("#qtyOnHand").val(0);
    loadSupplierData();
}

$(document).ready(function() {
    function callRefreshToken() {

        $.ajax({
            type: 'POST',
            url: "http://localhost:8080/shoe/api/v1/auth/refresh",
            data: {
                refreshToken: token
            },
            success: function(response) {
                console.log(response);
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    }

    setInterval(callRefreshToken, 45 * 60 * 1000);
});

/**
 * Load User Name
 **/
function loadUserName() {
    var selectedValue = $('#signingEmail').val();

    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/auth/getUser",
        async:true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (user) {
            user.forEach(function (user) {
                if (selectedValue === user.email){
                    userName = user.name;
                    console.log(userName)
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
};