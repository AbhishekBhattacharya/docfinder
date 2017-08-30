var auth_token;
var hasura_id;
var username;
var data_url = "https://data.action94.hasura-app.io"; //"http://data.c100.hasura.me";
var auth_url = "https://auth.action94.hasura-app.io"; //"http://auth.c100.hasura.me";
var user_id = 0;
var user_location = "";

var f_box = $('#feedback_box');

var s_name = $('#name');
s_name.on('blur', () => {
    if (s_name.val().length < 3) {
        s_name.addClass('i-error');
    } else {
        s_name.removeClass('i-error');
    } 
});

var s_age = $('#age');
s_age.on('blur', () => {
    if (s_age.val() < 14 || s_age.val() > 110) {
        s_age.addClass('i-error');
    } else {
        s_age.removeClass('i-error');
    } 
});

var s_uname = $('#username');
s_uname.on('blur', () => {
    if (s_uname.val().length < 3) {
        s_uname.addClass('i-error');
    } else {
        s_uname.removeClass('i-error');
    } 
});

var s_email = $('#email');
s_email.on('blur', () => {
    if (!s_email.val().match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
        s_email.addClass('i-error');
    } else {
        s_email.removeClass('i-error');
    } 
});

var s_pass = $('#password');
s_pass.on('blur', () => {
    if(!s_pass.val().match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)) {
        s_pass.addClass('i-error');
    } else {
        s_pass.removeClass('i-error');
    }
});

var s_rpass = $('#confirm_password');
s_rpass.on('blur', () => {
    if (s_pass.val() !== s_rpass.val()) {
        s_rpass.addClass('i-error');
    } else {
        s_rpass.removeClass('i-error');
    }
});

$('#signup_form > input').on('focus', () => {
    console.log("Clear feedback");
    f_box.removeClass('success error');
});

var signup_btn = $('#signup_button');
var s_prval = signup_btn.val();
$('#signup_form').on('submit', (e) => {
    e.preventDefault();
    signup_btn.prop("disabled", true);
    signup_btn.val('Signing up ...');
    
    var uname = $('#username').val();
    var name = $('#name').val();
    var age = $('#age').val();
    var sex;
    var location;
    var pass = $('#password').val();
    var r_pass = $('#confirm_password').val();
    var email = $('#email').val();
    
    //Sex 
    if (document.getElementById('male').checked) {
        sex = document.getElementById('male').value;
    } else if (document.getElementById('female').checked) {
        sex = document.getElementById('female').value;
    } else if (document.getElementById('others').checked) {
        sex = document.getElementById('others').value;
    }
    
    //Location
    if (document.getElementById('delhi').checked) {
        location = document.getElementById('delhi').value;
    } else if (document.getElementById('mumbai').checked) {
        location = document.getElementById('mumbai').value;
    } else if (document.getElementById('bengaluru').checked) {
        location = document.getElementById('bengaluru').value;
    }

    //ajax request
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                //alert('Account created successfully');
                var x = JSON.parse(this.responseText);
                auth_token = x.auth_token;
                hasura_id = x.hasura_id;

                let request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        if (request.status === 200) {
                            f_box.removeClass('hidden error').addClass('success');
                            f_box.html("Signup successful , You can Login Now!");
                            setTimeout(function () {
                                window.location = "/login.html";
                            }, 500);
                        } else {
                            f_box.removeClass('hidden success').addClass('error');
                            f_box.html("Error : " + JSON.parse(request.responseText)["message"]);
                            console.log(this.responseText);
                            signup_btn.prop("disabled", false);
                            signup_btn.val(s_prval);
                        }
                    }
                }; //second request
                request.open('POST', data_url + '/v1/query', true);
                request.setRequestHeader('Content-Type', 'application/json');
                request.setRequestHeader('Authorization', 'Bearer ' + auth_token);
                request.send(JSON.stringify({
                    "type": "insert",
                    "args": {
                        "table": "patient_details",
                        "objects": [{
                            "pat_id": hasura_id,
                            "name": name,
                            "age": age,
                            "sex": sex,
                            "pat_location": location
                        }]
                    }
                }));
            }
            /*else if(request.status === 403){
                       alert('Username/Password is incorrect');
                   }*/
            else {
                f_box.removeClass('hidden success').addClass('error');
                f_box.html("Signup Error : " + JSON.parse(request.responseText)["message"]);
                signup_btn.prop("disabled", false);
                signup_btn.val(s_prval);
            }
        }
    };
    request.open('POST', auth_url + '/signup', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({
        username: uname,
        password: pass
    }));
});


function toNumber(str) {
    //console.log("changing to integer:"+str);
    return str * 1;
}


//getting and setting cookie
function createCookie(name, value) {
    var cookie_string = name + "=" + escape(value);
    //  console.log(cookie_string);
    document.cookie = cookie_string;
    //console.log("setting cookie: "+name+"="+value);
}


