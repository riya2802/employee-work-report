console.log("checked")

function apiServiceFamilyData(apiUrl,data,child_f_name,child_m_name,child_l_name,child_gen,child_marital_st,child_b_date) 
{
    console.log("we are in the job details function");
    console.log("this is the data",data)
   console.log(apiUrl,"this is the url");
    var res=''
    $.ajax({
        url : apiUrl,
        type: 'POST',
        data: {'data':data,'childlastname':child_l_name,'childfirstname':child_f_name,'childmiddlename':child_m_name,'childgender':child_gen,'childbirthdate':child_b_date,'childmaritalstatus':child_marital_st},
        async: false,
    }).success(function(response){

        res=JSON.parse(JSON.stringify(response))
    });
    return res
}
function apiServiceData(apiUrl,data) 
{
    console.log("we are in the job details function");
    console.log("this is the data",data)
   console.log(apiUrl,"this is the url");
    var res=''
    $.ajax({
        url : apiUrl,
        type: 'POST',
        data: data,
        async: false,
    }).success(function(response){

        res=JSON.parse(JSON.stringify(response))
    });
    return res
}

      function checkId(str){
          if (str){
            $.ajax({
              url: "http://192.168.0.191:8000/newapp/isuseridcorrect",
              type:"POST",
              data : { request_data:$('#employeeid').val()},
              success: function(response_data) { 
                console.log(response_data);

                if (response_data['data']){
                    document.getElementById("txtHint").innerHTML =" Already Exist ";
                }
                else if (response_data['data'] == "Invalid"){
                    document.getElementById("txtHint").innerHTML =" Invalid Username ";

                }
                else{
                    document.getElementById("txtHint").innerHTML ="Available";
                }
            },
            });
          }
      }

function apiServiceForFormData(form) 
{
    var apiUrl = 'http://192.168.0.191:8000/newapp/persoanldetails';
    var res=''
    $.ajax({
        url : apiUrl,
        type: 'POST',
        data: form,
        async: false,
        cache:false,
        contentType: false,
        processData: false,
        mimeType: "multipart/form-data",
    }).success(function(response) {
        res=JSON.parse(response)      

    });
    return res
}

function scroll_to_class(element_class, removed_height) {
	var scroll_to = $(element_class).offset().top - removed_height;
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 0);
	}
}

function bar_progress(progress_line_object, direction) {
	var number_of_steps = progress_line_object.data('number-of-steps');
	var now_value = progress_line_object.data('now-value');
	var new_value = 0;
	if(direction == 'right') {
		new_value = now_value + ( 100 / number_of_steps );
	}
	else if(direction == 'left') {
		new_value = now_value - ( 100 / number_of_steps );
	}
	progress_line_object.attr('style', 'width: ' + new_value + '%;').data('now-value', new_value);
}

