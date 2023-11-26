// starterScene.js
var starterScene = new Phaser.Scene('starterScene');

starterScene.preload = function() {
    this.load.image('image1', 'image1.png');
    this.load.image('image2', 'image2.png');
    this.load.image('image3', 'image3.png');
    this.load.image('background-c', 'Champions-backgrounds.png');
};

starterScene.create = function() {
    
    var scene = this; // Store the scene reference

    scene.add.image(400, 300, 'background-c');

    var images = [
        scene.add.image(150, 300, 'image1').setInteractive(),
        scene.add.image(380, 300, 'image2').setInteractive(),
        scene.add.image(650, 300, 'image3').setInteractive()
    ];

    images[0].origScale = 0.5;
    images[1].origScale = 1.3;
    images[2].origScale = 0.9;
    images.forEach(image => image.setScale(image.origScale));

    var selectedIndex = 0;
    var cursors = scene.input.keyboard.createCursorKeys();
    var enterKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    var selectImage = function(index) {
        // Deselect the previous image
        images[selectedIndex].setScale(images[selectedIndex].origScale);
        images[selectedIndex].clearTint();
        images[selectedIndex].setAlpha(1.0);
        // Select the new image
        selectedIndex = index;
        images[selectedIndex].setScale(images[selectedIndex].origScale * 1.1);
        images[selectedIndex].setTint(0x808080);
        images[selectedIndex].setAlpha(0.8);
    };

    var onLeftKey = function() {
        if (selectedIndex > 0) {
            selectImage(selectedIndex - 1);
        }
    };

    var onRightKey = function() {
        if (selectedIndex < images.length - 1) {
            selectImage(selectedIndex + 1);
        }
    };

    var onEnterKey = () => {
        startGame();
    };

    var startGame = () => {
        scene.scene.start('gameScene');
    };

    selectImage(selectedIndex);

    cursors.left.on('down', onLeftKey);
    cursors.right.on('down', onRightKey);
    enterKey.on('down', onEnterKey);
};
