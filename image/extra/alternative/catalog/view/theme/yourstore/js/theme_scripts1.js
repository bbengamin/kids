/************************************************** web-developer scripts */
/* mailing-list.js */
$j(document).ready(function() {
    $j('#signup').submit(function() {
        // update user interface
        $j('#response').html('Adding email address...');
        //window.alert('ajax=true&email=' + escape($j('#email').val())+'&apikey=' + escape($j('#apikey').val())+'&listid=' + escape($j('#listid').val()));
        // Prepare query string and send AJAX request
        $.ajax({
            url: 'image/inc/store-address.php',
            data: 'ajax=true&email=' + escape($j('#email').val())+'&apikey=' + escape($j('#apikey').val())+'&listid=' + escape($j('#listid').val()),
            success: function(msg) {
                $j('#response').html(msg);
            }
        });

        return false;
    });

    $j('#signup1').submit(function() {
        $j('#response1').html('Adding email address...');
        $.ajax({
            url: 'image/inc/store-address1.php',
            data: 'ajax=true&email1=' + escape($j('#email1').val())+'&apikey1=' + escape($j('#apikey1').val())+'&listid1=' + escape($j('#listid1').val()),
            success: function(msg) {
                $j('#response1').html(msg);
            }
        });

        return false;
    });


});

/*cookies*/
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));

function openNewsletterPopup(){

    "use strict";
    if ($j('#newsletterModal').length) {
        var pause = $j('#newsletterModal').attr('data-pause');
        setTimeout(function() {
            $j('#newsletterModal').modal('show');
        }, pause);
    }

}


$j(function(){
    //if ($j(window).width() > 768) {
        show_popup= $j.cookie('show_popup');
        if(show_popup == null || show_popup=='enabled'){
            openNewsletterPopup()
        }
        $j('#checkBox1').change(function() {
            show_popup= $j.cookie('show_popup');
            if($j(this).is(":checked")) {
                show_popup= $j.cookie('show_popup','disabled');
            } else {
                show_popup= $j.cookie('show_popup','enabled');
            }
        });
    //}
})

/* end mailing-list.js */

function handlerDropDownClose1() {

    $j('.dropdown-menu__close').on('click', function(e) {
        e.preventDefault();
        $j(this).closest('.dropdown.open').removeClass('open');
    });

};

$j(document).ready(function() {

    handlerDropDownClose1();

    // Currency for mobile
    $j('#form-currency-mobile .currency-select').on('click', function(e) {
        e.preventDefault();

        $j('#form-currency-mobile input[name=\'code\']').attr('value', $j(this).attr('name'));

        $j('#form-currency-mobile').submit();
    });

    // Language  for mobile
    $j('#form-language-mobile .language-select').on('click', function(e) {
        e.preventDefault();

        $j('#form-language-mobile input[name=\'code\']').attr('value', $j(this).attr('name'));

        $j('#form-language-mobile').submit();
    })


    /* Search */
    $j('#search-wrapper input[name=\'search1\']').parent().find('button').on('click', function() {
        var url = $j('base').attr('href') + 'index.php?route=product/search';

        var value = $j('header input[name=\'search1\']').val();

        if (value) {
            url += '&search=' + encodeURIComponent(value);
        }

        location = url;
    });

    $j('#search-wrapper input[name=\'search1\']').on('keydown', function(e) {
        if (e.keyCode == 13) {
            $j('header input[name=\'search1\']').parent().find('button').trigger('click');
        }
    });


    $j('#search-wrapper2 input[name=\'search2\']').parent().find('button').on('click', function() {
        var url = $j('base').attr('href') + 'index.php?route=product/search';

        var value = $j('header input[name=\'search2\']').val();

        if (value) {
            url += '&search=' + encodeURIComponent(value);
        }

        location = url;
    });

    $j('#search-wrapper2 input[name=\'search2\']').on('keydown', function(e) {
        if (e.keyCode == 13) {
            $j('header input[name=\'search2\']').parent().find('button').trigger('click');
        }
    });


// Product List
    $j('.list-view1').click(function() {
        //$j('#centerColumn .product-grid > .clearfix').remove();

        //$j('#centerColumn .row > .product-grid').attr('class', 'product-layout product-list col-xs-12');


        //e.preventDefault();
        $j(this).addClass('active');


        $j('a.grid-view1').removeClass('active');
        $j('.product-listing').addClass('row-view');


        localStorage.setItem('display', 'list');
    });

// Product Grid
    $j('.grid-view1').click(function() {
        // What a shame bootstrap does not take into account dynamically loaded columns
        //var cols = $j('#column-right, #column-left').length;

        //if (cols == 2) {
            //$j('#centerColumn .product-list').attr('class', 'product-layout product-grid col-lg-6 col-md-6 col-sm-12 col-xs-12');
        //} else if (cols == 1) {
            //$j('#centerColumn .product-list').attr('class', 'product-layout product-grid col-lg-4 col-md-4 col-sm-6 col-xs-12');
        //} else {
            //$j('#centerColumn .product-list').attr('class', 'product-layout product-grid col-lg-3 col-md-3 col-sm-6 col-xs-12');
        //}


        //e.preventDefault();
        $j(this).addClass('active');
        $j('a.list-view1').removeClass('active');
        $j('.product-listing').removeClass('row-view');


        localStorage.setItem('display', 'grid');
    });

    if (localStorage.getItem('display') == 'list') {
        $j('.list-view1').trigger('click');
    } else {
        $j('.grid-view1').trigger('click');
    }



    var iconcolor = $j(".icon-color:not(.disable)");
    iconcolor.click(function () {
        if ($j(this).hasClass("selected")) iconcolor.each(function () {
            $j(this).removeClass("selected")
        });
        else {
            iconcolor.each(function () {
                $j(this).removeClass("selected")
            });
            $j(this).addClass("selected")
        }
    });


    $j(".reviews_button").click(function (){
        var tabTop = $j(".producttab").offset().top;
        $j("html, body").animate({ scrollTop:tabTop }, 1000);
    });
    $j(".write_review_button").click(function (){
        var tabTop = $j(".producttab").offset().top;
        $j("html, body").animate({ scrollTop:tabTop }, 1000);
    });




//=========== back-to-top

    function backToTop1(){
        //if ($j(".back-to-top1").length > 0) {
            $j('.back-to-top1').click(function() {
                $j('html, body').animate({scrollTop: 0},500);
                return false;
            })

            //$j(window).scroll(function () {
                //if ( $j(window).scrollTop() > 500) {$j(".back-to-top").stop(true.false).fadeIn(110)}
                //else {$j(".back-to-top").stop(true.false).fadeOut(110)}
            //})
        //}
    }


    backToTop1();

    if ($j('.countdown_box').length > 0) {
        countDown2();
    }














            })






