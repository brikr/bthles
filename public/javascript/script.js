var shorten = function() {
    $('#url-textbox').blur();
    $.post('/', {
        type: 'url',
        url: $('#url-textbox').val()
    }, function(data, status, xhr) {
        console.log(data);
        if (!data.error) {
            $('#result').html('<a href="' + data.url + '">' + data.url + '</a>');
        } else {
            $('#result').html('<a href="/">' + data.message + '</a>');
        }
        $('#url').fadeOut();
        $('#result').fadeIn();
    });
}

$(document).ready(function() {
    // intro
    $('.center').hide();
    $(':not("#result")').fadeIn();
    $('#url-textbox').focus();

    // focus hooks
    $('#url-textbox').focus(function() {
        if ($(this).val() == 'http://') {
            $(this).val('');
            $(this).css('color', '#000000');
        }
    });
    $('#url-textbox').focusout(function() {
        if ($(this).val() == '') {
            $(this).val('http://');
            $(this).css('color', '#AAAAAA');
        }
    });

    // shortening
    $('#url-button').click(shorten);
    $('#url-textbox').on('keypress', function(e) {
        if (e.keyCode == 13) {
            shorten();
            return false;
        }
    });
});
