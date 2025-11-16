const mainCanvas = document.getElementById('bg');
      const mainCtx = mainCanvas.getContext('2d');

      const offscreenCanvas = document.createElement('canvas');
      const ctx = offscreenCanvas.getContext('2d');
      
      const IX = 200; 
      let IY = 200; 
      let imgData = ctx.createImageData(IX, IY);

      let g = {};
      var a = 0;
      var state = 0;
      const max = 6;

      function setPixel(x, y, rgbColor) {
          x = Math.floor(x);
          y = Math.floor(y);

          if (x < 0 || x >= IX || y < 0 || y >= IY) { 
              return;
          }
          
          const [r, g, b] = rgbColor;

          const index = (y * IX + x) * 4; 
          imgData.data[index] = r;
          imgData.data[index + 1] = g;
          imgData.data[index + 2] = b;
          imgData.data[index + 3] = 255;
      }
      
      function bline(x0, y0, x1, y1, color) {
          x0 = Math.floor(x0);
          y0 = Math.floor(y0);
          x1 = Math.floor(x1);
          y1 = Math.floor(y1);
          var dx = Math.abs(x1 - x0);
          var dy = Math.abs(y1 - y0);
          var sx = (x0 < x1) ? 1 : -1;
          var sy = (y0 < y1) ? 1 : -1;
          var err = dx - dy;
          
          while (true) {
              setPixel(x0, y0, color);
              if ((x0 == x1) && (y0 == y1)) break;
              var e2 = 2 * err;
              if (e2 > -dy) {
                  err -= dy;
                  x0 += sx;
              }
              if (e2 < dx) {
                  err += dx;
                  y0 += sy;
              }
          }
      }

      g = {};

      function draw() {
        // console.log(date.now)
        if(Date.now()%5000<17){
          a=0;
          imgData = ctx.createImageData(IX, IY); 
          for(var i=0; i < imgData.data.length; i += 4){
              imgData.data[i] = 255;
            imgData.data[i+1] = 255;
            imgData.data[i+2] = 255;
            imgData.data[i+3] = 255;
          }
              
          state++;
          if(state>max){
              state=0;
          }
        }
          a++;
          g.last=0;
          for(var x=1;x<IX;x++){ 
              let r = Math.random();
              
              let r2 = Math.random();
              
              let t = (Math.sin(a * 0.01) + 1) / 2; 
              let g_val = 50 + Math.floor(r * 100); 
              let b_val = Math.floor(g_val * t * r2); 
              let r_val = Math.floor(r2 * 75);

              const color = [
                r_val, 
                g_val, 
                b_val
              ];
              
              let lastInt = Math.floor(g.last);

              switch(state) {
      case 0:
          g.cur=IY*Math.asin((x/(0.5/Math.sin(x*a)))/a)+50; 
                  setPixel(x, g.cur, color);
          break;
      case 1:
          g.cur=1000*Math.sin((a/20)*a*Math.floor(a*x^2))/x +50;
                  setPixel(x, g.cur, color);
          break;
      case 2:
          g.cur=a/x*(Math.cos(x*g.last)*x^2+lastInt^2-1000);
                  setPixel(x, g.cur, color);
          break;
      case 3:
          g.cur=IX*Math.sin(x+(a*0.05))+g.last/a; 
                  setPixel(x, g.cur, color);
          break;
      case 4:
       g.cur=IX*Math.sin(x*IY+a*0.01)+a; 
                  setPixel(x, g.cur, color);
          break;
      case 5:
       g.cur=(50*Math.sin(a))*Math.sin(x/5+(r*0.5)+a)+50;
                  setPixel(x, g.cur, color);
          break;
      case 6:
          g.cur=50*Math.sin(x/10+(r*0.01))+100*r;
                  bline(x, g.cur, x, g.last, color);
          break;
      }
              
              if (isFinite(g.cur)) {
                  g.last = g.cur;
              } else {
                  g.last = 0;
              }
      }

        ctx.putImageData(imgData, 0, 0);
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        mainCtx.imageSmoothingEnabled = false;
        mainCtx.drawImage(offscreenCanvas, 0, 0, mainCanvas.width, mainCanvas.height);
        requestAnimationFrame(draw);
      }

    //   document.addEventListener('mouseup', () => {
    //       a=0;
    //       imgData = ctx.createImageData(IX, IY); 
    //       for(var i=0; i < imgData.data.length; i += 4){
    //           imgData.data[i] = 255;
    //         imgData.data[i+1] = 255;
    //         imgData.data[i+2] = 255;
    //         imgData.data[i+3] = 255;
    //       }
              
    //       state++;
    //       if(state>max){
    //           state=0;
    //       }
    //   });

      function resizeCanvas() {
          mainCanvas.width = window.innerWidth;
          mainCanvas.height = document.documentElement.scrollHeight;

          if (mainCanvas.width === 0) {
              return; 
          }

          const newIY = Math.floor(IX * (mainCanvas.height / mainCanvas.width));

          if (newIY > 0 && newIY !== IY) {
              IY = newIY;
              offscreenCanvas.width = IX;
              offscreenCanvas.height = IY;
              imgData = ctx.createImageData(IX, IY);
          }
      }
      
      const observer = new ResizeObserver(() => {
        resizeCanvas();
      });
      observer.observe(document.body); 

      window.onload = () => {
          resizeCanvas();
          mainCanvas.classList.add('show'); 
          requestAnimationFrame(draw);
      };
