
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
            gravity: { y: 1000 },
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
var player;
var attackKey;
var isAttacking = false; // Boolean variable to track if it's an attack animation
// Monster Variables
var monster1;
var monster2;
var monster3;
var monster4;
var monster5;




// Preload assets
function preload() {
    // Background
    this.load.image('background', 'background.png');

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

    // monster assets
    this.load.image('monster1', 'monster/monster1.png');
    this.load.image('monster2', 'monster/monster2.png');
}

// Create game entities and setup
function create() {
    // Create background and set origin
    let bg = this.add.image(0, 0, 'background');
    bg.setOrigin(0.0, 0.03); 
    bg.setPosition(0, 0);

    // Create player, set origin, and world bounds
    player = this.physics.add.sprite(100, 450, 'player-stand');
    player.setOrigin(0.5, 0.5);
    this.physics.world.setBounds(-250, 0, 1920+480, 1080); 

    // Set camera settings
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, 1920, 1080-64);
    this.cameras.main.setZoom(0.7); 
    player.setCollideWorldBounds(true);
    
    // Create player animations
    createPlayerAnimations(this);

    // Set initial animation
    player.anims.play('player-walk');
    player.isAttacking = false;

    // Create cursor keys and attack key
    cursors = this.input.keyboard.createCursorKeys();
    attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);


    // Create a new Monster instance
    monster1 = new Monster(this, 400, 500);
    monster2 = new Monster(this, 1200, 500);
    monster3 = new Monster(this, 1500, 500);
    monster4 = new Monster(this, 1500, 500);
    monster5 = new Monster(this, 1500, 500);
    

    // Create monster animations
    createMonsterAnimations(this);

    // Start the walking animation for the monster
    monster1.sprite.anims.play('monster-walk', true);
    monster2.sprite.anims.play('monster-walk', true);
    monster3.sprite.anims.play('monster-walk', true);
    

    
}

// Create monster animations
function createMonsterAnimations(gameInstance) {
    gameInstance.anims.create({
        key: 'monster-walk',
        frames: [
            { key: 'monster1' },
            { key: 'monster2' }
        ],
        frameRate: 2,
        repeat: -1 // Repeat the animation indefinitely
    });

    gameInstance.anims.create({
        key: 'monster-stand',
        frames: [
            { key: 'monster1' },
        ],
        frameRate: 2,
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
