(function(Scratch) {
  'use strict';

  class UttilsExtension {
    constructor() {
      this.currentAudio = null;
    }

    getInfo() {
      return {
        id: 'chipywarptools',
        name: 'Chipywarp Tools',
        color1: '#47cc4b',
        blocks: [
          {
            opcode: 'evalCode',
            blockType: Scratch.BlockType.REPORTER,
            text: 'eval [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1+1'
              }
            }
          },
          {
            opcode: 'roundDecimals',
            blockType: Scratch.BlockType.REPORTER,
            text: 'round [NUM] to [PLACES] decimals',
            arguments: {
              NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 60.1234
              },
              PLACES: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              }
            }
          },
          {
            opcode: 'getPi',
            blockType: Scratch.BlockType.REPORTER,
            text: 'pi'
          },
          {
            opcode: 'getNaN',
            blockType: Scratch.BlockType.REPORTER,
            text: 'NaN'
          },
          {
            opcode: 'getInfinity',
            blockType: Scratch.BlockType.REPORTER,
            text: 'infinity'
          },
          '---',
          {
            opcode: 'playSoundFromUrl',
            blockType: Scratch.BlockType.COMMAND,
            text: 'play sound from url [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg'
              }
            }
          },
          {
            opcode: 'waitUntilSoundEnds',
            blockType: Scratch.BlockType.COMMAND,
            text: 'wait until sound ends'
          },
          '---',
          {
            opcode: 'getTrue',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'true'
          },
          {
            opcode: 'getFalse',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'false'
          }
        ]
      };
    }

    evalCode(args) {
      try {
        return eval(args.CODE);
      } catch (e) {
        return e.toString();
      }
    }

    roundDecimals(args) {
      const num = Scratch.Cast.toNumber(args.NUM);
      const places = Scratch.Cast.toNumber(args.PLACES);
      const multiplier = Math.pow(10, places);
      return Math.round(num * multiplier) / multiplier;
    }

    getPi() {
      return Math.PI;
    }

    getNaN() {
      return NaN;
    }

    getInfinity() {
      return Infinity;
    }

    playSoundFromUrl(args) {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      
      this.currentAudio = new Audio(Scratch.Cast.toString(args.URL));
      this.currentAudio.play().catch(err => {
        console.error('Uttils Extension - Audio playback failed:', err);
      });
    }

    waitUntilSoundEnds() {
      if (!this.currentAudio) return;
      if (this.currentAudio.paused || this.currentAudio.ended) return;
      
      return new Promise((resolve) => {
        const finish = () => {
          this.currentAudio.removeEventListener('ended', finish);
          this.currentAudio.removeEventListener('pause', finish);
          this.currentAudio.removeEventListener('error', finish);
          resolve();
        };

        this.currentAudio.addEventListener('ended', finish);
        this.currentAudio.addEventListener('pause', finish);
        this.currentAudio.addEventListener('error', finish);
      });
    }

    getTrue() {
      return true;
    }

    getFalse() {
      return false;
    }
  }

  Scratch.extensions.register(new UttilsExtension());
})(Scratch);
