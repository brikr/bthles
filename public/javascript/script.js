var mode = 'shorten';

function activate() {
    if (mode == 'shorten') {
        shorten();
    } else {
        info();
    }
}

function shorten() {
    $('.url-textbox').blur();
    url = $('.url-textbox').val();

    $.post('/', {
        type: 'url',
        url: $('.url-textbox').val()
    }, function(data, status, xhr) {
        if (!data.error) {
            $('#result').html('<p>' + data.url + '</p>');
        } else {
            $('#result').html('<a href="/">' + data.message + '</a>');
        }
        $('#url').fadeOut();
        $('#result').fadeIn();
    });
}

function info() {
    $('.url-textbox').blur();
    url = $('.url-textbox').val().split('/').pop();

    $.get('/_stats/' + url, null, function(data, status, xhr) {
        if (!data.error) {
            $('#result').html('<a href="/">long: ' + data.long + '<br />hits: ' + data.hits + '</a>');
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
    $('.url-button').click(activate);
    $('.url-textbox').on('keypress', function(e) {
        if (e.keyCode == 13) {
            activate();
            return false;
        }
    });

    // stats
    $(document).on('change paste keyup', '.url-textbox', function() {
        if ($('.url-button p').text() == 'shorten' && /^(http:\/\/)?bthl.es\/.+/i.test($('.url-textbox').val())) {
            mode = 'stats';
            $('.url-button p').fadeOut(function() {
                $('.url-button p').text('stats').fadeIn('slow');
            });
        } else if ($('.url-button p').text() == 'stats' && !/^(http:\/\/)?bthl.es\/.+/i.test($('.url-textbox').val())) {
            mode = 'shorten';
            $('.url-button p').fadeOut(function() {
                $('.url-button p').text('shorten').fadeIn('slow');
            });
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
