class Monster {
    constructor(scene, x, y) {
        
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y).setScale(0.25);// Set origin to be the center
        this.sprite.setCollideWorldBounds(true);
        this.direction = 1;
        this.speed = Phaser.Math.GetSpeed(50, 1);
        // Manually set the bounding box
        this.sprite.body.setSize(10,700);
        this.sprite.body.setOffset(0.1, 300);
        
        // Initialize monster's health
        this.health = 5;
        this.isDestroyed = false;
        console.log("Monster size:", this.sprite.displayWidth, this.sprite.displayHeight);

        

        // movment array
        this.movements = [
            { x: -50, anim: 'monster-walk', flipX: false },
            { x: 0, anim: 'monster-stand', flipX: false },
            { x: 50, anim: 'monster-walk', flipX: true },
        ];

        scene.time.addEvent({
            
            delay: Phaser.Math.Between(2000, 5000), // Change direction every 2 seconds
            callback: this.changeDirection,
            callbackScope: this,
            loop: true,
        });
    }

    destroy() {
        this.sprite.destroy();
        this.isDestroyed = true;
    }

    decreaseHealth() {
        this.health--;
        console.log("Monster health: ", this.health);
        if (this.health <= 0 && !this.isDestroyed) {
            let boom = this.scene.physics.add.sprite(this.sprite.x, this.sprite.y-15, 'boom');
            boom.body.setAllowGravity(false);
            
            
            // Use the setTimeEvent method to destroy the boom sprite after 1 second
            this.scene.time.addEvent({
                delay: 400, // time in ms
                callback: () => {
                    boom.destroy();
                    this.dropMoney();

                }
            });
            // Destroy the sprite
            this.sprite.destroy();
            this.isDestroyed = true;
            //this.dropMoney();
            
        }
    }

    
    
    dropMoney() {
        // Assuming that you have the image of the money named 'money' 
        let money = this.scene.physics.add.sprite(this.sprite.x, this.sprite.y+18, 'bitcoin').setScale(0.2);
        money.body.setAllowGravity(false); // Make sure the money doesn't fall due to gravity
        this.scene.time.addEvent({
            delay: 1500, // time in ms
            callback: () => money.destroy(),
        });
    }
    
    

        
    changeDirection() {
        // Check if the monster is not destroyed before changing its direction
        if (!this.isDestroyed) {
            let movement = Phaser.Utils.Array.GetRandom(this.movements);
            // Add a bit of randomness to the movement speed
            let speedAdjustment = Phaser.Math.Between(-20, 20);
            this.sprite.setVelocityX(movement.x + speedAdjustment);
            this.sprite.anims.play(movement.anim, true);
            this.sprite.flipX = movement.flipX;
        }
    }
}    

