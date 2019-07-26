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

$(document).ready(function(){
	$('#reportsubmitbtn').click(function(e){
	});
	$(document).on('click', '#reportsubmitbtn', function(e) {
	e.preventDefault();
	var projectname= $(".pname").map(function(){return $(this).val();}).get();
    var project_description  = $(".project_description").map(function(){return $(this).val();}).get();
        for(var i=0;i<project_description.length;i++){
    	console.log("lenh",project_description[i].length)
    	if(project_description[i].length <= 10) {
    		console.log("inbtn")
			$('.action').show()
            $('.action').show().delay(5000).fadeOut();
            $('.action').removeClass('alert-success');
            $('.action').addClass('alert-danger');
			$('.action').text("Empty"+projectname[i]  + "Description");
    	}
    }
    $.ajax({
        url : "http://127.0.0.1:8000/reportform",
        type: 'POST',
        data: {'projectname':projectname,'project_description':project_description},
        async: false,
    	success:function(response){
            res=JSON.parse(JSON.stringify(response))
	        console.log(res)
            if(res['status']==200){
	        	console.log("Success")
	        	console.log(res)
	            location.href=("http://127.0.0.1:8000/logout") 
	        }else{
                console.log('we are in a else condition');
                $('.action').show()
                $('.action').show().delay(2000).fadeOut();
                $('.action').removeClass('alert-success');
                $('.action').addClass('alert-danger');
				$('.action').text(res['msg']);
            }						

		}
	});
	});
    });