
//This function sets the desktop moving gallery 

function Block (i) {
    this.w = Math.round(Math.random() * 8) || 1;
    this.h = Math.round(Math.random() * 8) || 1;
    this.dom = $('<div class=lazy>').css({
        width : this.w * 60 - 2,
        height : this.h * 60 - 2,
        transition : 'all 1000ms ' + i + 'ms'
    });
    $('#grid').append(this.dom);
}

Block.prototype = {
    setPosition : function (x, y) {
        this.dom.css({
            top : y * 70,
            left : x * 70
        });
    }
}


function Grid () {
    this.blocks = [];
    this.grid = [];
}

Grid.prototype = {
    columns : 40,

    add : function (block) {
        this.blocks.push(block);
        this.findPlace(block);
    },

    clear : function () {
        var x, y;
        for (y = 0; y < this.grid.length; y++) {
            for (x = 0; x < this.grid[y].length; x++) {
                this.grid[y][x] = false;
            }
        }
        this.firstEmpty = 0;
    },

    firstEmpty : 0,
    findPlace : function (block) {
        var x, y,
            maxX = this.columns - block.w,
            maxY = this.grid.length + block.h;

        for (y = this.firstEmpty; y < maxY; y++) {
            for (x = 0; x <= maxX; x++) {
                if (this.place(block, x, y)) {
                    return;
                }
            }
        }
    },

    place : function (block, x, y) {
        var i, j,
            w = block.w,
            h = block.h;
        // check if we can place it
        for (i = 0; i < h; i++) {
            if (!this.grid[y + i]) {
                this.grid[y + i] = [];
            }
            for (j = 0; j < w; j++) {
                if (this.grid[y + i][x + j]) {
                    return false;
                }
            }
        }
        // we can place it, do so now
        for (i = 0; i < h; i++) {
            for (j = 0; j < w; j++) {
                this.grid[y + i][x + j] = true;
            }
        }
        block.setPosition(x, y);
        this.updateFirstEmpty();
        // return true so we know we placed the block
        return true;
    },

    updateFirstEmpty : function () {
        var x, y, hasEmpty;
        for (y = this.firstEmpty; y < this.grid.length; y++) {
            hasEmpty = false;
            for (x = 0; x < this.columns; x++) {
                if (!this.grid[y][x]) {
                    hasEmpty = true;
                }
            }
            if (hasEmpty) {
                this.firstEmpty = y;
                return;
            }
        }
    },

    setColumns : function (columns) {
        var i, block;
        if (columns === this.columns) {
            return;
        }
        $('#grid').css('margin-left', -columns * 5);
        this.columns = columns;
        this.clear();
        for (i = 0; i < this.blocks.length; i++) {
            this.findPlace(this.blocks[i], i);
        }
    }
}

var grid = new Grid();

for (var i = 0; i < 300; i++) {
    grid.add(new Block(i));
}


// change column count every second

var lastChange = +new Date();
function changeColumns() {
    var now = +new Date();
    var columns; 
    requestAnimationFrame(changeColumns);
    if (now - lastChange > 3000) {
        lastChange = now;
        columns = 10 + Math.round(Math.random() * 60);
        if (grid.columns === columns) {
            columns ++;
        }
        grid.setColumns(columns);
    }
}

changeColumns();

//Check to see if the site is running on a mobile browser
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;

// If the website is accessed from a mobile browser make the desktop grid not display and display a simple column based grid
$(document).ready(function($){
    if(!isMobile) {
    }
    else {
        $("#grid").css('display','none');
        for (i = 0; i <80 ; i++) {
          $(".mobile-looks").append('<div class="images-c"><span></span><img src="" /></div>');
        }
        
    }
});

//If it is mobile - take a peek and run through the posts to set them to the mobile grid
$(function(){

  // itemize the div elements in the mobile grid so we are able to access them later
  var mobileArr = [1,2,3,4,5,6,6,7,8,9,10,11,12,13,14,15,16,17,18];
  $( ".images-c" ).each(function( index ) {
    $(this).attr("id",idArr[index]);
  });

  //Make a request to The house of ladoshas tumblr
  var request = $.ajax({  url: "http://api.tumblr.com/v2/blog/thehouseofladosha.tumblr.com/posts?api_key=V0EUYuGTiPOFIY0gxZbuOJTIUYwPQX49i6wOHUkwrwiNfCfjtw&limit=50",
    dataType: 'jsonp',
    success: function(posts){

      // reverse the post order so we get the lastest posts at the top
      var postings_mobile = posts.response.posts.reverse();

        // create counters for the post item, their photos and the div items
        i = 0;
        x = 0;
        w = 0;

      var r = postings_mobile.reverse();

      for ( i in postings_mobile) {

          // create a variable for the post itself with x as a counter
          var the_post = postings_mobile[x];

        // if the post has a photo
       if (i < postings_mobile.length + the_post.photos) {
              $('.images-c img').eq(w).attr("src",the_post.photos[0].original_size.url);
              $('.images-c span ').eq(w).html('<div id="twit-cap-mobile" style="display:table-cell">'+ the_post.caption + '</div>'); 
       }

       // if the post is a quote or from twitter
       else  if ( the_post.type == "quote") { 
                $('.images-c span ').eq(w).html('<div id="twit-cap-mobile" style="display:table-cell">'+ the_post.text + '</div>'); 
                $('.images-c img').eq(w).css('display', "none"); 

       }

       // if the post is not a quote or a photo post  
       else   if ( !the_post.type == "quote" || !the_post.photos){ 
                $('.images-c img').eq(w).attr("src","");
                $('.images-c span ').eq(w).html('<div id="twit-cap-mobile" style="display:table-cell">'+ the_post.caption + '</div>');  
       }
       // if is anything else 
       else 
       { 
              $('.images-c img').eq(w).attr("src",the_post.photos[0].original_size.url);
              $('.images-c span').eq(w).html("");

        }

        // add one to each counter after each run
           i++;x++; w++;

      }
    }
  });                
});


