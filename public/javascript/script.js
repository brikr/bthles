var shorten = function() {
    $('.url-textbox').blur();
    url = $('.url-textbox').val();

    $.post('/', {
        type: 'url',
        url: $('.url-textbox').val()
    }, function(data, status, xhr) {
        console.log(data);
        if (!data.error) {
            // $('#result').html('<a href="http://' + data.url + '">' + data.url + '</a>');
            $('#result').html('<p>' + data.url + '</p>');
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
    $('.url-textbox').focus();

    // stay in focus of input
    $('.url-textbox').focusout(function() {
        $(this).focus();
    });

    // shortening
    $('.url-button').click(shorten);
    $('.url-textbox').on('keypress', function(e) {
        if (e.keyCode == 13) {
            shorten();
            return false;
        }
    });

    // copy result to clipboard
    $(document).on('click', '#result p', function() {
        clipboard.copy($('#result').text());
        $(this).fadeOut(function() {
            $('#result').html('<a href="/">copied to clipboard</a>').fadeIn('slow');
        });
    });
});
