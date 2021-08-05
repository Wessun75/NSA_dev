$(document).ready(function(){
    $('.subscribeButton').hover(function(){
        $(this).removeClass('text-success');
        $(this).removeClass('fa-check-circle');
        $(this).addClass('text-danger');
        $(this).addClass('fa-times-circle');
    }, function(){
        $(this).addClass('text-success');
        $(this).addClass('fa-check-circle');
        $(this).removeClass('text-danger');
        $(this).removeClass('fa-times-circle');
    });
});