function readCookie(cname) {
    //console.log("reading cookie of : "+cname);
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var delete_cookie = function (name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    //console.log("cookie deleted: "+name);
};



function login() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                //alert('Logged in successfully');


                var x = JSON.parse(this.responseText);
                createCookie('auth_token', x.auth_token);
                auth_token = readCookie('auth_token');
                createCookie('hasura_id', x.hasura_id);
                hasura_id = readCookie('hasura_id');
                hasura_id_int = toNumber(hasura_id);
                createCookie('login', "yes");
                alert('Logged In successfully');
                window.location = "/pat.html";
            } else if (request.status === 403) {
                alert('Username/Password is incorrect');
            } else if (request.status === 500) {
                alert('Something went wrong on the server');
                //console.log("login:"+auth_token+":"+hasura_id);
            }
            /*else{
            var y =JSON.parse(this.responseText);
            alert('Something went wrong on server :(' + y);
        }*/
        }
    };
    username = $('#username').val();
    var password = $('#password').val();
    request.open('POST', auth_url + '/login', true);
    request.withCredentials = true;
    request.setRequestHeader('Content-Type', 'application/json');
    request.withCredentials = true;

    request.send(JSON.stringify({
        username: username,
        password: password
    }));
    //document.getElementById("login_btn").value="Logging-in...";
}

//get user info
function getUserInfo() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                //alert('Logged in successfully');
                var xhr = JSON.parse(this.responseText);
                //console.log(xhr);
                var auth_token = xhr.auth_token;
                user_id = xhr.hasura_id;
                request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        if (request.status === 200) {
                            var result = JSON.parse(this.responseText);
                            //console.log(result[0]);
                            document.getElementById("user_display").innerHTML = "Welcome " + result[0].name;
                            document.getElementById("user_age").innerHTML = result[0].age;
                            document.getElementById("user_sex").innerHTML = result[0].sex;
                            user_location = result[0].pat_location;
                            document.getElementById("user_location").innerHTML = user_location;
                            document.getElementById("page_loader").style.display = "none"
                            document.getElementById("user_main").style.display = "block";
                        } else {
                            alert('Something went wrong on the server');
                            //console.log(this.responseText);
                        }
                    }
                };
                request.open('POST', data_url + '/v1/query', true);
                request.setRequestHeader('Content-Type', 'application/json');
                request.setRequestHeader('Authorization', 'Bearer ' + auth_token);
                request.send(JSON.stringify({
                    "type": "select",
                    "args": {
                        "table": "patient_details",
                        "columns": ["pat_id", "name", "age", "sex", "pat_location"],
                        "where": {
                            "pat_id": user_id
                        }
                    }
                }));
            } else if (request.status === 403) {
                alert('Error!');
            } else if (request.status === 500) {
                alert('Something went wrong on the server');
            }
        }
    };
    request.open('GET', auth_url + '/user/account/info', true);
    request.withCredentials = true;
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(null);
}

//Logout
function logout() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                alert('Logged out successfully');
                window.location = "/index.html";
            } else if (request.status === 500) {
                alert('Something went wrong on the server');
            }
        }
    };
    request.open('POST', auth_url + "/user/logout ", true);
    request.withCredentials = true;
    request.setRequestHeader('Authorization', 'Bearer ' + readCookie('auth_token'));
    request.send(null);
}

//find the doctor
function findDoctor(elem) {
    var spec = $(elem).val();
    var time_slot = $('input[name=time]:checked').val();
    if (time_slot) {
        request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var result = JSON.parse(this.responseText);
                    //console.log(result);
                    var doctor_list = "<option>--select--</option>";
                    if (result.length >= 1) {
                        for (var i = 0; i < result.length; i++) {
                            doctor_list += "<option value='" + result[i].doc_id + "'>" + result[i].name + ", " + result[i].designation + " [Exp. " + result[i].experience + "year(s)]" + "</option>";
                        }
                    } else {
                        alert("Sorry! No doctor available for that timeslot and specialization");
                    }
                    $("#doctor").html(doctor_list);
                } else {
                    alert('Error! Try again!');
                    //console.log(this.responseText);
                }
            }
        };
        request.open('POST', data_url + '/v1/query', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.withCredentials = true;
        request.send(JSON.stringify({
            "type": "select",
            "args": {
                "table": "Doctor",
                "columns": ["doc_id", "name", "designation", "experience"],
                "where": {
                    "$and": [{
                            "doc_time": time_slot
                        },
                        {
                            "doc_location": user_location
                        },
                        {
                            "doc_specialization": spec
                        }
                    ]
                }
            }
        }));
    } else {
        alert("Please select Preferred Time!");
        $(elem).removeAttr("checked");
    }
}

function uncheckSpec(){
    $('input[name=spec]').removeAttr("checked");
}

