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
    ;


    /*
     * Helpers
     */
    function rand(min, max) { return (Math.random() * (max - min) + min); }

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
     * Constantes
     */
    const KEY = {
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    }

    const STATE = {
        INIT: 0,
        PLAY: 1,
        PAUSE: 2,
        GAMEOVER: 3
    }

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

    const BACKGROUND_COLOR = COLORS.GRAYLIGHT; // Couleur de fond
    const TILES_X = 10; // Nombre de tiles horizontaux
    const TILES_Y = 16; // Nombre de tiles verticaux
    const TILE_SIZE = 8; // Largeur d'une tile
    // @TODO Rajouter une bordure autour de chaque tile

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
    const BAG = [PIECES.i, PIECES.j, PIECES.l, PIECES.o, PIECES.s, PIECES.t, PIECES.z];


    /*
     * Global variables
     */
    var canvas = document.getElementById("canvas");
    var preview = document.getElementById("preview");

    var tet = canvas.getContext("2d"); // Canvas qui contient le plateau de jeu
    var pvw = preview.getContext("2d"); // Canvas qui contient la prochaine pièce

    var _ = {
        tick: 0, // Tick game
        speed: 250, // Vitesse de déplacement des pièces

        score: 0, // Score du joueur
        linesCleared: 0, // Nombre de ligne qui a été effacé par le joueur

        loopRequestAnim: null,
        board: null, // Tableau 2d de la partie
        currentPiece: {
            type: null,
            offsetY: null,
            offsetY: null
        }
    };


    /*
     * Sac qui contient les 7 pièces
     * Chaque fois que le game core a besoin d'une pièce, on le retire du bag.
     * Quand le bag est rempli, on le rempli avec les 7 pièces.
     */
    var bag = {
        currentBag: [],
        getRandomPiece: function() {

            // Si le bag est vide, on le remplit
            if (this.currentBag.length == 0)
                this.currentBag = BAG.clone();

            // On enlève une pièce du bag et on le return
            return this.currentBag.splice(rand(0, this.currentBag.length-1), 1)[0];

        },
        rotatePiece: function(piece, direction) {

            // @TODO Algorythme pour tourner une pièce

        }
    };


    /*
     * Game core
     */
    var game = {
        state: null,
        init: function() {

            this.state = STATE.INIT;

            // Changement de la taille des canvas
            canvas.width = TILES_X * TILE_SIZE;
            canvas.height = TILES_Y * TILE_SIZE;
            preview.width  = 32;
            preview.height = 32;

            // Génération du terrain
            _.board = [];
            for (var i = 0; i < TILES_X; i++)
            {
                _.board[i] = [];
                for (var j = 0; j < TILES_Y; j++)
                {
                    _.board[i][j] = COLORS.EMPTY;
                }
            }

            this.state = STATE.PLAY;
            this.loop();

        },
        loop: function() {

            this.tick++;
            this.update();
            this.draw();

            _.loopRequestAnim = window.requestAnimationFrame(this.loop.bind(this));

        },
        update: function() {

            // @TODO Collisions
            // @TODO Effacer les lignes remplis
            // @TODO Changement de pièce après une collision
            // @TODO Gravité sur les pièces

        },
        draw: function() {

            this.drawBackground(); // @TODO Dessiner le background une seule fois. Ne pas le renouveler à chaque loop.
            this.drawPieces();
            this.drawPreview();

        },
        drawBackground: function() {

            tet.fillStyle = BACKGROUND_COLOR;
            tet.fillRect(0, 0, TILES_X*TILE_SIZE, TILES_Y*TILE_SIZE);

            pvw.fillStyle = BACKGROUND_COLOR;
            pvw.fillRect(0, 0, 32, 32);

        },
        drawPieces: function() {

            for (var i = 0; i < TILES_X; i++)
            {
                for (var j = 0; j < TILES_Y; j++)
                {
                    this.drawPiece(i, j, _.board[i][j]);
                }
            }

        },
        drawPiece: function(x, y, color) {

            if(color == COLORS.EMPTY) return;

            tet.fillStyle = color;
            tet.fillRect(x*TILE_SIZE, y*TILE_SIZE, x*TILE_SIZE+TILE_SIZE, y*TILE_SIZE+TILE_SIZE);

        },
        drawPreview: function() {

            // @TODO Dessiner la pièce en cours dans le canvas preview

        },
        rotateCurrentPiece: function() {

            // @TODO Algorythme pour tourner la pièce en cours
            // (gérer les collisions et les kicks contre les bord du board)

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

    game.init();

})();