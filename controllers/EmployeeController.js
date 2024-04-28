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

    // var fileInput = $("#employeeProfilePic")[0];
    // var file = fileInput.files[0];
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

        $("#employeeName").val(name);
        $("#employeeAddress").val(pic);
        base64Decoder(pic)

    });
});

// document.getElementById('employeeProfilePic').addEventListener('change', function(event) {
//     console.log("sa")
//     var file = event.target.files[0];
//     if (file) {
//         var reader = new FileReader();
//         reader.onload = function(e) {
//             console.log(e.target.result)
//             document.getElementById('previewImage').src = e.target.result;
//             document.getElementById('previewImage').style.display = 'block';
//         };
//         reader.readAsDataURL(file);
//     }
// });


var enc_file = document.getElementById('employeeProfilePic')
var enc_text = document.getElementById('employeeName')
var enc_button = document.getElementById('btnDeleteEmployee')
var base64Output = document.getElementById('base64-output')
//
var dec_text = document.getElementById('emergencyContact')
var dec_button = document.getElementById('btnUpdateEmployee')

// for encoding
document.getElementById('employeeProfilePic').addEventListener('change', function(event) {
    console.log("ssssss")
    if(enc_file.value !== '' || enc_text.value !== ''){
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
    // this function will get a blob file and convert into base64 string
    var reader = new FileReader();
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
        base64Output.innerHTML = reader.result
        picDecode = reader.result
        console.log(picDecode)
        // $("#employeeName").val(reader.result);
    }
}
//
// for decoding
dec_button.onclick = () => {
    console.log("decode")
    if(dec_text.value !== ''){
        base64Decoder(dec_text.value)
    }
}

// decode function
// function base64Decoder(base64){
//     // this will get base64 and convert to blob
//     const http = new XMLHttpRequest();
//     http.onload = () => {
//         // convert blob to url and download
//         var url = window.URL.createObjectURL(http.response)
//         var link = document.createElement('a')
//         link.href = url
//         link.download = 'image-from-base64.png'
//         link.click()
//     }
//     http.responseType = 'blob'
//     http.open('GET', base64, true)
//     http.send()
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