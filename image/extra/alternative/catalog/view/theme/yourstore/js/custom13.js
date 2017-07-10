

"use strict";

function getURLVar(key) {
    var value = [];

    var query = String(document.location).split('?');

    if (query[1]) {
        var part = query[1].split('&');

        for (i = 0; i < part.length; i++) {
            var data = part[i].split('=');

            if (data[0] && data[1]) {
                value[data[0]] = data[1];
            }
        }

        if (value[key]) {
            return value[key];
        } else {
            return '';
        }
    }
}

$(document).ready(function() {
    // Highlight any found errors
    $('.text-danger').each(function() {
        var element = $(this).parent().parent();

        if (element.hasClass('form-group')) {
            element.addClass('has-error');
        }
    });

    // Currency
    $('#form-currency .currency-select').on('click', function(e) {
        e.preventDefault();

        $('#form-currency input[name=\'code\']').val($(this).attr('name'));

        $('#form-currency').submit();
    });

    // Language
    $('#form-language .language-select').on('click', function(e) {
        e.preventDefault();

        $('#form-language input[name=\'code\']').val($(this).attr('name'));

        $('#form-language').submit();
    });

    /* Search */
    $('#search input[name=\'search\']').parent().find('button').on('click', function() {
        var url = $('base').attr('href') + 'index.php?route=product/search';

        var value = $('header #search input[name=\'search\']').val();

        if (value) {
            url += '&search=' + encodeURIComponent(value);
        }

        location = url;
    });

    $('#search input[name=\'search\']').on('keydown', function(e) {
        if (e.keyCode == 13) {
            $('header #search input[name=\'search\']').parent().find('button').trigger('click');
        }
    });

    // Menu
    $('#menu .dropdown-menu').each(function() {
        var menu = $('#menu').offset();
        var dropdown = $(this).parent().offset();

        var i = (dropdown.left + $(this).outerWidth()) - (menu.left + $('#menu').outerWidth());

        if (i > 0) {
            $(this).css('margin-left', '-' + (i + 10) + 'px');
        }
    });

    // Product List
    $('#list-view').click(function() {
        $('#content .product-grid > .clearfix').remove();

        $('#content .row > .product-grid').attr('class', 'product-layout product-list col-xs-12');
        $('#grid-view').removeClass('active');
        $('#list-view').addClass('active');

        localStorage.setItem('display', 'list');
    });

    // Product Grid
    $('#grid-view').click(function() {
        // What a shame bootstrap does not take into account dynamically loaded columns
        var cols = $('#column-right, #column-left').length;

        if (cols == 2) {
            $('#content .product-list').attr('class', 'product-layout product-grid col-lg-6 col-md-6 col-sm-12 col-xs-12');
        } else if (cols == 1) {
            $('#content .product-list').attr('class', 'product-layout product-grid col-lg-4 col-md-4 col-sm-6 col-xs-12');
        } else {
            $('#content .product-list').attr('class', 'product-layout product-grid col-lg-3 col-md-3 col-sm-6 col-xs-12');
        }

        $('#list-view').removeClass('active');
        $('#grid-view').addClass('active');

        localStorage.setItem('display', 'grid');
    });

    if (localStorage.getItem('display') == 'list') {
        $('#list-view').trigger('click');
        $('#list-view').addClass('active');
    } else {
        $('#grid-view').trigger('click');
        $('#grid-view').addClass('active');
    }

    // Checkout
    $(document).on('keydown', '#collapse-checkout-option input[name=\'email\'], #collapse-checkout-option input[name=\'password\']', function(e) {
        if (e.keyCode == 13) {
            $('#collapse-checkout-option #button-login').trigger('click');
        }
    });

    // tooltips on hover
    $('[data-toggle=\'tooltip\']').tooltip({container: 'body'});

    // Makes tooltips work on ajax generated content
    $(document).ajaxStop(function() {
        $('[data-toggle=\'tooltip\']').tooltip({container: 'body'});
    });
});

