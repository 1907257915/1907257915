//requestAnimationFrame兼容写法
if(!window.requestAnimationFrame){
  var lastTime = 0;
  window.requestAnimationFrame = function(callback){
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0,16.7-(currTime - lastTime));
    var id = window.setTimeout(function(){
      callback(currTime + timeToCall);
    },timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  }
}
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}
//事件处理程序兼容写法
function addEvent(target,type,handler){
  if(target.addEventListener){
    target.addEventListener(type,handler,false);
  }else{
    target.attachEvent('on'+type,function(event){
      return handler.call(target,event);
    });
  }
}
/*******生成元素*******/
var list = document.createElement('ul');
list.id = 'list';
list.innerHTML = '<li id="menuTop">回到顶部</li>\
  <li id="menuFavour">点赞(<span id="favourNum">0</span>赞)</li>\
  <li id="menuCommand">评论</li>';
document.body.appendChild(list);
/*******添加样式**********/
function loadStyles(str){
  var style = document.createElement("style");
  style.type = "text/css";
  try{
    style.innerHTML = str;
  }catch(ex){
    style.styleSheet.cssText = str;
  }
  var head = document.getElementsByTagName('head')[0];
  head.appendChild(style); 
}
loadStyles("#list{margin: 0!important;\
  padding: 0!important;\
  width: 120px;\
  text-align: center;\
  cursor: pointer;\
  font:20px/40px '宋体';\
  background-color: #eee;\
  position:fixed;\
  display:none;}\
  #list li{list-style:none!important;}\
#list li:hover{background-color: lightblue;color: white;font-weight:bold;}");    
//DOM结构稳定后，再操作
addEvent(window,'load', contextMenuLoad);
function contextMenuLoad(){
  /********显示和隐藏菜单***********/
  addEvent(document,'click',function(){
    list.style.display = 'none';
  })
  //右键点击时，菜单显示
  document.oncontextmenu = function(e){
    e = e || event;
    //通常情况下，菜单的位置就是鼠标的位置
    list.style.left = e.clientX + 'px';
    list.style.top = e.clientY + 'px';
    //当鼠标的位置到视口底部的位置小于菜单的高度，则鼠标的位置为菜单的底部位置
    if(document.documentElement.clientHeight - e.clientY < list.offsetHeight){
      list.style.top = e.clientY - list.offsetHeight + 'px';
    }
    //当鼠标的位置到视口右侧的位置小于菜单的宽度，则视口的右侧为菜单的右侧
    if(document.documentElement.clientWidth - e.clientX < list.offsetWidth){
      list.style.left = document.documentElement.clientWidth - list.offsetHeight + 'px';
    }
    list.style.display = 'block';
    //点击右键的同时按下ctrl键，那么将显示默认右键菜单
    if(e.ctrlKey){
      list.style.display = 'none';
    //如果只是点击右键，则显示自定义菜单
    }else{
      return false;
    }    
  }  
  /*********回到顶部功能*********/
  var timer = null;  
  menuTop.onclick = function(){
    cancelAnimationFrame(timer);
    //获取当前毫秒数
    var startTime = +new Date(); 
    //获取当前页面的滚动高度
    var b = document.body.scrollTop || document.documentElement.scrollTop;
    var d = 500;
    var c = b; 
    timer = requestAnimationFrame(function func(){
      var t = d - Math.max(0,startTime - (+new Date()) + d);
    document.documentElement.scrollTop = document.body.scrollTop = t * (-c) / d + b;
    timer = requestAnimationFrame(func);
    if(t == d){
     cancelAnimationFrame(timer);
    } 
    });
  };
  /*********点赞功能**********/
  //模拟原始点赞按钮的点击事件
  var digg = document.getElementById('div_digg');
  if(digg){
    menuFavour.onclick = digg.children[0].onclick;      
  }
  //获取赞成数的函数
  function getfavourNum(){
    if(digg){
      favourNum.innerHTML = digg.children[0].children[0].innerHTML;
    }      
  }
  //页面载入时获取赞成数
  getfavourNum();
  if(menuFavour.addEventListener){
    menuFavour.addEventListener('click',function(){
      setTimeout(function(){
        getfavourNum();
      },2000);
    })  
  }else{
    menuFavour.attachEvent('onclick',function(){
      setTimeout(function(){
        getfavourNum();
      },2000);
    })    
  }
  /*********评论功能*********/
  menuCommand.onclick = function(){
    document.getElementById('comment_form_container').scrollIntoView();
  }
}