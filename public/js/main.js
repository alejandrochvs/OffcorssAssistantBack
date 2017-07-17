/*global console*/
/*global define */
/*global $, jQuery, alert*/
/*jslint browser: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*jshint loopfunc:true */
$(function () {
    "use strict";
    var edit = false,
        currentIndex = localStorage.currentIndex - 1 || -1,
        //Variables
        gender,
        name,
        age,
        topSize,
        bottomSize,
        shoeSize,
        weather,
        favColor,
        currentClass,
        looks = [],
        occasion = [],
        personality = [],
        current,
        next,
        loadAdmin,
        previous;
    //        admin,
    //Functions
    var requestStringChange = function (toFind, toChange) {
            toChange = "'" + toChange + "'";
            toFind = "var " + toFind;
            var data = {
                string: toFind,
                change: toChange
            };
            $('.progress').addClass('loading');
            $.ajax({
                url: '/admin/edit',
                type: "POST",
                data: data,
                success: function (res) {
                    console.log(res);
                    $('.progress').removeClass('loading');
                }
            });
        },
        requestColorChange = function (toFind, toChange) {
            var data = {
                string: "$" + toFind,
                change: toChange
            };
            $('.progress').addClass('loading');
            $.ajax({
                type: 'POST',
                url: '/admin/colors',
                data: data,
                success: function (res) {
                    if (res == 'OK') {
                        location.reload();
                    } else {
                        console.error(res);
                    }
                    $('.progress').removeClass('loading');
                }
            });
        },
        bindEditable = function () {
            $('.text-editable').unbind();
            $('.text-editable').click(function () {
                var variable = $(this).attr('data-var');
                var temp = $(this);
                var tempParent = $(this).parent();
                var text = temp.html();
                var changed;
                $(this).css('display', 'none');
                tempParent.prepend('<input id="editing" class="' + temp.attr('class') + '"type="text"/>');
                $('#editing').val(text).focus().keyup(function (e) {
                    var key = e.keyCode || e.which;
                    if (key === 13) {
                        if ($('#editing').val() !== '') {
                            if ($('#editing').val() !== text) {
                                changed = true;
                            } else {
                                changed = false;
                            }
                            text = $('#editing').val();
                            $('#editing').focusout();
                        } else {
                            changed = false;
                            $('#editing').focusout();
                        }
                    }
                }).focusout(function () {
                    $('#editing').remove();
                    if (changed) {
                        requestStringChange(variable, text);
                    }
                    temp.removeAttr('style');
                    temp.html(text);
                });
            });
        },
        loadView = function (div) {
            div.load('views/' + current + '.html', function () {
                localStorage.current = current;
                if (currentIndex > 0) {
                    $('.header > .head:nth-child(1)').removeClass('transparent');
                    $('.header').removeClass('bGirl nGirl girl boy bBoy nBoy');
                    $('.loader').removeClass('active bGirl nGirl girl boy bBoy nBoy');
                    $('.loader').addClass(currentClass);
                    $('.header').addClass(currentClass);
                } else {
                    $('.header > .head:nth-child(1)').addClass('transparent');
                    $('.loader').removeClass('boy girl nBoy nGirl bBoy bGirl');
                    $('body > .header').removeClass('boy girl nBoy nGirl bBoy bGirl');
                }
                if (current === divs[0]) {
                    $('.gender > .selection-wrap > .title > .text').html(genderTitle);
                    $('.gender > .selection-wrap > .selections > .background > .boySel').html(genderBoy);
                    $('.gender > .selection-wrap > .selections > .background > .girlSel').html(genderGirl);
                    $('.header > .head:nth-child(1)').addClass('transparent');
                    $('.loader > .progress').css('width', '0%');
                    $('.header > .title > .cont').html(headTitle0);
                    $('.header > .title > .cont').attr('data-var', 'headTitle0');
                    $('.header > .head:nth-child(1)').addClass('transparent');
                    $('.gender').addClass(currentClass);
                    $('.boySel').hover(function () {
                        $('.gender').addClass('boy');
                    }, function () {
                        $('.gender').removeClass('boy');
                    });
                    $('.boySel').click(function () {
                        if (gender === "F") {
                            name = undefined;
                            age = undefined;
                            topSize = undefined;
                            bottomSize = undefined;
                            shoeSize = undefined;
                            occasion = [];
                            weather = undefined;
                            favColor = undefined;
                            looks = [];
                            personality = [];
                            localStorage.clear();
                        }
                        gender = 'M';
                        localStorage.setItem(divs[0], gender);
                        currentClass = 'boy';
                        localStorage.currentClass = currentClass;
                        $('.gender').addClass(currentClass);
                        $('.loader > .progress').css('width', '10%');
                        $('.header > .head:nth-child(1)').removeClass('transparent');
                        localStorage.setItem('currentClass', currentClass);
                        next(divs[1]);
                    });
                    $('.girlSel').hover(function () {
                        $('.gender').addClass('girl');
                    }, function () {
                        $('.gender').removeClass('girl');
                    });
                    $('.girlSel').click(function () {
                        if (gender === "M") {
                            name = undefined;
                            age = undefined;
                            topSize = undefined;
                            bottomSize = undefined;
                            shoeSize = undefined;
                            occasion = [];
                            weather = undefined;
                            favColor = undefined;
                            looks = [];
                            personality = [];
                            localStorage.clear();
                        }
                        gender = 'F';
                        localStorage.setItem(divs[0], gender);
                        currentClass = 'girl';
                        localStorage.currentClass = currentClass;
                        $('.gender').addClass(currentClass);
                        $('.loader > .progress').css('width', '10%');
                        $('.header > .head:nth-child(1)').removeClass('transparent');
                        localStorage.setItem('currentClass', currentClass);
                        next(divs[1]);
                    });
                } else if (current === divs[1]) {
                    $('.header > .title > .cont').html(headTitle1);
                    $('.header > .title > .cont').attr('data-var', 'headTitle1');
                    $('.name > .selection-wrap > .title > .text').html(nameTitle);
                    $('.name > .selection-wrap > .continue > div > h3').html(nameBtn);
                    if (name) {
                        $('.nameInput > h1 > input').val(name);
                        $('.continue').removeClass('btn-hidden');
                    }
                    $('.loader > .progress').css('width', '10%');
                    $('.name').addClass(currentClass);
                    $('.nameInput > h1 > input').keyup(function (e) {
                        if ($(this).val().length > 0) {
                            $('.continue').removeClass('btn-hidden');
                            var code = e.which;
                            if (code === 13) {
                                e.preventDefault();
                                if ($(this).parent().parent().parent().parent().parent().hasClass('current')) {
                                    $('.continue').click();
                                }
                            }
                        } else {
                            $('.continue').addClass('btn-hidden');
                        }
                    });
                    $('.continue').click(function () {
                        if (!$(this).hasClass('btn-hidden')) {
                            name = $('.nameInput > h1 > input').val();
                            localStorage.name = name;
                            next(divs[2]);
                        }
                    });
                } else if (current === divs[2]) {
                    $('.header > .title > .cont').html(headTitle1);
                    $('.header > .title > .cont').attr('data-var', 'headTitle1');
                    $('.age > .selection-wrap > .title > .text-editable').html(ageTitle);
                    if (gender == 'M') {
                        $('.row.primi').addClass('nBoy');
                        $('.row.baby').addClass('bBoy');
                        $('.row.kid').addClass('boy');
                    } else {
                        $('.row.primi').addClass('nGirl');
                        $('.row.baby').addClass('bGirl');
                        $('.row.kid').addClass('girl');
                    }
                    $('.loader > .progress').css('width', '20%');
                    $('.age').removeClass('bGirl nGirl girl boy bBoy nBoy');
                    $('.age').addClass(currentClass);
                    var tempCurrentClass = currentClass;
                    $('.pad > .row').hover(function () {
                        var classes = 'boy nBoy bBoy girl nGirl bGirl';
                        $('.age').removeClass(classes);
                        $('.loader').removeClass(classes);
                        $('body > .header').removeClass(classes);
                        if (gender == 'M') {
                            if ($(this).index() == 0) {
                                tempCurrentClass = 'nBoy';
                            } else if ($(this).index() == 1) {
                                tempCurrentClass = 'bBoy';
                            } else if ($(this).index() == 2) {
                                tempCurrentClass = 'boy';
                            }
                        } else {
                            if ($(this).index() == 0) {
                                tempCurrentClass = 'nGirl';
                            } else if ($(this).index() == 1) {
                                tempCurrentClass = 'bGirl';
                            } else if ($(this).index() == 2) {
                                tempCurrentClass = 'girl';
                            }
                        }
                        $('.age').addClass(tempCurrentClass);
                        $('.loader').addClass(tempCurrentClass);
                        $('body > .header').addClass(tempCurrentClass);
                    }, function () {
                        var classes = 'boy nBoy bBoy girl nGirl bGirl';
                        $('.age').removeClass(classes);
                        $('.loader').removeClass(classes);
                        $('body > .header').removeClass(classes);
                        $('.age').addClass(currentClass);
                        $('.loader').addClass(currentClass);
                        $('body > .header').addClass(currentClass);
                    });
                    $('.pad > .row').click(function () {
                        if (gender == 'M') {
                            if ($(this).index() == 0) {
                                currentClass = 'nBoy';
                                localStorage.currentClass = currentClass;
                                age = 1;
                                localStorage.age = age;
                                next(divs[4]);
                            } else if ($(this).index() == 1) {
                                currentClass = 'bBoy';
                                localStorage.currentClass = currentClass;
                                age = 3;
                                localStorage.age = age;
                                next(divs[3]);
                            } else if ($(this).index() == 2) {
                                currentClass = 'boy';
                                localStorage.currentClass = currentClass;
                                age = 7;
                                localStorage.age = age;
                                next(divs[3]);
                            }
                        } else {
                            if ($(this).index() == 0) {
                                currentClass = 'nGirl';
                                localStorage.currentClass = currentClass;
                                age = 1;
                                localStorage.age = age;
                                next(divs[4]);
                            } else if ($(this).index() == 1) {
                                currentClass = 'bGirl';
                                localStorage.currentClass = currentClass;
                                age = 3;
                                localStorage.age = age;
                                next(divs[3]);
                            } else if ($(this).index() == 2) {
                                currentClass = 'girl';
                                localStorage.currentClass = currentClass;
                                age = 7;
                                localStorage.age = age;
                                next(divs[3]);
                            }
                        }
                    })
                }
                else if (current === divs[3]) {
                    $('.header > .title > .cont').html(headTitle1);
                    $('.header > .title > .cont').attr('data-var', 'headTitle1');
                    $('.size > .selection-wrap > .title > .text-editable').html(sizeTitle);
                    $('.size > .selection-wrap > .title > .text > N').html(name);
                    $('.size').addClass(currentClass);
                    $('.size > .selection-wrap > .title > .text > a').append('<i class="fa fa-exclamation hidden-xs" aria-hidden="true"></i>')
                    $('.loader > .progress').css('width', '30%');
                    $('.sizes-guide > .img').append('<img src="../IMG/Size/' + currentClass + '.jpg" class="col-xs-12" alt="">');
                    $.ajax({
                        type: 'POST',
                        url: '/db/sizes',
                        data: {
                            category: currentClass
                        },
                        success: function (res) {
                            var list = [res.top, res.bottom, res.shoes],
                                i;
                            $('.padSize > .row').remove();
                            for (i = 0; i < list.length; i++) {
                                var counter = 3,
                                    j;
                                for (j = 0; j < list[i].length; j++) {
                                    if (counter === 3) {
                                        $($('.padSize')[i]).append('<div class="col-xs-4 col-sm-12 row"></div>');
                                        counter = 0;
                                    }
                                    $($('.padSize')[i]).find('.row').last().append('<div data-select=' + i + ' class="col-xs-4 box">' + list[i][j] + '</div>');
                                    counter++;
                                }
                                if (list[i].length > 9) {
                                    $($('.padWrap')[i]).find('.nav').addClass('active');
                                }
                            }
                            $('.up').click(function () {
                                var currentPad = $(this).attr('data-pad');
                                $($('.padSize')[currentPad]).find('.row').css('top', '0vh');
                            });
                            $('.down').click(function () {
                                var currentPad = $(this).attr('data-pad');
                                if (window.innerWidth < 768) {
                                    $($('.padSize')[currentPad]).find('.row').css('top', '-10vh');
                                } else {
                                    $($('.padSize')[currentPad]).find('.row').css('top', '-30vh');
                                }
                            });
                            $('.box').click(function () {
                                var datapad = $(this).attr('data-select');
                                if ($(this).hasClass('active')) {
                                    $(this).removeClass('active');
                                    if (datapad === 0) {
                                        topSize = undefined;
                                    } else if (datapad === 1) {
                                        bottomSize = undefined;
                                    } else if (datapad === 2) {
                                        shoeSize = undefined;
                                    }
                                } else {
                                    $($('.padSize')[datapad]).find('.box').removeClass('active');
                                    $(this).addClass('active');
                                    if (datapad === 0) {
                                        topSize = $(this).html();
                                        localStorage.setItem('topSize', topSize);
                                    } else if (datapad === 1) {
                                        bottomSize = $(this).html();
                                        localStorage.setItem('bottomSize', bottomSize);
                                    } else if (datapad === 2) {
                                        shoeSize = $(this).html();
                                        localStorage.setItem('shoeSize', shoeSize);
                                    }
                                    if ($('.padSize > .row .active').length === 3) {
                                        next(divs[5]);
                                    }
                                }
                            });
                            if (shoeSize && topSize && bottomSize) {
                                $($('.padWrap')[0]).find('.box:contains("' + topSize + '")').last().addClass('active');
                                $($('.padWrap')[1]).find('.box:contains("' + bottomSize + '")').last().addClass('active');
                            }
                        }
                    });
                }
                else if (current === divs[4]) {
                    $('.sizePrimi > .selection-wrap > .title > .text > N').html(name);
                    $('.header > .title > .cont').html(headTitle1);
                    $('.header > .title > .cont').attr('data-var', 'headTitle1');
                    $('.sizePrimi > .selection-wrap > .title > .text-editable').html(sizePrimiTitle);
                    $('.sizePrimi').addClass(currentClass);
                    $('.sizePrimi > .selection-wrap > .title > .text > a').append('<i class="fa fa-exclamation hidden-xs" aria-hidden="true"></i>')
                    $('.loader > .progress').css('width', '30%');
                    $('.sizes-guide > .img').append('<img src="../IMG/Size/' + currentClass + '.jpg" class="col-xs-12" alt="">');
                    $.ajax({
                        type: "POST",
                        url: '/db/sizes',
                        data: {
                            category: currentClass
                        },
                        success: function (res) {
                            var list = res.top,
                                i,
                                counter = 3;
                            $('.padSizePrimi > .row').remove();
                            for (i = 0; i < list.length; i++) {
                                if (counter === 3) {
                                    $('.padSizePrimi').append('<div class="col-xs-12 col-sm-12 row"></div>');
                                    counter = 0;
                                }
                                $('.padSizePrimi').find('.row').last().append('<div data-select=' + i + ' class="col-xs-4 box">' + list[i] + '</div>');
                                counter++;
                            }
                            if (list.length > 9) {
                                $('.padWrap').find('.nav').addClass('active');
                            }
                            $('.up').click(function () {
                                $('.padSizePrimi').find('.row').css('top', '0vh');
                            });
                            $('.down').click(function () {
                                $('.padSizePrimi').find('.row').css('top', '-30vh');
                            });
                            $('.box').click(function () {
                                if ($(this).hasClass('active')) {
                                    $(this).removeClass('active');
                                    topSize = undefined;
                                    bottomSize = undefined;
                                    shoeSize = undefined;
                                } else {
                                    $('.padSizePrimi').find('.box').removeClass('active');
                                    $(this).addClass('active');
                                    topSize = $(this).html();
                                    bottomSize = $(this).html();
                                    shoeSize = $(this).html();
                                    localStorage.setItem('topSize', topSize);
                                    localStorage.setItem('bottomSize', bottomSize);
                                    localStorage.setItem('shoeSize', shoeSize);
                                    next(divs[5]);
                                }
                            });
                        }
                    });
                } else if (current === divs[5]) {
                    $('.header > .title > .cont').html(headTitle2);
                    $('.header > .title > .cont').attr('data-var', 'headTitle2');
                    $('.occasion > .selection-wrap > .title > .text-editable').html(occasionsTitle);
                    $('.occasions > .background:nth-child(1) > .cont > .title > h3').html(occasionName1);
                    $('.occasions > .background:nth-child(2) > .cont > .title > h3').html(occasionName2);
                    $('.occasions > .background:nth-child(3) > .cont > .title > h3').html(occasionName3);
                    $($('.occasions > .background > .cont > .title > h3')[3]).html(occasionName4);
                    $($('.occasions > .background > .cont > .title > h3')[4]).html(occasionName5);
                    $($('.occasions > .background > .cont > .title > h3')[5]).html(occasionName6);
                    $('.occasion > .occasionsBtn').html(occasionBtn);
                    $('.loader > .progress').css('width', '40%');
                    if (occasion) {
                        if (occasion.length > 0) {
                            var i;
                            for (i = 0; i < occasion.length; i++) {
                                $('[data-occasion="' + occasion[i] + '"]').find('.cont').addClass('active');
                                $('.occasionsBtn').removeClass('disabled');
                            }
                        }
                    }
                    $('.occasion').addClass(currentClass);
                    $('.background').click(function () {
                        var tempOccasion = $(this).attr('data-occasion');
                        if (occasion.indexOf(tempOccasion) >= 0) {
                            occasion.splice(occasion.indexOf(tempOccasion), 1);
                            if (occasion.length === 0) {
                                $('.occasionsBtn').addClass('disabled');
                            }
                        } else {
                            occasion.push(tempOccasion);
                            $('.occasionsBtn').removeClass('disabled');
                        }
                        $(this).find('.cont').toggleClass('active');
                    });
                    if (currentClass === 'nBoy' || currentClass === 'nGirl') {
                        $('.background:nth-child(1)').css('display', 'none');
                        $($('.occasions > .background')[5]).css('display', 'none');
                        $($('.occasions > .background')[2]).addClass('col-xs-offset-0');
                        if ($(window).width() < 767) {
                            $($('.occasions > .background')[3]).addClass('col-xs-offset-2');
                        }
                        $('.background:nth-child(2)').toggleClass('col-xs-offset-2');
                        $('.background:nth-child(3)').toggleClass('col-xs-offset-2 col-md-offset-0');
                    }
                    $('.occasionsBtn').click(function () {
                        if (occasion.length > 0) {
                            localStorage.occasion = JSON.stringify(occasion);
                            next(divs[6]);
                        }
                    });
                } else if (current === divs[6]) {
                    $('.header > .title > .cont').html(headTitle2);
                    $('.header > .title > .cont').attr('data-var', 'headTitle2');
                    $('.weather > .selection-wrap > .title > .text-editable').html(weatherTitle);
                    $('.weathers > .background:nth-child(1) > .cont > .title > h3').html(weatherName1);
                    $('.weathers > .background:nth-child(2) > .cont > .title > h3').html(weatherName2);
                    $('.weathers > .background:nth-child(3) > .cont > .title > h3').html(weatherName3);
                    $('.weather').addClass(currentClass);
                    $('.loader > .progress').css('width', '50%');
                    $('.weathers > .background').click(function () {
                        weather = $(this).attr('data-weather');
                        localStorage.setItem(divs[6], weather);
                        next(divs[7]);
                    });
                } else if (current === divs[7]) {
                    $('.header > .title > .cont').html(headTitle2);
                    $('.header > .title > .cont').attr('data-var', 'headTitle2');
                    $('.color > .selection-wrap > .title > .text-editable').html(colorTitle);
                    $('.colors > .color-wrap:nth-child(1) > .select').html(colorName1);
                    $('.colors > .color-wrap:nth-child(2) > .select').html(colorName2);
                    $('.colors > .color-wrap:nth-child(3) > .select').html(colorName3);
                    $('.colors > .color-wrap:nth-child(4) > .select').html(colorName4);
                    $('.loader > .progress').css('width', '70%');
                    $('.color').addClass(currentClass);
                    $.post('/db/colors', function (res) {
                        for (var i = 0; i < res.length; i++) {
                            $('.colors').append('<div class="col-xs-6 col-sm-4 col-md-2 color-wrap"> <div class="col-xs-12 select text-editable" style="border-color:' + res[i].hex + ';" data-color="' + res[i].color + '" data-var="colorName1">' + res[i].color + '</div></div>')
                        }
                        $('.select').click(function () {
                            favColor = $(this).attr('data-color');
                            localStorage.setItem('favColor', favColor);
                            next(divs[8]);
                        });
                    });
                } else if (current === "looks") {
                    $('.header > .title > .cont').html(headTitle2);
                    $('.header > .title > .cont').attr('data-var', 'headTitle2');
                    if (looks.length > 0) {
                        var j;
                        $('.continueLooks').removeClass('transparent');
                        for (j = 0; j < looks.length; j++) {
                            $($('.looksWrap > .background')[looks[j]]).addClass('active');
                            $($('.looksWrap > .background')[looks[j]]).find('.fa').addClass('fa-heart').removeClass('fa-heart-o');
                        }
                    }
                    $('.loader > .progress').css('width', '60%');
                    $('.background').click(function () {
                        $(this).toggleClass('active');
                        $($(this).find('.fa')[0]).toggleClass('fa-heart fa-heart-o');
                        if ($(this).hasClass('active')) {
                            looks.push($(this).attr('data-look'));
                        } else {
                            looks.splice(looks.indexOf($(this).attr('data-look')), 1);
                        }
                        if ($('.looks > .looksWrap > .active').length > 0) {
                            $('.continueLooks').removeClass('transparent');
                        } else {
                            $('.continueLooks').addClass('transparent');
                        }
                    });
                    $('.looks > .continueLooks').click(function () {
                        if (!($(this).hasClass('transparent'))) {
                            localStorage.setItem('looks', JSON.stringify(looks));
                            next(divs[8]);
                        }
                    });
                    $('.looks').addClass(currentClass);
                } else if (current === divs[8]) {
                    $('.header > .title > .cont').html(headTitle2);
                    $('.header > .title > .cont').attr('data-var', 'headTitle2');
                    $('.personality > .selection-wrap > .title > .text-editable').html(personalityTitle);
                    $('.personWrap > .person:nth-child(1) > .background > .title > h4').html(personalityName1);
                    $('.personWrap > .person:nth-child(2) > .background > .title > h4').html(personalityName2);
                    $('.personWrap > .person:nth-child(3) > .background > .title > h4').html(personalityName3);
                    $('.personWrap > .person:nth-child(4) > .background > .title > h4').html(personalityName4);
                    $('.personWrap > .person:nth-child(5) > .background > .title > h4').html(personalityName5);
                    if (personality.length > 0) {
                        var k;
                        for (k = 0; k < personality.length; k++) {
                            $($('.person')[personality[k]]).removeClass('transparent');
                        }
                        $('.continue').removeClass('transparent');
                    }
                    $('.loader > .progress').css('width', '80%');
                    $('.personality').addClass(currentClass);
                    $('.person').click(function () {
                        if ($(this).hasClass('transparent')) {
                            $(this).removeClass('transparent');
                            personality.push($(this).attr('data-personality'));
                        } else {
                            $(this).addClass('transparent');
                            personality.splice(personality.indexOf($(this).attr('data-personality')), 1);
                        }
                        if ($('.person.transparent').length < 6) {
                            $('.continue').removeClass('transparent');
                        } else {
                            $('.continue').addClass('transparent');
                        }
                    });
                    $('.continue').click(function () {
                        if ($('.person.transparent').length < 6) {
                            localStorage.personality = JSON.stringify(personality);
                            next(divs[9]);
                        }
                    });
                    if (gender === 'F') {
                        $('.person:nth-child(1) > .background > .title > h4').html(personalityNameF1);
                        $('.person:nth-child(2) > .background > .title > h4').html(personalityNameF2);
                        $('.person:nth-child(3) > .background > .title > h4').html(personalityNameF3);
                        $('.person:nth-child(4) > .background > .title > h4').html(personalityNameF4);
                        $('.person:nth-child(5) > .background > .title > h4').html(personalityNameF5);
                    }
                } else if (current === divs[9]) {
                    $('.header > .title > .cont').html(headTitle3);
                    $('.header > .title > .cont').attr('data-var', 'headTitle3');
                    $('.loader > .progress').css('width', '100%');
                    $('.result').addClass(currentClass);
                    $('.result > .selection-wrap > .title > h4').typeIt({
                        strings: 'Cargando...',
                        speed: 100,
                        autoStart: true,
                        loop: true
                    });
                    var data = {}
                    if (gender == "F") {
                        data.gender = "FEMENINO";
                    } else {
                        data.gender = "MASCULINO";
                    }
                    if (age == 1) {
                        data.age = 'PRIMI (0-18M)';
                    } else if (age == 3) {
                        data.age = 'BEBE (18M - 5 AÑOS)';
                    } else if (age == 7) {
                        data.age = 'NIÑO (5 AÑOS - 13 AÑOS)';
                    }
                    data.color = favColor;
                    $('.progress').addClass('loading');
                    $.ajax({
                        type: "POST",
                        url: "db/e-cards/match",
                        data: data,
                        success: function (res) {
                            $('.resultIMG').append('<img class="col-xs-12" src="IMG/ecards/' + res[0].url + '"/>');
                            $('.resultIMG').click(function () {
                                $('.callcenter').click();
                            });
                            $('.result > .selection-wrap').remove();
                            $('.progress').removeClass('loading');
                            data.bottomSize = bottomSize;
                            data.topSize = topSize;
                            data.shoeSize = shoeSize;
                            data.occasion = occasion;
                            data.weather = weather;
                            data.color = favColor;
                            data.personality = personality;
                            data.e_card = res[0].url;
                            data.name = name;
                            $('.call-modal > .button').click(function () {
                                data.phone = $('.call-modal > .input > input').val();
                                var regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
                                if (data.phone.match(regex)) {
                                    var regexToConv = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
                                    data.phone = data.phone.replace(/\D/g, "");
                                    console.log(data);
                                    $.ajax({
                                        url: '/db/customers',
                                        type: 'POST',
                                        data: data,
                                        success: function (res) {
                                            console.log(res);
                                            if (res == 'User already exists.') {
                                                $('.call-modal > .input > input').addClass('wrong');
                                                $('.call-modal > .input > input').tooltip({
                                                    title: 'El teléfono ya está registrado.',
                                                    trigger: 'manual',
                                                    placement: 'top'
                                                });
                                                $('.call-modal > .input > input').tooltip('show');
                                            } else {
                                                $('.call-modal > .input').removeClass('wrong');
                                                $('.call-modal').removeClass('active');
                                            }
                                        }
                                    });
                                } else {
                                    $('.call-modal > .input > input').addClass('wrong');
                                    $('.call-modal > .input > input').tooltip({
                                        title: 'Formato incorrecto.',
                                        trigger: 'manual',
                                        placement: 'top'
                                    });
                                    $('.call-modal > .input > input').tooltip('show');
                                }
                            });
                        }
                    });
                } else if (current === 'login') {
                    $('.head.title > .cont').html(headTitle4);
                    $('.head.title > .cont').attr('data-var', 'headTitle4');
                    var login = function (username, password) {
                        if (username !== "" && password !== "") {
                            var data = {
                                username: username,
                                password: password
                            };
                            $('.progress').addClass('loading');
                            $.ajax({
                                type: 'POST',
                                url: '/db/users/login',
                                data: data,
                                success: function (result) {
                                    if (result.status !== 200) {
                                        console.error(result);
                                    } else {
                                        localStorage.admin = JSON.stringify({
                                            token: result.token,
                                            username: result.username,
                                            adminName: result.name
                                        });
                                        loadAdmin();
                                        next('gender');
                                        console.log('Logged in.');
                                        $('.progress').removeClass('loading');
                                    }
                                }
                            });
                        } else {
                            console.log('Fill everything.');
                        }
                    };
                    $('.loginBtn').click(function () {
                        var username = $('#username').val();
                        var password = $('#password').val();
                        login(username, password);
                    });
                    $('.login > input').keyup(function (e) {
                        if (e.keyCode === 13) {
                            $('.loginBtn').click();
                        }
                    });
                    localStorage.current = 'gender';

                } else if (current === 'register') {
                    currentIndex = 100;
                    localStorage.current = divs[0];
                    $('.head.title > .cont').html(headTitle4);
                    $('.head.title > .cont').attr('data-var', 'headTitle4');
                    $('body > .header').removeClass('boy girl nBoy nGirl bBoy bGirl');
                    var register = function (username, email, password, passwordVer, name, last_name, gender, birthday, access_level) {
                        function validateEmail(emailToValidate) {
                            var re = /\S+@\S+\.\S+/;
                            return re.test(emailToValidate);
                        };

                        function validateUsername(usernameToValidate) {
                            var re = /^[a-zA-Z\-]+$/;
                            return re.test(usernameToValidate);
                        };

                        function validatePassword(passwordToValidate) {
                            var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
                            if (password == passwordVer && re.test(passwordToValidate)) {
                                return true;
                            } else {
                                return false;
                            }
                        };
                        if (validateUsername && validatePassword && validateUsername(name) && validateEmail(email) && validateUsername(name) && gender !== "" && birthday !== "" && access_level !== "") {
                            var data = {
                                username: username,
                                mail: email,
                                password: password,
                                name: name,
                                last_name: last_name,
                                access_level: access_level,
                                gender: gender,
                                birthday: birthday,
                                last_connection: new Date().toISOString(),
                                current_page: 0,
                                profile_picture: " "
                            };
                            $('.progress').addClass('loading');
                            $.ajax({
                                type: 'POST',
                                url: '/db/users/register',
                                data: data,
                                success: function (result) {
                                    if (result !== 'User already exists.') {
                                        previous(divs[0]);
                                    }
                                    $('.progress').removeClass('loading');
                                    return console.log(result);
                                }
                            });
                        } else {
                            if (!validateEmail(email)) {
                                $('#email').css('border-bottom', 'solid 2px red');
                                console.log('Wrong e-mail.')
                            } else {
                                $('#email').css('border-bottom', 'solid 2px transparent');
                            }
                            if (!validateUsername(username)) {
                                $('#username').css('border-bottom', 'solid 2px red');
                                console.log('Wrong username.')
                            } else {
                                $('#username').css('border-bottom', 'solid 2px transparent');
                            }
                            if (!validatePassword(password)) {
                                $('#password').css('border-bottom', 'solid 2px red');
                                $('#password-ver').css('border-bottom', 'solid 2px red');
                                console.log('Wrong password.')
                            } else {
                                $('#password').css('border-bottom', 'solid 2px transparent');
                                $('#password-ver').css('border-bottom', 'solid 2px transparent');
                            }
                            if (!validateUsername(name)) {
                                $('#name').css('border-bottom', 'solid 2px red');
                                console.log('Wrong name.')
                            } else {
                                $('#name').css('border-bottom', 'solid 2px transparent');
                            }
                            if (!validateUsername(last_name)) {
                                $('#last_name').css('border-bottom', 'solid 2px red');
                                console.log('Wrong last name.')
                            } else {
                                $('#last_name').css('border-bottom', 'solid 2px transparent');
                            }
                            console.log('Fill everything.');
                        }
                    };
                    $('.registerBtn').click(function () {
                        var username = $('#username').val();
                        var email = $('#email').val();
                        var password = $('#password').val();
                        var passwordVer = $('#password-ver').val();
                        var name = $('#name').val();
                        var last_name = $('#last_name').val();
                        var gender = $('#gender').val();
                        var birthday = $('#birthday').val();
                        var access_level = $('#access_level').val();
                        register(username, email, password, passwordVer, name, last_name, gender, birthday, access_level);
                    });
                    $('.register > input').keyup(function (e) {
                        if (e.keyCode === 13) {
                            $('.registerBtn').click();
                        }
                    });
                    $('.register > select').keyup(function (e) {
                        if (e.keyCode === 13) {
                            $('.registerBtn').click();
                        }
                    });
                } else if (current === 'e-cards') {
                    $('.head.title > .cont').html('E-cards');
                    var dbAges, dbColors, dbGenders, dbOccasions, dbSizes, dbTypes, dbWeathers;
                    var getAges = function () {
                        $.post({
                            url: '/db/ages',
                            success: function (res) {
                                dbAges = res;
                                getColors();
                            }
                        });
                    }
                    var getColors = function () {
                        $.post({
                            url: '/db/colors',
                            success: function (res) {
                                dbColors = res;
                                getGenders();
                            }
                        });
                    }
                    var getGenders = function () {
                        $.post({
                            url: '/db/genders',
                            success: function (res) {
                                dbGenders = res;
                                getOccasions();

                            }
                        });
                    }
                    var getOccasions = function () {
                        $.post({
                            url: '/db/occasions',
                            success: function (res) {
                                dbOccasions = res;
                                getTypes();
                            }
                        });
                    }
                    var getTypes = function () {
                        $.post({
                            url: '/db/types',
                            success: function (res) {
                                dbTypes = res;
                                getWeathers();
                            }
                        });
                    }
                    var getWeathers = function () {
                        $.post({
                            url: '/db/weathers',
                            success: function (res) {
                                dbWeathers = res;
                                $('.progress').removeClass('loading');
                                var loadEdition = function (eCardDiv) {
                                    var ulList = eCardDiv.find('ul');
                                    for (var i = 0; i < dbGenders.length; i++) {
                                        $(ulList[0]).append('<li>' + dbGenders[i].gender + '</li>');
                                    }
                                    for (var i = 0; i < dbAges.length; i++) {
                                        $(ulList[1]).append('<li>' + dbAges[i].age + '</li>');
                                    }
                                    for (var i = 0; i < dbTypes.length; i++) {
                                        $(ulList[2]).append('<li>' + dbTypes[i].type + '</li>');
                                    }
                                    for (var i = 0; i < dbColors.length; i++) {
                                        $(ulList[3]).append('<li>' + dbColors[i].color + '</li>');
                                    }
                                    for (var i = 0; i < dbWeathers.length; i++) {
                                        $(ulList[4]).append('<li>' + dbWeathers[i].weather + '</li>');
                                    }
                                    for (var i = 0; i < dbOccasions.length; i++) {
                                        $(ulList[5]).append('<li>' + dbOccasions[i].occasion + '</li>');
                                    }
                                }
                                loadEdition($('.e-card-new'));
                                $('.progress').addClass('loading');
                                $.ajax({
                                    type: "POST",
                                    url: '/db/e-cards/count',
                                    success: function (res) {
                                        var pages = Math.ceil(res.count / 10);
                                        var pagesColumns;
                                        if (pages <= 5) {
                                            pagesColumns = 2;
                                        } else {
                                            pagesColumns = 1;
                                        }
                                        for (var i = 0; i < pages; i++) {
                                            $('<li class="col-xs-' + pagesColumns + ' table-page"><h6>' + (i + 1) + '</h6></li>').insertBefore('.table-next');
                                        }
                                        var requestECards = function (offset) {
                                            $('.progress').addClass('loading');
                                            $.ajax({
                                                type: "POST",
                                                url: '/db/e-cards',
                                                data: {
                                                    offset: offset * 10
                                                },
                                                success: function (res) {
                                                    $('.e-card-item').remove();
                                                    for (var i = 0; i < res.length; i++) {
                                                        $('.e-cards-table').append('<div class="col-xs-12 e-card-item"></div>');
                                                        $('.e-card-item:last-child').append('<div class="col-xs-2 e-card-desc e-card-img"></div>');
                                                        $('.e-card-img:last-child').append('<img class="col-xs-12" src="../IMG/ecards/' + res[i].url + '"/>');
                                                        $('.e-card-item:last-child').append('<div class="col-xs-1 e-card-desc e-card-gender"><div class="col-xs-12">' + res[i].gender + '</div></div>');
                                                        $('.e-card-item:last-child').append('<div class="col-xs-2 e-card-desc e-card-age"><div class="col-xs-12">' + res[i].age + '</div></div>');
                                                        $('.e-card-item:last-child').append('<div class="col-xs-1 e-card-desc e-card-reference"></div>');
                                                        for (var j = 0; j < res[i].reference.length; j++) {
                                                            $('.e-card-item:last-child >.e-card-desc:last-child').append('<div class="col-xs-12">' + res[i].reference[j] + '</div>');
                                                        }
                                                        $('.e-card-item:last-child').append('<div class="col-xs-1 e-card-desc e-card-type"></div>');
                                                        for (var j = 0; j < res[i].type.length; j++) {
                                                            $('.e-card-item:last-child >.e-card-desc:last-child').append('<div class="col-xs-12">' + res[i].type[j] + '</div>');
                                                        }
                                                        $('.e-card-item:last-child').append('<div class="col-xs-1 e-card-desc e-card-color"></div>');
                                                        for (var j = 0; j < res[i].color.length; j++) {
                                                            $('.e-card-item:last-child >.e-card-desc:last-child').append('<div class="col-xs-12">' + res[i].color[j] + '</div>');
                                                        }
                                                        $('.e-card-item:last-child').append('<div class="col-xs-1 e-card-desc e-card-weather"></div>');
                                                        for (var j = 0; j < res[i].weather.length; j++) {
                                                            $('.e-card-item:last-child >.e-card-desc:last-child').append('<div class="col-xs-12">' + res[i].weather[j] + '</div>');
                                                        }
                                                        $('.e-card-item:last-child').append('<div class="col-xs-2 e-card-desc e-card-occasion"></div>');
                                                        for (var j = 0; j < res[i].occasion.length; j++) {
                                                            $('.e-card-item:last-child >.e-card-desc:last-child').append('<div class="col-xs-12">' + res[i].occasion[j] + '</div>');
                                                        }
                                                        $('.e-card-item:last-child').append('<div class="col-xs-1 e-card-desc e-card-edition"><div class="col-xs-6 fa fa-trash" title="Borrar"></div><div class="col-xs-6 fa fa-pencil" title="Editar"></div></div>');
                                                        if (res[i].occasion.length > 1) {
                                                            $('.e-card-item:last-child > .e-card-occasion > div:first-child ').append(' <i class="fa fa-angle-down" aria-hidden="true"></i> ');
                                                        }
                                                        if (res[i].weather.length > 1) {
                                                            $('.e-card-item:last-child > .e-card-weather > div:first-child ').append(' <i class="fa fa-angle-down" aria-hidden="true"></i> ');
                                                        }
                                                        if (res[i].color.length > 1) {
                                                            $('.e-card-item:last-child > .e-card-color > div:first-child ').append(' <i class="fa fa-angle-down" aria-hidden="true"></i> ');
                                                        }
                                                        if (res[i].type.length > 1) {
                                                            $('.e-card-item:last-child > .e-card-type > div:first-child ').append(' <i class="fa fa-angle-down" aria-hidden="true"></i> ');
                                                        }
                                                        if (res[i].reference.length > 1) {
                                                            $('.e-card-item:last-child > .e-card-reference > div:first-child ').append(' <i class="fa fa-angle-down" aria-hidden="true"></i> ');
                                                        }
                                                    }
                                                    $('.e-card-item').click(function (e) {
                                                        if (e.target == $(this).find('.fa-trash')[0] && $(this).hasClass('active')) {
                                                            var tempTrashThis = $(this);
                                                            $('.warning-wrapper').toggleClass('active');
                                                            $('.warning-wrapper > .yes').click(function () {
                                                                var tempCurUrl = tempTrashThis.find('.e-card-img > img').attr('src').split('/');
                                                                tempCurUrl = tempCurUrl[tempCurUrl.length - 1];
                                                                var tempThis = tempTrashThis;
                                                                $('.progress').addClass('loading');
                                                                $.ajax({
                                                                    type: 'POST',
                                                                    url: '/db/e-cards/delete',
                                                                    data: {
                                                                        url: tempCurUrl
                                                                    },
                                                                    success: function () {
                                                                        tempThis.click();
                                                                        tempThis.remove();
                                                                        $('.progress').removeClass('loading');
                                                                    }
                                                                });
                                                                $('.warning-wrapper').toggleClass('active');
                                                                $('.warning-wrapper > .yes').unbind();
                                                                $('.warning-wrapper > .no').unbind();
                                                            });
                                                            $('.warning-wrapper > .no').click(function () {
                                                                $('.warning-wrapper').toggleClass('active');
                                                                $('.warning-wrapper > .yes').unbind();
                                                                $('.warning-wrapper > .no').unbind();
                                                            })
                                                            return;
                                                        } else if (e.target == $(this).find('.fa-pencil')[0] && $(this).hasClass('active')) {
                                                            editingECard = true;
                                                            $(this).click();
                                                            $('.e-card-new > .e-card-desc > .fa-ban').click();
                                                            $('.e-card-new > .e-card-desc:nth-child(1) > div').append(
                                                                $(this).find('.e-card-desc:nth-child(1) > img')[0].outerHTML);
                                                            $('.e-card-new').click();
                                                            return;
                                                        }
                                                        if ($(this).hasClass('active')) {
                                                            $('.e-card-item.active > .e-card-desc').unbind();
                                                            $('.e-card-item.active > .e-card-desc').removeClass('col-xs-2');
                                                            $('.e-card-item.active > .e-card-desc').removeClass('col-xs-4');
                                                            $('.e-card-item.active > .e-card-desc').removeClass('col-xs-1');
                                                            $('.e-card-item.active > .e-card-desc:nth-child(1)').addClass('col-xs-2');
                                                            $('.e-card-item.active > .e-card-desc:nth-child(2)').addClass('col-xs-1');
                                                            $('.e-card-item.active > .e-card-desc:nth-child(3)').addClass('col-xs-2');
                                                            $('.e-card-item.active > .e-card-desc:nth-child(4)').addClass('col-xs-1');
                                                            $('.e-card-item.active > .e-card-desc:nth-child(5)').addClass('col-xs-1');
                                                            $('.e-card-item.active > .e-card-desc:nth-child(6)').addClass('col-xs-1');
                                                            $('.e-card-item.active > .e-card-desc:nth-child(7)').addClass('col-xs-1');
                                                            $('.e-card-item.active > .e-card-desc:nth-child(8)').addClass('col-xs-2');
                                                            $('.table-header > .e-card-title').removeClass('col-xs-1 col-xs-2 col-xs-4');
                                                            $('.table-header > .e-card-title:nth-child(1)').addClass('col-xs-2');
                                                            $('.table-header > .e-card-title:nth-child(2)').addClass('col-xs-1');
                                                            $('.table-header > .e-card-title:nth-child(3)').addClass('col-xs-2');
                                                            $('.table-header > .e-card-title:nth-child(4)').addClass('col-xs-1');
                                                            $('.table-header > .e-card-title:nth-child(5)').addClass('col-xs-1');
                                                            $('.table-header > .e-card-title:nth-child(6)').addClass('col-xs-1');
                                                            $('.table-header > .e-card-title:nth-child(7)').addClass('col-xs-1');
                                                            $('.table-header > .e-card-title:nth-child(8)').addClass('col-xs-2');
                                                            $('.table-header > .e-card-title:nth-child(9)').addClass('col-xs-1');
                                                            $('.e-card-new').css('max-height', '7vh');
                                                            $(this).removeClass('active');
                                                        } else {
                                                            if ($('.e-card-new').hasClass('active')) {
                                                                $('.fa-eye').click();
                                                            }
                                                            $('.e-card-item.active > .e-card-desc').unbind();
                                                            $('.e-card-item.active').removeClass('active');
                                                            $(this).toggleClass('active');
                                                            $('.e-card-new').css('max-height', '0vh');
                                                            $('.e-card-item.active > .e-card-desc:not(:last-child)').hover(function () {
                                                                $('.e-card-item.active > .e-card-desc').removeClass('col-xs-2');
                                                                $('.e-card-item.active > .e-card-desc').addClass('col-xs-1');
                                                                $(this).removeClass('col-xs-1');
                                                                $(this).addClass('col-xs-4');
                                                                $('.table-header > .e-card-title').removeClass('col-xs-1 col-xs-2');
                                                                $('.table-header > .e-card-title').addClass('col-xs-1');
                                                                $('.table-header > .e-card-title:nth-child(' + ($(this).index() + 1) + ')').removeClass('col-xs-1');
                                                                $('.table-header > .e-card-title:nth-child(' + ($(this).index() + 1) + ')').addClass('col-xs-4');
                                                            }, function () {
                                                                $('.e-card-item.active > .e-card-desc').removeClass('col-xs-1 col-xs-2 col-xs-4');
                                                                $('.e-card-item.active > .e-card-desc:nth-child(1)').addClass('col-xs-2');
                                                                $('.e-card-item.active > .e-card-desc:nth-child(2)').addClass('col-xs-1');
                                                                $('.e-card-item.active > .e-card-desc:nth-child(3)').addClass('col-xs-2');
                                                                $('.e-card-item.active > .e-card-desc:nth-child(4)').addClass('col-xs-1');
                                                                $('.e-card-item.active > .e-card-desc:nth-child(5)').addClass('col-xs-1');
                                                                $('.e-card-item.active > .e-card-desc:nth-child(6)').addClass('col-xs-1');
                                                                $('.e-card-item.active > .e-card-desc:nth-child(7)').addClass('col-xs-1');
                                                                $('.e-card-item.active > .e-card-desc:nth-child(8)').addClass('col-xs-2');
                                                                $('.table-header > .e-card-title').removeClass('col-xs-1 col-xs-2 col-xs-4');
                                                                $('.table-header > .e-card-title:nth-child(1)').addClass('col-xs-2');
                                                                $('.table-header > .e-card-title:nth-child(2)').addClass('col-xs-1');
                                                                $('.table-header > .e-card-title:nth-child(3)').addClass('col-xs-2');
                                                                $('.table-header > .e-card-title:nth-child(4)').addClass('col-xs-1');
                                                                $('.table-header > .e-card-title:nth-child(5)').addClass('col-xs-1');
                                                                $('.table-header > .e-card-title:nth-child(6)').addClass('col-xs-1');
                                                                $('.table-header > .e-card-title:nth-child(7)').addClass('col-xs-1');
                                                                $('.table-header > .e-card-title:nth-child(8)').addClass('col-xs-2');
                                                                $('.table-header > .e-card-title:nth-child(9)').addClass('col-xs-1');
                                                            });
                                                        }
                                                    });
                                                    $('.progress').removeClass('loading');
                                                }
                                            });
                                        }
                                        var imgToPost, genderToPost, ageToPost, referenceToPost = [],
                                            typeToPost = [],
                                            colorToPost = [],
                                            weatherToPost = [],
                                            occasionToPost = [];
                                        $('.e-card-new').click(function (e) {
                                            if ($('.e-card-new').hasClass('active')) {
                                                if (e.target == $('.fa-eye')[0]) {
                                                    $('.e-card-new.active > .e-card-desc > div.ul-title >').unbind();
                                                    $(this).removeClass('active');
                                                    $('.e-card-new').css('max-height', '7vh');
                                                }
                                            } else {
                                                $('.e-card-new').addClass('active');
                                                $('.e-card-new').css('max-height', '400vh');
                                                $('.e-card-new.active > .e-card-desc > div.ul-title >').click(function () {
                                                    var indexOfUL = $(this).parent().parent().index();
                                                    $('.e-card-new.active > .e-card-desc:nth-child(' + (indexOfUL + 1) + ') > div > ul').toggleClass('active');
                                                    $('.e-card-new.active > .e-card-desc:nth-child(' + (indexOfUL + 1) + ') > div > i').toggleClass('active');
                                                });
                                            }
                                        });
                                        $('.e-card-new > .e-card-desc > div > ul > li').click(function () {
                                            if (!$(this).hasClass('disabled')) {
                                                var indexOfLi = $(this).parent().parent().parent().index() + 1;
                                                if (indexOfLi == 2 || indexOfLi == 3) {
                                                    $('.e-card-new > .e-card-desc:nth-child(' + indexOfLi + ') > div > ul > li').addClass('disabled');
                                                    $('.e-card-new > .e-card-desc:nth-child(' + indexOfLi + ') > div.ul-title').click();
                                                }
                                                $('.e-card-new > .e-card-desc:nth-child(' + indexOfLi + ')').append('<div class="col-xs-12 new" data-index="' + $(this).index() + '">' + $(this).html() + '<div class="fa fa-trash"></div></div>');
                                                $('.e-card-new > .e-card-desc:nth-child(' + indexOfLi + ') > .new:last-child() > .fa-trash').click(function () {
                                                    $('.e-card-new > .e-card-desc:nth-child(' + ($(this).parent().parent().index() + 1) + ') > div > ul > li:nth-child(' + (Number($(this).parent().attr('data-index')) + 1) + ')').removeClass('disabled');
                                                    if (($(this).parent().parent().index() + 1) == 2 || ($(this).parent().parent().index() + 1) == 3) {
                                                        $('.e-card-new > .e-card-desc:nth-child(' + ($(this).parent().parent().index() + 1) + ') > div > ul > li').removeClass('disabled');
                                                    }
                                                    $(this).parent().remove();
                                                });
                                                $(this).addClass('disabled');
                                            }

                                        });
                                        $('.e-card-img-new').click(function (e) {
                                            if (e.target == $('.fa-camera')[0]) {
                                                $('input[type="file"]').click();
                                            }
                                        });
                                        $('#uploadForm').submit(function () {
                                            $("#status").empty().text("File is uploading...");
                                            $('.progress').addClass('loading');
                                            $(this).ajaxSubmit({
                                                error: function (xhr) {
                                                    status('Error: ' + xhr.status);
                                                },
                                                success: function (res) {
                                                    $('.e-card-img-new > div > img').remove();
                                                    $('.e-card-img-new > div').append('<img class="col-xs-12" src="../IMG/ecards/' + res + '">');
                                                    imgToPost = res;
                                                    $('.progress').removeClass('loading');
                                                }
                                            });
                                            return false;
                                        });
                                        $('#uploadForm > input[type="file"]').change(function () {
                                            if ($('.e-card-img-new > div > img').length == 1) {
                                                var tempCurlUrlFromBan = $('.e-card-img-new > div > img').attr('src').split('/');
                                                tempCurlUrlFromBan = tempCurlUrlFromBan[tempCurlUrlFromBan.length - 1];
                                                $('.progress').toggleClass('loading');
                                                $.ajax({
                                                    type: 'POST',
                                                    url: '/db/e-cards/delete',
                                                    data: {
                                                        url: tempCurlUrlFromBan
                                                    },
                                                    success: function () {
                                                        $('.e-card-img-new > div > img').remove();
                                                        $('#uploadForm > input[type="submit"]').click();
                                                        $('.progress').removeClass('loading');
                                                    }
                                                });
                                            } else {
                                                $('#uploadForm > input[type="submit"]').click();
                                            }
                                        });
                                        $('.e-card-new > .e-card-desc > div.ref > .fa-plus-square').click(function () {
                                            var inputVal = $('.e-card-new > .e-card-desc > div.ref > input').val();
                                            if (inputVal != "") {
                                                if ($('.e-card-new > .e-card-desc:nth-child(4) > div.new:contains(' + inputVal + ')').length == 0) {
                                                    $('.e-card-new > .e-card-desc:nth-child(4)').append('<div class="col-xs-12 new">' + inputVal + '<div class="fa fa-trash"></div></div>');
                                                    $('.e-card-new > .e-card-desc:nth-child(4) > .new:last-child() > .fa-trash').click(function () {
                                                        $(this).parent().remove();
                                                    });
                                                }

                                            }
                                        });
                                        $('.e-card-new > .e-card-desc > .fa-ban').click(function () {
                                            $('.e-card-new > .e-card-desc > div > .fa-trash').click();
                                            if ($('.e-card-img-new > div > img').length == 1) {
                                                var tempCurlUrlFromBan = $('.e-card-img-new > div > img').attr('src').split('/');
                                                tempCurlUrlFromBan = tempCurlUrlFromBan[tempCurlUrlFromBan.length - 1];
                                                $('.progress').toggleClass('loading');
                                                $.ajax({
                                                    type: 'POST',
                                                    url: '/db/e-cards/delete',
                                                    data: {
                                                        url: tempCurlUrlFromBan
                                                    },
                                                    success: function () {
                                                        $('.progress').removeClass('loading');
                                                        $('.e-card-img-new > div > img').remove();
                                                    }
                                                });
                                            }
                                            if (editingECard) {
                                                editingECard = false;
                                                $('.e-card-item').css('max-height', '7vh');
                                                $('.fa-eye').click();
                                                $('.fa-eye').click();
                                                console.log(editingECard);
                                            }
                                        });
                                        $('.e-card-new > .e-card-desc > .fa-plus-square').click(function () {
                                            for (var i = 1; i < $('.e-card-new > .e-card-desc').length - 1; i++) {
                                                for (var j = 0; j < $('.e-card-new > .e-card-desc:nth-child(' + (i + 1) + ') > div.new').length; j++) {
                                                    if ($('.e-card-new > .e-card-desc:nth-child(' + (i + 1) + ') > div.new:nth-child(' + (j + 1) + ')')) {
                                                        var tempVal = $($('.e-card-new > .e-card-desc:nth-child(' + (i + 1) + ') > div.new')[j]).html().split('<div')[0];
                                                        if (i == 1) {
                                                            genderToPost = tempVal;
                                                        } else if (i == 2) {
                                                            ageToPost = tempVal;
                                                        } else if (i == 3) {
                                                            referenceToPost[j] = tempVal;
                                                        } else if (i == 4) {
                                                            typeToPost[j] = tempVal;
                                                        } else if (i == 5) {
                                                            colorToPost[j] = tempVal;
                                                        } else if (i == 6) {
                                                            weatherToPost[j] = tempVal;
                                                        } else if (i == 7) {
                                                            occasionToPost[j] = tempVal;
                                                        }
                                                    }
                                                }
                                            }
                                            var objToPost = {
                                                url: imgToPost,
                                                gender: genderToPost,
                                                age: ageToPost,
                                                reference: referenceToPost,
                                                type: typeToPost,
                                                color: colorToPost,
                                                weather: weatherToPost,
                                                occasion: occasionToPost
                                            }
                                            $('.progress').addClass('loading');
                                            $.ajax({
                                                type: "POST",
                                                url: 'db/e-cards/upload',
                                                data: objToPost,
                                                success: function (res) {
                                                    $('.e-cards-table > div.active > .e-card-desc > .fa-eye').click();
                                                    $('.e-cards-table > div.active > .e-card-desc > .fa-ban').click();
                                                    if ($('.table-page').last().hasClass('active')) {
                                                        $('.table-page').first().click();
                                                        $('.table-page').last().click();
                                                    }
                                                    $('.progress').removeClass('loading');
                                                }
                                            })
                                        });
                                        $('.table-page').click(function () {
                                            if (!$(this).hasClass('active')) {
                                                $('.table-page.active').removeClass('active');
                                                $(this).addClass('active');
                                                var currentPageIndex = $('.table-page.active').index();
                                                requestECards(currentPageIndex - 1);
                                            }
                                        });
                                        $('.table-next').click(function () {
                                            var currentPageIndex = $('.table-page.active').index();
                                            if (currentPageIndex < pages) {
                                                $('.table-page.active').removeClass('active');
                                                $($('.table-page')[currentPageIndex]).addClass('active');
                                                requestECards(currentPageIndex);
                                            }
                                        });
                                        $('.table-prev').click(function () {
                                            var currentPageIndex = $('.table-page.active').index();
                                            if (currentPageIndex > 1) {
                                                $('.table-page.active').removeClass('active');
                                                $($('.table-page')[currentPageIndex - 2]).addClass('active');
                                                requestECards(currentPageIndex - 2);
                                            }
                                        });
                                        $('.table-page')[0].click();
                                    }
                                });
                            }
                        });
                    }
                    var editingECard = false;
                    $('.progress').addClass('loading');
                    getAges()

                }
                $('N').html(name);
                if (admin && edit) {
                    $('.header').find('*').unbind();
                    $('.content').find('*').unbind();
                    $('.footer').find('*').unbind();
                    $('.occasionsBtn').removeClass('disabled');
                    bindEditable();
                }
            });
        };

    next = function (cur) {
        current = cur;
        if (cur !== 'login') {
            currentIndex = divs.indexOf(cur);
        }
        localStorage.currentIndex = currentIndex;
        $('.prev').remove();
        $('.current').addClass('prev').removeClass('current');
        loadView($('.next > .container'));
        $('.next').addClass('current').removeClass('next');
        $('.content').append('<div class="screen next"><div class="container col-xs-12"></div></div>');
    };
    previous = function (cur) {
        current = cur;
        if (currentIndex >= 0) {
            currentIndex = divs.indexOf(cur);
            localStorage.currentIndex = currentIndex;
            $('.next').remove();
            $('.current').addClass('next').removeClass('current');
            loadView($('.prev > .container'));
            $('.prev').addClass('current').removeClass('prev');
            $('.content').append('<div class="screen prev"><div class="container col-xs-12"></div></div>');
        } else {
            console.error('No prev page');
        }
    };
    loadAdmin = function () {
        var access_level,
            tempLocalStorage = JSON.parse(localStorage.admin);
        var data = {
            username: tempLocalStorage.username,
            password: tempLocalStorage.token
        };
        $('.progress').addClass('loading');
        $.ajax({
            type: "POST",
            url: "/db/users/login",
            data: data,
            success: function (res) {
                if (res.status !== 200) {
                    console.log(res);
                } else {
                    access_level = res.access_level;
                    $('body').prepend('<div class="ui col-xs-12 hidden-xs"> <input type="color" class="colorPicker" style="display:none;"> <div class="ui-section col-xs-1"> <div class="ui-option backAdmin col-xs-6"><i class="fa fa-angle-left" aria-hidden="true"></i></div> <div class="ui-option nextAdmin col-xs-6"><i class="fa fa-angle-right" aria-hidden="true"></i></div> </div> <div class="ui-section col-xs-1"> <div class="ui-option toggle-edit-mode col-xs-12"> <h6>Edit mode</h6> </div> </div> <div class="col-xs-2 ui-section"> <div class="col-xs-12 ui-option admin-color"> <h6>Color</h6> </div> <div class="col-xs-12 ui-hidden color-hidden"> <ul class="colors"> <li> <h5>Boy</h5> <div data-var="boy" class="color"> <h5>Boy</h5> </div> <div class="color-edit"><i class="fa fa-pencil" aria-hidden="true"></i></div> </li> <li> <h5>Girl</h5> <div data-var="girl" class="color"> <h5>Girl</h5> </div> <div class="color-edit"><i class="fa fa-pencil" aria-hidden="true"></i></div> </li> <li> <h5>Baby Boy</h5> <div data-var="bBoy" class="color"> <h5>Baby Boy</h5> </div> <div class="color-edit"><i class="fa fa-pencil" aria-hidden="true"></i></div> </li> <li> <h5>Baby Girl</h5> <div data-var="bGirl" class="color"> <h5>Baby Girl</h5> </div> <div class="color-edit"><i class="fa fa-pencil" aria-hidden="true"></i></div> </li> <li> <h5>Newborn Boy</h5> <div data-var="nBoy" class="color"> <h5>Newborn Boy</h5> </div> <div class="color-edit"><i class="fa fa-pencil" aria-hidden="true"></i></div> </li> <li> <h5>Newborn Girl</h5> <div data-var="nGirl" class="color"> <h5>Newborn Girl</h5> </div> <div class="color-edit"><i class="fa fa-pencil" aria-hidden="true"></i></div> </li> </ul> </div> </div> <div class="col-xs-4 ui-section"> <div class="col-xs-12 ui-option" style="cursor:default;padding:0">Admin mode</div> </div> <div class="col-xs-1 ui-section"> <div class="col-xs-12 ui-option admin-sections"> <h6>Sections</h6> </div> <div class="col-xs-12 ui-hidden sections-hidden"> <ul class="section-divs"> </ul> </div> </div> <div class="col-xs-2 ui-section user"> <div class="ui-option col-xs-12 admin-user" style="padding:0 3px;"> <h6 class="col-xs-8" style="padding-right: 0;">Username</h6><i class="fa fa-user-o col-xs-4" aria-hidden="true" style="padding:0;"></i></div> <div class="col-xs-12 ui-hidden user-hidden"> <ul class="user-settings"> </li> <li class="settings"> <h5>Settings</h5> </li> <li class="log-out"> <h5>Log out</h5> </li> </ul> </div> </div> <div class="col-xs-1 ui-section hide-admin"> <div class="col-xs-12 ui-option"><i class="fa fa-times fa-1x exit" aria-hidden="true"></i></div> </div> </div>');
                    if (access_level === '8') {
                        $('.user-settings').prepend('<li class="register"> <h5>Register user</h5> </li>');
                        $('.register').click(function () {
                            if (current !== 'register') {
                                next('register');
                            }
                        });
                        $('.user-settings').prepend('<li class="e-cards"> <h5>E-cards</h5> </li>');
                        $('.e-cards').click(function () {
                            if (current !== 'e-cards') {
                                next('e-cards');
                            }
                        });
                    }
                    $('.log-out').click(function () {
                        localStorage.removeItem('admin');
                        location.reload();
                    });
                    $('.admin-user > h6').html(JSON.parse(localStorage.admin).adminName);
                    $('.nextAdmin').click(function () {
                        if (currentIndex === 100) {
                            currentIndex = -1;
                        }
                        currentIndex++;
                        next(divs[currentIndex]);
                        $('.header > .head:nth-child(1)').removeClass('transparent');
                    });
                    $('.backAdmin').click(function () {
                        if (currentIndex === 100) {
                            currentIndex = 1;
                        }
                        if (currentIndex >= 1) {
                            currentIndex--;
                            previous(divs[currentIndex]);
                            if (currentIndex === 0) {
                                $('.header > .head:nth-child(1)').addClass('transparent');
                            }
                        }
                    });
                    $('body').addClass('admin');
                    $('.admin-color').hover(function () {
                        $('.color-hidden').addClass('active');
                        $('.color-hidden').hover(function () {
                            $('.color-hidden').addClass('active');
                        }, function () {
                            $('.color-hidden').removeClass('active');
                        });
                    }, function () {
                        $('.color-hidden').removeClass('active');
                        $('.color-hidden').unbind('hover');
                    });
                    $('.admin-user').hover(function () {
                        $('.user-hidden').addClass('active');
                        $('.user-hidden').hover(function () {
                            $('.user-hidden').addClass('active');
                        }, function () {
                            $('.user-hidden').removeClass('active');
                        });
                    }, function () {
                        $('.user-hidden').removeClass('active');
                        $('.user-hidden').unbind('hover');
                    });
                    $('.admin-sections').hover(function () {
                        $('.sections-hidden').addClass('active');
                        $('.sections-hidden').hover(function () {
                            $('.sections-hidden').addClass('active');
                        }, function () {
                            $('.sections-hidden').removeClass('active');
                        });
                    }, function () {
                        $('.sections-hidden').removeClass('active');
                        $('.sections-hidden').unbind('hover');
                    });
                    var i;
                    for (i = 0; i < divs.length; i++) {
                        $('.section-divs').append('<li data-section="' + divs[i] + '"><h5>' + divs[i] + '</h5></li>');
                        $('.section-divs > li:last-child()').click(function () {
                            var dataSection = $(this).attr('data-section');
                            if (current !== dataSection) {
                                if (currentIndex < divs.indexOf(dataSection)) {
                                    next(dataSection);
                                } else {
                                    previous(dataSection);
                                }
                            }
                        });
                    }
                }
                $('.colors > li > .color').click(function () {
                    var color = $(this).attr('data-var');
                    currentClass = color;
                    $('body > .header').removeClass('boy girl bBoy bGirl nBoy nGirl');
                    $('body > .footer > .loader').removeClass('boy girl bBoy bGirl nBoy nGirl');
                    $('body > .content > .current > .container > div').removeClass('boy girl bBoy bGirl nBoy nGirl');
                    $('body > .header').addClass(currentClass);
                    $('body > .footer > .loader').addClass(currentClass);
                    $('body > .content > .current > .container > div').addClass(currentClass);
                });
                $('.colors > li > .color-edit').click(function () {
                    var color = $(this).siblings('.color').attr('data-var');
                    $('.colorPicker').change(function () {
                        console.log(color);
                        requestColorChange(color, $('.colorPicker').val());
                        $('.colorPicker').unbind('change');
                    });
                    $('.colorPicker').click();
                });
                currentIndex = localStorage.currentIndex || -1;
                gender = gender || 'M';
                name = name || 'Alejo';
                age = age || 5;
                bottomSize = bottomSize || 24;
                topSize = topSize || 24;
                shoeSize = shoeSize || 24;
                weather = weather || 'hot';
                favColor = favColor || 2;
                current = divs[currentIndex];
                currentClass = currentClass || 'boy';
                $('.toggle-edit-mode').click(function () {
                    edit = !edit;
                    $(this).toggleClass('active');
                    if (edit) {
                        $('body').addClass('edit');
                        $('.header').find('*').unbind();
                        $('.content').find('*').unbind();
                        $('.footer').find('*').unbind();
                        $('.occasionsBtn').removeClass('disabled');
                        bindEditable();
                    } else {
                        $('body').removeClass('edit');
                        $('.text-editable').unbind();
                    }
                });
                $('.hide-admin').click(function () {
                    $('body').toggleClass('admin');
                    $(this).toggleClass('admin-hidden');
                    $('.hide-admin > .ui-option > .fa').toggleClass('exit fa-times fa-arrow-down');
                    admin = false;
                });
                console.log('Loaded admin.');
                $('.progress').removeClass('loading');
            }
        });
    };
    //Extras
    if (status == 404) {
        if (current != '404') {
            if (localStorage.current) {
                var tempCurrent = localStorage.current;
            }
            next('404');
            current = tempCurrent || 'gender';
            localStorage.current = current;
            $('.progress').removeClass('loading');
            return;
        }

    }
    if (localStorage.current) {
        current = localStorage.current;
        gender = localStorage.gender;
        name = localStorage.name;
        age = localStorage.age;
        bottomSize = localStorage.bottomSize;
        topSize = localStorage.topSize;
        shoeSize = localStorage.shoeSize;
        weather = localStorage.weather;
        favColor = localStorage.favColor;
        currentClass = localStorage.currentClass;
        if (localStorage.occasion !== undefined) {
            occasion = JSON.parse(localStorage.occasion);
        } else {
            occasion = [];
        }
        if (localStorage.personality !== undefined) {
            personality = JSON.parse(localStorage.personality);
        } else {
            personality = [];
        }
        if (admin) {
            if (localStorage.admin) {
                console.log('Logged in.');
                loadAdmin();
                current = divs[0];
            } else {
                currentIndex = -10;
                console.log('Not logged in.');
                current = 'login';
            }
        }
        next(current);
        $('.progress').removeClass('loading');
    } else {
        if (admin) {
            if (localStorage.admin) {
                console.log('Logged in.');
                loadAdmin();
                current = divs[0];
            } else {
                currentIndex = -10;
                current = 'login';
                console.log('Not logged in.');
            }
        } else {
            current = divs[0];
        }
        next(current);
        $('.progress').removeClass('loading');
    }
    $('.back').click(function () {
        if (current === divs[5]) {
            if (currentClass !== 'nBoy' && currentClass !== 'nGirl') {
                currentIndex--;
            }
        }
        if (current === divs[4]) {
            currentIndex--;
        }
        currentIndex--;
        previous(divs[currentIndex]);
        if (current === divs[1]) {
            $('.loader > .progress').css('width', '10%');
            if (gender === "F") {
                currentClass = "girl";
                localStorage.currentClass = currentClass;
            } else if (gender === "M") {
                currentClass = "boy";
                localStorage.currentClass = currentClass;
            }
        } else if (current === divs[2]) {
            $('.loader > .progress').css('width', '20%');
        } else if (current === divs[3]) {
            $('.loader > .progress').css('width', '30%');
        } else if (current === divs[4]) {
            $('.loader > .progress').css('width', '30%');
        } else if (current === divs[5]) {
            $('.loader > .progress').css('width', '40%');
        } else if (current === divs[6]) {
            $('.loader > .progress').css('width', '50%');
        } else if (current === 'looks') {
            $('.loader > .progress').css('width', '60%');
        } else if (current === divs[7]) {
            $('.loader > .progress').css('width', '70%');
        } else if (current === divs[8]) {
            $('.loader > .progress').css('width', '80%');
        }
    });
    $('.exit').click(function () {
        localStorage.clear();
    });
});
