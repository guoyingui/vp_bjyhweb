// JavaScript Document
$(function(){
	//登录页
	$('.Bblogin_username input').focus(function(e) {
        $(this).parent().css('background','url(vpImages/login_inputbg_pressed.png)');
    });
	$('.Bblogin_username input').blur(function(e) {
        $(this).parent().css('background','url(vpImages/login_inputbg_default.png)');
    });
	$('.Bblogin_password input').focus(function(e) {
        $(this).parent().css('background','url(vpImages/login_inputbg_pressed.png)');
    });
	$('.Bblogin_password input').blur(function(e) {
        $(this).parent().css('background','url(vpImages/login_inputbg_default.png)');
    });
	//首页头部导航处效果
	$('.header_menu_ul li').click(function(e) {
        $(this).addClass('current').siblings().removeClass('current');
    });
	
	//操作页面效果
	$('.project_big_li .project_info').click(function(e) {
        $(this).parent().addClass('current').siblings().removeClass('current');
    });
	$('.save_icons span').click(function(e) {
        $(this).addClass('current').siblings().removeClass('current');
    });
	$('.Right_tabs .tab_wrapper li').click(function(e) {
        $(this).addClass('current').siblings().removeClass('current');
    });
	$('.table_four tr td .add').click(function(e) {
        $(this).css('background-image','url(vpImages/add_delete_pressed_icon.png)');
		$(this).siblings().css('background-image','url(vpImages/add_delete_icon.png)');
    });
	$('.table_four tr td .delete').click(function(e) {
        $(this).css('background-image','url(vpImages/add_delete_pressed_icon.png)');
		$(this).siblings().css('background-image','url(vpImages/add_delete_icon.png)');
    });
	//报表页面
	$('.report_t_right span').click(function(e) {
        $(this).css('background-image','url(vpImages/report_right_icons_pressed.png)');
		$(this).siblings().css('background-image','url(vpImages/report_right_icons.png)');
    });
	$('.table_three tr td').css('background-color','#fff');
	$('.table_three tr:even td').css('background-color','#f7f7f7');
	$('.table_three_first_tr td').css('background-color','#e7f5ff');
	$('.table_three tr:gt(0)').mouseover(function(e) {
        $(this).children('td').css('color','#87c8ff');
    });
	$('.table_three tr:gt(0)').mouseout(function(e) {
        $(this).children('td').css('color','#3e3e3e');
    });
})