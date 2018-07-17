var game = new Game()
game.init()
game.addSuccessFn(success)
game.addFailedFn(failed)

var mask = document.querySelector('.mask')
var restartButton = document.querySelector('.restart')
var score = document.querySelector('.score')
var rank = document.getElementById("rank");
var userid = getQueryVariable("userid");

restartButton.addEventListener('click', restart)

// 游戏重新开始，执行函数
function restart() {
	mask.style.display = 'none'
	rank.style.display = 'block'
	game.restart()
}
// 游戏失败执行函数
function failed() {
	$.ajax({
        type: "POST",
        url: "http://192.168.0.10:8090/xyjy/rest/points/recordScore.json?userid=" + userid + "&score=" +game.score,
        data: {},
        dataType: "text",
        async: true,
        success: function (data) {
        	var json = JSON.parse(data);
        	if(json[0].result !== "success"){
        		alert("分数上传失败！");
        	}
        }
    });
	score.innerText = game.score;
	mask.style.display = 'flex';
}
// 游戏成功，更新分数
function success(score) {
	var scoreCurrent = document.querySelector('.score-current')
	scoreCurrent.innerText = score
}

function getQueryVariable(variable){
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
	        var pair = vars[i].split("=");
	        if(pair[0] == variable){return pair[1];}
	}
	return(false);
}

$(rank).on("click",function(){
	$.ajax({
        type: "POST",
        url: "http://192.168.0.10:8090/xyjy/rest/points/showGameRank.json?userid=" + userid,
        data: {},
        dataType: "text",
        async: true,
        success: function (data) {
        	var json = JSON.parse(data);
        	var topRank = json[0].topRank;
        	var userRank = json[0].userRank;
        	var topRankLength = topRank.length;
        	if(userRank){
        		$(".my-list .item-num").html(userRank.rank);
        		$(".my-list .item-name").html(userRank.username);
        		$(".my-list .item-score").html(userRank.score);
        	}
        	$(".list-container").empty();
        	if(topRankLength > 0){
        		for(var i = 0;i < topRankLength;i++){
        			$(".list-container").append('<div class="list-item"><div class="item-num">' 
    						+ topRank[i].rank + '</div><div class="item-name">' + topRank[i].username + '</div><div class="item-score">'
    						+ topRank[i].score + '</div></div>');
        		}
        		$(".list-container .list-item:even").addClass("item-eve");
        		$(".list-container .list-item:odd").addClass("item-odd");
        		$(".list-container .list-item .item-num").eq(0).addClass("item-one");
        		$(".list-container .list-item .item-num").eq(1).addClass("item-two");
        		$(".list-container .list-item .item-num").eq(2).addClass("item-three");
        	}
        	$(".rank-mask").show();
        	$(".rank-list").show();
        }
    });
	
});

$(".rank-close").on("click",function(){
	$(".rank-mask").hide();
	$(".rank-list").hide();
});


document.querySelector("canvas").ontouchstart = function(e) {
	e.preventDefault();
};