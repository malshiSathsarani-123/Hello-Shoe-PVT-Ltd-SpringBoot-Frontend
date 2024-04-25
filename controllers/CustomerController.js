
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
    getSelectedRadioButtonValue();
    $("#JoinDate").val("");
    $("#dob").val("");
    $("#level").val("level");
    $("#contact").val("");
    $("#address").val("");
    $("#email").val("");
})
