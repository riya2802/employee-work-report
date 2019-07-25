console.log("hii")
$(document).ready(function(){
	console.log("hii")
	$('#reportsubmitbtn').click(function(e){
	});
	$(document).on('click', '#reportsubmitbtn', function(e) {
	e.preventDefault();
	var projectname= $(".pname").map(function(){return $(this).val();}).get();
    var project_description  = $(".project_description").map(function(){return $(this).val();}).get();
        for(var i=0;i<project_description.length;i++){
    	console.log("lenh",project_description[i].length)
    	if(project_description[i].length <= 2){
    		console.log("inbtn")
			$('.action').show()
            $('.action').show().delay(5000).fadeOut();
            $('.action').removeClass('alert-success');
            $('.action').addClass('alert-danger');
			$('.action').text("Empty"+projectname[i]  + "Description");
    	}
    	
    }
    $.ajax({
        url : "http://192.168.0.191:8000/reportform",
        type: 'POST',
        data: {'projectname':projectname,'project_description':project_description},
        async: false,
    	success:function(response){

	        res=JSON.parse(JSON.stringify(response))
	        console.log(res)
        
	        if(res['status']==200){
	        	console.log("Success")
	        	console.log(res)
	            location.href=("http://192.168.0.191:8000/logout") 
	            
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