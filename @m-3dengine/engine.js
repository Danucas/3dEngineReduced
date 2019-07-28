function engine(){
        this.cargarmodelo = cargarmodelo;
        this.setPlayerCamara = setPlayerCamara;
        this.mobileControl = mobileControl;
        this.setRequestedColor = setRequestedColor;
        this.aplicarColor = aplicarColor;
        this.initCamara = initCamara;
        this.acelerate = acelerate;
        this.stopMotion = stopMotion;
        this.generateWorld = generateWorld;
        console.log('engine started');
        var camara ;
        var camaras = [];
        var cam = false;
        var canvas;
        var context;
        var dx ;
        var dy;
        var scene = [] ;
        var actualObj
        var scalar =false;
        var mover = true;
        var rotar = false;
        var reqCOLOR = {r:255, g:0, b:0};
        var editMode = 'none';
        var selectedVer;
        var cliking;
        var width;
        var height;
        var log = document.getElementById('console');
        var modelo3d;
        var viewport;
        var cubo;
        var fi;
          var gl;
        //camaras y de""mas


        function initCamara(){
          camara = new Camara();
          camara.pos.z = 2;
          camara.rotation.z = 3.1416;
          camara.type = 'self';
         
          viewport = new Viewport();
          initialize3dCanvas();

        }

        function setPlayerCamara() {
           camaras[0] = [camara, viewport];
           camara = new Camara();
           camara.pos.z = 12;
           camara.pos.y = 2;
           camara.rotation.z = 3.1416;
           camara.type = 'third-p';
           viewport = new Viewport();
           renderScene(scene);

        }
        function dibujarWorldAxis(con){
          var axis_length = 100;
          var P = project([0,0,0], camara);
          con.rect(P.x+dx, P.y+dy, 1, 1);
          con.lineWidth = '1';
          con.moveTo(P.x+dx, P.y+dy);
          console.log(P);
          con.beginPath();
          for(var i=0;i<axis_length;i+=5){
            var x  = project([i,0,0], camara);
            console.log(x, y,z);

            con.strokeStyle = "blue";
            con.lineTo(x.x+dx, x.y+dy);
            con.arc(x.x+dx, x.y+dy, 1, 1, 2 * Math.PI);


          }
          con.stroke();
          con.closePath();
          con.moveTo(P.x+dx, P.y+dy);
          con.beginPath();
          for(var i=0;i<axis_length;i+=5){
            var y  = project([0,-i,0], camara);

            con.strokeStyle = "red";
            con.arc(y.x+dx, y.y+dy, 1, 1,2 * Math.PI);
            con.lineTo(y.x+dx, y.y+dy);
          }
          con.stroke();
          con.closePath();
          con.moveTo(P.x+dx, P.y+dy);
          con.beginPath();
          for(var i=0;i<axis_length;i+=5){
            var z  = project([0,0,i], camara);
            con.strokeStyle = "green";
            con.arc(z.x+dx, z.y+dy, 1, 1,2 * Math.PI);
            con.lineTo(z.x+dx, z.y+dy);
          }
          con.stroke();
          con.closePath();

          return true;
        }

        function cargarmodelo(file){
          load3dObj(file).then((mod)=>{
            //console.log(mod);
            var md = new Mesh(mod, file);
            cubo = mod;
            fi = file;
            scene.push(md);
            
            rend();
          });
        }
        function rend(){
          var txt = document.getElementById('meta_AR');
          log.innerHTML = 'mover';
          txt.innerHTML = scene[actualObj].name;
          renderScene(scene);
        }


        function setCamaraK(k){
           camara.rotation ={x:k[0][0] ,y:k[1][1] ,z:[2][2] };
           camara.pos = {x:k[0][2] ,y:[1][2] ,z:k[2][2] };
        }
        function generateWorld(){
            var  cantObjs = 20;
            for(var i=0; i<cantObjs; i++){
              var newCube = new Mesh(cubo, fi+i );
              var max = 50;
              var min = 12;
              var r = Math.floor(Math.random()*(255 - 0)) + + 18;
              var g  = Math.floor(Math.random()*(255 - 0)) + + 18;
              var b  = Math.floor(Math.random()*(255 - 0)) + + 18;
              //console.log(r, g, b);
               var rgb ={r:r, g:g, b:b};
               var scal =  Math.floor(Math.random()*(2 - 0.6)) + + 0.6;
               var x = Math.floor(Math.random()*(30 - - 20)) + + - 20;
              var y  = Math.floor(Math.random()*(30 - - 10)) + + - 10;
              var z  = Math.floor(Math.random()*(100 - 40)) + + 40;
              
              newCube.ObjTranslation = {x: x , y: y, z: b};
              newCube.scala = scal;
              newCube.setColor({r:105, g:100, b:30});
              scene.push(newCube);
            }
            scene.reverse();
            actualObj = scene.length-1;
            scene[actualObj].rgb = {r: 255, g:230 , b:190 };
            renderScene(scene);


        }

        function initialize3dCanvas(){
            camaras = [];


            document.getElementById('actColor').style.backgroundColor = 'rgb('+reqCOLOR.r+','+reqCOLOR.g+','+reqCOLOR.b+')';
            canvas = document.getElementById('canvas3d');
            canvas.width  =300;
            canvas.height = 300;
            dx = canvas.width / 2;
            dy = canvas.height / 2;

            width = canvas.width;
            height = canvas.height;
            context =  canvas.getContext('2d');

            context.strokeStyle = 'rgba(86, 35, 23, 1)';
            context.fillStyle = 'rgba(255, 211, 0, 1)';

            //iniciando variables




            cam = true;
            document.getElementById('camFocus').style.backgroundColor = '#8c8c88';
            var rotacion = new Vec([0,0,0]);
            context.clearRect(0, 0, canvas.width, canvas.height);

            camara.zoom =1.8;


            //cubo.setTranslation({x: 0, y:0, z:10});


            //var cubo2 = new Mesh(model, 'cubo2');
            sumTranslate({x:0, y:0, z:0});

            //cubo2.rgb = {r:0, g:255, b:0};



            //cubo2.scala = 15;



            actualObj = 0;

            cargarmodelo('cubo');




            function drawPoligons(faces){

              var P = project(faces[0][0], camara);
              context.moveTo(P.x+dx, P.y+dy);
              for(var i=0;i<faces.length;i++){
                  context.beginPath();
                  for(var j=0;j<faces[i].length;j++){

                      var P = project(faces[i][j], camara);
                      if(P.x<300&&P.y<300){
                           context.lineTo(P.x+dx, P.y+dy);
                      }


                  }
                  context.stroke();
                  context.closePath()
                  context.fill();

              }

            }
            var changedTouch = {
              actual:{x:0, y:0},
              last:{x:0, y:0}
            }
            var typeEvent = '';
            if(fromMob){
              typeEvent = 'touchstart';
            }else{
              typeEvent = 'click';
            }
            canvas.addEventListener(typeEvent, function(e){
                    console.log('click', e);
                    if(!rendering){

                      var clientx;
                      var clienty;
                      var clientWidth;
                      var clientHeight;
                      if(fromMob){
                        clientx = e.changedTouches[0].clientX;
                        clienty =e.changedTouches[0].clientY;
                        clientWidth = e.changedTouches[0].target.clientWidth;
                        clientHeight =e.changedTouches[0].target.clientHeight ;
                      }else{
                        clientx = e.clientX;
                        clienty =e.clientY;
                        clientWidth = e.target.clientWidth;
                        clientHeight =e.target.clientHeight ;
                      }
                      changedTouch.last.x = clientx;
                      changedTouch.last.y =  clienty;
                      var x = parseInt((changedTouch.last.x*width)/clientWidth, 10);
                      var y = parseInt((changedTouch.last.y*height)/clientHeight, 10);

                      console.log('revisando la cosa peluda',x, y);
                      if(editMode=='vertices'){

                        var vertices =  scene[actualObj].getVertices();
                        //console.log(vertices);
                        for(var i=0;i<vertices.length;i++){
                            var ver = vertices[i];
                            //console.log('vertice', ver, i);
                            var P = project(ver, camara);
                            //console.log('vertice'+i, P);
                            if((P.x+dx)>0&&(P.y+dy)>0){
                              //console.log(P);
                              var diferenciaX  = x-(P.x+dx);
                              var diferenciaY  = y-(P.y+dy);
                              if(diferenciaX<0){
                                diferenciaX *= -1;
                              }
                              if(diferenciaY<0){
                                diferenciaY *= -1;
                              }
                            //  console.log(x, y,  P, diferenciaX, diferenciaY);


                              if(diferenciaX<20&&diferenciaY<20){
                                //console.log(P.x+dx, P.y+dy, i);
                                selectedVer = i;
                                console.log("selected vert: ", i, Math.round(P.x+dx), Math.round(P.y+dy));


                                break;
                              }
                            }


                        }
                        if(selectedVer!=null){
                          renderScene(scene);
                        }

                      }
                    }


            }, true);
            /*canvas.addEventListener('touchend', function(e){


                    changedTouch.actual.x = e.changedTouches[0].clientX;
                    changedTouch.actual.y = e.changedTouches[0].clientY;


                    var diffX = changedTouch.actual.x-changedTouch.last.x;
                    var diffY = changedTouch.actual.x-changedTouch.last.y;
                    var iX;
                    var iY;
                    if(diffX<0){
                      iX = diffX*(-1);
                    }else{ iX = diffX;}
                    if(diffY<0){
                      iY = diffY*(-1);
                    }else{ iY = diffY;}


                    var average = (diffX+diffY)/2;


                    if(iY>(iX+20)&&diffY<0){
                      if(changedTouch.actual.y>0){
                        sumTranslate({x:0, y:(iY/dy), z:0});

                      }

                    }else if(iY>(iX+20)&&diffY>0){

                        sumTranslate({x:0, y:-(iY/dy), z:0});
                    }else if(iX>(iY+20)&&diffX<0){
                       sumTranslate({x:+(iX/dx), y:0, z:0});
                    }else if(iX>(iY+20)&&diffX>0){
                      sumTranslate({x:-(iX/dx), y:0, z:0});
                    }
                    /*
                    if(changedTouch.actual.x<0&&changedTouch.actual.y<0){

                      sumTranslate({x:(average), y:(average), z:0});
                      console.log('T');
                    }else if(changedTouch.actual.x<0&&changedTouch.actual.y>0){
                      sumTranslate({x:(diffX), y:-(diffY), z:0});
                      console.log('M');

                    }else if(changedTouch.actual.x>0&&changedTouch.actual.y>0){

                        sumTranslate({x:-(average), y:-(average), z:0});
                      console.log('H');
                    }else if(changedTouch.actual.x>0&&changedTouch.actual.y<0){
                        sumTranslate({x:-(diffX), y:(diffY), z:0});
                      console.log('W');
                    }
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    */
                    //renderScene(scene);}, true);
            canvas.addEventListener( 'wheel', function(e) {
              //console.log('wheling')
               if(!rendering){

                context.clearRect(0, 0, canvas.width, canvas.height);
                rendering = true;
                var doZoom = false;
                if(e.deltaY<0){
                        if(scalar){
                          console.log('scalando: ', scene[actualObj].name);
                          scene[actualObj].scala += 0.01;
                        }else{
                          camara.zoom += 0.4;
                        }

                        doZoom = true;







                }else if(e.deltaY>0){

                      if(scalar){
                        console.log('scalando: ', scene[actualObj].name);
                          if(scene[actualObj].scala>0.01){
                            scene[actualObj].scala -= 0.01;
                          }
                          console.log('top_minimun_scala');
                        }else{
                        camara.zoom -= 0.4;

                      }
                        doZoom = true;


                }

                if(doZoom){

                  renderScene(scene);
                }

               }

            });
            document.addEventListener('keydown', function(e){
              console.log(e.keyCode);

                if(!rendering){
                    var canMove = false;

                var rot = false;


                rendering = true;
                commandKey(e.keyCode, e.shiftKey);
              }

            });

            //render(model, context, dx, dy*/

        }


        function round(value, decimals) {
            return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }


        class Mesh{
           constructor(model, nombre){
              this.model = model;
              this.name = nombre;
              this.ObjRotation = {x:0,y:0, z:0};
              this.ObjTranslation = {x:0,y:0, z:6};
              this.up = {x:0, y:0,z:0};
              this.scala = 1;
              this.origin = this.setCenterOrigin(model.vertices)[0];
              this.poligons = this.convertToMesh(model);
              this.axis = this.setCenterOrigin(model.vertices)[1];
              this.rgb = {r:156,g:226, b:250
              };
              
              this.rotaxis = this.setCenterOrigin(model.vertices)[2];
              //console.log(this.rotaxis);
           }
           alignToParent(){
             var m =  this.translate(this.rotate(this.scalar(this.origin)));
             var newVec = sumarVec(Parent.pos, new Vector(m));
             console.log(Parent.pos ,newVec, m);
             this.setTranslation(Parent.pos);
           }

           getTargetOrigin(){
            return this.translate([this.origin.x, this.origin.y, this.origin.z]);
           }
           getRaxis(pos){
             
             var raxs=new Array();
             for(var k=0;k<this.rotaxis[pos].length;k++){
        
             var a = this.translate(this.rotate(this.scalar(this.rotaxis[pos][k])));
             raxs.push([round(a[0], 2), round(a[1],2),round(a[2],2)]);
             }
             
             return raxs;
             }

           setCenterOrigin(vertices) {
            // console.log(vertices);
             var xs = new Array();
             var ys = new Array();
             var zs = new Array();
             for(var i = 0; i<vertices.length;i++){
               xs.push(vertices[i][0]);
               ys.push(vertices[i][1]);
               zs.push(vertices[i][2]);
             }
             var xMax = Math.max.apply(null, xs);
             var xMin = Math.min.apply(null, xs);
             var yMax = Math.max.apply(null, ys);
             var yMin = Math.min.apply(null, ys);
             var zMax = Math.max.apply(null, zs);
             var zMin = Math.min.apply(null, zs);

             var xMid  = ((xMax-xMin)/1.98)+xMin;
             var yMid  = ((yMax-yMin)/1.98)+yMin;
             var zMid  = ((zMax-zMin)/1.98)+zMin;

             var center = [xMid, yMid, zMid];





             if(xMid==0){
               xMid = 0.003;
             }
             if(yMid==0){
               yMid = 0.003;
             }
             if(zMid==0){
               zMid = 0.003;
             }

             var xAxis = [xMin/1.6, yMid, zMid];
             var yAxis = [xMid, yMax/1.6, zMid];
             var zAxis = [xMid, yMid, zMax/1.6];
             //eje rotacion sobre x
             var rxaxisx1 = round(xMid,2);
             var rxaxisy1 = round(yMid,2);
             var rxaxisz1 = round(zMin,2);
             
             var rxaxisx2 = round(xMid,2);
             var rxaxisy2 = round(yMax,2);
             var rxaxisz2 = round(zMin,2);


             return [{x:xMid , y:yMid , z:zMid}, [xAxis, yAxis, zAxis],[[[rxaxisx1,rxaxisy1,rxaxisz1],[rxaxisx2,rxaxisy2,rxaxisz2],
             [xMid,yMax,zMid],
             [xMid, yMax, zMax],
             [xMid,yMid, zMax],[xMid,yMin,zMax],[xMid, yMin, zMid],[xMid,yMin,zMin]]] ] ;
           }



           getOrigin(){
             var red  = this.translate(this.rotate(this.scalar([this.origin.x, this.origin.y, this.origin.z])));
             //console.log(red);
             return red;
           }
           getAxis(){
             var axs = []
             for (var i=0; i<this.axis.length;i++){
                var  tranformedAxis = this.translate(this.rotate(this.scalar(this.axis[i])));
                axs.push(tranformedAxis);
             }
             return axs;
           }

           setColor(rgb){
             this.rgb = rgb;
           }
           getColor(){
             return this.rgb;
           }
           setRotation(rot){
             this.ObjRotation = sumarVec(this.ObjRotation, rot);
             for(var key in this.ObjRotation){
                  if(this.ObjRotation[key]>6.28){
                    this.ObjRotation[key] =0;
                  }
             }
           }
           setTranslation(tra){
             this.ObjTranslation = sumarVec(this.ObjTranslation, tra);

           }
           rotate(vertice){
                var or = [this.origin.x, this.origin.y, this.origin.z];

                var tempx = vertice[0]-or[0];
                var tempy = vertice[1]-or[1];
                var tempz = vertice[2]-or[2];


                var overX = this.ObjRotation.x;
                var overY = this.ObjRotation.y;
                var overZ = this.ObjRotation.z;
                //rotar en x
                var i = (1)*(tempx)+(0)*(tempy)+(0)*(tempz);
                var j = (0)*(tempx)+(Math.cos(overX))*(tempy)+(-(Math.sin(overX)))*(tempz);
                var k = (0)*(tempx)+(Math.sin(overX))*(tempy)+(Math.cos(overX))*(tempz);
                tempx = i;
                tempy = j;
                tempz = k;
                //rotar en Y

                var i = (Math.cos(overY))*(tempx)+(0)*(tempy)+(Math.sin(overY))*(tempz);
                var j = (0)*(tempx)+(1)*(tempy)+(0)*(tempz);
                var k = (-(Math.sin(overY)))*(tempx)+(0)*(tempy)+(Math.cos(overY))*(tempz);

                tempx = i;
                tempy = j;
                tempz = k;

                //rotar en z;

                var i = (Math.cos(overZ))*(tempx)+(-(Math.sin(overZ)))*(tempy)+(0)*(tempz);
                var j = (Math.sin(overZ))*(tempx)+(Math.cos(overZ))*(tempy)+(0)*(tempz);
                var k = (0)*(tempx)+(0)*(tempy)+(1)*(tempz);

                tempx = i;
                tempy = j;
                tempz = k;

                var temp = [tempx, tempy, tempz];

                return temp;
           }
           translate(vertice){
              var vec1 = new Vector(vertice);
              var newVec = sumarVec(vec1, this.ObjTranslation);
              return [newVec.x, newVec.y, newVec.z];

           }
           scalar(vertice){
              var newVert = multiplicarVec(new Vector(vertice), new Vector([this.scala, this.scala, this.scala]));

              return [newVert.x, newVert.y, newVert.z];
           }

           mergeMesh(){
             var newPoligons = new Array();
             this.poligons.forEach(poligono=>{
               var newPoli = new Array();
               poligono.forEach(vertice=>{
                  var ver = this.translate(this.rotate(this.scalar(vertice)));
                  //this.scalar(this.translate(this.rotate(vertice)));
                  newPoli.push(ver);
               });

               newPoligons.push(newPoli);
             });

             var up  = this.calcularVector(new Vector(newPoligons[0][0]), new Vector(newPoligons[0][1]));
             //console.log('name: ', this.name, 'rotation: ', this.ObjRotation, 'translation: ', this.ObjTranslation);
             return this.culling(newPoligons);
           }
           calcularVector(vec1, vec2){
             var op = (Math.pow((vec1.x-vec2.x), 2))+(Math.pow((vec1.y-vec2.y), 2))+(Math.pow((vec1.z-vec2.z), 2));

             op  = Math.sqrt(op);
             return parseFloat(op);
           }
           transform(vert){
             var newVert = this.translate(this.rotate(this.scalar(vert)));
             //console.log('transformed vert',[round(newVert[0], 2),round(newVert[1], 2),round(newVert[2], 2)]);
             return [round(newVert[0], 2),round(newVert[1], 2),round(newVert[2], 2)] ;
           }
           translateVert(pos, tr){

             var vec1 = new Vector(this.model.vertices[pos]);
             var res = sumarVec(vec1, tr);
             console.log(res);
             this.model.vertices[pos] = [res.x, res.y, res.z];
             this.poligons = this.convertToMesh(this.model);

           }


           getVertices(){
             var newVertex = new Array();
             this.model.vertices.forEach(vert=>{
               newVertex.push(this.translate(this.rotate(this.scalar(vert))));
             });

            return newVertex;



           }
           convertToMesh(modelo){
               var faces = new Array();

               for(var i=0, faces_length= modelo.faces.length; i<faces_length; i++){
                   var verts = new Array();


                   for(var j=0; j<modelo.faces[i].length;j++){
                       var vert = modelo.faces[i][j].split('/');
                       var v = modelo.vertices[vert[0]-1];
                       if(v!=undefined){
                         verts.push(v);
                       }


                   }

                   if(verts.length>3){
                     //console.log("dealing wiht quaternio", verts.length);

                       var tri1 = [verts[0],verts[1],verts[2]];
                       var tri2 = [verts[3],verts[2],verts[0]];
                       //console.log(tri1, tri2);
                       faces.push(tri1);
                       faces.push(tri2);


                   }else{
                     faces.push(verts);
                   }




               }




               return this.culling(faces);
           }
           culling(faces){
             var compV = new Array();
             //console.log(camara);
             for(var i=0;i<faces.length;i++){
              // console.log(this.transform( [faces[i][0][0],faces[i][0][1], faces[i][0][2]]));
               var c = round(dotProduct(camara.pos, new Vector(this.transform( [faces[i][0][0],faces[i][0][1], faces[i][0][2]]))), 2);
               compV.push({distance:c,polygon:faces[i]});
             }
            // console.log('compv: ',compV);
             compV.sort(function(a, b) {
               return a.distance- b.distance;
             });
             var culledFaces  = new Array();
             for(var i=0;i<compV.length;i++){
               culledFaces.push(compV[i].polygon);
             }
            // console.log('sorted vertex: ', compV);

             return culledFaces;
           }


        };



        class Camara{
            constructor(){
                this.pos = new Vec([0, 0 , -80]);
                this.zoom = 2;
                this.mode = 'perspective';
                this.up = {x:0, y:-10,z:0};
                //this.target = {x:0, y:0,z:100};
                this.rotation = {x:0, y:0,z:0};
                this.K = [[this.rotation.x,0,0, this.pos.x],[0,this.rotation.x,0],[0,0,0],[0,0,0]];
            }

            setRotation(rot){
                this.rotation = sumarVec(this.rotation, rot);
                for(var key in this.otation){
                     if(this.rotation[key]>6.28){
                       this.rotation[key] =0;
                     }
                }
            }

            rotate(vertice){

                var or = scene[actualObj].getTargetOrigin();
                //console.log(or)

                if(this.type=='third-p'){
                  var tempx = vertice[0]-or[0];
                  var tempy = vertice[1]-or[1];
                  var tempz = vertice[2]-or[2];
                  
                }else{
                  var tempx = vertice[0]-this.pos.x;
                  var tempy = vertice[1]-this.pos.y;
                  var tempz = vertice[2]-this.pos.z;
                }

                

                 
                 var overX = this.rotation.x;
                 var overY = this.rotation.y;
                 var overZ = this.rotation.z;
                 //rotar en x
                 var i = (1)*(tempx)+(0)*(tempy)+(0)*(tempz);
                 var j = (0)*(tempx)+(Math.cos(overX))*(tempy)+(-(Math.sin(overX)))*(tempz);
                 var k = (0)*(tempx)+(Math.sin(overX))*(tempy)+(Math.cos(overX))*(tempz);
                 tempx = i;
                 tempy = j;
                 tempz = k;
                 //rotar en Y

                 var i = (Math.cos(overY))*(tempx)+(0)*(tempy)+(Math.sin(overY))*(tempz);
                 var j = (0)*(tempx)+(1)*(tempy)+(0)*(tempz);
                 var k = (-(Math.sin(overY)))*(tempx)+(0)*(tempy)+(Math.cos(overY))*(tempz);

                 tempx = i;
                 tempy = j;
                 tempz = k;

                 //rotar en z;

                 var i = (Math.cos(overZ))*(tempx)+(-(Math.sin(overZ)))*(tempy)+(0)*(tempz);
                 var j = (Math.sin(overZ))*(tempx)+(Math.cos(overZ))*(tempy)+(0)*(tempz);
                 var k = (0)*(tempx)+(0)*(tempy)+(1)*(tempz);

                 tempx = i;
                 tempy = j;
                 tempz = k;

                 var temp = [tempx, tempy, tempz];

                 return temp;
            }

            transform(punto){

            }
        }
        class Viewport {

            constructor(){
              this.pos= {x:0, y:150, z:camara.pos.z+100};
              this.up={x:0, y:150, z:0};
              this.width= 300;
              this.height=300;
              this.rotation= {x:0, y:0, z:0};
            }
            setRotation(rot){

              this.rotation = sumarVec(this.rotation, rot);
              for(var key in this.otation){
                   if(this.rotation[key]>6.28){
                     this.rotation[key] =0;
                   }
              }

            }

        }



        
        var Parent = {
            pos:{x: 0, y:0, z:20}
        }

        reClick();
        var rendering = false;


        var Vector = function(coor){
            this.x = coor[0];
            this.y = coor[1];
            this.z = coor[2];
        }
        function sumarVec(vec1, vec2) {
          var newVec = {
            x: round(vec1.x+vec2.x, 4),
            y: round(vec1.y+vec2.y, 4),
            z: round(vec1.z+vec2.z, 4)
          }
          return newVec;
        }
        function restarVec(vec1, vec2) {
          var newVec = {
            x: parseFloat(vec1.x-vec2.x),
            y: parseFloat(vec1.y-vec2.y),
            z: parseFloat(vec1.z-vec2.z)
          }
          return newVec;

        }
        function dividirVec(vec1, vec2) {
          var newVec = {
            x: parseFloat(vec1.x/vec2.x),
            y: parseFloat(vec1.y/vec2.y),
            z: parseFloat(vec1.z/vec2.z)
          }
          return newVec;
        }
        function multiplicarVec(vec1, vec2) {
          var newVec = {
            x: parseFloat(vec1.x*vec2.x),
            y: parseFloat(vec1.y*vec2.y),
            z: parseFloat(vec1.z*vec2.z)
          }
          return newVec;
        }
        function dotProduct(vec1, vec2) {
          var newVec = parseFloat(vec1.x*vec2.x)+parseFloat(vec1.y*vec2.y)+parseFloat(vec1.z*vec2.z);

          return newVec;
        }


        function sumTranslate(M){
          camara.pos = sumarVec(camara.pos, M);
          viewport.pos = sumarVec(viewport.pos, M);

        }
        function sumRotate(M) {
          camara.setRotation(M);
          viewport.setRotation(M);
        }
        function translate(punto){




            var tempx = punto[0]+camara.pos.x;
            var tempy = punto[1]+camara.pos.y;
            var tempz = punto[2]+camara.pos.z;

            return [tempx, tempy, tempz];
        }


        function load3dObj(name){
          return new Promise((resolve, reject)=>{
            console.log('loading', name);
            var fileName = './@m-3dengine/3dAssets/pan/'+name+'.txt';
            var rawFile = new XMLHttpRequest();
            rawFile.open("GET", fileName, true);
            rawFile.onload = function (){

                if(rawFile.readyState === 4)
                {
                    if(rawFile.status === 200 || rawFile.status == 0)
                    {

                        var allText = rawFile.responseText;
                        var list = allText.split('f')[0].split('v');

                        var list2 = new Array();
                        var list3 = new Array();
                        var pos;
                        list3.push([""]);
                        for(var i=0; i<list.length;i++){

                            if(list[i].split(' ')[0]=='t'){
                                if(!pos){
                                    pos = i;
                                }
                                var L = list[i].replace('t ', '').split(' ');

                                var newL = new Array();
                                for(var j=1;j<4;j++){
                                    newL.push(L[j]);
                                }
                                list2.push(newL);
                            }else if(list[i].split(' ')[0]=='n'){
                                var L = list[i].replace('n ', '').split(' ');
                                var newL = new Array();
                                for(var j=0;j<4;j++){
                                    newL.push(L[j]);
                                }
                                list3.push(newL);

                            }
                        }


                        var fragmentList= allText.split('f')

                        var newFragmentList = new Array();
                        for(var i=1;i<fragmentList.length;i++){
                            var l = fragmentList[i].split(' ');
                            var fList = new Array();
                            for(var j=1;j<l.length;j++){
                                fList.push(l[j]);
                            }
                            newFragmentList.push(fList);
                        }
                        if(!pos){
                            pos = list.length;
                        }
                        var newList = new Array();

                        for(var i=1;i<pos;i++){
                            var I = list[i].split(' ');
                            var newI = new Array();
                            for(var j=0;j<I.length;j++){
                              if(I[j]!=''&&I[j]!=undefined){
                                  newI.push(parseFloat(I[j]));
                              }



                            }

                            newList.push(newI);
                        }

                        modelo3d = [newList, newFragmentList];

                        resolve({
                            vertices: modelo3d[0],
                            faces: modelo3d[1]
                        });

                    }
                }
            }
            rawFile.send();
          });


        }





        function renderScene(scena){
          //console.log('renderizando escena');
          rendering = true;

            context.strokeStyle = 'rgba(86, 35, 23, 1)';
            context.lineWidth = '1';
            context.clearRect(0, 0, canvas.width, canvas.height);
            //var axis = dibujarWorldAxis(context);
            console.log('Camara pos: ', camara.pos);
            console.log('ObjTranslation: ', scene[actualObj].ObjTranslation);
            //console.log('Viewport pos: ', viewport.pos);
            var object_strokeLine = 'rgba(0,0,0, 1)';
            scena.forEach(object=>{
                var rgb = object.getColor();
                context.strokeStyle = object_strokeLine;
                context.fillStyle = 'rgba('+ rgb.r+','+ rgb.g+','+ rgb.b+', 1)';
              renderMesh(object.mergeMesh(), context, dx, dy, [rgb.r, rgb.g, rgb.b], object.getOrigin(), object.getAxis(),object.name, object.getRaxis(0));
                //console.log(object.ObjTranslation);
                //console.log(object);
                //console.log(object, object.mergeMesh());
            });


            //console.log(, viewport.rotation);

            if(editMode=='vertices'){
              drawVertices();
            }else{
              //console.log('escena renderizada');
              reClick();
              rendering = false;
            }

        }
        function reClick(){
          cliking = false;
        }

        function renderMesh(faces, context, dx, dy, rgb, origin, axis, name,raxis){

            var r = rgb[0];
            var g=  rgb[1];;
            var b= rgb[2];
            var len = faces.length;

            //len =4;
            var P = project(faces[0][0], camara);
            context.moveTo(P.x+dx, P.y+dy);
            context.lineWidth = '1.4';
            //Para pintar las caras
            //determinar las normales
            for(var i=0;i<len;i++){

                if(i==0){
                  context.fillStyle = 'rgba('+ (r-50)+','+ (g+100)+','+ b+', 1)';
                }else{
                  context.fillStyle = 'rgba('+ r+','+ g+','+ b+', 1)';
                }
                //context.fillStyle = 'rgba('+ r+','+ g+','+ b+', 0.3)';
                context.beginPath();
                for(var j=0;j<faces[i].length;j++){

                    var P = project(faces[i][j], camara);




                    if(P!=undefined){
                      context.lineTo(P.x+dx, P.y+dy);
                    }
                }

                context.stroke();

                context.fill();
                context.closePath();
            }
            context.beginPath();
            var Or = project(origin, camara);

            context.strokeStyle = "#F0FF5C";
            context.rect(Or.x+dx, Or.y +dy,2, 2 );
            context.stroke();
            context.closePath();

            var colors = ['blue','red',  'green'];
            var ax = ['x', 'y', 'z'];
            context.lineWidth = '1';
            
            //console.log(raxis);
            //dibujar axis
            if(name==scene[actualObj].name){
              
              //dibujar axis de rotacion
              
              var rxs=new Array();
              for(var k=0;k< raxis.length;k++){
              var rP = project(raxis[k], camara);
              rxs.push(rP);
              //console.log(rP.x)
              
              context.strokeStyle = "rgba(233, 35, 102,1)"
              context.rect(Math.round(rP.x+dx), Math.round(rP.y+dy),2,2);
              context.stroke();
              
              }
              context.closePath();
              console.log(rxs[0].x+dx);
              var ra =Math.round(Math.sqrt(Math.pow((rxs[0].x-Or.x),2)+Math.pow(rxs[0].y-Or.y,2)));
              if(ra<0){
                ra *= -1;
              }
              console.log(ra);
              context.moveTo(rxs[0].x+dx,rxs[0].y+dy);
              context.ellipse(Math.round(Or.x+dx),Math.round(Or.y+dy),30,50, (180*3.1416)/180 ,0,1.57);
              context.stroke();
              
              
              //dibujar ;axis
              for(var i= 0;i<3;i++){
                
                context.beginPath();
                context.moveTo(Or.x+dx, Or.y +dy);
                context.strokeStyle = colors[i];
                context.fillStyle = colors[i];
                var s = project(axis[i], camara);
                context.lineTo(Math.round(s.x+dx), Math.round(s.y+dy));
              
                //console.log('dibujando', axis[i], s.x+dx, s.y+dy);
                context.rect(Math.round(s.x+dx), Math.round(s.y+dy), 1.4, 1.4);
                context.font = "8px Arial";
                context.fillText(ax[i], Math.round(s.x+dx), Math.round(s.y+dy));
                context.stroke();
                context.fill();
                context.closePath();
              }
              
              
              
            }
            
        }

        function drawVertices(){
          console.log('dibujando vertices');

          context.strokeStyle = 'rgba(247, 182, 17, 1)';
          var vertices =  scene[actualObj].getVertices();
          //console.log(vertices);
          //dibujando los puntos de cada vertice

          for(var i=0;i<vertices.length;i++){
            var ver = vertices[i];
              var P = project(ver, camara);
              //console.log(P);
              context.beginPath();
              context.lineWidth = '4';
              context.rect(P.x+dx, P.y+dy, 1, 1);
              context.font="24px Arial";
              //context.fillText(i,P.x+dx, P.y+dy);
              context.stroke();
              context.closePath();
          }

          if(selectedVer||selectedVer==0){

            var P = project(vertices[selectedVer], camara);
            var v = vertices[selectedVer];
            console.log(perspectiva(v, camara));
            console.log(camara);
            context.strokeStyle = 'rgba(6, 122, 15, 1)';
            context.beginPath();
            context.lineWidth = '4';
            context.rect(P.x+dx, P.y+dy, 1, 1);
            context.stroke();
            context.closePath();
          }

          rendering = false;
          console.log('escena renderizada');
        }

        function nextObj(){
            actualObj +=1;
            if(actualObj>scene.length-1){
              actualObj = 0;
            }
            console.log('selected Obj:=>', scene[actualObj].name);
            log.innerHTML= 'selected Obj:=>'+ scene[actualObj].name;
            document.getElementById('actColor').style.backgroundColor = 'rgb('+scene[actualObj].rgb.r+','+scene[actualObj].rgb.g+','+scene[actualObj].rgb.b+')';
        }

        function commandKey(code, shift){
          console.log(code);
          switch(code){
              case 27:
                 initCamara();
                 break;
              case 37:
              console.log(rotar);
               //left
               if(editMode!='none'){
                  if(selectedVer!=null){
                      scene[actualObj].translateVert(selectedVer, {x:0.19625 ,y:0 ,z:0});
                  }

               }else{
                 if(rotar){
                   console.log('rotando camara');
                      sumRotate({x:0, y:-0.19625, z:0});
                 }else{
                     sumTranslate({x:-1, y: 0, z:0});
                 }


               }
               renderScene(scene);
               break;

              case 39:
                 //right
                 if(editMode!='none'){
                    if(selectedVer!=null){
                        scene[actualObj].translateVert(selectedVer, {x:0.19625 ,y:0 ,z:0});
                    }

                 }else{
                   if(rotar){
                     sumRotate({x:0, y:0.19625, z:0});
                   }else{
                     sumTranslate({x: 1, y: 0, z:0});
                   }
                 }


                  renderScene(scene);
                  break;
              case 38:
                  if(editMode!='none'){
                      if(selectedVer!=null){
                          scene[actualObj].translateVert(selectedVer, {x:0 ,y:0 ,z:0.19625});
                          }

                  }else{
                    if(rotar){
                       sumRotate({x:0.19625, y:0, z:0});



                    }else{
                        sumTranslate({x: 0, y: -1, z:0});
                        console.log(camara.pos);
                        //dezplazar CAMARA hacia arriba

                    }
                  }

                    renderScene(scene);
                   break;
              case 40:

                  if(editMode!='none'){
                      if(selectedVer!=null){
                          scene[actualObj].translateVert(selectedVer, {x:0 ,y:-0.19625 ,z:0});
                          }

                  }else{
                    if(rotar){
                        sumRotate({x:-0.19625, y:0, z:0});


                    }else{
                        //dezplazar CAMARA hacia abajo
                        sumTranslate({x: 0, y: 1, z:0});

                    }
                  }

                    renderScene(scene);
                   break;
              case 74:

                  if(rotar){
                    ///rotar objeto sobre el eje y
                    scene[actualObj].setRotation({x:0, y:-0.19625, z:0});
                  }else{
                    //dezplazar objeto hacia la izquierda
                      scene[actualObj].setTranslation({x:-0.4, y:0, z:0});
                  }

                  renderScene(scene);


                  break;
              case 76:
                  if(rotar){
                    ///rotar objeto sobre el eje y
                    scene[actualObj].setRotation({x:0, y:0.19625, z:0});
                  }else{
                    //dezplazar objeto hacia la derecha
                    scene[actualObj].setTranslation({x:0.4, y:0, z:0});
                  }

                  renderScene(scene);
                  break;
              case 73:
                  if(rotar){
                    ///rotar objeto sobre el eje x
                    scene[actualObj].setRotation({x:-0.19625, y:0, z:0});
                  }else{
                    //dezplazar objeto hacia ARRIBA
                    scene[actualObj].setTranslation({x:0, y:-0.4, z:0});
                  }

                  renderScene(scene);
                  break;
              case 75:
                  if(rotar){
                    ///rotar objeto sobre el eje x
                    scene[actualObj].setRotation({x:0.19625, y:0, z:0});
                  }else{
                    //dezplazar objeto hacia abajo
                    scene[actualObj].setTranslation({x:0, y:0.4, z:0});
                  }

                  renderScene(scene);
                  break;
              case 80:
                  if(scalar&&!cam){
                    scene[actualObj].scala += 0.01;
                  }else{
                    //dezplazar objeto hacia adelante
                    if(editMode!='none'){
                       if(selectedVer!=null){
                           scene[actualObj].translateVert(selectedVer, {x:0 ,y:0 ,z:0.19625});
                       }

                    }else{
                        scene[actualObj].setTranslation({x:0, y:0, z:0.4});
                    }

                  }

                  renderScene(scene);
                  break;
              case 77:
                  if(scalar&&!cam){
                      scene[actualObj].scala -= 0.01;
                  }else{
                    //dezplazar objeto hacia atras
                    if(editMode!='none'){
                       if(selectedVer!=null){
                           scene[actualObj].translateVert(selectedVer, {x:0 ,y:-0.19625 ,z:0});
                       }

                    }else{
                          scene[actualObj].setTranslation({x:0, y:0, z:-0.4});
                    }

                  }

                  renderScene(scene);
                  break;
              case 81:
                  //alinear objeto al padre
                  scene[actualObj].alignToParent();
                  renderScene(scene);
                  break;
              case 220:
                  //seleccionar siguiente objeto
                  nextObj();
                  break;
              case 188:

                  renderScene(scene);
                  break;

              case 83:
                  mover = false;
                  rotar = false;
                  if(!scalar){
                    scalar = true;
                  }else{
                    scalar = false;
                  }
                  rendering = false;
                  console.log('scalar: ', scalar);
                  log.innerHTML = 'scalar..';
                  break;
              case 33:
                  sumTranslate({x:0, y:0, z:-1});
                  scene[actualObj].setTranslation({x:0, y:0, z:-1});
                  renderScene(scene);
                  break;
              case 34:
                  sumTranslate({x:0, y:0, z:1});
                  scene[actualObj].setTranslation({x:0, y:0, z:1});
                  renderScene(scene);
                  break;
              case 82:
                  rotar = true;
                  mover = false;
                  scalar = false;
                  log.innerHTML = 'rotar..';
                  rendering = false;
                  break;
              case 84:
                  rotar = false;
                  mover = true;
                  scalar = false;
                  log.innerHTML = 'mover..';
                  rendering = false;
                  break;
              case 1000:
                  cam = false;
                  document.getElementById('camFocus').style.backgroundColor = '#424240';
                  document.getElementById('objFocus').style.backgroundColor = '#8c8c88';
                  nextObj();
                  break;
              case 86:
                  editMode = 'vertices';
                  cam = false;
                  document.getElementById('camFocus').style.backgroundColor = '#424240';
                  document.getElementById('objFocus').style.backgroundColor = '#8c8c88';
                  renderScene(scene);
                  break;
          }
        }

        function mobileControl(code){
          console.log(code);
          if(code==77||code==80){
            if(cam){
              if(code == 77){

                camara.zoom -= 0.4;
              }else{
                camara.zoom += 0.4;
              }
              renderScene(scene);
            }else{
              commandKey(code, false);
            }

          }else if(code==0||code==1){
            if(code ==0){
              cam = true;
              editMode = 'none';
              document.getElementById('camFocus').style.backgroundColor = '#8c8c88';
              document.getElementById('objFocus').style.backgroundColor = '#424240';

            }else{
              cam = false;
              document.getElementById('camFocus').style.backgroundColor = '#424240';
              document.getElementById('objFocus').style.backgroundColor = '#8c8c88';
            }

          }else if(code>36&&code<41){
            if(!cam&&editMode=='none'){
              var newCode ;
              if(code==37){
                newCode = 74;
              }else if(code ==38){
                newCode = 73;
              }else if(code ==39){
                newCode = 76;
              }else if(code == 40){
                newCode =75;
              }
              commandKey(newCode, false);
            }else{
              commandKey(code, false);
            }

          }else{
              commandKey(code, false);
          }


        }

        function offset(punto, position){

        }

        var Vec = function(arr){
          return {x:arr[0], y: arr[1], z: arr[2]};
        }

        function zoom(punto, factor){

            const scale = Math.pow(factor, 2);
            var tempx = parseFloat(punto[0]*scale);
            var tempy = parseFloat(punto[1]*scale);
            var tempz = punto[2];//parseFloat(punto[2]*scale);
            var temp = [tempx, tempy, tempz];
            return temp;

        }





        function toPoligon(punto){

        }

        function render(object, context, dx, dy){
            var vertices = object.vertices;

            for(var i=0, n_faces = object.faces.length; i<n_faces;++i){

                var face = object.faces[i];
                var P  = project(vertices[face[0][0]]);



                for(var j=0, n_vertices = face.length; j<n_vertices;++j){
                    context.beginPath();
                    context.moveTo(P.x +dx, P.y+dy);
                    for(var vertex=0, len = face[j].length; vertex<len; ++vertex){
                        if(face[j][vertex]<vertices.length){

                            if(vertices[face[j][vertex]]!=undefined){
                                var P = project(vertices[face[j][vertex]]);
                                context.lineTo(P.x+dx, P.y+dy);
                            }

                        }
                        context.stroke();

                    }
                    context.closePath()

                    context.fill();



                }




            }

        }

        function project(punto, camara){
            if(camara.mode=='perspective'){
              return new Vertex2D(perspectiva(punto, camara));
            }



        }

        function perspectiva(point, camara){
            var punto = zoom(translate(camara.rotate(point), camara.pos), camara.zoom);
            var tempx = ((punto[0]*viewport.pos.z)/punto[2]);//+viewport.width;
            var tempy = ((punto[1]*viewport.pos.z)/punto[2]);//+viewport.width;
            var tempz = ((punto[2]*viewport.pos.z)/punto[2]);//+viewport.width;
            var temp = [tempx, tempy, tempz];

            return new Vector(temp);


        }

        var Vertex2D = function(punto) {
            this.x = parseFloat(punto.x*width/viewport.width);
            this.y = parseFloat(punto.y*height/viewport.height);
        };

        function aplicarColor(){
          scene[actualObj].setColor(getRGB());
          renderScene(scene);
          console.log(getRGB());
        }

        function getRGB(){
          return reqCOLOR;
        }

        function setRequestedColor(rgb){
            reqCOLOR = rgb;
            document.getElementById('actColor').style.backgroundColor = 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
        }



        //seccion de fisicas


        function acelerate(){
          console.log('Begin motion');
          scene[actualObj].acceleration = 0.6;
          scene[actualObj].velocity = 0;
          //console.log(obj.axis[0][2]);
          update();
          
        }
        var frame = 0;
        var fps = round(1000/15, 0);
        var frameRate = 15
        var upd;
        var initDif;
        function update(){
          console.log(fps);
          
          upd = setInterval(function(){
            var obj = scene[actualObj];
            var maxSpeed = 2;

            if(obj.velocity<maxSpeed){
              obj.velocity += round(obj.acceleration/fps, 2);

            }

            var mo = motionValues(obj.transform(obj.axis[2]), obj.transform([obj.origin.x, obj.origin.y, obj.origin.z] ));

            /*console.log('velocidad:', obj.velocity, '\nframe count: ', frame,
                        'axisZ pos: ', obj.transform(obj.axis[2]),
                        'obj origin: ', obj.transform([obj.origin.x, obj.origin.y, obj.origin.z]),
                        'motion values: ', mo);*/
            
            //console.log({x:obj.ObjTranslation.x+mo[0], y:obj.ObjTranslation.y+mo[1], z:obj.ObjTranslation.z+mo[2]});
            var x = round((mo.obj.x/frameRate), 2);
            var y = round((mo.obj.y/frameRate), 2);
            var z = round((mo.obj.z/frameRate), 2);

            var xc = round((mo.cam.x/frameRate), 2);
            var yc = round((mo.cam.y/frameRate), 2);
            var zc = round((mo.cam.z/frameRate), 2);


            //console.log('mo:',{x:x,y:y,z:z}, mo,
             //           'Obj tran: ', obj.ObjTranslation);
            scene[actualObj].setTranslation({x:x,y:y, z:z});
            //camara.pos = {x:xc,y:yc, z:zc};

            if(frame%15==0){
              console.log(frame);
              //console.log('mo:',{x:x,y:y,z:z}); 
            }
            
            //sumTranslate({x:mo[0],y:mo[1], z:mo[2]});
            frame ++;
            //if(!rendering){
              rendering = false;
              renderScene(scene);
            //}
            
          },fps );
        }
        function motionValues(axis, origin){
         // console.log(axis, origin);
            var xdiff = round(axis[0]-origin[0], 2);
            var ydiff = round(axis[1]-origin[1], 2);
            var zdiff = round(axis[2]-origin[2], 2);
            if(axis[0]<0){xdiff*=-1}
            if(axis[1]<0){ydiff*=-1}
            if(axis[2]<0){zdiff*=-1}
            var camDistance = 8;

            var V = [round(axis[0]-origin[0], 2),round(axis[1]-origin[1], 2),round(axis[2]-origin[2], 2)];
            var VL = Math.sqrt((Math.pow(V[0], 2)+Math.pow(V[1], 2)+Math.pow(V[2], 2)));
            var vf = [V[0]/VL, V[1]/VL, V[2]/VL ];
            var Pd = [((origin[0]+camDistance)*vf[0]),((origin[1]+camDistance)*vf[1]),((origin[2]+camDistance)*vf[2])]
            if(isNaN(Pd[0])){Pd[0]=0}
            if(isNaN(Pd[1])){Pd[1]=0}
            if(isNaN(Pd[2])){Pd[2]=0}

            console.log('axis: ', axis, 'origin: ', origin, 'camPoint: ', Pd,
                           {x: xdiff ,y: ydiff ,z:zdiff  }, scene[actualObj].ObjTranslation);
             return {cam: {x: Pd[0]  ,y:Pd[1]  ,z:Pd[2] }, obj:  {x: xdiff ,y: ydiff ,z:zdiff  } };

            /*
            if(initDif==null){
              initDif = {x: xdiff , y: ydiff , z:zdiff};
            }
            var xm = (scene[actualObj].velocity*xdiff)/initDif.x;
            var ym = (scene[actualObj].velocity*xdiff)/initDif.y;
            var zm = (scene[actualObj].velocity*xdiff)/initDif.z;
            
            

            var xcam = (camDistance*xdiff)/initDif.x;
            if(isNaN(xcam)){xcam = 0}
            var ycam = (camDistance*ydiff)/initDif.y;
            if(isNaN(ycam)){ycam = 0}
            var zcam = (camDistance*zdiff)/initDif.z;
            if(isNaN(zcam)){zcam = 0}

            xcam = round((axis[0]-camDistance)*origin[0], 2);
            ycam = round((axis[1]-camDistance)*origin[1], 2);
            zcam = round((axis[2]-camDistance)*origin[2], 2);

            //valores de la camara
            console.log(xcam, ycam, zcam);
            console.log(scene[actualObj].getTargetOrigin());
            var xc = scene[actualObj].getTargetOrigin()[0]+xcam;
            var yc  = scene[actualObj].getTargetOrigin()[1]+ycam;
            var zc  = scene[actualObj].getTargetOrigin()[2]+zcam;


            console.log({cam: {x: xc  ,y:yc  ,z:zc  }, obj:  {x: xdiff ,y: ydiff ,z:zdiff  } });
            return {cam: {x: xc  ,y:yc  ,z:zc  }, obj:  {x: xdiff ,y: ydiff ,z:zdiff  } };
            */
        }


        function stopMotion(){
          console.log('Motion stoped');
          clearInterval(upd);
          frame = 0;
        }

        

}

export default engine;




