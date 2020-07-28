// for the hidden form in home page
$('.form').hide();
$('.show').on('click',function(){

    $(this).siblings().toggle();
})

////////////////////////

// for the hidden form in details page
$('.formdet').hide();
$('.showdet').on('click',function(){

    $(this).siblings().toggle();
})