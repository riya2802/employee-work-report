console.log("hii")
$(document).ready(function(){
	$('#loginbtn').click(function(e){
		e.preventDefault();
		console.log("we are in the job details function");
	    console.log("this is the data");
	   	console.log("this is the url");
	    var res=''
	    $.ajax({
	        url : "http://127.0.0.1:8000/login",
	        type: 'POST',
	        data: {'email': $('#email').val(),'password':$('#password').val()},
	        async: false,
	    	success:function(response){

		        res=JSON.parse(JSON.stringify(response))
		        console.log(res)
	        
		        if(res['status']==200){
		             location.href=("/reportlist")   
		            console.log('we are in a if condition');
		            $('.action').show().delay(5000).fadeOut();
		            $('.action').addClass('alert-success');
		            $('.action').removeClass('alert-danger');
		            $('.action').text(res['msg']);
		            
		        }else{
	                console.log('we are in a else condition');
	                $('.action').show()
	                $('.action').removeClass('alert-success');
	                $('.action').addClass('alert-danger');
	                $('.action').text(res['msg']);
	                 
		        }						
   
			}
		});
	});
	
	console.log('up')
	$("#reportsubmitbtn").click(function(e){
	e.preventDefault();
	console.log("in")
	console.log("in")
    
    var x = $("form").serializeArray();
    console.log('x',x.val)
    $.each(x, function(i, field){
      console.log(field.name + ":" + field.value + " ");
    });
		});
    $.ajax({
        url : "http://127.0.0.1:8000/reportform",
        type: 'POST',
        data: data,
        async: false,
    	success:function(response){

	        res=JSON.parse(JSON.stringify(response))
	        console.log(res)
        
	        if(res['status']==200){
	             location.href=("/home")   
	            
	        }else{
                console.log('we are in a else condition');
                $('.action').show()
                $('.action').removeClass('alert-success');
                $('.action').addClass('alert-danger');
                $('.action').text(res['msg']);
                 
	        }						

		}
	});
	});


