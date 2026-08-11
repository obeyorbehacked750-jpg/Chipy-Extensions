(function (Scratch) {
  'use strict';

  class ChipyUttils {
    getInfo() {
      return {
        id: 'chipyuttils',
        name: 'Chipy Uttils',
        color1: '#FF4444', 
        color2: '#CC0000',
        // Icons removed to prevent web browser CORS crashes
        blocks: [
          {
            opcode: 'pointTowards',
            blockType: Scratch.BlockType.COMMAND,
            text: 'point towards closest clone of [SPRITE]',
            arguments: {
              SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spriteMenu' }
            }
          },
          {
            opcode: 'homingTowards',
            blockType: Scratch.BlockType.COMMAND,
            text: 'homing to [SPRITE] at [SPEED] degrees',
            arguments: {
              SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spriteMenu' },
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
            }
          },
          {
            opcode: 'distanceTo',
            blockType: Scratch.BlockType.REPORTER,
            text: 'distance to closest clone of [SPRITE]',
            arguments: {
              SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spriteMenu' }
            }
          },
          "---",
          {
            opcode: 'isTouchingClone',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is touching clone of [SPRITE]?',
            arguments: {
              SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spriteMenu' }
            }
          },
          {
            opcode: 'getTouchedCloneVar',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get [VAR] from touched clone of [SPRITE]',
            arguments: {
              VAR: { type: Scratch.ArgumentType.STRING, defaultValue: 'HP' },
              SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spriteMenu' }
            }
          },
          {
            opcode: 'setTouchedCloneVar',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set [VAR] of touched clone of [SPRITE] to [VALUE]',
            arguments: {
              VAR: { type: Scratch.ArgumentType.STRING, defaultValue: 'HP' },
              SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spriteMenu' },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '0' }
            }
          }
        ],
        menus: {
          spriteMenu: {
            acceptReporters: true,
            items: '_getSprites'
          }
        }
      };
    }

    _getSprites() {
      const spriteNames = [];
      const targets = Scratch.vm.runtime.targets;
      for (const target of targets) {
        if (target.isOriginal && !target.isStage) {
          spriteNames.push(target.sprite.name);
        }
      }
      return spriteNames.length > 0 ? spriteNames : ['Sprite1'];
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

    _getTouchedClone(util, spriteName) {
      let closestTouch = null;
      let minDistance = Infinity;
      const targets = Scratch.vm.runtime.targets;

      for (const target of targets) {
        if (!target.isOriginal && target.sprite.name === spriteName) {
          if (target.id === util.target.id) continue;
          
          if (Scratch.vm.renderer.isTouchingDrawables(util.target.drawableID, target.drawableID)) {
            const dx = target.x - util.target.x;
            const dy = target.y - util.target.y;
            const distance = Math.sqrt((dx * dx) + (dy * dy));

            if (distance < minDistance) {
              minDistance = distance;
              closestTouch = target;
            }
          }
        }
      }
      return closestTouch;
    }

    pointTowards(args, util) {
      const result = this._getClosestClone(util, args.SPRITE);
      if (result.clone) {
        const dx = result.clone.x - util.target.x;
        const dy = result.clone.y - util.target.y;
        util.target.setDirection((180 / Math.PI) * Math.atan2(dx, dy));
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
        
        let diff = (targetDirection - currentDirection) % 360;
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
      if (result.clone) return Math.round(result.distance * 10) / 10;
      return '';
    }

    isTouchingClone(args, util) {
      return this._getTouchedClone(util, args.SPRITE) !== null;
    }

    getTouchedCloneVar(args, util) {
      const touchedClone = this._getTouchedClone(util, args.SPRITE);
      if (touchedClone) {
        const variable = touchedClone.lookupVariableByNameAndType(args.VAR, '');
        if (variable) return variable.value;
      }
      return '';
    }

    setTouchedCloneVar(args, util) {
      const touchedClone = this._getTouchedClone(util, args.SPRITE);
      if (touchedClone) {
        const variable = touchedClone.lookupVariableByNameAndType(args.VAR, '');
        if (variable) {
          variable.value = args.VALUE;
        }
      }
    }
  }

  Scratch.extensions.register(new ChipyUttils());
})(Scratch);
