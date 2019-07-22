console.log("hii")
$(document).ready(function(){
	console.log("hii")
	$('#loginbtn').click(function(e){
		console.log("hii")
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
	                $('.action').show().delay(2000).fadeOut();
	                $('.action').removeClass('alert-success');
	                $('.action').addClass('alert-danger');
	                $('.action').text(res['msg']);
	                 
		        }						
   
			}
		});
	});
	$(document).on('click', '#reportsubmitbtn', function(e) {
	console.log("hii")
	e.preventDefault();
	console.log("in")
	console.log("in")
    var projectname= $(".pname").map(function(){return $(this).val();}).get();
    var project_description  = $(".project_description").map(function(){return $(this).val();}).get();
    console.log('projectname',projectname)
    console.log('project_description',project_description)
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
	            location.href=("/logout") 
	            
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