//patient details
function patientdetails() {

    var timeslot;
    var speciality;
    var healthissue = $('#healthissue').val();
    var doctor_id = $("#doctor").val();

    //Timeslot
    if (document.getElementById('slot1').checked) {
        timeslot = document.getElementById('slot1').value;
    } else {
        timeslot = document.getElementById('slot2').value;
    }
    //speciality
    if (document.getElementById('dermatologist').checked) {
        speciality = document.getElementById('dermatologist').value;
    } else if (document.getElementById('pediatrician').checked) {
        speciality = document.getElementById('pediatrician').value;
    } else if (document.getElementById('gynecologist').checked) {
        speciality = document.getElementById('gynecologist').value;
    } else if (document.getElementById('opth').checked) {
        speciality = document.getElementById('opth').value;
    } else if (document.getElementById('dentist').checked) {
        speciality = document.getElementById('dentist').value;
    } else if (document.getElementById('cardio').checked) {
        speciality = document.getElementById('cardio').value;
    }

    //console.log(healthissue, timeslot, speciality);
    hasura_id = readCookie('hasura_id');
    hasura_id_int = toNumber(hasura_id);
    //console.log(hasura_id_int);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                alert('Successfully Booked!');
                getBookingDetails();
            } else if (request.status === 400) {
                alert('You have already booked for this timeslot!');
                //console.log(this.responseText);
            } else if (request.status === 500) {
                alert('Something went wrong on the server');
                //console.log(this.responseText);
            }
        }
    };
    auth_token = readCookie('auth_token');
    //console.log(auth_token);
    request.open('POST', data_url + '/v1/query', true);
    request.withCredentials = true;
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + readCookie('auth_token'));
    request.send(JSON.stringify({
        "type": "insert",
        "args": {
            "table": "appointment_details",
            "objects": [{
                "health_issue": healthissue,
                "preferred_time": timeslot,
                "speciality": speciality,
                "pat_id": hasura_id_int,
                "doc_id": doctor_id
            }]
        }
    }));

}

//get booking details
function getBookingDetails() {
    hasura_id = readCookie('hasura_id');
    user_id = toNumber(hasura_id);
    request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var result = JSON.parse(this.responseText);
                //console.log(result);
                if (result.length >= 1) {
                    var booking_table = "<table width='100%'><thead><tr><th>Health Issue</th><th>Time Slot</th><th>Speciality</th><th>Doctor</th></tr></thead><tbody>";
                    for (var i = 0; i < result.length; i++) {
                        booking_table += "<tr>" + "<td>" + result[i].health_issue + "</td>" + "<td>" + result[i].date + " " + result[i].timeslot_booked.range + "</td>" + "<td>" + result[i].speciality + "</td>" + "<td><a href='doc/id/" + result[i].current_doctor.doc_id + "'>" + result[i].current_doctor.name + "</a></td>" + "</tr>";
                    }
                    booking_table += "</tbody></table>";
                    $("#recent_bookings_table").html(booking_table);
                } else {
                    $("#recent_bookings_table").html("No records found!");
                }
            } else {
                alert('Error! Try again!');
                //console.log(this.responseText);
            }
        }
    };
    request.open('POST', data_url + '/v1/query', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.withCredentials = true;
    request.send(JSON.stringify({
        "type": "select",
        "args": {
            "table": "appointment_details",
            "columns": ["bookingid", "health_issue", "speciality", "date",
                {
                    "name": "timeslot_booked",
                    "columns": [
                        "range"
                    ]
                },
                {
                    "name": "current_doctor",
                    "columns": [
                        "doc_id", "name"
                    ]
                }
            ],
            "where": {
                "pat_id": user_id
            },
            "order_by": "-bookingid",
            "limit": "5"
        }
    }));
}

//get doctor details
function getDoctorDetails() {
    var doctor_id = window.location.pathname.split('/')[3];
    request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var result = JSON.parse(this.responseText);
                //console.log(result);
                if (result.length >= 1) {
                    document.getElementById("doctor_details").innerHTML="<table><tr><td><b>Name:</b></td><td>"+result[0].name+"</td></tr><tr><td><b>Designation:</b></td><td>"+result[0].designation+"</td></tr><tr><td><b>Experience:</b></td><td>"+result[0].experience+"year(s)</td></tr><tr><td><b>Available Time:</b></td><td>"+result[0].doc_available_time.range+"</td></tr><tr><td><b>Location:</b></td><td>"+result[0].doc_location+"</td></tr><tr><td><b>Specialization:</b></td><td>"+result[0].doc_specialization+"</td></tr></table>";
                    document.getElementById("page_loader").style.display = "none";
                    document.getElementById("doctor_main").style.display = "block";
                } else {
                    document.getElementById("page_loader").style.display = "none";
                    document.getElementById("doctor_main").style.display = "block";
                    document.getElementById("doctor_details").innerHTML="Sorry! Not found!";
                }
            } else {
                alert('Error! Try again!');
                //console.log(this.responseText);
            }
        }
    };
    request.open('POST', data_url + '/v1/query', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.withCredentials = true;
    request.send(JSON.stringify({
        "type": "select",
        "args": {
            "table": "Doctor",
            "columns": ["name", "experience", "designation", "doc_location", "doc_specialization",
                {
                    "name": "doc_available_time",
                    "columns": [
                        "range"
                    ]
                }
            ],
            "where": {
                "doc_id": doctor_id
            }
        }
    }));
}