// Cart add remove functions
var cart = {
    'add': function(product_id, quantity) {
        $.ajax({
            url: 'index.php?route=checkout/cart/add',
            type: 'post',
            data: 'product_id=' + product_id + '&quantity=' + (typeof(quantity) != 'undefined' ? quantity : 1),
            dataType: 'json',
            beforeSend: function() {
                $('#cart > button').button('loading');
            },
            complete: function() {
                $('#cart > button').button('reset');
            },
            success: function(json) {
                $('.alert, .text-danger').remove();

                if (json['redirect']) {
                    location = json['redirect'];
                }

                if (json['success']) {
                    $('#content').parent().before('<div class="alert alert-success"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');

                    // Need to set timeout otherwise it wont update the total
                    setTimeout(function () {
                        $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                    }, 100);

                    $('html, body').animate({ scrollTop: 0 }, 'slow');

                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
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
                $('#cart > button').button('loading');
            },
            complete: function() {
                $('#cart > button').button('reset');
            },
            success: function(json) {
                // Need to set timeout otherwise it wont update the total
                setTimeout(function () {
                    $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
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
                $('#cart > button').button('loading');
            },
            complete: function() {
                $('#cart > button').button('reset');
            },
            success: function(json) {
                // Need to set timeout otherwise it wont update the total
                setTimeout(function () {
                    $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

var voucher = {
    'add': function() {

    },
    'remove': function(key) {
        $.ajax({
            url: 'index.php?route=checkout/cart/remove',
            type: 'post',
            data: 'key=' + key,
            dataType: 'json',
            beforeSend: function() {
                $('#cart > button').button('loading');
            },
            complete: function() {
                $('#cart > button').button('reset');
            },
            success: function(json) {
                // Need to set timeout otherwise it wont update the total
                setTimeout(function () {
                    $('#cart > button').html('<span id="cart-total"><i class="fa fa-shopping-cart"></i> ' + json['total'] + '</span>');
                }, 100);

                if (getURLVar('route') == 'checkout/cart' || getURLVar('route') == 'checkout/checkout') {
                    location = 'index.php?route=checkout/cart';
                } else {
                    $('#cart > ul').load('index.php?route=common/cart/info ul li');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    }
}

var wishlist = {
    'add': function(product_id) {
        $.ajax({
            url: 'index.php?route=account/wishlist/add',
            type: 'post',
            data: 'product_id=' + product_id,
            dataType: 'json',
            success: function(json) {
                $('.alert').remove();

                if (json['redirect']) {
                    location = json['redirect'];
                }

                if (json['success']) {
                    $('#content').parent().before('<div class="alert alert-success"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');
                }

                $('#wishlist-total span').html(json['total']);
                $('#wishlist-total').attr('title', json['total']);

                $('html, body').animate({ scrollTop: 0 }, 'slow');
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function() {

    }
}

var compare = {
    'add': function(product_id) {
        $.ajax({
            url: 'index.php?route=product/compare/add',
            type: 'post',
            data: 'product_id=' + product_id,
            dataType: 'json',
            success: function(json) {
                $('.alert').remove();

                if (json['success']) {
                    $('#content').parent().before('<div class="alert alert-success"><i class="fa fa-check-circle"></i> ' + json['success'] + ' <button type="button" class="close" data-dismiss="alert">&times;</button></div>');

                    $('#compare-total').html(json['total']);

                    $('html, body').animate({ scrollTop: 0 }, 'slow');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },
    'remove': function() {

    }
}

/* Agree to Terms */
$(document).delegate('.agree', 'click', function(e) {
    e.preventDefault();

    $('#modal-agree').remove();

    var element = this;

    $.ajax({
        url: $(element).attr('href'),
        type: 'get',
        dataType: 'html',
        success: function(data) {
            html  = '<div id="modal-agree" class="modal">';
            html += '  <div class="modal-dialog">';
            html += '    <div class="modal-content">';
            html += '      <div class="modal-header">';
            html += '        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>';
            html += '        <h4 class="modal-title">' + $(element).text() + '</h4>';
            html += '      </div>';
            html += '      <div class="modal-body">' + data + '</div>';
            html += '    </div';
            html += '  </div>';
            html += '</div>';

            $('body').append(html);

            $('#modal-agree').modal('show');
        }
    });
});

// Autocomplete */
(function($) {
    $.fn.autocomplete = function(option) {
        return this.each(function() {
            this.timer = null;
            this.items = new Array();

            $.extend(this, option);

            $(this).attr('autocomplete', 'off');

            // Focus
            $(this).on('focus', function() {
                this.request();
            });

            // Blur
            $(this).on('blur', function() {
                setTimeout(function(object) {
                    object.hide();
                }, 200, this);
            });

            // Keydown
            $(this).on('keydown', function(event) {
                switch(event.keyCode) {
                    case 27: // escape
                        this.hide();
                        break;
                    default:
                        this.request();
                        break;
                }
            });

            // Click
            this.click = function(event) {
                event.preventDefault();

                value = $(event.target).parent().attr('data-value');

                if (value && this.items[value]) {
                    this.select(this.items[value]);
                }
            }

            // Show
            this.show = function() {
                var pos = $(this).position();

                $(this).siblings('ul.dropdown-menu').css({
                    top: pos.top + $(this).outerHeight(),
                    left: pos.left
                });

                $(this).siblings('ul.dropdown-menu').show();
            }

            // Hide
            this.hide = function() {
                $(this).siblings('ul.dropdown-menu').hide();
            }

            // Request
            this.request = function() {
                clearTimeout(this.timer);

                this.timer = setTimeout(function(object) {
                    object.source($(object).val(), $.proxy(object.response, object));
                }, 200, this);
            }

            // Response
            this.response = function(json) {
                html = '';

                if (json.length) {
                    for (i = 0; i < json.length; i++) {
                        this.items[json[i]['value']] = json[i];
                    }

                    for (i = 0; i < json.length; i++) {
                        if (!json[i]['category']) {
                            html += '<li data-value="' + json[i]['value'] + '"><a href="#">' + json[i]['label'] + '</a></li>';
                        }
                    }

                    // Get all the ones with a categories
                    var category = new Array();

                    for (i = 0; i < json.length; i++) {
                        if (json[i]['category']) {
                            if (!category[json[i]['category']]) {
                                category[json[i]['category']] = new Array();
                                category[json[i]['category']]['name'] = json[i]['category'];
                                category[json[i]['category']]['item'] = new Array();
                            }

                            category[json[i]['category']]['item'].push(json[i]);
                        }
                    }

                    for (i in category) {
                        html += '<li class="dropdown-header">' + category[i]['name'] + '</li>';

                        for (j = 0; j < category[i]['item'].length; j++) {
                            html += '<li data-value="' + category[i]['item'][j]['value'] + '"><a href="#">&nbsp;&nbsp;&nbsp;' + category[i]['item'][j]['label'] + '</a></li>';
                        }
                    }
                }

                if (html) {
                    this.show();
                } else {
                    this.hide();
                }

                $(this).siblings('ul.dropdown-menu').html(html);
            }

            $(this).after('<ul class="dropdown-menu"></ul>');
            $(this).siblings('ul.dropdown-menu').delegate('a', 'click', $.proxy(this.click, this));

        });
    }
})(window.jQuery);


// Generated by CoffeeScript 1.9.3
(function(){var e;e=function(){function e(e,t){var n,r;this.options={target:"instafeed",get:"popular",resolution:"thumbnail",sortBy:"none",links:!0,mock:!1,useHttp:!1};if(typeof e=="object")for(n in e)r=e[n],this.options[n]=r;this.context=t!=null?t:this,this.unique=this._genKey()}return e.prototype.hasNext=function(){return typeof this.context.nextUrl=="string"&&this.context.nextUrl.length>0},e.prototype.next=function(){return this.hasNext()?this.run(this.context.nextUrl):!1},e.prototype.run=function(t){var n,r,i;if(typeof this.options.clientId!="string"&&typeof this.options.accessToken!="string")throw new Error("Missing clientId or accessToken.");if(typeof this.options.accessToken!="string"&&typeof this.options.clientId!="string")throw new Error("Missing clientId or accessToken.");return this.options.before!=null&&typeof this.options.before=="function"&&this.options.before.call(this),typeof document!="undefined"&&document!==null&&(i=document.createElement("script"),i.id="instafeed-fetcher",i.src=t||this._buildUrl(),n=document.getElementsByTagName("head"),n[0].appendChild(i),r="instafeedCache"+this.unique,window[r]=new e(this.options,this),window[r].unique=this.unique),!0},e.prototype.parse=function(e){var t,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w,E,S,x,T,N,C,k,L,A,O,M,_,D;if(typeof e!="object"){if(this.options.error!=null&&typeof this.options.error=="function")return this.options.error.call(this,"Invalid JSON data"),!1;throw new Error("Invalid JSON response")}if(e.meta.code!==200){if(this.options.error!=null&&typeof this.options.error=="function")return this.options.error.call(this,e.meta.error_message),!1;throw new Error("Error from Instagram: "+e.meta.error_message)}if(e.data.length===0){if(this.options.error!=null&&typeof this.options.error=="function")return this.options.error.call(this,"No images were returned from Instagram"),!1;throw new Error("No images were returned from Instagram")}this.options.success!=null&&typeof this.options.success=="function"&&this.options.success.call(this,e),this.context.nextUrl="",e.pagination!=null&&(this.context.nextUrl=e.pagination.next_url);if(this.options.sortBy!=="none"){this.options.sortBy==="random"?M=["","random"]:M=this.options.sortBy.split("-"),O=M[0]==="least"?!0:!1;switch(M[1]){case"random":e.data.sort(function(){return.5-Math.random()});break;case"recent":e.data=this._sortBy(e.data,"created_time",O);break;case"liked":e.data=this._sortBy(e.data,"likes.count",O);break;case"commented":e.data=this._sortBy(e.data,"comments.count",O);break;default:throw new Error("Invalid option for sortBy: '"+this.options.sortBy+"'.")}}if(typeof document!="undefined"&&document!==null&&this.options.mock===!1){m=e.data,A=parseInt(this.options.limit,10),this.options.limit!=null&&m.length>A&&(m=m.slice(0,A)),u=document.createDocumentFragment(),this.options.filter!=null&&typeof this.options.filter=="function"&&(m=this._filter(m,this.options.filter));if(this.options.template!=null&&typeof this.options.template=="string"){f="",d="",w="",D=document.createElement("div");for(c=0,N=m.length;c<N;c++){h=m[c],p=h.images[this.options.resolution];if(typeof p!="object")throw o="No image found for resolution: "+this.options.resolution+".",new Error(o);E=p.width,y=p.height,b="square",E>y&&(b="landscape"),E<y&&(b="portrait"),v=p.url,l=window.location.protocol.indexOf("http")>=0,l&&!this.options.useHttp&&(v=v.replace(/https?:\/\//,"//")),d=this._makeTemplate(this.options.template,{model:h,id:h.id,link:h.link,type:h.type,image:v,width:E,height:y,orientation:b,caption:this._getObjectProperty(h,"caption.text"),likes:h.likes.count,comments:h.comments.count,location:this._getObjectProperty(h,"location.name")}),f+=d}D.innerHTML=f,i=[],r=0,n=D.childNodes.length;while(r<n)i.push(D.childNodes[r]),r+=1;for(x=0,C=i.length;x<C;x++)L=i[x],u.appendChild(L)}else for(T=0,k=m.length;T<k;T++){h=m[T],g=document.createElement("img"),p=h.images[this.options.resolution];if(typeof p!="object")throw o="No image found for resolution: "+this.options.resolution+".",new Error(o);v=p.url,l=window.location.protocol.indexOf("http")>=0,l&&!this.options.useHttp&&(v=v.replace(/https?:\/\//,"//")),g.src=v,this.options.links===!0?(t=document.createElement("a"),t.href=h.link,t.appendChild(g),u.appendChild(t)):u.appendChild(g)}_=this.options.target,typeof _=="string"&&(_=document.getElementById(_));if(_==null)throw o='No element with id="'+this.options.target+'" on page.',new Error(o);_.appendChild(u),a=document.getElementsByTagName("head")[0],a.removeChild(document.getElementById("instafeed-fetcher")),S="instafeedCache"+this.unique,window[S]=void 0;try{delete window[S]}catch(P){s=P}}return this.options.after!=null&&typeof this.options.after=="function"&&this.options.after.call(this),!0},e.prototype._buildUrl=function(){var e,t,n;e="https://api.instagram.com/v1";switch(this.options.get){case"popular":t="media/popular";break;case"tagged":if(!this.options.tagName)throw new Error("No tag name specified. Use the 'tagName' option.");t="tags/"+this.options.tagName+"/media/recent";break;case"location":if(!this.options.locationId)throw new Error("No location specified. Use the 'locationId' option.");t="locations/"+this.options.locationId+"/media/recent";break;case"user":if(!this.options.userId)throw new Error("No user specified. Use the 'userId' option.");t="users/"+this.options.userId+"/media/recent";break;default:throw new Error("Invalid option for get: '"+this.options.get+"'.")}return n=e+"/"+t,this.options.accessToken!=null?n+="?access_token="+this.options.accessToken:n+="?client_id="+this.options.clientId,this.options.limit!=null&&(n+="&count="+this.options.limit),n+="&callback=instafeedCache"+this.unique+".parse",n},e.prototype._genKey=function(){var e;return e=function(){return((1+Math.random())*65536|0).toString(16).substring(1)},""+e()+e()+e()+e()},e.prototype._makeTemplate=function(e,t){var n,r,i,s,o;r=/(?:\{{2})([\w\[\]\.]+)(?:\}{2})/,n=e;while(r.test(n))s=n.match(r)[1],o=(i=this._getObjectProperty(t,s))!=null?i:"",n=n.replace(r,""+o);return n},e.prototype._getObjectProperty=function(e,t){var n,r;t=t.replace(/\[(\w+)\]/g,".$1"),r=t.split(".");while(r.length){n=r.shift();if(!(e!=null&&n in e))return null;e=e[n]}return e},e.prototype._sortBy=function(e,t,n){var r;return r=function(e,r){var i,s;return i=this._getObjectProperty(e,t),s=this._getObjectProperty(r,t),n?i>s?1:-1:i<s?1:-1},e.sort(r.bind(this)),e},e.prototype._filter=function(e,t){var n,r,i,s,o;n=[],r=function(e){if(t(e))return n.push(e)};for(i=0,o=e.length;i<o;i++)s=e[i],r(s);return n},e}(),function(e,t){return typeof define=="function"&&define.amd?define([],t):typeof module=="object"&&module.exports?module.exports=t():e.Instafeed=t()}(this,function(){return e})}).call(this);






	var $j = jQuery.noConflict();

	
// 	Uncommenting these lines if prototype.js is used

// if (Prototype.BrowserFeatures.ElementExtensions) {  
//     var disablePrototypeJS = function (method, pluginsToDisable) {
//             var handler = function (event) {
//                 event.target[method] = undefined;
//                 setTimeout(function () {
//                     delete event.target[method];
//                 }, 0);
//             };
//             pluginsToDisable.each(function (plugin) { 
//                 jQuery(window).on(method + '.bs.' + plugin, handler);
//             });
//         },
//     pluginsToDisable = ['collapse', 'dropdown', 'modal', 'tooltip', 'popover', 'tab'];
//     disablePrototypeJS('show', pluginsToDisable);
//     disablePrototypeJS('hide', pluginsToDisable);
// }


	function debouncer(func, timeout) {
	    var timeoutID, timeout = timeout || 500;
	    return function() {
	        var scope = this,
	            args = arguments;
	        clearTimeout(timeoutID);
	        timeoutID = setTimeout(function() {
	            func.apply(scope, Array.prototype.slice.call(args));
	        }, timeout);
	    }
	}
	
	
	// Compare

	function compareSlideIni(){
	    if ($j("#compareSlide").length > 0) {
	        $j('.compare-link').on('click', function(e){
				$j("#compareSlide").toggleClass('open');
				e.preventDefault();
			});
			 $j('.compareSlide__close').on('click', function(e){
				$j("#compareSlide").toggleClass('open');
				e.preventDefault();
			});
	    }	
	}

	// placeholder

	$j(function() {
	    $j('[placeholder]').focus(function() {
	        var input = $j(this);
	        if (input.val() == input.attr('placeholder')) {
	            input.val('');
	            input.removeClass('placeholder');
	        }
	    }).blur(function() {
	        var input = $j(this);
	        if (input.val() == '' || input.val() == input.attr('placeholder')) {
	            input.addClass('placeholder');
	            input.val(input.attr('placeholder'));
	        }
	    }).blur();
	    $j('[placeholder]').parents('form').submit(function() {
	        $j(this).find('[placeholder]').each(function() {
	            var input = $j(this);
	            if (input.val() == input.attr('placeholder')) {
	                input.val('');
	            }
	        })
	    });
	});

	// Cart	

	function cartSlideIni(){
	    if ($j("header .cart").length > 0) {
	        $j('header .cart .dropdown-toggle').on('click', function(e){
				$j("header .cart .dropdown").toggleClass('open');
				headerCartSize();
				e.preventDefault();
			});
			 $j('header .cart .cart__close').on('click', function(e){
				$j("header .cart .dropdown").toggleClass('open');
				e.preventDefault();
			});						
	    }
	}
	var $cart = $j(".cart");
	$j(window).resize(headerCartSize);
	function headerCartSize() {
        var $cart = $j(".cart");
        if ($cart.length) {
          $cart.find(".dropdown-menu").scrollTop(0)
		cartHeight();
	  }
	}
	function cartHeight(){
        var $cart = $j(".cart");
        var $obj = $cart.find(".dropdown-menu");
	  var w_height = window.innerHeight;
	  var o_height = $obj.outerHeight();
	  var delta = parseInt(w_height - o_height);
        if(delta < 0) {
		$obj.css({"max-height": o_height + delta, "overflow": "auto", "overflow-x": "hidden" });
	  }
	}

	//
	function changeInputNameCartPage() {
      var name= "updates[]";
      if ($j(window).width() > 767) {
        $j(".input-mobile").attr("name", "");
        $j(".input-desktop").attr("name", name);
      }
      else {
        $j(".input-mobile").attr("name", name);
        $j(".input-desktop").attr("name", "");
      }
    }
    if ($j(".input-mobile").length && $j(".input-desktop").length ) {
      changeInputNameCartPage();
      $j(window).resize(changeInputNameCartPage);
    }



	// Slide Column  $j('.slide-column-close').trigger('click');	
     function slideColumn(){
      if ($j('#leftColumn').length > 0) {
        $j(window).resize(function(){
          if(window.innerWidth < 992 ) {
           filtersHeight();
          } else {
           $j('#leftColumn').removeAttr('style');
          }
        });

        
       $j('.slide-column-close').addClass('position-fix');
        $j('.slide-column-open').on('click', function(e){
          e.preventDefault();
          $j('#leftColumn').addClass('column-open');
          $j('body').css("top", -$j('body').scrollTop());         
          $j('body').addClass("no-scroll").append( '<div class="modal-filter"></div>');	
          if ($j(".modal-filter").length > 0) {	        	
			  $j(".modal-filter").click(function(){
			   $j('.slide-column-close').trigger('click');
			  })
			} 
        });
        $j('.slide-column-close').on('click', function(e){
          e.preventDefault();
          $j("#leftColumn").removeClass('column-open');
          var top = parseInt($j('body').css("top").replace("px", ""))*-1;
          $j('body').removeAttr("style");
          $j('body').removeClass("no-scroll");
          $j('body').scrollTop(top);
          $j(".modal-filter").unbind();
          $j(".modal-filter").remove();
        });
      }

    }
	
    function filtersHeight(){
      var $obj = $j('#leftColumn');
      var w_height = window.innerHeight;
      var o_height = $obj.outerHeight();
      var delta = parseInt(w_height - o_height);
      if(delta < 0) {
        $obj.css({"max-height": o_height + delta, "overflow": "auto", "overflow-x": "hidden" });
      }
    }

	
	
	// Countdown

	function countDown(){
	    if ($j("#countdown1").length > 0) {
	        $j('#countdown1').countdown({
	            until: new Date(2016, 12, 10)
	        });
	    }	
	}

	// input-counter

	function inputCounter(){
	    if ($j(".input-counter").length > 0) {
	        $j('.minus-btn').click(function () {
                var $jinput = $j(this).parent().find('input');
                var count = parseInt($jinput.val()) - 1;
                count = count < 1 ? 1 : count;
                $jinput.val(count);
                $jinput.change();
                return false;
            });
            $j('.plus-btn').click(function () {
                var $jinput = $j(this).parent().find('input');
                $jinput.val(parseInt($jinput.val()) + 1);
                $jinput.change();
                return false;
            });
	    }	
	}

	//slider on product-fields
	function sliderNoZoom(){
	   if ($j(".slider-no-zoom").length > 0) {
	  		$j('.slider-product-large').slick({
				  slidesToShow: 1,
				  slidesToScroll: 1,
				  arrows: false,
				  fade: true,
				   centerPadding: '40px',
				   infinite: true,
				  asNavFor: '.slider-product-small'
				});
				$j('.slider-product-small').slick({
				  slidesToShow: 4,
				  slidesToScroll: 1,
				  infinite: true,
				  asNavFor: '.slider-product-large',
				  dots: true,
				 centerPadding: '40px',
				  focusOnSelect: true
				});
	}		    
	}
	
	
	//mobile menu 
/*
	jQuery(function($) {
		  if ($j("#off-canvas-menu").length > 0) {
			"use strict";
		    $j(document).bind('cbox_open', function() {
		        $j('html').css({
		            overflow: 'hidden'
		        });
		    }).bind('cbox_closed', function() {
		        $j('html').css({
		            overflow: ''
		        });
		    });


		    // check if RTL mode
		    var colorBoxMenuPosL = ($j("body").hasClass('rtl')) ? 'none' : '0';
		    var colorBoxMenuPosR = ($j("body").hasClass('rtl')) ? '0' : 'none';

		    $j(".off-canvas-menu-toggle").colorbox({
		        inline: true,
		        opacity: 0.55,
		        transition: "none",
		        arrowKey: false,
		        width: "300",
		        height: "100%",
		        fixed: true,
		        className: 'canvas-menu',
		        top: 0,
		        right: colorBoxMenuPosR,
		        left: colorBoxMenuPosL,
		        colorBoxCartPos: 0,
                close:'7777'
		    })

		}

	});

    */
	$j(window).resize(function(){
	  var $cboxClose = $j("#cboxClose");
	  if($cboxClose.length && window.innerWidth > 1024 ) {
	    $j("#cboxClose").trigger("click");
	  }
	})


	




		jQuery(function($j) {
	    "use strict";
	    $j("#off-canvas-menu .expander-list").find("ul").hide().end().find(" .expander").text("+").end().find(".active").each(function() {
	        $j(this).parents("li ").each(function() {
	            var $jthis = $j(this),
	                $jul = $jthis.find("> ul"),
	                
	                $jexpander = $jthis.find("> .name .expander");
	            $jul.show();
	         
	            $jexpander.html("&minus;")
	        })
	    }).end().find(" .expander").each(function() {
	        var $jthis = $j(this),
	            hide = $jthis.text() === "+",
	            $jul = $jthis.parent(".name").next("ul"),
	            $jname = $jthis.next("a");
	        $jthis.click(function() {
	            if ($jul.css("display") ==
	                "block") $jul.slideUp("slow");
	            else $jul.slideDown("slow");
	            $j(this).html(hide ? "&minus;" : "+");	            
	            hide = !hide
	        })
	    })
	});






	//end mobile
				

	// Product Carousel
	
	function productCarousel(carousel,numberXl,numberLg,numberMd,numberSm,numberXs) {

		var windowW = window.innerWidth || $j(window).width();

		var slidesToShowXl = (numberXl > 0) ? numberXl : 6;
		var slidesToShowLg = (numberLg > 0) ? numberLg : 4;
		var slidesToShowMd = (numberMd > 0) ? numberMd : numberLg;
		var slidesToShowSm = (numberSm > 0) ? numberSm : numberMd;
		var slidesToShowXs = (numberXs > 0) ? numberXs : 1;
		
		var carousel = carousel;
		var speed = 500;
			
		if (carousel.parent().find('.carousel-products__button').length > 0) {
	
				carousel.slick({
						prevArrow: carousel.parent().find('.carousel-products__button .btn-prev'),
						nextArrow: carousel.parent().find('.carousel-products__button .btn-next'),
						dots: true,
						slidesToShow: slidesToShowXl,
						slidesToScroll: slidesToShowXl,
						responsive: [{
							breakpoint: 1770,
							settings: {
								slidesToShow: slidesToShowLg,
								slidesToScroll: slidesToShowLg
							}
						},{
							breakpoint: 992,
							settings: {
								slidesToShow: slidesToShowMd,
								slidesToScroll: slidesToShowMd
							}
						}, {
							breakpoint: 768,
							settings: {
								slidesToShow: slidesToShowSm,
								slidesToScroll: slidesToShowSm
							}
						}, {
							breakpoint: 480,
							settings: {
								slidesToShow: slidesToShowXs,
								slidesToScroll: slidesToShowXs
							}
						}]
					});
			}
			else {
				carousel.slick({
					slidesToShow: slidesToShowXl,
					slidesToScroll: 1,
					speed: speed,
						responsive: [{
							breakpoint: 1770,
							settings: {
								slidesToShow: slidesToShowLg,
								slidesToScroll: slidesToShowLg
							}
						},{
							breakpoint: 992,
							settings: {
								slidesToShow: slidesToShowMd,
								slidesToScroll: slidesToShowMd
							}
						}, {
							breakpoint: 768,
							settings: {
								slidesToShow: slidesToShowSm,
								slidesToScroll: slidesToShowSm
							}
						}, {
							breakpoint: 480,
							settings: {
								slidesToShow: slidesToShowXs,
								slidesToScroll: slidesToShowXs
							}
						}]
				});
			}
		

		fixCarouselHover(carousel);

	};
	// Product productBigCarousel
	
	function productBigCarousel(carousel,numberXl,numberLg,numberMd,numberSm,numberXs) {

		var windowW = window.innerWidth || $j(window).width();

		var slidesToShowXl = (numberXl > 0) ? numberXl : 6;
		var slidesToShowLg = (numberLg > 0) ? numberLg : 4;
		var slidesToShowMd = (numberMd > 0) ? numberMd : numberLg;
		var slidesToShowSm = (numberSm > 0) ? numberSm : numberMd;
		var slidesToShowXs = (numberXs > 0) ? numberXs : 1;
		
		var carousel = carousel;
		var speed = 500;
			
		if (carousel.parent().find('.carousel-products__button').length > 0) {
	
				carousel.slick({
						prevArrow: carousel.parent().find('.carousel-products__button .btn-prev'),
						nextArrow: carousel.parent().find('.carousel-products__button .btn-next'),
						dots: true,
						slidesToShow: slidesToShowXl,
						slidesToScroll: slidesToShowXl,
						responsive: [{
							breakpoint: 1770,
							settings: {
								slidesToShow: slidesToShowLg,
								slidesToScroll: slidesToShowXs
							}
						},{
							breakpoint: 992,
							settings: {
								slidesToShow: slidesToShowMd,
								slidesToScroll: slidesToShowXs
							}
						}, {
							breakpoint: 768,
							settings: {
								slidesToShow: slidesToShowSm,
								slidesToScroll: slidesToShowXs
							}
						}, {
							breakpoint: 480,
							settings: {
								slidesToShow: slidesToShowXs,
								slidesToScroll: slidesToShowXs
							}
						}]
					});
			}
			else {
				carousel.slick({
					slidesToShow: slidesToShowXl,
					slidesToScroll: 1,
					speed: speed,
						responsive: [{
							breakpoint: 1770,
							settings: {
								slidesToShow: slidesToShowLg,
								slidesToScroll: slidesToShowXs
							}
						},{
							breakpoint: 992,
							settings: {
								slidesToShow: slidesToShowMd,
								slidesToScroll: slidesToShowXs
							}
						}, {
							breakpoint: 768,
							settings: {
								slidesToShow: slidesToShowSm,
								slidesToScroll: slidesToShowXs
							}
						}, {
							breakpoint: 480,
							settings: {
								slidesToShow: slidesToShowXs,
								slidesToScroll: slidesToShowXs
							}
						}]
				});
			}
		

		fixCarouselHover(carousel);

	};

	// Carousel Product Mobile only	
	
	function mobileOnlyCarousel() {

		var windowW = window.innerWidth || $j(window).width();
	
		var carouselMobileOnly = $j('.carousel-products-mobile');
		
		if (windowW < 480) {
			$j('.carousel-products-mobile').slick({
				slidesToShow: 1,
				slidesToScroll: 1
			});
		}
		$j(window).resize(debouncer(function(e) {
		
			var currentW = window.innerWidth || $j(window).width();
			
			if (currentW < 480) {
			  carouselMobileOnly.slick({
				slidesToShow: 1,
				slidesToScroll: 1
			});
			} else {
				if (carouselMobileOnly.hasClass('slick-initialized')){
					carouselMobileOnly.slick('unslick');
				}
			}
		}))
	};
	
	// Category carousel	
	
	function bannerCarousel(carousel) {
	    carousel.slick({
	        infinite: true,
	        dots: false,
	        slidesToShow: 3,
	        slidesToScroll: 3,
	        responsive: [{
				breakpoint: 768,
				settings: {
	                slidesToShow: 2,
	                slidesToScroll: 2
					}
				}, 
				{
	            breakpoint: 480,
	            settings: {
	                slidesToShow: 1,
	                slidesToScroll: 1
	            }
	        }]
	    });
	}	

	// Category carousel	
	
	function bannerCarouselShort(carousel) {
	    carousel.slick({
	        infinite: true,
	        dots: false,
	        slidesToShow: 3,
	        slidesToScroll: 3,
	        responsive: [{
				breakpoint: 1200,
				settings: {
	                slidesToShow: 2,
	                slidesToScroll: 2
					}
				}, 
				{
	            breakpoint: 480,
	            settings: {
	                slidesToShow: 1,
	                slidesToScroll: 1
	            }
	        }]
	    });
	}	
	
	// Blog carousel	
	
	
	function blogCarousel(carousel,numberXl,numberLg,numberMd,numberSm,numberXs) {

		var windowW = window.innerWidth || $j(window).width();

		var slidesToShowXl = (numberXl > 0) ? numberXl : 6;
		var slidesToShowLg = (numberLg > 0) ? numberLg : 4;
		var slidesToShowMd = (numberMd > 0) ? numberMd : numberLg;
		var slidesToShowSm = (numberSm > 0) ? numberSm : numberMd;
		var slidesToShowXs = (numberXs > 0) ? numberXs : 1;
		
		var carousel = carousel;
		var speed = 500;
			
		if (carousel.parent().find('.carousel-products__button').length > 0) {
	
				carousel.slick({
						prevArrow: carousel.parent().find('.carousel-products__button .btn-prev'),
						nextArrow: carousel.parent().find('.carousel-products__button .btn-next'),
						dots: false,
						infinite: true,
						slidesToShow: slidesToShowXl,
						slidesToScroll: slidesToShowXl,
						responsive: [{
							breakpoint: 1770,
							settings: {
								slidesToShow: slidesToShowLg,
								slidesToScroll: slidesToShowLg
							}
						},{
							breakpoint: 992,
							settings: {
								slidesToShow: slidesToShowMd,
								slidesToScroll: slidesToShowMd
							}
						}, {
							breakpoint: 768,
							settings: {
								slidesToShow: slidesToShowSm,
								slidesToScroll: slidesToShowSm
							}
						}, {
							breakpoint: 480,
							settings: {
								slidesToShow: slidesToShowXs,
								slidesToScroll: slidesToShowXs
							}
						}]
					});
			}
			else {
				carousel.slick({
					slidesToShow: slidesToShowXl,
					slidesToScroll: 1,
					speed: speed,
						responsive: [{
							breakpoint: 1770,
							settings: {
								slidesToShow: slidesToShowLg,
								slidesToScroll: slidesToShowLg
							}
						},{
							breakpoint: 992,
							settings: {
								slidesToShow: slidesToShowMd,
								slidesToScroll: slidesToShowMd
							}
						}, {
							breakpoint: 768,
							settings: {
								slidesToShow: slidesToShowSm,
								slidesToScroll: slidesToShowSm
							}
						}, {
							breakpoint: 480,
							settings: {
								slidesToShow: slidesToShowXs,
								slidesToScroll: slidesToShowXs
							}
						}]
				});
			}
		


	};

	// bannerAsid carousel	
	
	function bannerAsid(carousel) {
	    carousel.slick({
	        infinite: true,
	        dots: true,
	        arrows: false,
	        slidesToShow: 1,
	        slidesToScroll: 1
	    });
	}

	// bannerAsid carousel	
	
	function testimonialsAsid(carousel) {
	    carousel.slick({
	        infinite: true,
	        dots: true,
	        arrows: false,
	        slidesToShow: 1,
	        slidesToScroll: 1
	    });
	}

	
		
	// Brands carousel	
	
	function brandsCarousel(carousel) {
	    carousel.slick({
	        infinite: true,
	        dots: false,
	        slidesToShow: 10,
	        slidesToScroll: 10,
	        responsive: [{
				breakpoint: 1770,
				settings: {
	                slidesToShow: 6,
	                slidesToScroll: 6
					}
				},{
				breakpoint: 1199,
				settings: {
	                slidesToShow: 3,
	                slidesToScroll: 3
					}
				},{
				breakpoint: 768,
				settings: {
	                slidesToShow: 3,
	                slidesToScroll: 3
					}
				}, 
				{
	            breakpoint: 480,
	            settings: {
	                slidesToShow: 2,
	                slidesToScroll: 2
	            }
	        }]
	    });
	}
	
	// Vertical carousel	
	
	function verticalCarousel(carousel, slidesToShow) {
		var slidesToShow = (slidesToShow > 0) ? slidesToShow : 2;
	    carousel.slick({
	        infinite: false,
	        dots: false,
	        slidesToShow: slidesToShow,
	        slidesToScroll: slidesToShow,
			vertical: true
	    });
	}
	
	// Product thumbnails carousel
	
	function thumbnailsCarousel(carousel) {
		carousel.slick({
			infinite: false,
			dots: false,
			slidesToShow: 4,
			slidesToScroll: 1,
			responsive: [{
				breakpoint: 1200,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			}]
		});
	}
	
	// Fix z-index problem on carousel hover
	
	function fixCarouselHover(carousel) {
		carousel.find('.slick-slide').bind( "mouseenter mouseleave",
                function( event ){
                    $j(this).closest('.slick-slider').toggleClass('hover');
                }
        );			
	};
	
	// Elevate Zoom

	function elevateZoom() {

		var windowW = window.innerWidth || document.documentElement.clientWidth;
		$j('.product-zoom').imagesLoaded(function() {
		if ($j('.product-zoom').length) {

			   var zoomPosition
				if ( $j('html').css('direction').toLowerCase() == 'rtl' ) {
					zoomPosition = 11;					
				}
				else {
					zoomPosition = 1
				}


			if (windowW > 767) {
				$j('.product-zoom').elevateZoom({
					//zoomWindowHeight: $j('.product-zoom').height(), // if zoom container must be as image height
					zoomWindowWidth: $j('.product-zoom').width()- 60,
					zoomWindowHeight: $j('.product-zoom').width() - 60,
					gallery: "smallGallery",
					galleryActiveClass: 'active',
					zoomWindowPosition	: zoomPosition
				})

			} else {
				$j(".product-zoom").elevateZoom({
					gallery: "smallGallery",
					zoomType: "inner",
					galleryActiveClass: 'active',
					zoomWindowPosition	: zoomPosition
				});
			}
		}
		})
		
		
		$j('.product-main-image > .product-main-image__zoom ').bind('click', function(){
		
			
				galleryObj = [];
				current = 0;
				itemN = 0;
				
			if ($j('#smallGallery').length){
				console.log('1');
				$j('#smallGallery li a').not('.video-link').each(function() {
					if ($j(this).hasClass('active')) {
						current = itemN;
					}
					itemN++;
					var src = $j(this).data('zoom-image'),
						type = 'image';
						image = {};
						image ["src"] = src;
						image ["type"] = type;

					galleryObj.push(image);
				});
			}
			
			else {
				console.log('2');
					itemN++;
					var src = $j(this).parent().find('.product-zoom').data('zoom-image'),
						type = 'image';
						image = {};
						image ["src"] = src;
						image ["type"] = type;

					galleryObj.push(image);
			}

			$j.magnificPopup.open({
				items: galleryObj,
				gallery: {
					enabled: true,
				}
			}, current);
			
		});
		
		var  prevW = windowW;


		$j(window).resize(debouncer(function(e) {
			var currentW = window.innerWidth || $j(window).width();

			if (currentW != prevW) {
				// start resize events

				$j('.zoomContainer').remove();
				$j('.elevatezoom').removeData('elevateZoom');

				if ($j('.product-zoom').length) {
					if (currentW > 767) {
						$j('.product-zoom').elevateZoom({
							zoomWindowHeight: $j('.product-zoom').height(),
							gallery: "smallGallery"
						})
					} else {
						$j(".product-zoom").elevateZoom({
							gallery: "smallGallery",
							zoomType: "inner"
						});
					}
				}		
				
				
				// end resize events		
			}


			prevW = window.innerWidth || $j(window).width();


		}));
	}

	// Elevate Zoom

	function elevateZoom1() {
		var currentW = window.innerWidth || $j(window).width();
		if (currentW > 767) {
			if ($j('.bigGallery .product-zoom1').length) {
				 $j('.bigGallery .product-zoom1').elevateZoom({
				    zoomType: "inner",
					cursor: "crosshair",
					zoomWindowFadeIn: 300,
					zoomWindowFadeOut: 300
				}); 
			}
		}

	}
	
	// Set Product Size 

	function setProductSize() {
		
	    var windowW = window.innerWidth || $j(window).width();
		
	    if (windowW > 767) {
	        $j('.product').each(function() {
	            var productH = $j(this).outerHeight();
	            $j(this).css({
	                'min-height': productH + 'px'
	            });
	            $j(this).find('.product__inside').addClass('pos-abs');
	        });
	    }
	
	    $j(window).resize(function(e) {
	        $j('.product').each(function() {
	            $j(this).css({
	                'min-height': ''
	            })
	            $j(this).find('.product__inside__info').css({
	                'height': '0'
	            })
	            $j(this).find('.product__inside').removeClass('pos-abs');
	        })
			
			var timeout;
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				var currentW = window.innerWidth || $j(window).width();
				$j('.product').each(function() {
					$j(this).find('.product__inside__info').css({
						'height': ''
					});
					if (currentW > 767) {
						var productH = $j(this).outerHeight();
						$j(this).css({
							'min-height': productH + 'px'
						});
						$j(this).find('.product__inside').addClass('pos-abs');
					}
				});
			}, 1000);				
	    })
	};

	
	
	// menu click go URL
	
	function navbarClick() {
		
		var windowW = window.innerWidth || $j(window).width();
		// mobile menu off width
		if (windowW > 1025) {
			$j('.navbar .dropdown > a').on('click', function(){
				location.href = this.href;
				return false
			});
		}
		
	};
	

	// Set Product Page Prev-Next Arrows Position at center of the product image 

	function setProductArrows() {
		var windowW = window.innerWidth || $j(window).width();
		var setArrowPos = function(windowW) {
			if (windowW > 1199) {
				var imgH = $j('.product-main-image img').height();
				$j('#productPrevNext > a').css({'top': imgH/2 + 'px'});
			}
		}
		
		setArrowPos(windowW);
		
		$j(window).resize(debouncer(function(e) {
			var currentW = window.innerWidth || $j(window).width();
			setArrowPos(currentW);
		}))
	};

	
	// Set Mobile Carousel Arrows Position at center of the product image 

	function setCarouselArrows() {

	    var windowW = window.innerWidth || $j(window).width();
		
		var setArrowPos = function(windowW) {
			if (windowW < 480) {
				if ($j('.carousel-products-mobile.slick-initialized').length || $j('.carousel-products.slick-initialized').length){
					$j('.carousel-products-mobile').each(function() {
						var imgH = $j(this).find('.slick-list .slick-track .slick-slide:first-child img').height();
						$j(this).find('.slick-arrow').css({'top': imgH/2 + 'px'});
					})					
					$j('.carousel-products').each(function() {
						if ($j(this).parent().parent().find('.carousel-products__button').length > 0) {
							var imgH = $j(this).find('.slick-list .slick-track .slick-slide:first-child img').height();
							var titleH = $j(this).parent().parent().find('.title-with-button').height();
							$j(this).parent().parent().find('.carousel-products__button').css({'top': imgH/2 + titleH + 'px'});
						}
					})
				}
			} else {
				$j('.carousel-products').each(function() {
					if ($j(this).parent().parent().find('.carousel-products__button').length > 0) {
						$j(this).parent().parent().find('.carousel-products__button').css({'top': ''});
					}
					else {
						var imgH = $j(this).find('.slick-list .slick-track .slick-slide:first-child img').height();
						$j(this).find('.slick-arrow').css({'top': imgH/2 + 'px'});
					}
				})
			}		
		}
		
		setArrowPos(windowW);
		
		$j(window).resize(debouncer(function(e) {
			var currentW = window.innerWidth || $j(window).width();
			setArrowPos(currentW);
		}))
	};

	// Set mobile dropdowns width
	
	function setMobileDrop() {
	
	    var windowW = $j('body').innerWidth();
		
		var setDropsW;
		
		setDropsW = function(windowW) {
		// mobile menu off width
			if (windowW < 1025) {
				$j('.dropdown-menu--xs-full').each(function() {
					$j(this).css({'width': windowW + 'px'});
				})			
			}
			else {
				$j('.dropdown-menu--xs-full').each(function() {
					$j(this).css({'width': ''});
				})	
			}
		}
				
		setDropsW(windowW);
		
		$j(window).resize(debouncer(function(e) {
			var currentW = $j('body').innerWidth();
			setDropsW(currentW);
		}))
			
	};
	
	// DropDown Close
	
	function handlerDropDownClose() {
	
		$j('.dropdown-menu__close').on('click', function(e) {
			e.preventDefault();
			$j(this).closest('.dropdown.open .dropdown-toggle').dropdown('toggle');
		});
			
	};
	
	// Search DropDown
	
	function searchDropDown() {
	
		$j('.search__open').on('click', function(e) {
			e.preventDefault();
			$j(this).parent('.search').addClass('open');
			$j(this).next('#search-dropdown, .search-dropdown').addClass('open');
			$j('header .badge').addClass('badge--hidden');
		});		
		$j('.search__close').on('click', function(e) {
			e.preventDefault();
			$j(this).closest('.search').removeClass('open');
			$j(this).closest('#search-dropdown, .search-dropdown').removeClass('open');
			$j('header .badge').removeClass('badge--hidden');
		});
			
	};	
	
	// Mobile footer collapse

	function footerCollapse() {

		$j('.mobile-collapse__title').on('click', function(e) {
			e.preventDefault;
			$j(this).parent('.mobile-collapse').toggleClass('open');
		})

	};
	
	
	// Product inside carousel

	

	 function productInsideCarousel() {
	  $j(".product__inside__carousel").each(function () {
	            var $this = $j(this);
	   $this.carousel({
	    interval: false
	   })
	   $this.find('.carousel-control.next').on('click', function() {
	    $this.carousel('next');
	   });  
	   $this.find('.carousel-control.prev').on('click', function() {
	    $this.carousel('prev');
	   });
	  });
	 };
	
	// Category list collapse
	
	function expanderList() {
		$j('.expander-list .expander').each(function() {
			if ($j(this).parent('li').hasClass('active')){
				$j(this).next('ul').slideDown(0);
				$j(this).parent().addClass('open');
			}
		})
		$j(".expander-list .expander").on('click', function(e) {
			e.preventDefault;
			var speed = 300;
			var thisItem = $j(this).parent(),
				nextLevel = $j(this).next('ul');
			if (thisItem.hasClass('open')){
				thisItem.removeClass('open');
				nextLevel.slideUp(speed);
			}
			else {
				thisItem.addClass('open');
				nextLevel.slideDown(speed);
			}
		})
	};
	
	// Collapse Block (left column in listing)

	function collapseBlock() {
		$j('.collapse-block__content').each(function() {
			if ($j(this).parent('.collapse-block').hasClass('open')){
				$j(this).slideDown(0);
			}
		})
		$j('.collapse-block__title').on('click', function(e) {
			e.preventDefault;
			var speed = 300;
			var thisItem = $j(this).parent(),
				nextLevel = $j(this).next('.collapse-block__content');
			if (thisItem.hasClass('open')){
				thisItem.removeClass('open');
				nextLevel.slideUp(speed);
			}
			else {
				thisItem.addClass('open');
				nextLevel.slideDown(speed);
			}
		})
	};


	

	// Price Slider initialize

	function priceSlider() {

		if ($j('.price-slider').length) {
		
			var priceSlider = document.getElementById('priceSlider');

			noUiSlider.create(priceSlider, {
				start: [100, 900],
				connect: true,
				step: 1,
				range: {
					'min': 0,
					'max': 1000
				}
			});
			
			var inputPriceMax = document.getElementById('priceMax');
			var inputPriceMin = document.getElementById('priceMin');

			priceSlider.noUiSlider.on('update', function( values, handle ) {

				var value = values[handle];

				if ( handle ) {
					inputPriceMax.value = value;
				} else {
					inputPriceMin.value = value;
				}
			});

			inputPriceMax.addEventListener('change', function(){
				priceSlider.noUiSlider.set([null, this.value]);
			});			
			inputPriceMin.addEventListener('change', function(){
				priceSlider.noUiSlider.set([this.value, null]);
			});
		};
	}
	
	// Listing view mode

	function listingModeToggle() {		
		$j('a.link-row-view').on('click', function(e) {
			e.preventDefault();
			$j(this).addClass('active');
			$j('a.link-grid-view').removeClass('active');
			$j('.product-listing').addClass('row-view');
		})
		$j('a.link-grid-view').on('click', function(e) {
			e.preventDefault();
			$j(this).addClass('active');
			$j('a.link-row-view').removeClass('active');
			$j('.product-listing').removeClass('row-view');
		})
	}
	
	// Quick view

	// jQuery(function($j) {

		// "use strict";
		
		// $j('#quickView').on('hidden.bs.modal', function () {
		  // $j(this).removeData('bs.modal').find('.modal-content').empty();;
		// });
		
		// $j('.quick-view').on('click', function(e) {
				// console.log(url);
				// $j('#modalLoader-wrapper').show();
			// e.preventDefault();
			// var $jthis = $j(this),
				// url = $jthis.attr("href");

			// $j.ajax({
				// url: url,
				// cache: false,
				// success: function(data) {
					// var $jdata = $j(data);
					// $j('#quickview .modal-content').empty().append($jdata);
				// },
				// complete: function() {
					// setTimeout(function() {
					// $j('#modalLoader-wrapper').fadeOut();
						// $j('.product-images-carousel ul').on('init', function(e) {
								// $j('.product-images-carousel').addClass('loaded');
							// })
					// }, 1000);
				// },
				// error: function(jqXHR, textStatus, errorThrown) {
					// return false;
				// }
			// })
		// });
	// });
		
// Init for all template pages




//=========== back-to-top

function backToTop(){
    if ($j(".back-to-top").length > 0) {
        $j('.back-to-top').click(function() {
	        $j('html, body').animate({scrollTop: 0},500);
	        return false;
	      }) 

	     $j(window).scroll(function () {
	        if ( $j(window).scrollTop() > 500) {$j(".back-to-top").stop(true.false).fadeIn(110)}
	        else {$j(".back-to-top").stop(true.false).fadeOut(110)}
	    })
    }	
}


//=========== stuck-nav

var HeaderTop = '';
function stuckNav(){
  if ($j(".stuck-nav").length > 0) {
    HeaderTop = $j('.header-layout-02').length && window.innerWidth > 1024 ? $j('#pageContent').offset().top : $j('.stuck-nav').offset().top;
    $j(window).scroll(function(){
      checkStickyPosition();
      $j('.header-layout-02').length ? stickNav() : false;
    });
    $j(window).resize(function(){
      HeaderTop = $j('#pageContent').offset().top;
      checkStickyPosition();
      $j('.header-layout-02').length ? $j( '.stuck-nav' ).length && window.innerWidth <= 1024 ? $j( '.stuck-nav' ).show() : stickNav() : false;
    });
    checkStickyPosition();
  }
}
function checkStickyPosition(){
  $j(window).scrollTop() > HeaderTop ? $j('.stuck-nav').addClass('fixedbar') : $j('.stuck-nav').removeClass('fixedbar');
}
function stickNav() {
  if($j( '.stuck-nav' ).length && window.innerWidth > 1024) {
    $j( window ).scrollTop() > $j('#header').innerHeight() ? $j( '.stuck-nav' ).show() : $j( '.stuck-nav' ).hide();
  }
}


//=========== click on cart(header-layout-06)
jQuery(function($j) {

    "use strict";

     if ($j(".header-layout-06 ").length > 0) {
     	 $j(".header-layout-06 .icon-search").click(function() {
	        $j(".header-layout-06 .alignment-extra").toggleClass('width-extra');
	    });
	     $j(".header-layout-06 .icon-close").click(function() {
	        $j(".header-layout-06 .alignment-extra").toggleClass('width-extra');
	    });
     }

   
    
	
		

});



//=========== click on cart
jQuery(function($j) {

    "use strict";

    $j("header .cart").click(function() {
        $j("#slider").toggleClass('slider-button');
    });
	
	if ($j("html.touch").length > 0) {
		 $j(".product .product__inside__image a").click(function(event) {	       
	        event.preventDefault();
	    });	
	}
	

});




//=========== click on toggle-menu(icon toggle menu)
jQuery(function($j) {

    "use strict";

    if ($j('.toggle-menu').length) {
	    $j(".toggle-menu .icon, .toggle-menu .close").click(function() {
	        $j(".toggle-menu .dropdown-menu").fadeToggle(20);        
	    });
	}	    
	

});


// Image background

jQuery(function($j) {

    "use strict";
	if ($j('.image-bg').length) {
		$j('.image-bg').each(function() {
			var attr = $j(this).attr('data-image');		
			$j(this).css({'background-image': 'url('+attr+')'});
		})
	}

});

// show newsletter Modal
/*
jQuery(function($j) {

    "use strict";
	if ($j('#newsletterModal').length) {
		var pause = $j('#newsletterModal').attr('data-pause');
		setTimeout(function() {
			$j('#newsletterModal').modal('show');
		}, pause);
	}

})
*/


// Parallax

jQuery(function($j) {

    "use strict";
    if ($j('.content--parallax, .carusel--parallax').length) {
		$j('.content--parallax, .carusel--parallax').each(function() {
			var attr = $j(this).attr('data-image');		
			$j(this).css({'background-image': 'url('+attr+')'});
		})
	}
	
	
});








// Blog carousel
function blogPostSlider(){
	"use strict";
    if ($j(".blogPostSlider").length > 0) {
        $j('.blogPostSlider').slick({
		  infinite: true,
		  slidesToShow: 1
		});
    }	
}




// Add active class to opened accordion panel

jQuery(function($j) {
	
    "use strict";
	
	$j('.panel-group')
	  .on('show.bs.collapse', function(e) {
		$j(e.target).prev('.panel-heading').addClass('active');
	  })
	  .on('hide.bs.collapse', function(e) {
		$j(e.target).prev('.panel-heading').removeClass('active');
	});

});

// Custom select initialized

function selectpicker(){
	"use strict";
    if ($j(".selectpicker").length > 0) {
        $j('.selectpicker').selectpicker({
            showSubtext: true
        });
        
    }	
}



// desctop menu(popup)


$j("nav").each(function(){
  if(!$j( this ).hasClass("navbar-vertical")) {
    $j( this ).find(".dropdown").each(function(){
      $j( this ).hover(
        function() {
   var $this = $j( this );
   var $obj = $this.find(".dropdown-menu");
   submenuXposition($obj);
   submenuYposition($obj);
   $j( window ).bind( "scroll", { obj: $obj }, menuScroll);

        }, function() {
   var $this = $j( this );
   $this.find(".dropdown-menu").removeAttr("style");
   $j( window ).unbind( "scroll", menuScroll);
        }
      );
    });
  }
});
function submenuXposition($obj){
    var w_width = window.innerWidth;
 var o_position = $obj.offset().left;
 var o_width = $obj.outerWidth();
 var delta = parseInt(w_width - o_position - o_width - 25);
 
 if(delta < 0) {
  $obj.css("left", delta);
 }
}
function submenuYposition($obj){
 var w_height = window.innerHeight;
 var o_position = $j(".stuck-nav").hasClass("fixedbar") ? $obj.position().top : $obj.offset().top;
 var o_height = $obj.outerHeight();
 var delta = parseInt(w_height - o_position - o_height);
 if(delta < 0) {
  $obj.css({"max-height": o_height + delta - 25, "overflow": "auto"});
 }
}
function menuScroll(event) {
 event.data.obj.removeAttr("style");
 submenuXposition(event.data.obj);
 submenuYposition(event.data.obj)
}

if($j(".l9-one-product-js").length) {
 l9rectangle();
 $j(window).resize(l9rectangle);
}
function l9rectangle() {
 var $obj = $j(".l9-one-product-js");
 $obj.find(".row").removeAttr("style");
 setTimeout(function(){
  var w_height = window.innerHeight;
  var y_pos = $obj.offset().top;
  var h_obj = $obj.outerHeight();
  var delta = parseInt(w_height - y_pos - h_obj);
  if(delta > 0) {
   $obj.find(".row").css("padding-bottom", delta);
  }
 }, 100);
}



	
	





$j(document).ready(function() {
	
	"use strict";
	
	navbarClick();
	countDown();
	setMobileDrop();
	handlerDropDownClose();
	searchDropDown();
	footerCollapse();
	productInsideCarousel();
	expanderList();
	collapseBlock();
	priceSlider();
	compareSlideIni();
	slideColumn();
	backToTop();
	stuckNav();
	blogPostSlider();
	selectpicker();
	cartSlideIni();
	changeInputNameCartPage();
	inputCounter();
	
	
	
	// Remove Loader
	$j('body').addClass('loaded');
	
	
	
	var timeout1;
	clearTimeout(timeout1);
	timeout1 = setTimeout(function() {
		//setProductSize();
	}, 500);	
	
	var timeout2;
	clearTimeout(timeout2);
	timeout2 = setTimeout(function() {
		// Resize elements	
		setCarouselArrows();
		if ($j('#productPrevNext').length) {
			setProductArrows();	
		}
	}, 2000);		

	


})



// Reinit when resize

$j(window).resize(debouncer(function(e) {
	elevateZoom1();
	
}))



if($j('.nav-tabs--ys-center').length) {
  initTabsGallery();
 
  $j('.nav-tabs--ys-center .active a').trigger('click');
  $j(window).resize(function(){
    $j('.nav-tabs--ys-center a').unbind();
    initTabsGallery();
  });

}

 function initTabsGallery(){
    $j('.nav-tabs--ys-center a').each(function(){
      $j(this).click(function(){
        $j(this).unbind();
        var tab = $j(this).attr("href");
        var clone = tab+"-clone";
        $j(tab).empty();
        $j(clone).children().clone().appendTo($j(tab));
        var $obj = $j(tab).find(".carouselTab");
        $obj.css("visibility", "hidden");
        if($obj.length) {
          setTimeout(function(){
            productCarousel($obj,6,4,3,2,1);
            $obj.hide();
            $obj.css("visibility", "visible");
            $obj.fadeIn(500);
          }, 5);
        }
      })
    });
  }


// Listing Gallery
function initListingGalleryEvent() {
  $j('.coll-products-js').click(function(){
    $j(this).unbind();
    listingGalleryEventHandler();
  });
}
function listingGalleryEventHandler() {
  $j('.coll-gallery').empty();
  $j('.coll-gallery-clone').children().clone().appendTo('.coll-gallery');
  verticalCarousel($j('.coll-gallery .vertical-carousel-2'),2);
};
if($j('.coll-products-js').length) {
  if($j('.coll-products-js').hasClass('open')) {
    listingGalleryEventHandler();
  } else {
    initListingGalleryEvent();
  }
  $j(window).resize(function(){
    $j('.coll-products-js').unbind();
    initListingGalleryEvent();
    if($j('.coll-products-js').hasClass('open')) {
      listingGalleryEventHandler();
    }
  });
};




//=========== Gallery

//=========== Gallery Popup (gallery-layout.html)

jQuery(function($j) {	
    "use strict";
	if ($j('.gallery').length) {
		$j('.gallery .zomm-gallery').magnificPopup({
			type:'image',
			gallery:{
				enabled:true
			}
			
		});
	}
	
}); 




jQuery(function($j) {	
	"use strict";

	var newSelection = "";
	
	$j(".filter-nav div").click(function(){
		$j("#all-filter-content").hide(0);
	    $j("#all-filter-content").fadeIn(500);
	
		$j(".filter-nav div").removeClass("current");
		$j(this).addClass("current");
		
		newSelection = $j(this).attr("rel");
		
		$j(".filter-content-item").not("."+newSelection).fadeOut();
		$j("."+newSelection).fadeIn();
		
	    $j("#all-filter-content").fadeIn(0);
		
	});
	
});


//=========== Gallery (blog-variants.html)
	jQuery(function($j) {	
    "use strict";
	if ($j('.gallery-isotope').length) {
		$j('.gallery-isotope .zomm-gallery').magnificPopup({
			type:'image',
			gallery:{
				enabled:true
			}
			
		});
	}
	
}); 

				jQuery(function($j) {

				    "use strict";
				   
				    	var gallery = $j('.gallery-isotope');
					
					
						gallery.imagesLoaded(function() {
							if (gallery.length) {
								gallery.isotope({
									itemSelector: '.gallery__item',
									isResizeBound: false,
									masonry: {
										isFitWidth: true
									}
								});
								setGallerySize();
							}	
						})
						

					    function setGallerySize() {
					        var windowW = window.innerWidth || $(window).width(),
					            itemsInRow = 1;
					        if (windowW > 1199) {
					            itemsInRow = 5;
					        } else if (windowW > 991) {
					            itemsInRow = 4;
					        } else if (windowW > 767) {
					            itemsInRow = 3;
					        } else if (windowW > 480) {
					            itemsInRow = 2;
					        }
					        var containerW = gallery.parent('.container').width(),
					            galleryW = containerW / itemsInRow;
								
							gallery.find('.gallery__item').each(function() {
								if ($j(this).hasClass('gallery__item--double') && windowW > 767 ) {
									$j(this).css({
										width: galleryW*2 + 'px',
									});
								}
								else {
									$j(this).css({
										width: galleryW + 'px'
									});
								}
					        });
							var galleryH = gallery.find('.gallery__item:not(.gallery__item--double)').height();
								gallery.find('.gallery__item').each(function() {
								$j(this).css({
										height: ''
								});
								if ($j(this).hasClass('gallery__item--double') && windowW > 767) {
									$j(this).css({
										height: galleryH*2 + 'px'
									});
								}
					        });
							gallery.isotope('layout');
					    }
						
						
					  
							var prevW = window.innerWidth || $j(window).width();
							
							$j(window).resize(debouncer(function(e) {
								if (gallery.length) {			
									var currentW = window.innerWidth || $j(window).width();
									if (currentW != prevW) {
										// start resize events	
										setGallerySize();
										// end resize events		
									}
									prevW = window.innerWidth || $j(window).width();
								}
							}));

				   
					
				})




// logo for retina
jQuery(function($j) {	
     if( 'devicePixelRatio' in window && window.devicePixelRatio == 2 ){
  		  var img_to_replace = jQuery( 'img.replace-2x' ).get();
 
		    for (var i=0,l=img_to_replace.length; i<l; i++) {
		      var src = img_to_replace[i].src;
		      src = src.replace(/\.(png|jpg|gif)+$/i, '@2x.$1');
		      img_to_replace[i].src = src;
		    };
  }
	
}); 



//=========== top menu(hover)
jQuery(function($j) {
    "use strict";
	
	$j('.nav.navbar-nav li').hover(function(){
		$j(this).addClass('hover');
	},function(){
		$j(this).removeClass('hover');
	})
	
});




