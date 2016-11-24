(function() {
    /*
     * Polyfill
     */

    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };


    /*
     * Helpers
     */

    // @return float Random number between min and max
    function rand(min, max) { return (Math.random() * (max - min) + min); }

    // @return array/object Clone an array or an object
    Object.prototype.clone = function() {
        var newObj = (this instanceof Array) ? [] : {};
        for (i in this) {
            if (i == 'clone')
                continue;
            if (this[i] && typeof this[i] == "object") {
                newObj[i] = this[i].clone();
            }
            else
                newObj[i] = this[i]
        }
        return newObj;
    };


    /*
     * Constants
     */

    // Keyboard key code
    const KEY = {
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    }

    // Possible game state
    const STATE = {
        INIT: 0,
        PLAY: 1,
        PAUSE: 2,
        GAMEOVER: 3
    }

    // Blocks colors
    const COLORS = {
        EMPTY: -1,
        GRAYLIGHT: "#adb5bd",
        GRAY: "#343a40",
        RED: "#e03131",
        PINK: "#c2255c",
        PURPLE: "#9c36b5",
        VIOLET: "#6741d9",
        INDIGO: "#3b5bdb",
        BLUE: "#1b6ec2",
        CYAN: "#0c8599",
        TEAL: "#099268",
        GREEN: "#2f9e44",
        LIME: "#66a80f",
        YELLOW: "#f08c00",
        ORANGE: "#e8590c"
    }

    // Background color
    const BACKGROUND_COLOR = COLORS.GRAYLIGHT;

    // Number of horizontal tiles
    const COLUMNS = 10;

    // Number of vertical tiles
    const ROWS = 16;

    // Size of tiles width (px)
    const TILE_SIZE = 8;

    // @TODO Add a Border on a tile (in px)
    // const TILE_BORDER = 2;

    // Tetriminos
    const PIECES = {
        i: {
            color: COLORS.CYAN,
            blocks: [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ]
        },
        j: {
            color: COLORS.BLUE,
            blocks: [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1]
            ]
        },
        l: {
            color: COLORS.ORANGE,
            blocks: [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1]
            ]
        },
        o: {
            color: COLORS.YELLOW,
            blocks: [
                [1, 1],
                [1, 1]
            ]
        },
        s: {
            color: COLORS.GREEN,
            blocks: [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0]
            ]
        },
        z: {
            color: COLORS.RED,
            blocks: [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 1]
            ]
        },
        t: {
            color: COLORS.PURPLE,
            blocks: [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ]
        }
    };

    /*
     * Globals variables
     */

    var canvas = document.getElementById("canvas");
    var preview = document.getElementById("preview");

    var tet = canvas.getContext("2d"); // Board game
    var pvw = preview.getContext("2d"); // Preview of the next tetriminos

    var _ = {
        // Tick game
        tick: 0,

        // Movement speed of tetriminos
        speed: 250,

        // Player score
        score: 0,

        // Players's lines cleared
        linesCleared: 0,

        // Hold the requestAnimationFrame
        loopRequestAnim: null,

        // 2D array of the game board
        board: null,

        // Current tetriminos
        currentPiece: {
            type: null,
            offsetY: null,
            offsetY: null
        }
    };


    /*
     * Bag
     */

    var bag = {
        // Current bag
        currentBag: [],

        // Pick a tetriminos in the bag and re-fill it when empty
        getRandomPiece: function() {

            // If the bag is empty, re-fill it
            if (this.currentBag.length == 0)
                this.currentBag = [PIECES.i, PIECES.j, PIECES.l, PIECES.o, PIECES.s, PIECES.t, PIECES.z];

            // Randomly pick a tetriminos
            // and remove it out of the bag
            return this.currentBag.splice(rand(0, this.currentBag.length-1), 1)[0];

        },

        // Rotate a tetriminos +90 degres
        rotatePiece: function(piece, direction) {

            // @TODO Algorythm to rotate a tetriminos

        }
    };


    /*
     * Game engine
     */

     var render = {

        // Draw the background (on the board game & on the preview)
        drawBackground: function() {

            tet.fillStyle = BACKGROUND_COLOR;
            tet.fillRect(0, 0, COLUMNS*TILE_SIZE, ROWS*TILE_SIZE);

            pvw.fillStyle = BACKGROUND_COLOR;
            pvw.fillRect(0, 0, 32, 32);

        },

        // Draw tetriminos (on the board game)
        drawPieces: function() {

            for (var i = 0; i < COLUMNS; i++)
            {
                for (var j = 0; j < ROWS; j++)
                {
                    this.drawBlock(i, j, _.board[i][j]);
                }
            }

        },

        // Draw a block (on the board game)
        drawBlock: function(x, y, color) {

            if(color == COLORS.EMPTY) return;

            tet.fillStyle = color;
            tet.fillRect(x*TILE_SIZE, y*TILE_SIZE, x*TILE_SIZE+TILE_SIZE, y*TILE_SIZE+TILE_SIZE);

        },

        // Draw the next tetriminos (inside the preview)
        drawPreview: function() {

            // @TODO Draw the next tetriminos inside the preview

        }
     };

    /*
     * Game core
     */

    var game = {
        // Current game state
        state: null,

        // Game initialization
        init: function() {

            this.state = STATE.INIT;

            // Set the width and the hight of canvas
            canvas.width = COLUMNS * TILE_SIZE;
            canvas.height = ROWS * TILE_SIZE;
            preview.width  = 32;
            preview.height = 32;

            // Generate the boardgame
            _.board = [];
            for (var i = 0; i < COLUMNS; i++)
            {
                _.board[i] = [];
                for (var j = 0; j < ROWS; j++)
                {
                    _.board[i][j] = COLORS.EMPTY;
                }
            }

            this.state = STATE.PLAY;
            this.loop();

        },

        // Loop function (on each frame)
        loop: function() {

            this.tick++;
            this.update();
            this.draw();

            _.loopRequestAnim = window.requestAnimationFrame(this.loop.bind(this));

        },

        // Update the board game and the preview on each loop
        update: function() {

            // @TODO Collisions
            // @TODO Change the current tetriminos on collision (kick on wall or blocks)
            // @TODO Clear filled lines & set the next tetriminos
            // @TODO Gravity

        },

        // Draw everything on each loop (on the board game & on the preview)
        draw: function() {

            render.drawBackground(); // @TODO Draw the background only once. Dont renew it on each loop.
            render.drawPieces();
            render.drawPreview();

        },

        // Rotate the current tetriminos
        rotateCurrentPiece: function() {

            // @TODO Rotate the current tetriminos
            // (Handle collisions and kicks near border of gameboard)

        }
    };


    /*
     * Events listeners
     */
    window.addEventListener("keydown", function(event) {
        if (game.state !== STATE.PLAY) return;

        // @TODO Game controller
        switch (event.keyCode) {
            case KEY.LEFT:

                break;
            case KEY.RIGHT:

                break;
            case KEY.UP:

                break;
            case KEY.DOWN:

                break;
            case KEY.SPACE:

                break;
            default:
                return;
        }
    });

    // Run the game
    game.init();

})();