var employeeCode = null;
var picDecode = null;

document.addEventListener('DOMContentLoaded', function () {
    loadEmployeeData();
});
/**
 * Search employee Data
 * */
$('#searchCusId').on("keyup", function () {
    let value = $(this).val().toLowerCase();
    $("tbody tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
});
/**
 * Load Employee Data
 * */
const loadEmployeeData = () => {
    var tableBody = $('#employeeTable');
    $.ajax({
        method: 'GET',
        url: "http://localhost:8080/shoe/api/v1/employee",
        async:true,
        success: function (item) {
            tableBody.empty();

            item.forEach(function (item) {
                var row = $('<tr>');

                row.append($('<td>').text(item.code));
                row.append($('<td>').text(item.name));
                row.append($('<td>').text(item.gender));
                row.append($('<td>').text(item.status));
                row.append($('<td>').text(item.designation));
                row.append($('<td>').text(item.role));
                row.append($('<td>').text(item.dob));
                row.append($('<td>').text(item.dateOfJoin));
                row.append($('<td>').text(item.branchName));
                row.append($('<td>').text(item.address));
                row.append($('<td>').text(item.contact));
                row.append($('<td>').text(item.email));
                row.append($('<td>').text(item.guardianName));
                row.append($('<td>').text(item.emergencyContact));
                row.append($('<td>').text(item.profilePic));

                tableBody.append(row);
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch item data. Status code:");
        }
    });
};
/**
 * Employee Save
 * */
$("#btnSaveEmployee").click(function () {
    var formData = new FormData();

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

    formData.append('profilePic', picDecode);
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
            loadEmployeeData();
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
/**
 * Employee Update
 * */
$("#btnUpdateEmployee").click(function () {
    var formData = new FormData();

    formData.append('code', employeeCode);
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
    formData.append('profilePic', picDecode);
    $.ajax({
        method: "PUT",
        url: "http://localhost:8080/shoe/api/v1/employee",
        processData: false,
        contentType: false,
        data: formData,
        success: function (data) {
            Swal.fire(
                'Success!',
                'Employee has been updated successfully!',
                'success'
            );
            loadEmployeeData();
            $("#btnResetEmployee").click();
        },
        error: function (xhr, exception) {
            Swal.fire(
                'Error!',
                'Employee has been updated unsuccessfully!',
                'error'
            );
        }
    });
});

/**
 * Table Click Action
 * */
$(document).ready(function () {
    $("#employeeTable").on("click", "tr", function () {

        var code = $(this).find("td:eq(0)").text();
        var name = $(this).find("td:eq(1)").text();
        var gender = $(this).find("td:eq(2)").text();
        var status = $(this).find("td:eq(3)").text();
        var designation = $(this).find("td:eq(4)").text();
        var rol = $(this).find("td:eq(5)").text();
        var dob = $(this).find("td:eq(6)").text();
        var dateOfJoin = $(this).find("td:eq(7)").text();
        var branch = $(this).find("td:eq(8)").text();
        var address = $(this).find("td:eq(9)").text();
        var contact = $(this).find("td:eq(10)").text();
        var email = $(this).find("td:eq(11)").text();
        var guardianName = $(this).find("td:eq(12)").text();
        var emergencyContact = $(this).find("td:eq(13)").text();
        var pic = $(this).find("td:eq(14)").text();

        employeeCode=code;
        $("#employeeName").val(name);
        var radioMale = document.getElementById("flexRadioDefault3");
        var radioFemale = document.getElementById("flexRadioDefault4");
        if (gender === "MALE"){
            radioMale.click();
        }else {
            radioFemale.click();
        }
        $("#employeeStatus").val(status);
        $("#designation").val(designation);
        $("#employeeRole").val(rol);
        $("#employeeDob").val(dob);
        $("#employeeDateOfJoin").val(dateOfJoin);
        $("#branchName").val(branch);
        $("#employeeAddress").val(address);
        $("#employeeContact").val(contact);
        $("#employeeEmail").val(email);
        $("#guardianName").val(guardianName);
        $("#emergencyContact").val(emergencyContact);
        base64Decoder(pic)

    });
});

var enc_file = document.getElementById('employeeProfilePic')
var enc_text = document.getElementById('employeeName')
// var base64Output = document.getElementById('base64-output')
//
// var dec_text = document.getElementById('emergencyContact')
// var dec_button = document.getElementById('btnUpdateEmployee')

// for encoding
document.getElementById('employeeProfilePic').addEventListener('change', function(event) {
    // if(enc_file.value !== '' || enc_text.value !== ''){
    if(enc_file.value !== ''){
        if(enc_file.value !== ''){
            base64Encoder(enc_file.files[0])
        }else{
            const http = new XMLHttpRequest();
            http.onload = () => {
                base64Encoder(http.response)
            }
            http.responseType = 'blob'
            http.open('GET', enc_text.value, true)
            http.send()
        }
    }
});

// encode function
function base64Encoder(blob){
    var reader = new FileReader();
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
        // base64Output.innerHTML = reader.result
        picDecode = reader.result
        base64Decoder(picDecode)
    }
}

// for decoding
// dec_button.onclick = () => {
//     if(dec_text.value !== ''){
//         base64Decoder(dec_text.value)
//     }
// }
function base64Decoder(base64){
    const http = new XMLHttpRequest();
    http.onload = () => {
        const reader = new FileReader();
        reader.onloadend = () => {
            document.getElementById('previewImage').src = reader.result;
            document.getElementById('previewImage').style.display = 'block';
        };
        reader.readAsDataURL(http.response);
    }
    http.responseType = 'blob';
    http.open('GET', base64, true);
    http.send();
}