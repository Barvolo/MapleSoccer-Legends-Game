
// Scene Declarations
var gameScene = new Phaser.Scene('gameScene');

gameScene.preload = preload;
gameScene.create = create;
gameScene.update = update;


// Phaser Configuration
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [starterScene, gameScene],
    
    worldBounds: { width: 1920, height: 1080 },
};

// Game instance
var game = new Phaser.Game(config);

// Input and Player Variables
var cursors;
//var player;
var player = {
    money: 0,
};
var selectedBall = 'ball';
var attackKey;
var isAttacking = false; // Boolean variable to track if it's an attack animation
// Monster Variables
const numMonsters = 8;
var monsters = [];
let monsterIndex = 1;
let monsterFirstMove = `monster${monsterIndex}`;
let monsterSecMove = `monster${monsterIndex+1}`;






// Preload assets
function preload() {
    // Background
    this.load.image('background', 'background.png');
    this.load.image('zoneBackground', 'zone.png');
    this.load.image('wall-street', 'wallstreet.png');
    

    // Player assets
    this.load.image('player-stand', 'player/player-stand.png');
    this.load.image('player-jump', 'player/player-jump.png');

    // Load Player attacking assets
    for (let i = 1; i <= 4; i++) {
        this.load.image(`player-attack${i}`, `player/attack${i}.png`);
    }

    // Load Player walking assets
    for (let i = 1; i <= 4; i++) {
        this.load.image(`player-walk${i}`, `player/player-walk${i}.png`);
    }

    // ball asset
    this.load.image('ball', 'player/ball.png');
    this.load.image('ball2', 'player/ball2.png');
    this.load.image('ball3', 'player/ball3.png');
    this.load.image('ball4', 'player/ball4.png');
    this.load.image('ball5', 'player/ball5.png');
    this.load.image('ball6', 'player/ball6.png');
    this.load.image('ball7', 'player/ball7.png');
    this.load.image('ball8', 'player/ball8.png');

    // monster assets
    this.load.image('monster1', 'monster/monster1.png');
    this.load.image('monster2', 'monster/monster2.png');
    this.load.image('monster3', 'monster/monster3.png');
    this.load.image('monster4', 'monster/monster4.png');
    this.load.image('monster5', 'monster/monster5.png');
    this.load.image('monster6', 'monster/monster6.png');      
    this.load.image('boom', 'monster/boom.png');
    this.load.image('bitcoin', 'monster/bitcoin.png');

    this.load.audio('audioKey', 'Powerful.mp3');
    this.load.audio('gameof', 'gameof.mp3');
    this.load.audio('boom', 'boom.mp3');

}

// Create game entities and setup
var gameStarted = false;  // Flag to denote if the game has started or not

