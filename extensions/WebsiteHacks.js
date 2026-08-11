(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Website Hacks extension must run unsandboxed');
  }

  // Inject all CSS animations
  const style = document.createElement('style');
  style.textContent = `
    /* Rainbow Animation */
    @keyframes turbowarp-rainbow-filter {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    .turbowarp-rainbow-active {
      animation: turbowarp-rainbow-filter 2s infinite linear !important;
    }

    /* Flip Animations */
    .turbowarp-flipped {
      transform: rotate(180deg) !important;
      transition: transform 1s ease-in-out;
    }
    .turbowarp-unflipped {
      transform: rotate(0deg) !important;
      transition: transform 1s ease-in-out;
    }

    /* Gravity Physics Animation */
    @keyframes gravity-fall {
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(200vh) rotate(35deg); opacity: 0; }
    }
    .turbowarp-gravity-active div {
        animation: gravity-fall 2.5s ease-in forwards !important;
    }

    /* Custom Background Magic */
    .turbowarp-custom-bg-active,
    .turbowarp-custom-bg-active #app,
    .turbowarp-custom-bg-active div[class*="gui_body-wrapper"] {
        background-color: transparent !important;
        background-image: none !important;
    }
    
    #turbowarp-custom-bg-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -9999;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        display: none;
    }
    .turbowarp-custom-bg-active #turbowarp-custom-bg-canvas { display: block; }

    /* Tornado and Cat CSS */
    .turbowarp-tornado {
        position: fixed;
        font-size: 100px;
        z-index: 99999;
        pointer-events: none;
        animation: tornado-spin 0.4s linear infinite, tornado-move 3s linear forwards;
    }
    @keyframes tornado-spin { 100% { transform: rotate(360deg) scale(1.5); } }
    @keyframes tornado-move { 0% { left: -150px; top: 30vh; } 100% { left: 110vw; top: 30vh; } }

    .turbowarp-cat {
        position: fixed;
        font-size: 50px;
        z-index: 99998;
        pointer-events: none;
        transition: all 0.5s ease-in-out;
    }

    /* When UI elements get eaten, they shrink and disappear */
    .eaten-by-chaos {
        transition: transform 0.3s, opacity 0.3s !important;
        transform: scale(0) rotate(180deg) !important;
        opacity: 0 !important;
        pointer-events: none !important;
    }

    /* Rickroll overlay styles */
    #turbowarp-rickroll-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: black;
        z-index: 999999;
        display: flex;
        justify-content: center;
        align-items: center;
    }
  `;
  document.head.appendChild(style);

  const bgCanvas = document.createElement('div');
  bgCanvas.id = 'turbowarp-custom-bg-canvas';
  document.body.appendChild(bgCanvas);

  class FunWebsiteHacks {
    getInfo() {
      return {
        id: 'funwebsitehacks',
        name: 'Website Hacks',
        color1: '#ff007f', 
        color2: '#cc0066',
        color3: '#99004d',
        blocks: [
          {
            opcode: 'setBgColor',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set website background color to [COLOR]',
            arguments: { COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#00ffff' } }
          },
          {
            opcode: 'setBgImage',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set website background image to [URL]',
            arguments: { URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Latte_and_dark_coffee.jpg' } }
          },
          { opcode: 'resetBg', blockType: Scratch.BlockType.COMMAND, text: 'reset website background' },
          "---",
          {
            opcode: 'makeRainbow',
            blockType: Scratch.BlockType.COMMAND,
            text: 'make page rainbow for [TIME] seconds',
            arguments: { TIME: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 } }
          },
          {
            opcode: 'flipWebsite',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set website flipped [STATE]',
            arguments: { STATE: { type: Scratch.ArgumentType.STRING, menu: 'FLIP_MENU' } }
          },
          { opcode: 'doBarrelRoll', blockType: Scratch.BlockType.COMMAND, text: 'do a barrel roll' },
          "---",
          { opcode: 'addGravity', blockType: Scratch.BlockType.COMMAND, text: '⚠️ destroy website with gravity' },
          { opcode: 'startTornado', blockType: Scratch.BlockType.COMMAND, text: '🌪️ start tornado to eat website' },
          { opcode: 'spawnCat', blockType: Scratch.BlockType.COMMAND, text: '🐈 spawn cat to eat random elements' },
          "---",
          { opcode: 'breakAndRickroll', blockType: Scratch.BlockType.COMMAND, text: 'say hello' }
        ],
        menus: {
          FLIP_MENU: { acceptReporters: true, items: ['on', 'off'] }
        }
      };
    }

    setBgColor(args) {
      bgCanvas.style.backgroundImage = 'none';
      bgCanvas.style.backgroundColor = Scratch.Cast.toString(args.COLOR);
      document.body.classList.add('turbowarp-custom-bg-active');
    }

    setBgImage(args) {
      bgCanvas.style.backgroundColor = 'transparent';
      bgCanvas.style.backgroundImage = `url("${Scratch.Cast.toString(args.URL)}")`;
      document.body.classList.add('turbowarp-custom-bg-active');
    }

    resetBg() {
      document.body.classList.remove('turbowarp-custom-bg-active');
    }

    makeRainbow(args) {
      const time = Scratch.Cast.toNumber(args.TIME);
      document.body.classList.add('turbowarp-rainbow-active');
      return new Promise((resolve) => setTimeout(() => {
          document.body.classList.remove('turbowarp-rainbow-active');
          resolve();
      }, time * 1000));
    }

    flipWebsite(args) {
      const state = Scratch.Cast.toString(args.STATE).toLowerCase();
      if (state === 'on') {
        document.body.classList.add('turbowarp-flipped');
        document.body.classList.remove('turbowarp-unflipped');
      } else {
        document.body.classList.remove('turbowarp-flipped');
        document.body.classList.add('turbowarp-unflipped');
      }
    }

    doBarrelRoll() {
       document.body.style.transition = "transform 1.5s ease-in-out";
       document.body.style.transform = "rotate(360deg)";
       return new Promise((resolve) => setTimeout(() => {
           document.body.style.transition = "none";
           document.body.style.transform = "";
           resolve();
       }, 1500));
    }

    addGravity() { document.body.classList.add('turbowarp-gravity-active'); }

    startTornado() {
      const tornado = document.createElement('div');
      tornado.textContent = '🌪️';
      tornado.className = 'turbowarp-tornado';
      document.body.appendChild(tornado);

      let uiElements = Array.from(document.querySelectorAll('button, input, span, .scratchCategoryMenuItem'));
      uiElements.sort(() => 0.5 - Math.random());

      const eatInterval = setInterval(() => {
          const el = uiElements.pop();
          if (el) el.classList.add('eaten-by-chaos');
      }, 100);

      setTimeout(() => {
          tornado.remove();
          clearInterval(eatInterval);
      }, 3000);
    }

    spawnCat() {
      const cat = document.createElement('div');
      cat.textContent = '🐈';
      cat.className = 'turbowarp-cat';
      cat.style.left = '50vw';
      cat.style.top = '50vh';
      document.body.appendChild(cat);

      const huntInterval = setInterval(() => {
          const elements = Array.from(document.querySelectorAll('button, span, img, .scratchCategoryMenuItem'));
          const validElements = elements.filter(e => !e.classList.contains('eaten-by-chaos') && e.getBoundingClientRect().width > 0);
          
          if (validElements.length === 0) {
              cat.textContent = '🐈‍⬛ (Full!)';
              clearInterval(huntInterval);
              setTimeout(() => cat.remove(), 3000);
              return;
          }

          const target = validElements[Math.floor(Math.random() * validElements.length)];
          const rect = target.getBoundingClientRect();
          
          cat.style.left = `${rect.left}px`;
          cat.style.top = `${rect.top}px`;

          setTimeout(() => {
              if (document.body.contains(target)) {
                  target.classList.add('eaten-by-chaos');
              }
          }, 500);

      }, 1000);
    }

    // --- NEW: Break Everything and Rickroll Method ---
    breakAndRickroll() {
      // Clear out the body contents cleanly
      document.body.innerHTML = '';
      document.body.style.margin = '0';
      document.body.style.overflow = 'hidden';

      // Create overlay container
      const overlay = document.createElement('div');
      overlay.id = 'turbowarp-rickroll-overlay';

      // Embed the classic Rickroll video with autoplay and looping enabled
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.src = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&loop=1&playlist=dQw4w9WgXcQ';
      iframe.title = 'Never Gonna Give You Up';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;

      overlay.appendChild(iframe);
      document.body.appendChild(overlay);
    }
  }

  Scratch.extensions.register(new FunWebsiteHacks());
})(Scratch);