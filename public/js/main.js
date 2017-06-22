$(function () {
    var edit = false;
    var currentIndex = localStorage.currentIndex - 1 || -1;
    //Variables
    var gender, name, age, topSize, bottomSize, shoeSize, weather, favColor, currentClass;
    var looks = [];
    var occasion = [];
    var personality = [];
    var current;
    //Functions
    var requestStringChange = function (toFind, toChange) {
        toChange = "'" + toChange + "'";
        toFind = "\r\nvar " + toFind;
        var data = {
            string: toFind,
            change: toChange
        }
        $.ajax({
            url: '/admin/edit',
            type: "POST",
            data: data,
            success: function (res) {
                console.log(res);
            }
        });
    }
    var requestColorChange = function (toFind, toChange) {
        var data = {
            string: "\n$" + toFind,
            change: toChange
        }
        $.ajax({
            type: 'POST',
            url: '/admin/colors',
            data: data,
            success: function (res) {
                console.log(res);
            }
        });
    }
    var bindEditable = function () {
        $('.text-editable').unbind();
        $('.text-editable').click(function () {
            var variable = $(this).attr('data-var');
            var temp = $(this);
            var tempParent = $(this).parent();
            var text = temp.html();
            $(this).css('display', 'none');
            tempParent.append('<input id="editing" class="' + temp.attr('class') + '"type="text" placeholder="' + text + '"/>');
            $('#editing').focus();
            $('#editing').keyup(function (e) {
                var key = e.keyCode || e.which;
                if (key == 13) {
                    if ($('#editing').val() != '') {
                        text = $('#editing').val();
                        $('#editing').focusout();
                    }
                }
            });
            $('#editing').focusout(function () {
                $('#editing').remove();
                requestStringChange(variable, text);
                temp.removeAttr('style');
                temp.html(text);
            });
        });
    }
    var next = function (cur) {
        current = cur;
        currentIndex = divs.indexOf(cur);
        localStorage.currentIndex = currentIndex;
        if (currentIndex > 0) {
            $('.header > .head:nth-child(1)').removeClass('transparent');
            $('.loader').addClass(currentClass);
        } else {
            $('.header > .head:nth-child(1)').addClass('transparent');
        }
        $('.prev').remove();
        $('.current').addClass('prev').removeClass('current');
        loadView($('.next > .container'));
        $('.next').addClass('current').removeClass('next');
        $('.content').append('<div class="screen next"><div class="container col-xs-12"></div></div>');
    }
    var previous = function (cur) {
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
    }
    var loadView = function (div) {
        div.load('views/' + current + '.html', function () {
            localStorage.current = current;
            if (current == divs[0]) {
                $('.gender > .selection-wrap > .title > .text').html(genderTitle);
                $('.gender > .selection-wrap > .selections > .background > .boySel').html(genderBoy);
                $('.gender > .selection-wrap > .selections > .background > .girlSel').html(genderGirl);
                $('.header > .head:nth-child(1)').addClass('transparent');
                $('.loader > .progress').css('width', '0%');
                $('.header').removeClass('bGirl nGirl girl boy bBoy nBoy');
                $('.loader').removeClass('bGirl nGirl girl boy bBoy nBoy');
                $('.header > .title > .cont').html(headTitle0);
                $('.header > .title > .cont').attr('data-var', 'headTitle0');
                $('.header > .head:nth-child(1)').addClass('transparent');
                $('.gender').addClass(currentClass);
                $('.boySel').hover(function () {
                    $('.gender').addClass('boy');
                }, function () {
                    $('.gender').removeClass('boy');
                })
                $('.boySel').click(function () {
                    if (gender == "F") {
                        name = undefined;
                        age = undefined;
                        topSize = undefined;
                        bottomSize = undefined;
                        shoeSize = undefined;
                        occasion = undefined;
                        weather = undefined;
                        favColor = undefined;
                        looks = [];
                        personality = [];
                        localStorage.clear();
                    }
                    gender = 'M';
                    localStorage.setItem(divs[0], gender);
                    currentClass = 'boy';
                    localStorage.currentClas = currentClass;
                    $('.gender').addClass(currentClass);
                    $('.header').addClass(currentClass);
                    $('.loader').addClass('active ' + currentClass);
                    $('.loader > .progress').css('width', '10%');
                    $('.header > .head:nth-child(1)').removeClass('transparent');
                    localStorage.setItem('currentClass', currentClass);
                    next(divs[1]);
                });
                $('.girlSel').hover(function () {
                    $('.gender').addClass('girl');
                }, function () {
                    $('.gender').removeClass('girl');
                })
                $('.girlSel').click(function () {
                    if (gender == "M") {
                        name = undefined;
                        age = undefined;
                        topSize = undefined;
                        bottomSize = undefined;
                        shoeSize = undefined;
                        occasion = undefined;
                        weather = undefined;
                        favColor = undefined;
                        looks = [];
                        personality = [];
                        localStorage.clear();
                    }
                    gender = 'F';
                    localStorage.setItem(divs[0], gender);
                    currentClass = 'girl';
                    localStorage.currentClas = currentClass;
                    $('.gender').addClass(currentClass);
                    $('.header').addClass(currentClass);
                    $('.loader').addClass('active ' + currentClass);
                    $('.loader > .progress').css('width', '10%');
                    $('.header > .head:nth-child(1)').removeClass('transparent');
                    localStorage.setItem('currentClass', currentClass);
                    next(divs[1]);
                });
            } else if (current == divs[1]) {
                $('.header > .title > .cont').html(headTitle1);
                $('.header > .title > .cont').attr('data-var', 'headTitle1');
                $('.name > .selection-wrap > .title > .text').html(nameTitle);
                $('.name > .selection-wrap > .continue > div > h3').html(nameBtn);
                if (name) {
                    $('.nameInput > h1 > input').val(name);
                    $('.continue').css('display', 'inherit');
                }
                $('.loader > .progress').css('width', '10%');
                $('.name').addClass(currentClass);
                $('.loader').addClass(currentClass);
                $('.header').addClass(currentClass);
                $('.nameInput > h1 > input').keyup(function (e) {
                    if ($(this).val().length > 0) {
                        $('.continue').css('display', 'inherit');
                        var code = e.which;
                        if (code == 13) {
                            e.preventDefault();
                            if ($(this).parent().parent().parent().parent().parent().hasClass('current')) {
                                $('.continue').click();
                            }
                        }
                    } else {
                        $('.continue').css('display', 'none');
                    }
                })
                $('.continue').click(function () {
                    name = $('.nameInput > h1 > input').val();
                    localStorage.name = name;
                    next(divs[2]);
                });
            } else if (current == divs[2]) {
                $('.header > .title > .cont').html(headTitle1);
                $('.header > .title > .cont').attr('data-var', 'headTitle1');
                $('.age > .selection-wrap > .title > .text-editable').html(ageTitle);
                if (age) {
                    $('.number').removeClass('selected');
                    $('.number[value="' + age + '"]').addClass('selected');
                    setClass(age);
                }
                $('.loader > .progress').css('width', '20%');
                $('.header').removeClass('bGirl nGirl girl boy bBoy nBoy');
                $('.loader').removeClass('bGirl nGirl girl boy bBoy nBoy');
                $('.age').removeClass('bGirl nGirl girl boy bBoy nBoy');
                $('.header').addClass(currentClass);
                $('.loader').addClass(currentClass);
                $('.age').addClass(currentClass);

                function setClass(comp) {
                    if (comp >= 0 && comp < 2) {
                        if (gender == "F") {
                            $('.age').addClass('nGirl');
                        } else {
                            $('.age').addClass('nBoy');
                        }
                    } else if (comp >= 2 && comp <= 5) {
                        if (gender == "F") {
                            $('.age').addClass('bGirl');
                        } else {
                            $('.age').addClass('bBoy');
                        }
                    } else if (comp > 5 && comp <= 13) {
                        if (gender == "F") {
                            $('.age').addClass('girl');
                        } else {
                            $('.age').addClass('boy');
                        }
                    }
                }
                $('.number').hover(function () {
                    var val = $(this).attr('value');
                    setClass(val);
                }, function () {
                    $('.age').removeClass('boy girl bBoy bGirl nBoy nGirl');
                    $('.age').addClass(currentClass);
                });
                $('.number').click(function () {
                    age = $(this).attr('value');
                    localStorage.setItem(divs[2], age);
                    setClass(age);
                    $('.number').removeClass('selected');
                    $(this).addClass('selected');
                    if (age >= 0 && age < 2) {
                        if (gender == "F") {
                            currentClass = 'nGirl';
                            localStorage.currentClas = currentClass;
                            $('.header').addClass(currentClass);
                            $('.loader').addClass(currentClass);
                        } else {
                            currentClass = 'nBoy';
                            localStorage.currentClas = currentClass;
                            $('.header').addClass(currentClass);
                            $('.loader').addClass(currentClass);
                        }
                        next(divs[4]);
                    } else if (age >= 2 && age <= 5) {
                        if (gender == "F") {
                            currentClass = 'bGirl';
                            localStorage.currentClas = currentClass;
                            $('.header').addClass(currentClass);
                            $('.loader').addClass(currentClass);
                        } else {
                            currentClass = 'bBoy';
                            localStorage.currentClas = currentClass;
                            $('.header').addClass(currentClass);
                            $('.loader').addClass(currentClass);
                        }
                        next(divs[3]);
                    } else if (age > 5 && age <= 13) {
                        if (gender == "F") {
                            currentClass = 'girl';
                            localStorage.currentClas = currentClass;
                            $('.header').addClass(currentClass);
                            $('.loader').addClass(currentClass);
                        } else {
                            currentClass = 'boy';
                            localStorage.currentClas = currentClass;
                            $('.header').addClass(currentClass);
                            $('.loader').addClass(currentClass);
                        }
                        next(divs[3]);
                    }
                    $('.age').addClass(currentClass);
                    localStorage.setItem('currentClass', currentClass);
                })
            } else if (current == divs[3]) {
                $('.header').removeClass('boy girl bBoy bGirl nBoy nGirl');
                $('.header').addClass(currentClass);
                $('.loader').removeClass('boy girl bBoy bGirl nBoy nGirl');
                $('.loader').addClass(currentClass);
                $('.header > .title > .cont').html(headTitle1);
                $('.header > .title > .cont').attr('data-var', 'headTitle1');
                $('.size > .selection-wrap > .title > .text-editable').html(sizeTitle);
                $('.size > .selection-wrap > .title > .text > N').html(name);
                var boySizes = [['12', '18', '24', '2t', '3t', '4t', '5t']
                                    , ['12', '18', '24', '2t', '3t', '4t', '5t']
                                    , ['21/22', '23/24', '25/26', '19', '20', '21', '22', '23', '24', '25', '26', '27']
                                   ];
                var girlSizes = [['12', '18', '24', '2t', '3t', '4t', '5t']
                                    , ['12', '18', '24', '2t', '3t', '4t', '5t']
                                    , ['21/22', '23/24', '25/26', '19', '20', '21', '22', '23', '24', '25', '26', '27']
                                   ];
                var bBoySizes = [['12', '18', '24', '2t', '3t', '4t', '5t']
                                    , ['12', '18', '24', '2t', '3t', '4t', '5t']
                                    , ['21/22', '23/24', '25/26', '19', '20', '21', '22', '23', '24', '25', '26', '27']
                                   ];
                var bGirlSizes = [['12', '18', '24', '2t', '3t', '4t', '5t']
                                    , ['12', '18', '24', '2t', '3t', '4t', '5t']
                                    , ['21/22', '23/24', '25/26', '19', '20', '21', '22', '23', '24', '25', '26', '27']
                                   ];
                var list = [];
                if (age >= 2 && age <= 5) {
                    if (gender == "M") {
                        list = bBoySizes;
                    } else {
                        list = bGirlSizes;
                    }
                } else if (age = 5 && age <= 13) {
                    if (gender == "M") {
                        list = boySizes;
                    } else {
                        list = girlSizes;
                    }
                }
                $('.size').addClass(currentClass);
                $('.padSize > .row').remove();
                for (var i = 0; i < list.length; i++) {
                    var counter = 3;
                    for (var j = 0; j < list[i].length; j++) {
                        if (counter == 3) {
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
                var continueCount = 0;
                $('.box').click(function () {
                    var datapad = $(this).attr('data-select');
                    if ($(this).hasClass('active')) {
                        $(this).removeClass('active');
                        if (datapad == 0) {
                            topSize = undefined;
                        } else if (datapad == 1) {
                            bottomSize = undefined;
                        } else if (datapad == 2) {
                            shoeSize = undefined;
                        }
                    } else {
                        $($('.padSize')[datapad]).find('.box').removeClass('active');
                        $(this).addClass('active');
                        if (datapad == 0) {
                            topSize = $(this).html();
                            localStorage.setItem('topSize', topSize);
                        } else if (datapad == 1) {
                            bottomSize = $(this).html();
                            localStorage.setItem('bottomSize', bottomSize);
                        } else if (datapad == 2) {
                            shoeSize = $(this).html();
                            localStorage.setItem('shoeSize', shoeSize);
                        }
                        if ($('.padSize > .row .active').length == 3) {
                            next(divs[5]);
                        }
                    }
                });
                $('.loader > .progress').css('width', '30%');
                if (shoeSize && topSize && bottomSize) {
                    $($('.padWrap')[0]).find('.box:contains("' + topSize + '")').last().addClass('active');
                    $($('.padWrap')[1]).find('.box:contains("' + bottomSize + '")').last().addClass('active');
                }
            } else if (current == divs[4]) {
                $('.sizePrimi > .selection-wrap > .title > .text > N').html(name);
                $('.header > .title > .cont').html(headTitle1);
                $('.header > .title > .cont').attr('data-var', 'headTitle1');
                $('.size > .selection-wrap > .title > .text-editable').html(sizePrimiTitle);
                var list = ['21/22', '23/24', '25/26', '19', '20', '21', '22', '23', '24', '25', '26', '27'];
                if (gender == "M") {
                    currentClass = 'nBoy';
                    localStorage.currentClas = currentClass;
                } else {
                    currentClass = 'nGirl';
                    localStorage.currentClas = currentClass;
                }
                $('.sizePrimi').addClass(currentClass);
                $('.padSizePrimi > .row').remove();
                var counter = 3;
                for (var i = 0; i < list.length; i++) {
                    if (counter == 3) {
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
                var continueCount = 0;
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
                $('.loader > .progress').css('width', '30%');
            } else if (current == divs[5]) {
                $('.header > .title > .cont').html(headTitle2);
                $('.header > .title > .cont').attr('data-var', 'headTitle2');
                $('.occasion > .selection-wrap > .title > .text-editable').html(occasionsTitle);
                $('.occasions > .background:nth-child(1) > .cont > .title > h3').html(occasionName1);
                $('.occasions > .background:nth-child(2) > .cont > .title > h3').html(occasionName2);
                $('.occasions > .background:nth-child(3) > .cont > .title > h3').html(occasionName3);
                $('.occasions > .background:nth-child(4) > .cont > .title > h3').html(occasionName4);
                $('.occasions > .background:nth-child(5) > .cont > .title > h3').html(occasionName5);
                $('.occasions > .background:nth-child(6) > .cont > .title > h3').html(occasionName6);
                $('.occasion > .occasionsBtn').html(occasionBtn);
                $('.loader > .progress').css('width', '40%');
                if (occasion.length > 0) {
                    for (var i = 0; i < occasion.length; i++) {
                        $('[data-occasion="' + occasion[i] + '"]').find('.cont').addClass('active');
                        $('.occasionsBtn').removeClass('disabled');
                    }
                }
                $('.occasion').addClass(currentClass);
                $('.background').click(function () {
                    var tempOccasion = $(this).attr('data-occasion');
                    if (occasion.indexOf(tempOccasion) >= 0) {
                        occasion.splice(occasion.indexOf(tempOccasion), 1);
                        if (occasion.length == 0) {
                            $('.occasionsBtn').addClass('disabled');
                        }
                    } else {
                        occasion.push(tempOccasion);
                        $('.occasionsBtn').removeClass('disabled');
                    }
                    $(this).find('.cont').toggleClass('active');
                });
                if (currentClass == 'nBoy' || currentClass == 'nGirl') {
                    $('.background:nth-child(1)').css('display', 'none');
                    $('.background:nth-child(6)').css('display', 'none');
                    $('.background:nth-child(2)').toggleClass('col-xs-offset-2');
                    $('.background:nth-child(3)').toggleClass('col-xs-offset-2 col-md-offset-0');
                }
                $('.occasionsBtn').click(function () {
                    if (occasion.length > 0) {
                        localStorage.occasion = JSON.stringify(occasion);
                        next(divs[6]);
                    }
                });
            } else if (current == divs[6]) {
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
            } else if (current == divs[7]) {
                $('.header > .title > .cont').html(headTitle2);
                $('.header > .title > .cont').attr('data-var', 'headTitle2');
                $('.color > .selection-wrap > .title > .text-editable').html(colorTitle);
                $('.colors > .color-wrap:nth-child(1) > .select').html(colorName1);
                $('.colors > .color-wrap:nth-child(2) > .select').html(colorName2);
                $('.colors > .color-wrap:nth-child(3) > .select').html(colorName3);
                $('.colors > .color-wrap:nth-child(4) > .select').html(colorName4);
                $('.loader > .progress').css('width', '70%');
                $('.color').addClass(currentClass);
                $('.select').click(function () {
                    favColor = $(this).attr('data-color');
                    localStorage.setItem('favColor', favColor);
                    next(divs[8]);
                });
            } else if (current == "looks") {
                $('.header > .title > .cont').html(headTitle2);
                $('.header > .title > .cont').attr('data-var', 'headTitle2');
                if (looks.length > 0) {
                    $('.continueLooks').removeClass('transparent');
                    for (var i = 0; i < looks.length; i++) {
                        $($('.looksWrap > .background')[looks[i]]).addClass('active');
                        $($('.looksWrap > .background')[looks[i]]).find('.fa').addClass('fa-heart').removeClass('fa-heart-o');
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
                    };
                });
                $('.looks').addClass(currentClass);
            } else if (current == divs[8]) {
                $('.header > .title > .cont').html(headTitle2);
                $('.header > .title > .cont').attr('data-var', 'headTitle2');
                $('.personality > .selection-wrap > .title > .text-editable').html(personalityTitle);
                $('.personWrap > .person:nth-child(1) > .background > .title > h4').html(personalityName1);
                $('.personWrap > .person:nth-child(2) > .background > .title > h4').html(personalityName2);
                $('.personWrap > .person:nth-child(3) > .background > .title > h4').html(personalityName3);
                $('.personWrap > .person:nth-child(4) > .background > .title > h4').html(personalityName4);
                $('.personWrap > .person:nth-child(5) > .background > .title > h4').html(personalityName5);
                if (personality.length > 0) {
                    for (var i = 0; i < personality.length; i++) {
                        $($('.person')[personality[i]]).removeClass('transparent');
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
                if (gender == 'F') {
                    $('.person:nth-child(1) > .background > .title > h4').html(personalityNameF1);
                    $('.person:nth-child(2) > .background > .title > h4').html(personalityNameF2);
                    $('.person:nth-child(3) > .background > .title > h4').html(personalityNameF3);
                    $('.person:nth-child(4) > .background > .title > h4').html(personalityNameF4);
                    $('.person:nth-child(5) > .background > .title > h4').html(personalityNameF5);
                }
            } else if (current == divs[9]) {
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
                $('.finish').click(function () {
                    localStorage.clear();
                    window.location.href = 'http://www.offcorss.com/';
                });
            } else if (current == 'login') {
                $('.head.title > .cont').html(headTitle4);
                $('.head.title > .cont').attr('data-var', 'headTitle4');
                var login = function (username, password) {
                    if (username != "" && password != "") {
                        var data = {
                            username: username,
                            password: password
                        };
                        $.ajax({
                            type: 'GET',
                            url: '/db/users/login',
                            data: data,
                            success: function (result) {
                                if (result.status != 200) {
                                    return console.error(result);
                                } else {
                                    sessionStorage.token = result.token;
                                    sessionStorage.username = result.username;
                                    loadAdmin();
                                    next('gender');
                                    return console.log('Logged in.');
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
                    if (e.keyCode == 13) {
                        $('.loginBtn').click();
                    }
                });
                localStorage.current = 'gender';

            } else if (current == 'register') {
                $('.head.title > .cont').html(headTitle4);
                $('.head.title > .cont').attr('data-var', 'headTitle4');
                $('.loader').removeClass('boy girl nBoy nGirl bBoy bGirl');
                $('body > .header').removeClass('boy girl nBoy nGirl bBoy bGirl');
                var register = function (username, email, password, name, last_name, gender, birthday, access_level) {
                    if (username != "" && password != "" && name != "" && email != "" && last_name != "" && gender != "" && birthday != "" && access_level != "") {
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
                            current_page: 'Gender'
                        };
                        $.ajax({
                            type: 'GET',
                            url: '/db/users/register',
                            data: data,
                            success: function (result) {
                                next('gender');
                                return console.log(result);
                            }
                        });
                    } else {
                        console.log('Fill everything.');
                    }
                };
                $('.registerBtn').click(function () {
                    var username = $('#username').val();
                    var email = $('#email').val();
                    var password = $('#password').val();
                    var name = $('#name').val();
                    var last_name = $('#last_name').val();
                    var gender = $('#gender').val();
                    var birthday = $('#birthday').val();
                    var access_level = $('#access_level').val();
                    register(username, email, password, name, last_name, gender, birthday, access_level);
                });
                $('.register > input').keyup(function (e) {
                    if (e.keyCode == 13) {
                        $('.registerBtn').click();
                    }
                });
                $('.register > select').keyup(function (e) {
                    if (e.keyCode == 13) {
                        $('.registerBtn').click();
                    }
                });
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
    }
    var loadAdmin = function () {
        var access_level;
        var data = {
            username: sessionStorage.username,
            password: sessionStorage.token
        };
        $.ajax({
            type: "GET",
            url: "/db/users/login",
            data: data,
            success: function (res) {
                access_level = res.access_level;
                $('body').prepend('<div class="ui col-xs-12"> <input type="color" class="colorPicker" style="display:none;"> <div class="ui-section col-xs-1"> <div class="ui-option backAdmin col-xs-6"><i class="fa fa-angle-left" aria-hidden="true"></i></div> <div class="ui-option nextAdmin col-xs-6"><i class="fa fa-angle-right" aria-hidden="true"></i></div> </div> <div class="ui-section col-xs-1"> <div class="ui-option toggle-edit-mode col-xs-12"> <h6>Edit mode</h6> </div> </div> <div class="col-xs-2 ui-section"> <div class="col-xs-12 ui-option admin-color"> <h6>Color</h6> </div> <div class="col-xs-12 ui-hidden color-hidden"> <ul class="colors"> <li> <h5>Boy</h5> <div data-var="boy" class="color"> <h5>Boy</h5> </div> <div class="color-edit"><i class="fa fa-pencil" aria-hidden="true"></i></div> </li> <li> <h5>Girl</h5> <div data-var="girl" class="color"> <h5>Girl</h5> </div> <div class="color-edit"><i class="fa fa-pencil" aria-hidden="true"></i></div> </li> <li> <h5>Baby Boy</h5> <div data-var="bBoy" class="color"> <h5>Baby Boy</h5> </div> <div class="color-edit"><i class="fa fa-pencil" aria-hidden="true"></i></div> </li> <li> <h5>Baby Girl</h5> <div data-var="bGirl" class="color"> <h5>Baby Girl</h5> </div> <div class="color-edit"><i class="fa fa-pencil" aria-hidden="true"></i></div> </li> <li> <h5>Newborn Boy</h5> <div data-var="nBoy" class="color"> <h5>Newborn Boy</h5> </div> <div class="color-edit"><i class="fa fa-pencil" aria-hidden="true"></i></div> </li> <li> <h5>Newborn Girl</h5> <div data-var="nGirl" class="color"> <h5>Newborn Girl</h5> </div> <div class="color-edit"><i class="fa fa-pencil" aria-hidden="true"></i></div> </li> </ul> </div> </div> <div class="col-xs-4 ui-section"> <div class="col-xs-12 ui-option" style="cursor:default;padding:0">Admin mode</div> </div> <div class="col-xs-1 ui-section"> <div class="col-xs-12 ui-option admin-sections"> <h6>Sections</h6> </div> <div class="col-xs-12 ui-hidden sections-hidden"> <ul class="section-divs"> </ul> </div> </div> <div class="col-xs-2 ui-section user"> <div class="ui-option col-xs-12 admin-user" style="padding:0 3px;"> <h6 class="col-xs-8" style="padding-right: 0;">Username</h6><i class="fa fa-user-o col-xs-4" aria-hidden="true" style="padding:0;"></i></div> <div class="col-xs-12 ui-hidden user-hidden"> <ul class="user-settings"> </li> <li class="log-out"> <h5>Log out</h5> </li> </ul> </div> </div> <div class="col-xs-1 ui-section hide-admin"> <div class="col-xs-12 ui-option"><i class="fa fa-times fa-1x exit" aria-hidden="true"></i></div> </div> </div>');
                if (access_level == 8) {
                    $('.user-settings').prepend('<li class="register"> <h5>Register user</h5> </li>');
                    $('.register').click(function () {
                        if (current != 'register') {
                            next('register');
                        }
                    });
                }
                $('.log-out').click(function () {
                    sessionStorage.clear();
                    location.reload();
                });
                $('.admin-user > h6').html(sessionStorage.username);
                $('.nextAdmin').click(function () {
                    currentIndex++;
                    next(divs[currentIndex]);
                    $('.header > .head:nth-child(1)').removeClass('transparent');
                })
                $('.backAdmin').click(function () {
                    if (currentIndex > 0) {
                        currentIndex--;
                        previous(divs[currentIndex]);
                        if (currentIndex == 0) {
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
                for (var i = 0; i < divs.length; i++) {
                    $('.section-divs').append('<li data-section="' + divs[i] + '"><h5>' + divs[i] + '</h5></li>');
                    $('.section-divs > li:last-child()').click(function () {
                        var dataSection = $(this).attr('data-section');
                        if (current != dataSection) {
                            if ( currentIndex < divs.indexOf(dataSection)){
                                next(dataSection);
                            }else{
                                previous(dataSection);
                            }
                        }
                    });
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
                        requestColorChange(color, $('.colorPicker').val());
                        $('.colorPicker').unbind('change');
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
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
                        $('.footer').find('*').unbind()
                        $('.occasionsBtn').removeClass('disabled');
                        bindEditable();
                    } else {
                        $('body').removeClass('edit');
                        $('.text-editable').unbind();
                        setTimeout(function () {
                            location.reload();
                        }, 1000);
                    }
                });
                $('.hide-admin').click(function () {
                    $('body').toggleClass('admin');
                    $(this).toggleClass('admin-hidden');
                    $('.hide-admin > .ui-option > .fa').toggleClass('exit fa-times fa-arrow-down')
                    admin = false;
                });
                console.log('Loaded admin.');
            }
        });
    }
    //Extras
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
        if (localStorage.occasion != undefined) {
            occasion = JSON.parse(localStorage.occasion);
        } else {
            occasion = [];
        }
        if (localStorage.personality != undefined) {
            personality = JSON.parse(localStorage.personality);
        } else {
            personality = [];
        }
        $('.loader').addClass('active ' + currentClass);
        $('.header').addClass(currentClass);
        if (admin) {
            if (sessionStorage.token) {
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
    } else {
        if (admin) {
            if (sessionStorage.token) {
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
    }
    $('.back').click(function () {
        if (current == divs[5]) {
            if (currentClass != 'nBoy' && currentClass != 'nGirl') {
                currentIndex--;
            }
        }
        if (current == divs[4]) {
            currentIndex--;
        }
        currentIndex--;
        previous(divs[currentIndex]);
        if (current == divs[0]) {} else if (current == divs[1]) {
            $('.loader > .progress').css('width', '10%');
            $('.header').removeClass('bGirl nGirl girl boy bBoy nBoy');
            $('.loader').removeClass('bGirl nGirl girl boy bBoy nBoy');
            $('.name').removeClass('bGirl nGirl girl boy bBoy nBoy');
            if (gender == "F") {
                currentClass = "girl";
                localStorage.currentClas = currentClass;
            } else if (gender == "M") {
                currentClass = "boy";
                localStorage.currentClas = currentClass;
            }
        } else if (current == divs[2]) {
            $('.loader > .progress').css('width', '20%');
        } else if (current == divs[3]) {
            $('.loader > .progress').css('width', '30%');
        } else if (current == divs[4]) {
            $('.loader > .progress').css('width', '30%');
        } else if (current == divs[5]) {
            $('.loader > .progress').css('width', '40%');
        } else if (current == divs[6]) {
            $('.loader > .progress').css('width', '50%');
        } else if (current == 'looks') {
            $('.loader > .progress').css('width', '60%');
        } else if (current == divs[7]) {
            $('.loader > .progress').css('width', '70%');
        } else if (current == divs[8]) {
            $('.loader > .progress').css('width', '80%');
        }
    });
    $('.exit').click(function () {
        localStorage.clear();
    });
});
