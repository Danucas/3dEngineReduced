

  class ColorPicker{
    constructor(){
      this.ton = {
          last: {r:255, g:0, b:0},
          actual: {r:255, g:0, b:0},
          lastPos: 0,
          actualPos: 0
      };
      this.ranges = [[255, {r:255, g:0, b:0}],
                     [510, {r:255, g:255, b:0}],
                     [765, {r:0, g:255, b:0}],
                     [1020, {r:0, g:255, b:255}],
                     [1275, {r:0, g:0, b:255}],
                     [1530, {r:255, g:0, b:255}]];
      this.actualRange = 0;
      this.actual = {r:255, g:0, b:0};
      this.width = 200;
      this.height = 100;
      this.x = 0;
      this.y = 0;
      this.var = {val:{x:0,y:0}, ref:0};
      this.color = {r:255, g:0, b:0};

    }

    setFinalRGB(rgb){
      this.color = rgb;

    }

    setActual(a){
      this.actual = a;
    }
    getActual(){
      return this.actual;
    }
    setColor(){
      console.log('setting requested color');
      this.cont.style.display = 'none';
      var rgb = this.color;
      engine.setRequestedColor(rgb);
    }
    getActualRange(){
      return this.actualRange;
    }
    getRange(){
      return this.ranges;
    }
    getTone(){
      return this.ton.actual;
    }
    setRange(r){
        this.actualRange = r;
    }
    setTon(t){
      this.ton.actual.r = t.x;
      this.ton.actual.g = t.y;
      this.ton.actual.b = t.z;
    }
    setXY(x, y){
      console.log('setedXY: ', x, y);
      this.x = x;
      this.y =y;
    }
    getXY(){
      console.log('gettedXY: ',{x: this.x, y:this.y});
      return {x: this.x, y:this.y};
    }
    setWH(w, h){
      console.log('settedWH: ', w, h, );
      this.width = w;
      this.height =h;
    }
    getWH(){
      console.log('gettedWH: ',{w:this.width, h:this.height});
      return {w:this.width, h:this.height};
    }


    init(){
      this.cont = document.getElementById('colorPicker');
      this.cont.style.display = 'block';
      document.getElementById('alert').style.display = 'block';
      this.tonIn = document.getElementById('tonIn');
      this.tonIn.value = this.ton.actualPos;
      this.sat = document.getElementById('saturation');
      var context = this;
      this.setXY(this.sat.width, 0);
      this.x = this.sat.width;
      this.setWH(this.sat.width,this.sat.height);
      var s = this.getWH();

      var iniTon = this.xyToRGB(this.getShadow(s.w, s.h, this.x, this.y, false, this.actual));
      document.getElementById('pickerConsole').innerHTML = '2860: rgb('+iniTon.r+','+iniTon.g+','+iniTon.b+')';
      document.getElementById('picked').style.backgroundColor = 'rgb('+iniTon.r+','+iniTon.g+','+iniTon.b+')';
      var typeEvent = 'click';
      if(fromMob){
        typeEvent = 'touchstart' ;
      }
      this.sat.addEventListener(typeEvent, function(e){
              console.log(e);
              if(fromMob){
                context.shad(e.changedTouches[0].target.width,
                  e.changedTouches[0].target.height,
                  e.changedTouches[0].clientX,
                  e.changedTouches[0].clientY,
                  e.changedTouches[0].target.offsetParent.offsetLeft,
                  e.changedTouches[0].target.offsetParent.offsetTop
                );
              }else{
                context.shad(e.target.width,
                  e.target.height,
                  e.clientX,
                  e.clientY,
                  e.target.offsetParent.offsetLeft,
                  e.target.offsetParent.offsetTop
                );
              }




      });

      this.setColorShadows(this.actual);

      console.log('iniciando');
    }

    shad(w, h, x, y, offsetWidth, offsetHeight){
      var iniTon = this.xyToRGB(this.getShadow(w, h, x-offsetWidth, y-offsetHeight, true, this.getActual()));
      this.setFinalRGB(iniTon);
      document.getElementById('picked').style.backgroundColor = 'rgb('+iniTon.r+','+iniTon.g+','+iniTon.b+')';
      document.getElementById('pickerConsole').innerHTML = '2879: rgb('+iniTon.r+','+iniTon.g+','+iniTon.b+')';

    }

    step(s){
      this.ton.actualPos = s;

      var last = 0;
      var finalVec ;

      for(var i=0;i<this.ranges.length;i++){

        var rang = this.ranges[i][0];
        var comp = this.ranges[i][1];
        if(s>last&&s<=rang){
          var v = this.getVar();
          var finalIn;
          var lo = this.ton.actualPos-last;
          var s = [comp.r, comp.g, comp.b];
          finalIn = lo;
          var vec1 = this.Vector(s);

          var vec2;
          switch(i){
            case 0:
                vec2 = this.Vector([0, finalIn, 0]);
                break;
            case 1:
                vec2 = this.Vector([finalIn*(-1), 0, 0]);
                break;
            case 2:
                vec2 = this.Vector([0, 0, finalIn]);
                break;
            case 3:
                vec2 = this.Vector([0, finalIn*(-1), 0]);
                break;
            case 4:
                vec2 = this.Vector([finalIn, 0, 0]);
                break;
            case 5:
                vec2 = this.Vector([0, 0, finalIn*(-1)]);
                break;

          }
          this.setRange(i);

          finalVec = this.sumarVec(vec1, vec2);


        }



        last = rang;

        //console.log('last position: ', last);


      }
      if(finalVec){
        document.getElementById('picked').style.backgroundColor = 'rgb('+finalVec.x+','+finalVec.y+','+finalVec.z+')';
        document.getElementById('pickerConsole').innerHTML = '2940: rgb('+finalVec.x+','+finalVec.y+','+finalVec.z+')';
        this.setTon(finalVec);
        this.actual = this.xyToRGB(finalVec);
        this.ton.lastPos = s;
        this.setColorShadows(this.xyToRGB(finalVec));
      }



    }

    setColorShadows(vec){
      console.log('tono: ', this.actual);
      var wh = this.getWH();
      var newData = new Uint8ClampedArray(wh.w * wh.h *  4);
      var nDPOS = 0;
      for(var y=0;y<this.height;y++){
        for(var x=0; x<this.width;x++ ){
            var shadowColor = this.xyToRGB(this.getShadow(this.width, this.height, x, y, false, this.getActual()));
            newData[nDPOS] = shadowColor.r;
            nDPOS ++;
            newData[nDPOS] = shadowColor.g;
            nDPOS ++;
            newData[nDPOS] = shadowColor.b;
            nDPOS ++;
            newData[nDPOS] = 255;
            nDPOS ++;


        }
      }
      var context = this.sat.getContext('2d');
      context.clearRect(0, 0, this.width, this.height);
      context.fillStyle = '#ffffff';
      context.fill();
      var idata = context.createImageData(this.width, this.height);
      idata.data.set(newData);
      context.putImageData(idata, 0, 0);
      var pos = this.getXY();


      var shadow = this.xyToRGB(this.getShadow(wh.w, wh.h, pos.x, pos.y, false,this.getActual()));
      this.setFinalRGB(shadow);
      console.log('satpos: ', pos,'tono actual: ',  this.getActual(),'shadow:', shadow);
      document.getElementById('picked').style.backgroundColor = 'rgb:('+shadow.r+','+shadow.g+','+shadow.b+')';
      document.getElementById('pickerConsole').innerHTML = '2981: rgb:('+shadow.r+','+shadow.g+','+shadow.b+')';
      //console.log('sat done', shadow, vec);
      //console.log(this.sat.toDataURL());
      //document.getElementById('picked').src = this.sat.toDataURL();



    }

    xyToRGB(t){
      var act ={};
      act.r = t.x;
      act.g = t.y;
      act.b = t.z;
      return act;
    }

    setVar(val, comp){

      this.var.val = {x: parseInt(val.x), y:parseInt(val.y)};
      this.var.ref = parseInt(comp);
      console.log('seted Var: ', this.var.val);
    }
    getVar(){
      console.log('getted Var: ', this.var.val);
      return this.var;
    }
    getShadow(w, h, x, y, reloadTone, t){


      var ranges = this.getRange();
      var actual = this.getActualRange();



      var porcentajeX = 100-((x*100)/w);
      var porcentajeY = 100-((y*100)/h);
      porcentajeX = parseInt(porcentajeX, 10);
      porcentajeY = parseInt(porcentajeY, 10);

      //



      if(reloadTone){
        this.setXY(x, y);
        console.log(w, h, x, y, porcentajeX, porcentajeY);
        this.setWH(w, h);

        //console.log(this.actual, x, y);
      }

      var t = this.getActual();
      var r  = [ranges[actual][1].r,ranges[actual][1].g,ranges[actual][1].b];


      var comp  = [t.r,
                    t.g,
                    t.b];

      var postocheck;
      switch(this.actualRange){
        case 0:
           postocheck  = 1;
           break;
        case 1:
           postocheck = 0;
           break;
        case 2:
           postocheck = 2;
           break;
        case 3:
           postocheck = 1;
           break;
        case 4:
          postocheck = 0;
          break;
        case 5:
          postocheck = 2;
          break;


            //yxzyxz
      }

      var finalComp = new Array();
      var newVar = {x:0, y:0};
      var co = 0;
      for(var i=0; i<comp.length;i++){
        var fin = comp[i];
        var dif;

        if(fin!=255){


            dif = 255-comp[i];
            dif = dif*(porcentajeX/100);
            dif = fin+dif;
            fin =dif;
            fin *= (porcentajeY/100);

        /*  if(fin==0&&i!=postocheck){
            dif = 255*(porcentajeX/100);
            dif = dif*(porcentajeY/100);
            fin =dif;
          }*/





        }else {
            fin = fin*(porcentajeY/100);
        }
        if(fin<0){
          fin = 0;
        }

        finalComp.push(parseInt(fin));

      }
      var finalVec = this.Vector(finalComp);
      if(reloadTone){
        console.log('shadow: ', finalVec);
      }
      return finalVec;




  /*
      for(var i=0;i<comp.length;i++){
        var tone = r[i];

        var tonI;

        var dif;


        if(comp[i]==0){

          dif = 255*(porcentajeX/100);
          dif = dif*(porcentajeY/100);
          tonI =dif;
          if(reloadTone&&i==postocheck){
            tonI = comp[i];
          }

        }else if(comp[i]==255){
          dif = tone*(porcentajeY/100);
          tonI  = dif;
        }else if(comp[i]!=0&&comp[i]!=255){

          if(porcentajeX>=1){

            dif = comp[i];
            var h = 255-dif;
            var c = h*(porcentajeX/100);
            var p = comp[i] + (h*(c/100));
            h = (255-p)*(porcentajeX/100);
            p+=h;
            p*=(porcentajeY/100);
            p*=(porcentajeX/100);
            tonI = p;
            if(reloadTone&&this.var.val!=0&&i==postocheck){
               tonI = comp[i];
              //console.log(tone, p);
            }
          }else{
              tonI = comp[i];
          }
        }

        if(reloadTone){
          //console.log('posicion actual: ', x, y, 'porcentajes: ', porcentajeX, porcentajeY);
          //console.log( tonI,'cony: ',  porcentajeY);
        }
        if(i==postocheck&&reloadTone){
          this.setVar(tonI, comp[i]);
        }

        finalColor.push(parseInt(tonI, 10));

      }*/


      /*document.getElementById('pickerConsole').innerHTML = JSON.stringify(finalVec);
      document.getElementById('picked').style.backgroundColor = 'rgb('+finalVec.r+','+finalVec.g+','+finalVec.b+')';
      //console.log('final:', finalVec,'comparacion: ', comp);*/


    }



    translateToShadow(x, y){
       var ton = this.ton;
       console.log(ton);
       return 1;
    }

    sumarVec(vec1, vec2) {
      var newVec = {
        x: parseInt(vec1.x+vec2.x, 10),
        y: parseInt(vec1.y+vec2.y, 10),
        z: parseInt(vec1.z+vec2.z, 10)
      }
      return newVec;
    }
    Vector(coor){
        var t = {x:coor[0], y: coor[1], z:coor[2]};

        return t;
    }


    tonMasSaturacion(tono, saturacion){

    }


  }
export default ColorPicker;