// When the user accesses the website from a mobile browser run this code

// Itemize the div elements of lazy into an array
  var idArr = [1,2,3,4,5,6,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49];

    $( ".lazy" ).each(function( index ) {
        $(this).attr("id",idArr[index]);
    });

//Calling the tumblr API for the desktop browswer
$(function() {
  var request = $.ajax({  url: "http://api.tumblr.com/v2/blog/thehouseofladosha.tumblr.com/posts?api_key=V0EUYuGTiPOFIY0gxZbuOJTIUYwPQX49i6wOHUkwrwiNfCfjtw&limit=50",
    dataType: 'jsonp',
    success: function(posts){
      var postings_mobile = posts.response.posts;
      
      // create counter variables
      i = 0;
      x = 0;
      w = 0;

      console.log(postings_mobile);

      for (i in postings_mobile) {

        // make a posting variable with a counter for the index
        var the_post = postings_mobile[x];

        // is the post is a photo and has a caption
        if (i < postings_mobile.length + the_post.photos &&  the_post.caption) 
          {
             $('.lazy').eq(w).css({'text-align':'left'});
              $('.lazy').eq(w).html("<img style='width:80%;' src='"+the_post.photos[0].original_size.url+"'/>");
              $('.lazy').eq(w).append('<div id="twit-cap-home" style="over-flow:wrap;">'+ the_post.caption + '</div>'); 
            }
        // if the post is a quote
        else  if ( the_post.type == "quote" || the_post.type == "text") 
          { 
                $('.lazy').eq(w).html('<div id="twit-cap" style="display:table-cell">'+ the_post.text + '</div>');  
           }
        // if the post is something else


        else   
          { 
                $('.lazy').eq(w).css({'background-color':'white', "background-image":"url("+the_post.photos[0].original_size.url+")"});  

           }
           // increment by one after the code executes
          i++;x++;w++;
      }

}});


});

//were lazy... but we also like images to load
     $(function() {
        $('.lazy').lazy();
    });


// Create a countdown clock
function getTimeRemaining(endtime){
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    var hours = Math.floor( (t/(1000*60*60)) % 24 );
    var days = Math.floor( t/(1000*60*60*24) );
    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
}

function initializeClock(id, endtime){
  var clock = document.getElementById(id);
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock(){
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if(t.total<=0){
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock);
}

var deadline = 'January 15 2016 06:00:50 UTC+0200';
initializeClock('clockdiv', deadline);



//when the user enters their email create a box that says thank you and thank them please!
 function clicked() {
    $('.review_submit_box').fadeIn("2000", 
      function() {
        $(this).delay(3000).fadeOut("2000"); 
      });
  };


$(document).ready(function()


    {

       var wordArr = ['LADOSHA',"   NEON   ","MAGATHA", "GENERALRAGE", "    YSL    " , "LA’FEM", "CUNTY"];
          var a;

            $(".glitch").attr('data-text', wordArr[0]);                
            $(".glitch").html(wordArr[0]);  
    
          setInterval(function() {

            a =  wordArr.indexOf($(".glitch").html());
           
              if ( a == 6 ) {
                  a = -1;

              }
              console.log(wordArr[a+1]); 
          

              if (a == 4){ 
               
                $(".glitch").addClass("glitch-ysl");                
                   

              }

              else {

                $(".glitch").css('font-size', "300px"); 
                $(".glitch").attr('data-text', wordArr[a+1]);                
                $(".glitch").html(wordArr[a+1]); 


              }

                    //for (i in wordArr) 
                    $(".glitch").attr('data-text', wordArr[a+1]);                
                    $(".glitch").html(wordArr[a+1]);  


          }, 1000)
       
    } 
  );

/*
IN case we want to add the carousel back in

$(document).ready(function(){
    $('.carousel').carousel({
      interval: 2000
    });
    });

var cols = 0;
  function calc(){
    var newCols = Math.round($(window).width() / 1000) || 1;
    if (newCols === cols) {
      return;
    }

    cols = newCols;

    $('.cols').removeClass().addClass('cols cols-' + cols);

    var colEls = $('.col');
    var current = 0;

    $('img').each(function(){
      colEls.eq(current).append($(this));
      current = (current + 1) % cols;
    });
  }

  calc();

  $(window).on('resize', calc);
*/