function create() {
    // Create a different background and set origin
    let bg = this.add.image(0, 0, 'zoneBackground');  // Set your initial background
    bg.setOrigin(0.0, 0.03); 
    bg.setPosition(0, 0);

    // Create player, set origin, and world bounds
    player = this.physics.add.sprite(100, 1110, 'player-stand');
    player.setOrigin(0.5, 0.5);
    this.physics.world.setBounds(-250, 0, 1920+480, 1080); 

    player.money = 0; // Initialize player's money
    document.getElementById('money-value').innerText = player.money;
   

    player.level = 1; // Initialize player's level
    document.getElementById('level-value').innerText = player.level;

    // Set camera settings
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, 1920, 1080-64);
    this.cameras.main.setZoom(0.7); 
    player.setCollideWorldBounds(true);
    player.setDepth(2);  // This will make the player appear above the background and below other game objects

    // Create player animations
    createPlayerAnimations(this);

    // Set initial animation
    player.anims.play('player-walk');
    player.isAttacking = false;

    // Create cursor keys and attack key
    cursors = this.input.keyboard.createCursorKeys();
    attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    

    

    // Create a key listener for 'k'
    //var keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    let isZoneArea = true;

    // Create wall-street image and set its visibility to false
    wallStreetImage = this.add.image(0, 0, 'wall-street').setScale(0.8);
    wallStreetImage.setPosition(1200, 750);  // Set the position you want here
    wallStreetImage.setVisible(true);
    wallStreetImage.setDepth(1);  // This will make the wall-street image appear above the background and below other game objects

    
    let slotGameElement = document.getElementById('slotGameFrame');
    this.add.dom(1250, 120, slotGameElement).setDepth(1);
    
    window.addEventListener('keydown', function(event) {
        if (player.x < 1750 && player.x > 1650 && isZoneArea && (event.key === 'x' || event.keyCode === 80)) {
            slotGameElement.src = "slot.html";
            slotGameElement.classList.remove('hideSlotGame'); // Show the slot game
            backgroundMusic.stop();
        }
    });
    
    window.addEventListener('message', function(event) {
        // If the received message is 'hide', hide the slot game
        if (event.data === 'hide') {
            slotGameElement.classList.add('hideSlotGame'); // Hide the slot game
            slotGameElement.src = ''; // Clear the iframe src
            backgroundMusic.play();
        }
    }, false);
    
    boommusic = this.sound.add('boom');
    backgroundMusic = this.sound.add('gameof');
    backgroundMusic.play({
        loop: true
    });
    
    
    let keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    

    document.addEventListener('keydown', function(event) {
        if (event.key === 'x') {
          if (player.x < 800 && player.x > 700 && isZoneArea) {
            
            let storeElement = document.getElementById('store');
            
            if(storeElement.classList.contains('store-hidden')) {
              storeElement.classList.remove('store-hidden');
              backgroundMusic.stop();

                // Play the shop music
                let shopMusic = this.sound.add('shopmusic');
                shopMusic.play();
            } else {
              storeElement.classList.add('store-hidden');
              backgroundMusic.play();
            }
          }
        }
      });
      

      let timerEvent;

      let timeElapsed = 0;
      let spawnRate = 15;
      let timerText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '00:00', {
        fontFamily: 'Exo, sans-serif',
        fontSize: '100px',
        color: '#ffffff',
        align: 'center'
        });
    timerText.setOrigin(0.5, 2.5);  // This centers the text on its position
    
    // Set the text to be fixed to the camera
    timerText.setScrollFactor(0);  
      
      // Set up the timer but pause it immediately
      timerEvent = this.time.addEvent({
          delay: 100,
          callback: updateTimer,
          callbackScope: this,
          loop: true,
          paused: true   // Start the timer in a paused state
      });

        function updateTimer() {
            timeElapsed++; // Increase the timer by the time since the last frame

            // Format the time like a digital clock
            let totalSeconds = Math.floor(timeElapsed / 10);
            let seconds = totalSeconds % 60;
            let milliseconds = Math.floor(timeElapsed % 10);
            timerText.setText(('0' + seconds).slice(-2) + ':' + ('0' + milliseconds).slice(-1));

            // Animate the text in the last 5 seconds
            if (totalSeconds >= spawnRate - 5 && !timerText.isTinted) {
                timerText.setTint(0xff0000); // Change text color to red

                this.tweens.add({
                    targets: timerText,
                    scaleX: 1.2, // Increase the scale along the x-axis
                    scaleY: 1.2, // Increase the scale along the y-axis
                    alpha: 0.5, // Reduce the opacity
                    ease: 'Power2', // Use a different easing function for a smoother animation
                    duration: 500, // Animation duration in milliseconds
                    yoyo: true, // Reverse the animation
                    repeat: 2, // Repeat the animation twice
                    onComplete: function () {
                        timerText.setScale(1); // Reset the scale to its original value
                        timerText.clearTint(); // Remove the tint
                        timerText.setAlpha(1); // Reset the opacity
                    }
                });

                timerText.isTinted = true; // Add a custom property to prevent this block from running more than once
            }
        
            // Check if it's time to spawn more monsters
            if (totalSeconds >= spawnRate) {
                timeElapsed = 0;  // Reset the timer
                timerText.clearTint(); // Remove the red tint
                //timerText.setFontSize(50); // Reset font size
                timerText.isTinted = false; // Reset the custom property
        
            loadMonsterImages();
            console.log(monsterIndex);
            // Add more monsters
            for (let i = 0; i < numMonsters; i++) {
                let monster = new Monster(this, i * 200 + 800, 1000);
                monsters.push(monster);
            }
                
            }
            createMonsterAnimations(this);
        }
        timerText.setVisible(false);



    // Create a key listener for 'k'
    //var keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    keyX.on('down', () => {
        if (player.x < 350 && player.x > 250) {
        if (isZoneArea) {
            // music 
            backgroundMusic.stop();
            this.music = this.sound.add('audioKey');
            this.music.play({
                loop: true
            });
            timerEvent.paused = false;
            // Going from zone area to game area
            isZoneArea = false;
            timerText.setVisible(true);

            // Change background
            bg.setTexture('background');

            // Spawn monsters
            for (let i = 0; i < numMonsters; i++) {
                let monster = new Monster(this, i * 200 + 800, 1000);
                monsters.push(monster);
            }
            createMonsterAnimations(this);

            // Remove wall street image if it exists
            // Hide wall street image
            wallStreetImage.setVisible(false);

        } else {
            this.music.stop();
            backgroundMusic.play();
            timeElapsed = 0;
            timerText.setText('Timer: ' + timeElapsed);
            timerEvent.paused = true;
            timerText.setVisible(false);
            // Going from game area to zone area
            isZoneArea = true;
            
            
            // Change background
            bg.setTexture('zoneBackground');

            // Add wall street image
            wallStreetImage.setVisible(true);

            // Remove monsters
            for (let monster of monsters) {
                monster.destroy();
            }
            monsters = [];  // Clear the monsters array
        }
    }
    });

    document.getElementById('toolbar').classList.add('show');
    // if you want to hide the toolbar, uncomment the line below
    //document.getElementById('toolbar').classList.remove('show');
}


