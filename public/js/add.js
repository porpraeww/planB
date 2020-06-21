function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
  }
  
  function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
  }

$('button').click(function(e){
  var result = confirm("คุณแน่ใจว่าต้องการลบ");
  if(!result) {
      e.preventDefault();
  }
});