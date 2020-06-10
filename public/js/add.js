function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
  }
  
  function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
  }

// function w3_open() {
//   document.getElementById("mySidebar").style.display = "block";
// }

// function w3_close() {
//   document.getElementById("mySidebar").style.display = "none";
// }

// $(document).ready(function(){
//   $('#add_button').click(function(){
//    $('#user_form')[0].reset();
//    $('.modal-title').text("เพิ่มสลาก");
//    $('#action').val("เพิ่ม");
//    $('#operation').val("Add");
//    $('#user_uploaded_image').html('');
//   });
  
//   var dataTable = $('#user_data').DataTable({
//    "processing":true,
//    "serverSide":true,
//    "order":[],
//    "ajax":{
//     url:"fetch.php",
//     type:"POST"
//    },
//    "columnDefs":[
//     {
//      "targets":[0, 3, 4],
//      "orderable":false,
//     },
//    ],
 
//   });
 
//   $(document).on('submit', '#user_form', function(event){
//    event.preventDefault();
//    var number = $('#number').val();
//    var price = $('#price').val();
//    var discount = $('#discount').val();
//    var extension = $('#user_image').val().split('.').pop().toLowerCase();
//    if(extension != '')
//    {
//     if(jQuery.inArray(extension, ['gif','png','jpg','jpeg']) == -1)
//     {
//      alert("Invalid Image File");
//      $('#user_image').val('');
//      return false;
//     }
//    } 
//    if(number != '' && price != '' && discount != '')
//    {
//     $.ajax({
//      url:"insert.php",
//      method:'POST',
//      data:new FormData(this),
//      contentType:false,
//      processData:false,
//      success:function(data)
//      {
//       alert(data);
//       $('#user_form')[0].reset();
//       $('#userModal').modal('hide');
//       dataTable.ajax.reload();
//      }
//     });
//    }
//    else
//    {
//     alert("โปรดระบุ");
//    }
//   });
  
//   $(document).on('click', '.update', function(){
//    var user_id = $(this).attr("id");
//    $.ajax({
//     url:"fetch_single.php",
//     method:"POST",
//     data:{user_id:user_id},
//     dataType:"json",
//     success:function(data)
//     {
//      $('#userModal').modal('show');
//      $('#number').val(data.number);
//      $('#price').val(data.price);
//      $('#discount').val(data.discount);
//      $('.modal-title').text("Edit User");
//      $('#user_id').val(user_id);
//      $('#user_uploaded_image').html(data.user_image);
//      $('#action').val("Edit");
//      $('#operation').val("Edit");
//     }
//    })
//   });
  
//   $(document).on('click', '.delete', function(){
//    var user_id = $(this).attr("id");
//    if(confirm("คุณแน่ใจหรือว่าต้องการลบสิ่งนี้"))
//    {
//     $.ajax({
//      url:"delete.php",
//      method:"POST",
//      data:{user_id:user_id},
//      success:function(data)
//      {
//       alert(data);
//       dataTable.ajax.reload();
//      }
//     });
//    }
//    else
//    {
//     return false; 
//    }
//   });
//  });