function loadMonsterImages(){
    monsterIndex += 2;
    if (monsterIndex > 6) monsterIndex = 1;
    monsterFirstMove = `monster${monsterIndex}`;
    monsterSecMove = `monster${monsterIndex+1}`;
    console.log(monsterFirstMove);
    console.log(monsterSecMove);

    // Update monsterIndex for next call
     // Loop back to the start if we've gone past the last monster
}




// Create monster animations
function createMonsterAnimations(gameInstance) {
    if(gameInstance.anims.exists('monster-walk')) {
        gameInstance.anims.remove('monster-walk');
    }

    if(gameInstance.anims.exists('monster-stand')) {
        gameInstance.anims.remove('monster-stand');
    }

    gameInstance.anims.create({
        key: 'monster-walk',
        frames: [
            { key: monsterFirstMove },
            { key: monsterSecMove }
        ],
        frameRate: 1,
        repeat: -1 // Repeat the animation indefinitely
    });

    gameInstance.anims.create({
        key: 'monster-stand',
        frames: [
            { key: monsterFirstMove },
        ],
        frameRate: 1,
        repeat: -1 // Repeat the animation indefinitely
    });
}


// Create player animations
function createPlayerAnimations(gameInstance) {
    gameInstance.anims.create({
        key: 'player-stand',
        frames: [{ key: 'player-stand' }],
        frameRate: 20,
    });

    gameInstance.anims.create({
        key: 'player-walk',
        frames: Array.from({length: 4}, (_, i) => ({key: `player-walk${i+1}`})),
        frameRate: 4,
        repeat: -1
    });

    gameInstance.anims.create({
        key: 'player-jump',
        frames: [{ key: 'player-jump' }],
        frameRate: 20
    });

    gameInstance.anims.create({
        key: 'player-attack',
        frames: [
            { key: 'player-attack1' },
            { key: 'player-attack2' },
            { key: 'player-attack3' },
            { key: 'player-attack4' }
        ],
        frameRate: 10,
        repeat: 0
    });

    
}






function monsterHit(ball, monsterSprite) {
    console.log("Collision detected");
    ball.destroy();
    let monster = monsters.find(m => m.sprite === monsterSprite);  // find the monster that was hit
    if (monster) {
        monster.decreaseHealth();  // decrease health of the monster
    }
    if (monster.health <= 0) {
        player.money += 1;  // increase money
        console.log(`Money: ${player.money}`);
        document.getElementById('money-value').innerText = player.money;
        monsters = monsters.filter(monster => !monster.isDestroyed);
    }
}


function yourFunction() {
    let music = this.sound.add('boom');
    music.play({
        loop: false
    });

    // Stop the music after 1 second (adjust the duration as needed)
    setTimeout(function() {
        music.stop();
    }, 1000); // 1000 milliseconds = 1 second
}

function throwBall(gameInstance, direction) {
    // Create a new ball in Phaser
    let ball = gameInstance.physics.add.sprite(player.x, player.y, selectedBall).setScale(0.3);
    ball.setVelocityX(500 * direction);
    yourFunction.call(gameInstance);
    // Enable physics on the ball
    gameInstance.physics.world.enable(ball);

    // Add overlap detection between the ball and the monsters
    monsters.forEach(monster => {
        gameInstance.physics.add.overlap(ball, monster.sprite, function(ball, monsterSprite) {
            // This function is called when a ball hits a monster
            monsterHit(ball, monsterSprite);
        }, null, gameInstance);
    });
    
}




// Update game entities
function update() {
    // Player movement
    handlePlayerMovement(this);
    
}

// Handle player movement
function handlePlayerMovement(gameInstance) {
    if (!player.isAttacking) {
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('player-walk', true);
            player.flipX = false; 
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('player-walk', true);
            player.flipX = true;
        } else {
            player.setVelocityX(0);
            player.anims.play('player-stand'); 
        }
    }

    if (Phaser.Input.Keyboard.JustDown(attackKey) && !player.isAttacking) {
        player.isAttacking = true;
        player.setVelocityX(0);
        player.anims.play('player-attack', true);  
        // Always throw the ball when attack key is pressed
        throwBall(gameInstance, player.flipX ? 1 : -1);
    }
    
    if (Phaser.Input.Keyboard.JustDown(cursors.up) && player.body.blocked.down && !player.isAttacking) {
        player.setVelocityY(-330);
        player.anims.play('player-jump', true);
    }

    if (!player.body.blocked.down && !player.isAttacking) {
        player.anims.play('player-jump', true);
    }

    if (player.isAttacking && player.anims.currentAnim.key === 'player-attack' && player.anims.currentFrame.isLast) {
        player.isAttacking = false;
    }
}
