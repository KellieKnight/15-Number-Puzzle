
var app = function() {

    var self = {};
    self.is_configured = false;

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        v.map(function(e) {e._idx = k++;});
    };

    // Initializes an attribute of an array of objects.
    var set_array_attribute = function (v, attr, x) {
        v.map(function (e) {e[attr] = x;});
    };

    self.initialize = function () {
        document.addEventListener('deviceready', self.ondeviceready, false);
    };

    self.ondeviceready = function () {
        // This callback is called once Cordova has finished
        // its own initialization.
        console.log("The device is ready");
        $("#vue-div").show(); // This is jQuery.
        self.is_configured = true;
    };

    self.reset = function () {
        self.vue.board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    };

    self.shuffle = function(i, j) {

    	var zIndex;	               //the index of the zero cell in the board array

    	var zRow;                  //the row coordiante of the zero cell.
    	var zCol;                  //the col coordinate of the zero cell.

    	var idiff;                 //the difference between i values
    	var jdiff;                 //the difference between j values

    	var clickedIndex = 4*i+j;  //the array index of the clicked cell.


        // Empty cell is denoted by the index of board whose value is 0.
        // Search through board to find the index of the 0 cell.
        for(var x = 0; x < self.vue.board.length; x++){
        	if(self.vue.board[x] == 0){
        		zIndex = x;
        		break;
        	}
        }

        // After finding the index, calculate its coordinates: row (i) = floor(index/4) and col (j) = index %4)
        zRow = Math.floor(zIndex/4);
        zCol = zIndex % 4;

        // Compare the 0 cell's coordinate values to the current i and j values passed into the function.
        idiff = Math.abs(i - zRow);
        jdiff = Math.abs(j - zCol);

        // Check for adjacency.
        // Cells are directly adjacent if one coordinate changes by 1. 
    	// Differences between coordinates cannot both be 1.
		if((idiff == 0 && jdiff == 1) || (idiff == 1 && jdiff ==0)){

					console.log("Switching " + self.vue.board[clickedIndex] + " and " + self.vue.board[zIndex]);

					var temp = self.vue.board[clickedIndex];				//create temp variable to store the value at the clicked Index
					Vue.set(self.vue.board, clickedIndex, 0);
					Vue.set(self.vue.board, zIndex, temp);


			
		}


        //console.log("Shuffle:" + i + ", " + j);
        console.log(self.vue.board);
    };

    self.scramble = function() {

    	// http://mathworld.wolfram.com/15Puzzle.html
       

        var solvable = false;


        //As long as the puzzle is unsolvable, we keep randomizing it until a solvable one is found.
        while(!solvable){

            //Randomize the elements in the array
            var newBoard = self.vue.board;
            var m = newBoard.length;
            var temp = 0;
            var index = 0;

            var invCount = 0;               //Count of inversions (a pair of tiles (a, b) form an inversion if a appears before b but a > b.)
            var zPos = 0;                   //Position of z value in the new array
            var zRow = 0;                   //Row number of the z value in the new array

            while(m){
                index = Math.floor(Math.random() * m--);
                temp = newBoard[m];
                newBoard[m] = newBoard[index];
                newBoard[index] = temp;
            }

            //Check for solvability:
            //Count number of inversions.
            //Starting from first cell, compare value to those of all following cells.
            //If any cell contains a value that is less than the current, add to the inversion count.
            for(var i = 0; i < newBoard.length; i++){
                    if(newBoard[i] == 0){               //Check if the element is zero
                        zPos = i;
                    }
                for(var j = 1; j < newBoard.length; j++){
                    if(newBoard[i] > newBoard[j]){
                        console.log(newBoard[i] + " > " + newBoard[j]);
                        invCount++;
                    }
                }
            }

            //Find the row number of the zero cell.
            //Adjust so that 1 denotes bottom row, and so on.
            zRow = Math.abs((Math.floor(zPos/4) - 4));

            /*http://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/
            puzzle instance is solvable if:
            1. the blank is on an even row counting from the bottom (second-last, fourth-last, etc.) and number of inversions is odd.
            2. the blank is on an odd row counting from the bottom (last, third-last, fifth-last, etc.) and number of inversions is even.*/
            if( ((zRow%2 == 0) && (invCount %2 != 0)) || ((zRow%2 != 0) && (invCount%2 ==0))){   

                solvable = true;
            }
           

            console.log(newBoard[zPos] + " at " + zPos);
            console.log("Inversion count: " + invCount);
            console.log("Zero row #: " + zRow);
            console.log("New Array: " + newBoard);

    	}

        console.log("Solvable array: " + newBoard);

        //Set the new array

        for(var k = 0; k < newBoard.length; k++){
            Vue.set(self.vue.board, k, newBoard[k]);
        }

    };

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            board: []
        },
        methods: {
            reset: self.reset,
            shuffle: self.shuffle,
            scramble: self.scramble
        }

    });

    self.reset();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){
    APP = app();
    APP.initialize();
});
