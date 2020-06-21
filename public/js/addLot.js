$("#addLotBtn").click(function() {
    var number = $("#number").val();
    var price = $("#price").val();
    var discount = $("#discount").val();
    var date = $("#date").val();
    var remain = $("#remainc").val();
    var lot_image = $("#lot_image").val();

    if(number == '' || price == '' || discount == '' || date == '' || remain == '' || lot_image == '' ) {
        alert('กรุณากรอกข้อมูลให้ครบ')
    } else {
        alert('เพิ่มสลากเสร็จสิ้น')
    }
});