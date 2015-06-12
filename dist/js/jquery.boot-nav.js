/**
 * Created by zhou on 2015-06-01.
 *
 * 优化待解决：
 * 2015-06-03 当前为不论何种分辨率都有tooltip，应改为只有当分辨率为tablet的时候才显示tooltip
 * 2015-06-03 用jQuery的show和hide方法时，show正常，hide方法无法正常使用
 */
;
(function ($) {
    $.fn.bootNav = function (options) {
        var defaults = {
            method:'post',
            width:'200px',
            height:'100%',
            tabletSize:1024,
            pageContainer:''
        }
        var options = $.extend(defaults, options);
        var $this = this;
        if(options.url){
            $.ajax({
                url:options.url,
                method:options.method,
                success:function(data){
                    appendDom($this ,data ,options);
                }
            });
        }
        $this.css({
            width:options.width,
            height:options.height,
            overFlow:'hidden'
        });
        initNav(this,options);
    }
    function initNav($nav , options){
        $nav.each(function () {
            $(".bn-li").on('click', {options:options}, menuClicked);
            if($(this).find(".bn-label").css('display') == 'none'){
                $(this).find('.bn-li').on('mouseenter',iconHover);
            }else{
                $(this).find('.bn-li').off('mouseenter');
            }
            $('body').on('click', function () {
                $('.bn-child-menu-container').remove();
            });
            $('.bn-li').filter(".bn-has-children").append('<span class="bn-arrow"></span>');
            $('.bn-arrow').addClass('glyphicon glyphicon-menu-right');

        });
    }
    function appendDom($nav , data,options){
       //$nav.children().remove();
        var $ul;
        if($nav.has('.bn-nav').length>0 && $nav.has('.bn-ul').length>0){
            $ul = $nav.children('.bn-nav').children('.bn-ul');
        }else{
            $nav.children().remove();
            $ul = $('<ul class="bn-ul"></ul>').appendTo($('<nav class="bn-nav"></nav>').appendTo($nav));
        }

        for(var i in data){
            var $li = $('<li id="bn-li-'+data[i].id+'" class="bn-li"></li>').attr('data-url',data[i].url).appendTo($ul);
            $('<span class="bn-icon"></span>').addClass(data[i].iconCls).appendTo($li);
            $('<span class="bn-label">'+data[i].name+'</span>').appendTo($li);
            if(data[i].children && data[i].children.length>0){
                $li.addClass("bn-has-children glyphicon glyphicon-menu-right");
                appendChildDom($li , data[i].children);
            }
        }
        initNav($nav , options)
    }
    function appendChildDom($parent , data){
        var $ul = $('<ul class="bn-child-ul"></ul>').appendTo($parent);
        for(var i in data){
            var $li = $('<li id="bn-li-'+data[i].id+'" class="bn-li"></li>').attr('data-url',data[i].url).appendTo($ul);
            $('<span class="bn-icon"></span>').addClass(data[i].iconCls).appendTo($li);
            $('<span class="bn-label">'+data[i].name+'</span>').appendTo($li);
            if(data[i].children && data[i].children.length>0){
                $li.addClass("bn-has-children glyphicon glyphicon-menu-right");
                appendChildDom($li , data[i].children);
            }
        }
    }
    function menuClicked(event ) {
        event.stopPropagation();
        $(this).parent().find('.bn-li-active').removeClass('bn-li-active').addClass('bn-li');
        $(this).removeClass('bn-li').addClass('bn-li-active');
        $('.bn-child-menu-container').hide();
        $(this).parents('.bn-child-menu-container').show();

        linkTo($(this).attr('data-url'),event.data.options);

        if ($(this).children('ul').length > 0) {
            var temp = $("<div></div>");
            temp.html($(this).html()).addClass('bn-child-menu-container');
            temp.appendTo($('body'));
            if (temp.height() + $(this).offset().top <= $('body').height()) {
                temp.css({
                    left: $(this).offset().left + $(this).width() + 3,
                    top: $(this).offset().top
                });
            } else {
                temp.css({
                    left: $(this).offset().left + $(this).width() + 3,
                    top: $(this).offset().top - temp.height() + $(this).height()
                });
            }
            temp.hide().show(500);
            temp.children('.bn-arrow').remove();
            $(".bn-li").on('click',  {options:event.data.options},menuClicked);
        } else {
            $('.bn-child-menu-container').remove();
        }
    }
    function linkTo(url,options){
        if(options.pageContainer){
            //如果URL为#的话不涉及任何界面跳转，也就不需要处理任何事情了。
            if(url != '#'){
                //options中的pageContainer支持两种传值方式：选择器和jQuery对象，
                //该container可以是一个iframe，也可是是其他类型的DOM，建议使用iframe或者div，注（需要自己制定该页面的宽度）
                if(typeof(options.pageContainer) == 'string'){
                    var $c = $(options.pageContainer);
                    if($c.length>0){
                        if($c.is('iframe')){
                            $c.attr('src',url);
                        }else{
                            $c.children().remove();
                            $('<iframe class="bn-pageContainer"></iframe>').appendTo($c).attr('src',url);
                        }
                    }else{
                        console.error("System cannot find any elements with the selector you supported ! Please check your code and retry");
                    }
                }else{
                    var $c = options.pageContainer;
                    if($c.is('iframe')){
                        $c.attr('src',url);
                    }else{
                        $c.children().remove();
                        $('<iframe class="bn-pageContainer"></iframe>').appendTo($c).attr('src',url);
                    }
                }
            }
        }else{
            window.location.href=url;
        }
    }
    function iconHover() {
        var text = $(this).children('.bn-label').text();
        $(this).tooltip({
            title: text,
            placement: 'right'
        }).tooltip('show');
    }

})(jQuery);