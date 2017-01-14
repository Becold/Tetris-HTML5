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

    // Direction
    const DIR = {
        UP: 1,
        RIGHT: 2,
        DOWN: 3,
        LEFT: 4
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
        ORANGE: "#e8590c",
        WHITE: "#ffffff"
    }

    // Background color
    const BACKGROUND_COLOR = COLORS.GRAYLIGHT;

    // Background color
    const BORDER_COLOR = COLORS.WHITE;

    // Number of tiles on x-axe
    const COLUMNS = 10;

    // Number of tiles on y-axe
    const ROWS = 16;

    // Size of tiles width (in px)
    const TILE_SIZE = 24;

    // Border on a tile (in px)
    const TILE_BORDER_SIZE = 2.5;

    // Preview size (in px)
    const PREVIEW_SIZE = 116;

    // Canvas info
    const CANVAS = {
        // Canvas width (in px)
        WIDTH: COLUMNS * (TILE_SIZE + (2 * TILE_BORDER_SIZE)),

        // Canvas height (in px)
        HEIGHT: ROWS * (TILE_SIZE + (2 * TILE_BORDER_SIZE))
    };

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
                [1, 0, 0]
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

    var backgroundGb = document.getElementById("background-game");
    var gameboard = document.getElementById("board-game");
    var preview = document.getElementById("preview");

    var bgTet = backgroundGb.getContext("2d"); // Background board game
    var tet = gameboard.getContext("2d"); // Board game
    var pvw = preview.getContext("2d"); // Preview of the next tetriminos

    var _ = {
        // Tick game
        tick: 0,

        // Movement speed of tetriminos (60 = 1 sec)
        speed: 1 * 60,

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
            color: null,
            blocks: null,
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

        init: function() {

            // Set background gameboard canvas
            backgroundGb.width = CANVAS.WIDTH;
            backgroundGb.height = CANVAS.HEIGHT;

            // Set gameboard canvas
            gameboard.width = CANVAS.WIDTH;
            gameboard.height = CANVAS.HEIGHT;

            // Set preview canvas
            preview.width  = PREVIEW_SIZE;
            preview.height = PREVIEW_SIZE;


        },

        // Draw the background (on the board game & on the preview)
        drawBackground: function() {

            // Gameboard background
            bgTet.fillStyle = BACKGROUND_COLOR;
            bgTet.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

            // Preview background
            pvw.fillStyle = BACKGROUND_COLOR;
            pvw.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);

            // Gameboard grid
            bgTet.strokeStyle = BORDER_COLOR;
            bgTet.lineWidth = TILE_BORDER_SIZE;

            for (x = 0; x <= CANVAS.WIDTH; x += (TILE_SIZE + 2*TILE_BORDER_SIZE))
            {
                bgTet.moveTo(x, 0);
                bgTet.lineTo(x, CANVAS.HEIGHT);

                for (y = 0; y <= CANVAS.HEIGHT; y += (TILE_SIZE + 2*TILE_BORDER_SIZE))
                {
                    bgTet.moveTo(0, y);
                    bgTet.lineTo(CANVAS.WIDTH, y);
                }
            }
            bgTet.stroke();

        },

        // Draw tetriminos (on the board game)
        drawPieces: function() {

            // Draw landed tetriminos
            for (var y = 0; y < ROWS; y++)
            {
                for (var x = 0; x < COLUMNS; x++)
                {
                    this.drawBlock(x, y, _.board[y][x]);
                }
            }

            // Draw current tetriminos
            for (var y = 0; y < _.currentPiece.blocks.length; y++)
            {
                for (var x = 0; x < _.currentPiece.blocks[y].length; x++)
                {
                    if(_.currentPiece.blocks[x][y] == 0) continue;

                    this.drawBlock(x + _.currentPiece.offsetX, y + _.currentPiece.offsetY, _.currentPiece.color);
                }
            }

        },

        // Draw a block (on the board game)
        drawBlock: function(x, y, color) {

            if(color == COLORS.EMPTY) return;

            tet.fillStyle = color;
            tet.fillRect(
                x*TILE_SIZE + 2*x*TILE_BORDER_SIZE + TILE_BORDER_SIZE, // x-from
                y*TILE_SIZE + 2*y*TILE_BORDER_SIZE + TILE_BORDER_SIZE, // y-from
                TILE_SIZE, //width
                TILE_SIZE //height
            );

        },

        // Draw the next tetriminos (inside the preview)
        drawPreview: function() {

            // @TODO Draw the next tetriminos inside the preview

        },

        // Save the context
        save: function(ctx) { return ctx.save(); },

        // Restore the context
        restore: function(ctx) { return ctx.restore(); }
     };

    /*
     * Game core
     */

    var game = {
        // Current game state
        state: null,

        // Game initialization
        run: function() {

            this.state = STATE.INIT;

            // Game engine initisialization
            render.init();

            // Generate the boardgame
            _.board = [];
            for (var y = 0; y < ROWS; y++)
            {
                _.board[y] = [];
                for (var x = 0; x < COLUMNS; x++)
                {
                   _.board[y][x] = COLORS.EMPTY;
                }
            }

            this.state = STATE.PLAY;
            render.drawBackground();
            this.loop();

        },

        // Loop function (on each frame)
        loop: function() {

            _.tick++;
            this.update();
            this.draw();

            _.loopRequestAnim = window.requestAnimationFrame(this.loop.bind(this));

        },

        // Update the board game and the preview on each loop
        update: function() {

            // Pick a new tetriminos from the bag
            // @TODO Pick a tetriminos, put it in the preview, then use it later
            if (_.currentPiece.blocks == null) {
                _.currentPiece = bag.getRandomPiece();
                _.currentPiece.offsetX = 3;
                _.currentPiece.offsetY = 0;
            }

            // Gravity
            if (_.tick % _.speed == 0) {
                _.currentPiece.offsetY++;
            }

            // @TODO Collisions
            // @TODO Change the current tetriminos on collision (kick on wall or blocks)
            // @TODO Clear filled lines & set the next tetriminos
            // @TODO Gravity

        },

        // Draw everything on each loop (on the board game & on the preview)
        draw: function() {

            tet.clearRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT); // @TODO Clear the canvas only when needed
            render.drawPieces();
            render.drawPreview();

        },

        // Rotate the current tetriminos
        rotateCurrentPiece: function() {

            // @TODO Rotate the current tetriminos
            // (Handle collisions and kicks near border of gameboard)

        },

        //
        moveCurrentPiece: function(dir) {

            switch(dir) {
                case DIR.RIGHT:
                    _.currentPiece.offsetX++;
                    break;

                case DIR.DOWN:
                    _.currentPiece.offsetY++;
                    break;

                case DIR.LEFT:
                    _.currentPiece.offsetX--;
                    break;

                default:
                    return;
            }

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
                game.moveCurrentPiece(DIR.LEFT);
                break;

            case KEY.RIGHT:
                game.moveCurrentPiece(DIR.RIGHT);
                break;

            case KEY.UP:
                game.rotateCurrentPiece();
                break;

            case KEY.DOWN:
                game.moveCurrentPiece(DIR.DOWN);
                break;

            case KEY.SPACE:
                // @TODO Drop the current tetriminos
                break;

            default:
                return;
        }
    });

    // Run the game
    game.run();

})();