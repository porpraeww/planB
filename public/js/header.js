$(document).on('click', 'ul li',function(){
    $(this).addClass('active').siblings().removeClass('active') //เปลี่ยนสีเวลากด//
    })
    
    $(document).ready(function(){
    $('.menu-toggle').click(function(){
        $('.menu-toggle').toggleClass('active')
        $('nav').toggleClass('active')
    })
})