// Cart add remove functions
var cart_theme = {
    'add': function(product_id, quantity) {
        $.ajax({
            url: 'index.php?route=checkout/cart/add',
            type: 'post',
            data: 'product_id=' + product_id + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
            dataType: 'json',
            beforeSend: function() {
                //$j('#cart > button').button('loading');
            },
            complete: function() {
                $j('#cart > button').button('reset');
            },
            success: function(json) {
                $j('.alert, .text-danger').remove();

                if (json['redirect']) {
                    location = json['redirect'];
                }

                if (json['success']) {
                    var str=json['total'];
                    var myArray = str.split(' ');
                    var str1=myArray[0];


                    $j('.mfp-close').click();

                    //$j('#content').parent().before('<div class="alert alert-success"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');

                    var outputVariable =
                        '<div class="modal modal-window fade in" id="modalAddToCart" tabindex="-1" role="dialog" aria-label="myModalLabel" aria-hidden="true" style="display: block; padding-right: 17px;">' +
                        '<div class="modal-dialog white-modal modal-sm">' +
                        '<div class="modal-content ">' +
                        '<div class="modal-header">' +
                        '<button type="button" class="close"><span class="icon icon-clear"></span></button>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        '<div class="text-center">' + json['success'] + '</div>' +
                        '</div>' +
                        '<div class="modal-footer text-center">' +
                            '<a href="index.php?route=checkout/cart" class="btn btn--ys btn--lg"><span class="icon icon-shopping_basket"></span></a>' +
                            '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    var bg = '<div class="modal-backdrop fade in"></div>';

                    $j('body').after(bg);
                    $j('#notification').parent().before(outputVariable);
                    //$j('.success_ev').fadeIn('');
                    //$j('body').addClass('darken');

                    // Need to set timeout otherwise it wont update the total
                    setTimeout(function () {
                        $j('#cart > button').html('<span class="icon icon-shopping_basket"></span><span id="cart-total" class="badge badge--cart"> ' + str1 + '</span>');
                    }, 1000);


                    //$j('html, body').animate({ scrollTop: 0 }, 'slow');

                    $j('#cart > ul').load('index.php?route=common/cart/info ul li');
                    $j( ".close" ).click(function() {
                        //$j('body').removeClass('darken');
                        $j('.modal-window').remove();
                        $j('.modal-backdrop').remove();
                    });
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'update': function(key, quantity) {
        $.ajax({
            url: 'index.php?route=checkout/cart/edit',
            type: 'post',
            data: 'key=' + key + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
            dataType: 'json',
            beforeSend: function() {
                //$j('#cart > button').button('loading');
            },
            complete: function() {
                $j('#cart > button').button('reset');
            },
            success: function(json) {
                var str=json['total'];
                var myArray = str.split(' ');
                var str1=myArray[0];

                // Need to set timeout otherwise it wont update the total
                setTimeout(function () {
                    $j('#cart > button').html('<span class="icon icon-shopping_basket"></span><span id="cart-total" class="badge badge--cart"> ' + str1 + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $j('#cart > ul').load('index.php?route=common/cart/info ul li');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function(key) {
        $.ajax({
            url: 'index.php?route=checkout/cart/remove',
            type: 'post',
            data: 'key=' + key,
            dataType: 'json',
            beforeSend: function() {
                //$j('#cart > button').button('loading');
            },
            complete: function() {
                $j('#cart > button').button('reset');
            },
            success: function(json) {
                var str=json['total'];
                var myArray = str.split(' ');
                var str1=myArray[0];

                // Need to set timeout otherwise it wont update the total
                setTimeout(function () {
                    $j('#cart > button').html('<span class="icon icon-shopping_basket"></span><span id="cart-total" class="badge badge--cart"> ' + str1 + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $j('#cart > ul').load('index.php?route=common/cart/info ul li');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}


var wishlist_theme = {
    'add': function(product_id) {
        $.ajax({
            url: 'index.php?route=account/wishlist/add',
            type: 'post',
            data: 'product_id=' + product_id,
            dataType: 'json',
            success: function(json) {
                $j('.alert').remove();
                $j('.mfp-close').click();

                if (json['redirect']) {
                    location = json['redirect'];
                }

                if (json['success']) {
                    //$j('#content').parent().before('<div class="alert alert-success"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');

                    var outputVariable =
                        '<div class="modal modal-window fade in" id="modalAddToCart" tabindex="-1" role="dialog" aria-label="myModalLabel" aria-hidden="true" style="display: block; padding-right: 17px;">' +
                            '<div class="modal-dialog white-modal modal-sm">' +
                            '<div class="modal-content ">' +
                            '<div class="modal-header">' +
                            '<button type="button" class="close"><span class="icon icon-clear"></span></button>' +
                            '</div>' +
                            '<div class="modal-body">' +
                            '<div class="text-center">' + json['success'] + '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    var bg = '<div class="modal-backdrop fade in"></div>';

                    $j('body').after(bg);
                    $j('#notification').parent().before(outputVariable);





                    //$j('#notification').parent().before('<div class="preloader"><div class="success_ev" style="display: none;">' + json['success'] + '</div></div>');
                    //$j('.success_ev').fadeIn('slow');

                }

                $j('#wishlist-total span.text').html(json['total']);
                $j('#wishlist-total').attr('title', json['total']);

                $j('#wishlist-total-2').html(json['total']);
                $j('#wishlist-total-2').attr('title', json['total']);

                //setTimeout(function(){
                    //jQuery('.success_ev').fadeOut();
                    //jQuery('.preloader').remove();
                //},1500)

                $j( ".close" ).click(function() {
                    $j('.modal-window').remove();
                    $j('.modal-backdrop').remove();

                });



                //$j('html, body').animate({ scrollTop: 0 }, 'slow');
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function() {

    }
}

var compare_theme = {
    'add': function(product_id) {
        $.ajax({
            url: 'index.php?route=product/compare/add',
            type: 'post',
            data: 'product_id=' + product_id,
            dataType: 'json',
            success: function(json) {
                $j('.alert').remove();
                $j('.mfp-close').click();

                if (json['success']) {
                    var outputVariable =
                        '<div class="modal modal-window fade in" id="modalAddToCart" tabindex="-1" role="dialog" aria-label="myModalLabel" aria-hidden="true" style="display: block; padding-right: 17px;">' +
                            '<div class="modal-dialog white-modal modal-sm">' +
                            '<div class="modal-content ">' +
                            '<div class="modal-header">' +
                            '<button type="button" class="close"><span class="icon icon-clear"></span></button>' +
                            '</div>' +
                            '<div class="modal-body">' +
                            '<div class="text-center">' + json['success'] + '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    var bg = '<div class="modal-backdrop fade in"></div>';

                    $j('body').after(bg);
                    $j('#notification').parent().before(outputVariable);

                    $j('#compare-total').html(json['total']);

                    $j( ".close" ).click(function() {
                        $j('.modal-window').remove();
                        $j('.modal-backdrop').remove();

                    });
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function() {

    }
};

$ = jQuery.noConflict();