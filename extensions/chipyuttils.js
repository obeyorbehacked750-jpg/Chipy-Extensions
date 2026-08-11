(function (Scratch) {
  'use strict';

  // Your Discord image URL
  const iconURL = 'https://media.discordapp.net/attachments/1533845150764236911/1536422173592526918/5a058dfa-595f-4340-944d-ac43efa15aa0.jpg?ex=6a7b5827&is=6a7a06a7&hm=0312f61748be6ef7c73f5c4ba90e6330046a4d1a2caac26f8983bfa797f1f533&=&format=webp';

  class ChipyUttils {
    getInfo() {
      return {
        id: 'chipyuttils',
        name: 'Chipy Uttils',
        color1: '#FF4444', 
        color2: '#CC0000',
        blockIconURI: iconURL,
        menuIconURI: iconURL,
        blocks: [
          {
            opcode: 'pointTowards',
            blockType: Scratch.BlockType.COMMAND,
            text: 'point towards closest clone of [SPRITE]',
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Sprite1'
              }
            }
          },
          {
            opcode: 'homingTowards',
            blockType: Scratch.BlockType.COMMAND,
            text: 'homing to [SPRITE] at [SPEED] degrees',
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Sprite1'
              },
              SPEED: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 5
              }
            }
          },
          {
            opcode: 'distanceTo',
            blockType: Scratch.BlockType.REPORTER,
            text: 'distance to closest clone of [SPRITE]',
            arguments: {
              SPRITE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Sprite1'
              }
            }
          }
        ]
      };
    }

    _getClosestClone(util, spriteName) {
      const myX = util.target.x;
      const myY = util.target.y;

      let closest = null;
      let minDistance = Infinity;

      const targets = Scratch.vm.runtime.targets;
      
      for (const target of targets) {
        if (!target.isOriginal && target.sprite.name === spriteName) {
          if (target.id === util.target.id) continue;

          const dx = target.x - myX;
          const dy = target.y - myY;
          const distance = Math.sqrt((dx * dx) + (dy * dy));

          if (distance < minDistance) {
            minDistance = distance;
            closest = target;
          }
        }
      }

      return { clone: closest, distance: minDistance };
    }

    pointTowards(args, util) {
      const result = this._getClosestClone(util, args.SPRITE);
      
      if (result.clone) {
        const dx = result.clone.x - util.target.x;
        const dy = result.clone.y - util.target.y;
        const direction = (180 / Math.PI) * Math.atan2(dx, dy);
        util.target.setDirection(direction);
      }
    }

    homingTowards(args, util) {
      const result = this._getClosestClone(util, args.SPRITE);
      
      if (result.clone) {
        const dx = result.clone.x - util.target.x;
        const dy = result.clone.y - util.target.y;
        
        const targetDirection = (180 / Math.PI) * Math.atan2(dx, dy);
        const currentDirection = util.target.direction;
        const speed = Scratch.Cast.toNumber(args.SPEED);
        
        let diff = targetDirection - currentDirection;
        
        diff = diff % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        
        if (Math.abs(diff) <= speed) {
          util.target.setDirection(targetDirection);
        } else {
          util.target.setDirection(currentDirection + (Math.sign(diff) * speed));
        }
      }
    }

    distanceTo(args, util) {
      const result = this._getClosestClone(util, args.SPRITE);
      if (result.clone) {
        return Math.round(result.distance * 10) / 10;
      }
      return '';
    }
  }

  Scratch.extensions.register(new ChipyUttils());
})(Scratch);