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
	 * Constantes
	 */
	var STATE = {
		INIT: 0,
		PLAY: 1,
		PAUSE: 2,
		GAMEOVER: 3,
	}
	
	var COLORS = {
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
	}
	
	var TYPE = {
		
		// @TODO Définir les constantes pour chaque types de pièces
		
	}
	
	
	/*
	 * Global variables
	 */
	var canvas = document.getElementById("canvas");
	var preview = document.getElementById("preview");
	
	var tet = canvas.getContext("2d"); // Canvas qui contient le plateau de jeu
	var pvw = preview.getContext("2d"); // Canvas qui contient la prochaine pièce
	
	var _ = {
		backgroundColor: COLORS.GRAYLIGHT, // Couleur de fond
		
		tilesX: 10, // Nombre de tiles horizontaux
		tilesY: 16, // Nombre de tiles verticaux
		tileSize: 8, // Largeur d'une tile
		// @TODO Rajouter une bordure autour de chaque tile
		
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
	}
	
	
	/*
	 * Game core
	 */
	var game = {
		state: null,
		init: function() {
			
			this.state = STATE.INIT;
			
			// Changement de la taille des canvas
			canvas.width = _.tilesX * _.tileSize;
			canvas.height = _.tilesY * _.tileSize;
			preview.width  = 32;
			preview.height = 32;
			
			// Génération du terrain
			_.board = [];
			for (var i = 0; i < _.tilesX; i++)
			{
				_.board[i] = [];
				for (var j = 0; j < _.tilesY; j++)
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
			
			tet.fillStyle = _.backgroundColor;
			tet.fillRect(0, 0, _.tilesX*_.tileSize, _.tilesY*_.tileSize);
			
			pvw.fillStyle = _.backgroundColor;
			pvw.fillRect(0, 0, 32, 32);
			
		},
		drawPieces: function() {
			
			for (var i = 0; i < _.tilesX; i++)
			{
				for (var j = 0; j < _.tilesY; j++)
				{
					this.drawPiece(i, j, _.board[i][j]);
				}
			}
			
		},
		drawPiece: function(x, y, color) {
			
			if(color == COLORS.EMPTY) return; // Si color == 0, il n'y a pas de tetricube à cette endroit
			
			tet.fillStyle = color;
			tet.fillRect(x*_.tileSize, y*_.tileSize, x*_.tileSize+_.tileSize, y*_.tileSize+_.tileSize);
			
		},
		drawPreview: function() {
			
			// @TODO Dessiner la pièce en cours dans le canvas preview
			
		},
		rotateCurrentPiece: function() {
			
			// @TODO Algorythme pour tourner la pièce en cours
			
		}
	};
	
	
	/*
	 * Events listeners
	 */
	window.addEventListener("keydown", function(event) {
		if (game.state !== STATE.PLAY) return;
		
		// @TODO Game controller 
		switch (event.keyCode) {
			case 37: // gauche
				
				break;
			case 39: // droite
				
				break;
			case 38: // haut
				
				break;
			case 40: // bas
				
				break;
			case 32: // espace
				
				break;
			default:
				return;
		}
	});
	
	game.init();
	
})();