function Objects(){
    console.log(`Abriendo objects`);
    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    function dotProduct(vec1, vec2) {
        var newVec = parseFloat(vec1.x*vec2.x)+parseFloat(vec1.y*vec2.y)+parseFloat(vec1.z*vec2.z);
  
        return newVec;
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
    var Vector = function(coor){
        this.x = coor[0];
        this.y = coor[1];
        this.z = coor[2];
    }
    class Mesh{
        constructor(model, nombre, camara){
           this.model = model;
           this.name = nombre;
           this.ObjRotation = {x:0,y:0, z:0};
           this.ObjTranslation = {x:0,y:0, z:6};
           this.up = {x:0, y:0,z:0};
           this.scala = 1;
           this.origin = this.setCenterOrigin(model.vertices)[0];
           this.poligons = this.convertToMesh(model, camara);
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
               if(this.ObjRotation[key]>(Math.PI*2)){
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
    
        mergeMesh(camara){
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
          return this.culling(newPoligons, camara);
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
        convertToMesh(modelo, camara){
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
    
    
    
    
            return this.culling(faces, camara);
        }
        culling(faces, camara){
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
    
    
     }
    
    
    
     class Camara{
         constructor(){
             this.pos = new Vector([0, 0 , -80]);
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
                  if(this.rotation[key]>(Math.PI*2)){
                    this.rotation[key] =0;
                  }
             }
         }
    
         rotate(vertice){
    
             var or = this.target;//scene[actualObj].getTargetOrigin();
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
           
           this.up={x:0, y:150, z:0};
           this.width= 300;
           this.height=300;
           this.rotation= {x:0, y:0, z:0};
         }
         setRotation(rot){
    
           this.rotation = sumarVec(this.rotation, rot);
           for(var key in this.otation){
                if(this.rotation[key]>(Math.PI*2)){
                  this.rotation[key] =0;
                }
           }
    
         }
    
     }


     this.Mesh = Mesh;
    this.Camara = Camara;
    this.Viewport = Viewport;
    
}
export default Objects;