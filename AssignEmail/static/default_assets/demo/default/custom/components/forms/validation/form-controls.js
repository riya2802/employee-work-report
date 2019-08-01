function getCookie(name) {
   var cookieValue = null;
   if (document.cookie && document.cookie !== '') {
       var cookies = document.cookie.split(';');
       for (var i = 0; i < cookies.length; i++) {
           var cookie = cookies[i].trim();
           // Does this cookie string begin with the name we want?
           if (cookie.substring(0, name.length + 1) === (name + '=')) {
               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
               break;
           }
       }
   }
   return cookieValue;
}
var csrftoken = getCookie('csrftoken');
console.log(csrftoken,"this is the csrftoken")
function csrfSafeMethod(method) {
   // these HTTP methods do not require CSRF protection
   return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
   beforeSend: function(xhr, settings) {
       if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
           xhr.setRequestHeader("X-CSRFToken", csrftoken);
       }
   }
});

//== Class definition


var FormControls = function () {
    //== Private functions
    
    var demo1 = function () {
        $( "#m_form_1" ).validate({
            // define validation rules
            rules: {
                oldpassword: {
                    required: true,
                },
                newpassword: {
                    required: true, 
                },
               
                
            },
            
            //display error alert on form submit  
            invalidHandler: function(event, validator) {    
                var alert = $('#m_form_1_msg');
                alert.removeClass('m--hide').show();
                mApp.scrollTo(alert, -200);
            },

            submitHandler: function (form) {
            preventfunction();
            //form[0].submit(); // submit the form
            }
        });       
    

    
}
    return {
        // public functions
        init: function() {
            demo1(); 
        }
    };
}();

jQuery(document).ready(function() {    
    FormControls.init();
});

function preventfunction(){
    $('#resetbtn').click(function(e){
        e.preventDefault()
        $.ajax({

               // $('#resetbtn').on('submit', function(e) {
                //e.preventDefault();
                url : "http://192.168.0.191:8000/changepassword",
                type: 'POST',
                data: {'newpassword': $('#newpassword').val(),'oldpassword':$('#oldpassword').val()},
                async: false,
                success:function(response)
                {
                    res=JSON.parse(JSON.stringify(response))
                    if(res['status']==200){
                        location.href=("http://192.168.0.191:8000/")
                    }
                    else{
                        setTimeout(function() {
                            var alert = $('#m_form_1_msg');
                            alert.removeClass('m--hide').show();
                            mApp.scrollTo(alert, -200);
                            $('#errormsg').text(res['msg'])
                            }, 100);
                    }
                    
                }
            });
            
        });

    }
//}