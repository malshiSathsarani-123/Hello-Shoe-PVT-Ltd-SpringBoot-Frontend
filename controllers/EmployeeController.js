/**
 * Employee Save
 * */
$("#btnSaveEmployee").click(function () {
    var formData = new FormData(); // Create FormData object to handle file uploads

    // Append form data
    formData.append('name', $("#employeeName").val());
    formData.append('gender', $("input[name='flexRadioDefaultEmployee']:checked").val());
    formData.append('status', $("#employeeStatus").val());
    formData.append('designation', $("#designation").val());
    formData.append('role', $("#employeeRole").val());
    formData.append('dob', $("#employeeDob").val());
    formData.append('dateOfJoin', $("#employeeDateOfJoin").val());
    formData.append('branchName', $("#branchName").val());
    formData.append('address', $("#employeeAddress").val());
    formData.append('contact', $("#employeeContact").val());
    formData.append('email', $("#employeeEmail").val());
    formData.append('guardianName', $("#guardianName").val());
    formData.append('emergencyContact', $("#emergencyContact").val());

    // Append image file
    var fileInput = $("#employeeProfilePic")[0];
    var file = fileInput.files[0];
    formData.append('profilePic', file);
    $.ajax({
        method: "POST",
        url: "http://localhost:8080/shoe/api/v1/employee",
        processData: false,
        contentType: false,
        data: formData,
        success: function (data) {
            Swal.fire(
                'Success!',
                'Employee has been saved successfully!',
                'success'
            );
            $("#btnResetEmployee").click();
        },
        error: function (xhr, exception) {
            Swal.fire(
                'Error!',
                'Employee has been saved unsuccessfully!',
                'error'
            );
        }
    });
});
