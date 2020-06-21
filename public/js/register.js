$("#submitRegister").click(function() {
    var usr = $("#usr").val();
    var email = $("#email").val();
    var pwd = $("#pwd").val();
    var repwd = $("#repwd").val();
    var acc = $("#acc").val();
    var accname = $("#accname").val();
    var bank = $("#bank").val();

    if(pwd != repwd) {
        alert('รหัสผ่านไม่ตรงกัน')
    }
    
});