jQuery(document).ready(function() {


    $(document).on('input','.num', function (event) {
   this.value = this.value.replace(/[^0-9]/g, '');
});
    $(document).on('input','.alph', function (event) {
   this.value = this.value.replace(/[^a-zA-Z]+$/g, '');
});


    $.backstretch("assets/img/backgrounds/1.jpg");
    
    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$.backstretch("resize");
    });
    $('.f1 fieldset:first').fadeIn('slow');
    
    $('#datejoin,#positiondd,#jobstatuseffectivedate,#employmentstatuseffectivedate,#countrydd,#employeeid,#firstname,#lastname,#birthdate,#nationalid').on('focus', function() {
    	$(this).removeClass('input-error');
    });

    

    // next step
    $('.f1 .btn-next').on('click', function() {
    	var parent_fieldset = $(this).parents('fieldset');
        var selectedid = ($(this).parents('fieldset').attr('id'))
        console.log(selectedid)
    	var next_step = true;
    	// navigation steps / progress steps
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');

        
      //  fields validation
        parent_fieldset.find('#datejoin,#positiondd,#jobstatuseffectivedate,#employmentstatuseffectivedate,#countrydd,#employeeid,#firstname,#lastname,#birthdate,#nationalid').each(function() {
         if( $(this).val() == "" ) {
             $(this).addClass('input-error');
             next_step = false;
         }
        else{
                $(this).removeClass('input-error');
            }

        });
                next_step = false;
                var i =0
                if (selectedid =='personalfield'){
                    var form = new FormData();
                    form.append("employeeid", $('#employeeid').val());
                    form.append("firstname", $('#firstname').val());
                    form.append("middlename", $('#middlename').val());
                    form.append("lastname", $('#lastname').val());
                    form.append("gendern", $('#gendern').val());
                    form.append("birthdate", $('#birthdate').val());
                    form.append("nationalitydd",$('#nationalitydd').val());
                    form.append("nationalid", $('#nationalid').val());
                    form.append("passport", $('#passport').val());
                    form.append("ethnicity",$('#ethnicity').val());
                    form.append("religion", $('#religion').val());
                    form.append("image", $('#image').prop('files')[0]);
                    res = apiServiceForFormData(form)                    
                    if(res['status']==200){
                        $('.empid').val(res['empID']);
                        next_step =true
                        $('.action').show().delay(5000).fadeOut();
                        $('.action').addClass('alert-success');
                        $('.action').removeClass('alert-danger');
                        $('.action').text(res['msg'])
                    }else{
                        $('.action').show()
                        $('.action').removeClass('alert-success');
                        $('.action').addClass('alert-danger');
                        $('.action').text(res['msg'])
                    }
                   }

                else if (selectedid =='jobfield'){
                    var data = {};
                    data[$('.empid').attr('name')] = $('.empid').val();
                    data[$('#datejoin').attr('name')] = $('#datejoin').val();
                    data[$('#endofprobation').attr('name')] = $('#endofprobation').val();
                    data[$('#positiondd').attr('name')] = $('#positiondd').val();
                    data[$('#jobstatuseffectivedate').attr('name')] = $('#jobstatuseffectivedate').val();
                    data[$('#linemanagedd').attr('name')] = $('#linemanagedd').val();
                    data[$('#departmentdd').attr('name')] = $('#departmentdd').val();
                    data[$('#branchdd').attr('name')] = $('#branchdd').val();
                    data[$('#leveldd').attr('name')] = $('#leveldd').val();
                    data[$('#jobtypedd').attr('name')] = $('#jobtypedd').val();
                    data[$('#employmentstatuseffectivedate').attr('name')] = $('#employmentstatuseffectivedate').val();
                    data[$('#jobstatusdd').attr('name')] = $('#jobstatusdd').val();
                    data[$('#leaveworkflowdd').attr('name')] = $('#leaveworkflowdd').val();
                    data[$('#workdays').attr('name')] = $('#workdays').val(); 
                    data[$('#holidaysdd').attr('name')] = $('#holidaysdd').val(); 
                    data[$('#termstartdd').attr('name')] = $('#termstartdd').val(); 
                    data[$('#termend').attr('name')] = $('#termend').val(); 
                     var apiUrl = "http://192.168.0.191:8000/newapp/jobdetails";
                    // console.log(apiUrl)
                    res = apiServiceData('http://192.168.0.191:8000/newapp/jobdetails',data)                   
                        if(res['status']==200){
                            next_step =true
                            console.log('we are in a if condition');
                            console.log('next_step',next_step);
                            $('.action').show().delay(5000).fadeOut();
                            $('.action').addClass('alert-success');
                            $('.action').removeClass('alert-danger');
                            $('.action').text(res['msg'])
                        }else{
                            console.log('we are in a else condition');
                            $('.action').show()
                            $('.action').removeClass('alert-success');
                            $('.action').addClass('alert-danger');
                            $('.action').text(res['msg'])
                        }
                         // $('.action').show()
                    
                    }

                else if (selectedid =='familyfield'){
                    var data = {};
                    data[$('.empid').attr('name')] = $('.empid').val();
                    data[$('#maritalstatus').attr('name')] = $('#maritalstatus').val();
                    data[$('#spouseworking').attr('name')] = $('#spouseworking').val();
                    data[$('#numberofchild').attr('name')] = $('#numberofchild').val();
                    data[$('#spousefirstname').attr('name')] = $('#spousefirstname').val();
                    data[$('#spousemiddlename').attr('name')] = $('#spousemiddlename').val();
                    data[$('#spouselastname').attr('name')] = $('#spouselastname').val();
                    data[$('#spousenationality').attr('name')] = $('#spousenationality').val();
                    data[$('#spousenationalid').attr('name')] = $('#spousenationalid').val();
                    data[$('#spousebirthdate').attr('name')] = $('#spousebirthdate').val();
                    data[$('#spousepassport').attr('name')] = $('#spousepassport').val();
                    data[$('#spouseethnicity').attr('name')] = $('#spouseethnicity').val();
                    data[$('#spouserelegion').attr('name')] = $('#spouserelegion').val();
                 //   data[$('.childfirstname').attr('name')] = $('.childfirstname').val();
                 //   data[$('.childlastname').attr('name')] = $('.childlastname').val();
                   // data[$('.childmiddlename').attr('name')] = $('.childmiddlename').val();
                   // data[$('.childgender').attr('name')] = $('.childgender').val();
                    //data[$('.childbirthdate').attr('name')] = $('.childbirthdate').val();
                    //data[$('.childmaritalstatus').attr('name')] = $('.childmaritalstatus').val();
                    var child_f_name = $(".childfirstname").map(function(){return $(this).val();}).get();
                    var child_m_name = $(".childmiddlename").map(function(){return $(this).val();}).get();
                    var child_l_name = $(".childlastname").map(function(){return $(this).val();}).get();
                    var child_gen = $(".childgender").map(function(){return $(this).val();}).get();
                    var child_b_date = $(".childbirthdate").map(function(){return $(this).val();}).get();
                    var child_marital_st = $(".childmaritalstatus").map(function(){return $(this).val();}).get();

                     var apiUrl = 'http://192.168.0.191:8000/newapp/familydetails';
                    // console.log(apiUrl)
                    res = apiServiceFamilyData('http://192.168.0.191:8000/newapp/familydetails',data,child_f_name,child_m_name,child_l_name,child_gen,child_marital_st,child_b_date)               
                        if(res['status']==200){
                            next_step =true
                            console.log('we are in a if condition');
                            console.log('next_step',next_step);
                            $('.action').show().delay(5000).fadeOut();
                            $('.action').addClass('alert-success');
                            $('.action').removeClass('alert-danger');
                            $('.action').text(res['msg'])
                        }else{
                            console.log('we are in a else condition');
                            $('.action').show()
                            $('.action').removeClass('alert-success');
                            $('.action').addClass('alert-danger');
                            $('.action').text(res['msg'])
                        }
                         // $('.action').show()
                    
                }
                else if (selectedid =='contactfield'){
                     var data = {};
                    data[$('.empid').attr('name')] = $('.empid').val();
                    data[$('#email').attr('name')] = $('#email').val();
                    data[$('#bloghomepage').attr('name')] = $('#bloghomepage').val();
                    data[$('#officeextention').attr('name')] = $('#officeextention').val();
                    data[$('#postcode').attr('name')] = $('#postcode').val();
                    data[$('#office').attr('name')] = $('#office').val();
                    data[$('#mobile').attr('name')] = $('#mobile').val();
                    data[$('#home').attr('name')] = $('#home').val();
                    data[$('#address1').attr('name')] = $('#address1').val();
                    data[$('#address2').attr('name')] = $('#address2').val();
                    data[$('#city').attr('name')] = $('#city').val();
                    data[$('#state').attr('name')] = $('#state').val();
                    data[$('#countrydd').attr('name')] = $('#countrydd').val();
                    data[$('#coefirstname').attr('name')] = $('#coefirstname').val();
                    data[$('#coelastname').attr('name')] = $('#coelastname').val();
                    data[$('#coemiddlename').attr('name')] = $('#coemiddlename').val();
                    data[$('#coerelationship').attr('name')] = $('#coerelationship').val();
                    data[$('#coemobile').attr('name')] = $('#coemobile').val();
                    data[$('#coehousephone').attr('name')] = $('#coehousephone').val();
                    data[$('#coeofficephone').attr('name')] = $('#coeofficephone').val();


                     res = apiServiceData('http://192.168.0.191:8000/newapp/contactdetails',data)                    
                        if(res['status']==200){
                            next_step =true
                            console.log('we are in a if condition');
                            console.log('next_step',next_step);
                            $('.action').show().delay(5000).fadeOut();
                            $('.action').addClass('alert-success');
                            $('.action').removeClass('alert-danger');
                            $('.action').text(res['msg'])
                        }else{
                            console.log('we are in a else condition');
                            $('.action').show()
                            $('.action').removeClass('alert-success');
                            $('.action').addClass('alert-danger');
                            $('.action').text(res['msg'])
                        }
                }
                else if (selectedid =='healthfield'){
                     var data = {};
                    data[$('.empid').attr('name')] = $('.empid').val();
                    data[$('#height').attr('name')] = $('#height').val();
                    data[$('#weight').attr('name')] = $('#weight').val();
                    data[$('#bloodgroup').attr('name')] = $('#bloodgroup').val();
                    res = apiServiceData('http://192.168.0.191:8000/newapp/healthdetails',data) 
                        if(res['status']==200){
                            next_step =true
                            console.log('we are in a if condition');
                            console.log('next_step',next_step);
                            $('.action').show().delay(5000).fadeOut();
                            $('.action').addClass('alert-success');
                            $('.action').removeClass('alert-danger');
                            $('.action').text(res['msg'])
                        }else{
                            console.log('we are in a else condition');
                            $('.action').show()
                            $('.action').removeClass('alert-success');
                            $('.action').addClass('alert-danger');
                            $('.action').text(res['msg'])
                        }
                }
                else if (selectedid =='previewfield'){
                     var data = {};
                    data[$('.empid').attr('name')] = $('.empid').val();
                    res = apiServiceData('http://192.168.0.191:8000/newapp/preview',data)
                    if(res['status']==200){
                            next_step =true
                            $('.action').show().delay(5000).fadeOut();
                            $('.action').addClass('alert-success');
                            $('.action').removeClass('alert-danger');
                            $('.action').text(res['msg'])
                        }else{
                            next_step =false
                            console.log('we are in a else condition');
                            $('.action').show()
                            $('.action').removeClass('alert-success');
                            $('.action').addClass('alert-danger');
                            $('.action').text(res['msg'])
                        }
                }
                else if (selectedid =='directoryfield'){
                    var data = {};
                    data[$('.empid').attr('name')] = $('.empid').val();
                    res = apiServiceData('http://192.168.0.191:8000/newapp/directory',data)
                    if(res['status']==200){
                            next_step =true
                            $('.action').show().delay(5000).fadeOut();
                            $('.action').addClass('alert-success');
                            $('.action').removeClass('alert-danger');
                            $('.action').text(res['msg'])
                        }else{
                            next_step =false
                            console.log('we are in a else condition');
                            $('.action').show()
                            $('.action').removeClass('alert-success');
                            $('.action').addClass('alert-danger');
                            $('.action').text(res['msg'])
                        }
                }
                
                   console.log(next_step,'console.log(next_step)')
    

            

          
    //    fields validation
    //      $('#familyfield').submit(function(e){
    //     e.preventDefault(); 
    //     $.ajax({
    //           url: "http://192.168.0.191:8000/newapp/family",
    //           type:"POST",
    //           data : $("#check_form").serialize(),
    //           success: function(response_data) { 
    //             console.log(response_data);
    //         },
    //     });
    // })
    function displayResultnew(count,rowCount)
    {
    var counter =0
    flag =false
    var htm ='<tr><td><input type = "text" class="childfirstname" name="childfirstname" class="alph"></td> <td><input type = "text" name="childmiddlename" class="childmiddlename" class="alph"></td> <td><input type = "text" name="childlastname" class="childlastname" class="alph"></td> <td><input type = "Date" class="childbirthdate" name="childbirthdate" id="childbirthdate"></td> <td><select class="childgender" name="childgender"><option value="Unknown">Unknown</option><option value="Male">Male</option><option value="Female">Female</option></td> <td><select class="childmaritalstatus" name="childmaritalstatus"><option value="UnMarried">UnMarried</option><option value="Married">Married</option></td></tr>'
    if (rowCount == 0){

        
        counter=count
        for (var i = 0; i < count; i++) {  
            
            $('#myTable tbody').append(htm);
        }
    }
    else if (count > rowCount)
    {   
        counter =count-rowCount
       for (var i = 0; i < counter; i++) {  
        
            $('#myTable tbody').append(htm);
        }
    }
    else if (count < rowCount)
    {
        counter =rowCount-count
       for (var i = 0; i < counter; i++) {   
            $('#myTable tbody tr:last').remove();
        }
    }
}
    $('.test').change(function(){
         var rowCount = $('#myTable tbody tr').length;
        displayResultnew($(this).val(),rowCount)
    })
     $('.add_row').click(function(){
        console.log("call")

         var rowCount = $('#myTable tbody tr').length;
         console.log("rowCount",rowCount)

          $('.test').val(rowCount+1)
        displayResultnew(rowCount+1,rowCount)
    })

     $('.remove_row').click(function(){
         var rowCount = $('#myTable tbody tr').length;
         $('.test').val(rowCount-1)
        displayResultnew(rowCount-1,rowCount)
    })

    	
    	// fields validation
    	// parent_fieldset.find('input[type="text"], input[type="password"], textarea').each(function() {
    	// 	if( $(this).val() == "" ) {
    	// 		$(this).addClass('input-error');
    	// 		next_step = false;
    	// 	}
    	// 	else {
    	// 		$(this).removeClass('input-error');
    	// 	}
    	// });
    	// fields validation
    	
    	if( next_step ) {
    		parent_fieldset.fadeOut(400, function() {
    			// change icons
    			current_active_step.removeClass('active').addClass('activated').next().addClass('active');
    			// progress bar
    			bar_progress(progress_line, 'right');
    			// show next step
	    		$(this).next().fadeIn();
	    		// scroll window to beginning of the form
    			scroll_to_class( $('.f1'), 20 );
	    	});
    	}
    	
    });
   
    // previous step
    $('.f1 .btn-previous').on('click', function() {
    	// navigation steps / progress steps
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');
    	
    	$(this).parents('fieldset').fadeOut(400, function() {
    		// change icons
    		current_active_step.removeClass('active').prev().removeClass('activated').addClass('active');
    		// progress bar
    		bar_progress(progress_line, 'left');
    		// show previous step
    		$(this).prev().fadeIn();
    		// scroll window to beginning of the form
			scroll_to_class( $('.f1'), 20 );
    	});
    });
    
    //submit
    $('.f1').on('submit', function(e) {
        e.preventDefault();            
        var data = {};
        data[$('.empid').attr('name')] = $('.empid').val();
        res = apiServiceData('http://192.168.0.191:8000/newapp/submit',data)
        if(res['status']==200){
            next_step =true
            $('.action').show().delay(5000).fadeOut();
            $('.action').addClass('alert-success');
            $('.action').removeClass('alert-danger');
            $('.action').text(res['msg']);
             window.location.href = 'http://192.168.0.191:8000/newapp/employeeList';
        }else{
            next_step =false
            console.log('we are in a else condition');
            $('.action').show()
            $('.action').removeClass('alert-success');
            $('.action').addClass('alert-danger');
            $('.action').text(res['msg'])
            
        }
        return false   
    	
    	// fields validation
    	$(this).find('#datejoin,#positiondd,#jobstatuseffectivedate,#employmentstatuseffectivedate,#countrydd,#employeeid,#firstname,#lastname,#birthdate,#nationalid').each(function() {
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	// fields validation
    	
    });
    
    });

