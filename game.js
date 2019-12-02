(function () {
    var CSS = {
        arena: {
            width: 900,
            height: 600,
            background: '#62247B',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '999',
            transform: 'translate(-50%, -50%)'
        },
        ball: {
            width: 15,
            height: 15,
            position: 'absolute',
            top: 0,
            left: 350,
            borderRadius: 50,
            background: '#C6A62F'
        },
        ballTrail: {
            width: 5,
            height: 5,
            position: 'absolute',
            top: 0,
            left: 350,
            borderRadius: 50,
            background: '#ff6b81'
        },
        line: {
            width: 0,
            height: 600,
            borderLeft: '2px dashed #C6A62F',
            position: 'absolute',
            top: 0,
            left: '50%'
        },
        scoreboard1:{
            position: 'absolute',
            top: 20,
            color: '#C6A62F',
            fontSize:80,
            left: '22%'
        },
        scoreboard2:{
            position: 'absolute',
            top: 20,
            color: '#C6A62F',
            fontSize:80,
            left: '78%'
        },
        stick: {
            width: 12,
            height: 85,
            position: 'absolute',
            background: '#C6A62F'
        },
        stick1: {
            left: 0,
            top: 150
        },
        stick2:{
            right:0,
            top:150
        },
        winner:{
            height: 100,
            position: 'absolute',
            top: '40%',
            color:'#C6A62F',
            fontSize:50,
            left: '30%'
        },
        newGame:{
            height: 100,
            position: 'absolute',
            top: '50%',
            color:'#C6A62F',
            fontSize:25,
            left: '31%'      
        }
    };

    var CONSTS = {
        gameSpeed: 20,
        score1: 0,
        score2: 0,
        stick1Speed: 0,
        stick2Speed: 0,
        ballTopSpeed: 0,
        ballLeftSpeed: 0,
        trailCount : 0,
        gameType: ""
    };

    function start() {
        draw();
        setEvents();
        roll();
        loop();
    }

    function draw() {
        $('<div/>', { id: 'pong-game' }).css(CSS.arena).appendTo('body');
        $('<div/>', { id: 'scoreboard1' }).css(CSS.scoreboard1).appendTo('#pong-game').html(0);
        $('<div/>', { id: 'winner' }).css(CSS.winner).appendTo('#pong-game').html("Winner");
        $('<div/>', { id: 'newGame'}).css(CSS.newGame).appendTo('#pong-game').html("Press r key for new game");
        $('<div/>', { id: 'pong-line' }).css(CSS.line).appendTo('#pong-game');
        $('<div/>', { id: 'scoreboard2' }).css(CSS.scoreboard2).appendTo('#pong-game').html(0);
        $('<div/>', { id: 'pong-ball' }).css(CSS.ball).appendTo('#pong-game');
        $('<div/>', { id: 'stick-2' }).css($.extend(CSS.stick2, CSS.stick)).appendTo("#pong-game");
        $('<div/>', { id: 'stick-1' }).css($.extend(CSS.stick1, CSS.stick))
            .appendTo('#pong-game');

        $("#winner").hide();
        $("#newGame").hide();
        $("#pong-ball-second").hide();
    }

    function setEvents() {
        $(document).on('keydown', function (e) {
            if (e.keyCode == 87) {
                CONSTS.stick1Speed = -4;
                CSS.stick1.top += CONSTS.stick1Speed;
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 83) {
                CONSTS.stick1Speed = +4;
            }
        });

        $(document).on('keydown', function (e) {
            if (e.keyCode == 38) {
                CONSTS.stick2Speed = -4;
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 40) {
                CONSTS.stick2Speed = +4;
            }
        });

        $(document).on('keyup', function (e) {
            if (e.keyCode == 82) {

                window.location.reload();
            }
        });

    }

    function setScoreForPlayerTwo() {
        CONSTS.score2++;

        if (CONSTS.score2 == 5) {
            $("#scoreboard2").html(CONSTS.score2);
            Winner("Player 2");
            gameOver();
        }else
        {
            $("#scoreboard2").html(CONSTS.score2);
        }

    }

    function setScoreForPlayerOne()
    {
        CONSTS.score1++;

        if (CONSTS.score1 == 5) {
            $("#scoreboard1").html(CONSTS.score1);
            Winner("Player 1");
            gameOver();
        }else
        {
            $("#scoreboard1").html(CONSTS.score1);
        }

    }

    function Winner(winner)
    {
        $("#winner").show().html("Winner : " + winner);
        $("#newGame").show();

        $("#pong-ball").hide();
        $("#pong-line").hide();
        $("#stick-1").hide();
        $("#stick-2").hide();
        $("#scoreboard1").hide();
        $("#scoreboard2").hide();

        $("#trail-" + (CONSTS.trailCount - 10)).remove();
        $("#trail-" + (CONSTS.trailCount - 9)).remove();
        $("#trail-" + (CONSTS.trailCount - 8)).remove();
        $("#trail-" + (CONSTS.trailCount - 7)).remove();
        $("#trail-" + (CONSTS.trailCount - 6)).remove();
        $("#trail-" + (CONSTS.trailCount - 5)).remove();
        $("#trail-" + (CONSTS.trailCount - 4)).remove();
        $("#trail-" + (CONSTS.trailCount - 3)).remove();
        $("#trail-" + (CONSTS.trailCount - 2)).remove();
        $("#trail-" + (CONSTS.trailCount - 1)).remove();
        $("#trail-" + (CONSTS.trailCount - 0)).remove();

        gameHistory.winner = winner;
        gameHistory.score = CONSTS.score1 + " : "+CONSTS.score2;

        if (typeof (Storage) !== "undefined") {
            window.localStorage.setItem("gameHistory",JSON.stringify(gameHistory))
        } else {
            console.log("No web storage Support.");
        }

    }

    function gameOver()
    {
        clearInterval(window.pongLoop);
    }

    function loop() {
        window.pongLoop = setInterval(function () {

            CONSTS.trailCount++;

            CSS.ball.background="#f6e58d";
            CSS.ball.height = 15;
            CSS.ball.width = 15;
            CSS.ball.opacity = 0.6;

            $('<div/>', { id: 'trail-' + CONSTS.trailCount }).css(CSS.ball).appendTo('#pong-game');

            $("#trail-" + (CONSTS.trailCount - 10)).remove();
            $("#trail-" + (CONSTS.trailCount - 9)).css("opacity","0.1")
            $("#trail-" + (CONSTS.trailCount - 8)).css("opacity","0.2")
            $("#trail-" + (CONSTS.trailCount - 7)).css("opacity","0.3")
            $("#trail-" + (CONSTS.trailCount - 6)).css("opacity","0.4")
            $("#trail-" + (CONSTS.trailCount - 5)).css("opacity","0.5")
            $("#trail-" + (CONSTS.trailCount - 4)).css("opacity","0.6")
            $("#trail-" + (CONSTS.trailCount - 3)).css("opacity","0.7")
            $("#trail-" + (CONSTS.trailCount - 2)).css("opacity","0.8")
            $("#trail-" + (CONSTS.trailCount - 1)).css("opacity","0.9")

            CSS.stick1.top += CONSTS.stick1Speed;
            CSS.stick2.top += CONSTS.stick2Speed;

            $('#stick-1').css('top', CSS.stick1.top);
            $('#stick-2').css('top', CSS.stick2.top);

            CSS.ball.top += CONSTS.ballTopSpeed;
            CSS.ball.left += CONSTS.ballLeftSpeed;

            if (CSS.ball.top <= 0 || CSS.ball.top >= CSS.arena.height - CSS.ball.height) {
                CONSTS.ballTopSpeed = CONSTS.ballTopSpeed * -1;
            }

            if ((CSS.ball.left <= CSS.stick.width || CSS.ball.left >= CSS.arena.width - CSS.ball.width) && CSS.ball.top > CSS.stick1.top && CSS.stick1.top + CSS.stick1.height > CSS.ball.top) {
                CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1;
            }else if(CSS.ball.left < 0)
            {
                setScoreForPlayerTwo();
                roll()
            }

            if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width &&  CSS.ball.top > CSS.stick2.top && CSS.stick2.top + CSS.stick2.height > CSS.ball.top) {
                CONSTS.ballLeftSpeed = CONSTS.ballLeftSpeed * -1;
            }
            else if (CSS.ball.left >= CSS.arena.width - CSS.ball.width - CSS.stick.width) {
                setScoreForPlayerOne();
                roll();
            }

            if(CSS.stick1.top <= 0 || CSS.stick1.top >= CSS.arena.height - CSS.stick1.height)
            {
                CONSTS.stick1Speed = CONSTS.stick1Speed * -1; 
            }

            if(CSS.stick2.top <= 0 || CSS.stick2.top >= CSS.arena.height - CSS.stick2.height)
            {
                CONSTS.stick2Speed = CONSTS.stick2Speed * -1; 
            }


            $('#pong-ball').css({ top: CSS.ball.top, left: CSS.ball.left });


        }, CONSTS.gameSpeed);
    }

    function roll() {
        CSS.ball.top = 250;
        CSS.ball.left = 350;

        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
    }

    function rollSecond() {
        CSS.ball.top = 250;
        CSS.ball.left = 350;

        var side = -1;

        if (Math.random() < 0.5) {
            side = 1;
        }

        CONSTS.ballTopSpeed = Math.random() * -2 - 3;
        CONSTS.ballLeftSpeed = side * (Math.random() * 2 + 3);
    }
    
    const gameHistory = {
        winner: "",
        score: ""
    };

    start();
})();
