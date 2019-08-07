let terminal = document.getElementById("terminal");
let menuButton = document.getElementById("menu");
let menushowing=false;


terminal.addEventListener("focus", function(){
  terminal.value = "$ =>";
});
terminal.addEventListener("input",(ev)=>{
    //alert(terminal.setSelectionRange(4,4))
    //alert(terminal.value.length)
    if(terminal.value.length<4){
      terminal.value = "$ =>";
      
    }
    setTimeout(function(){
      terminal.setSelectionRange(terminal.value.length,terminal.value.length);
    },1);
});

function restartLine(){
  terminal.value = "$ =>";
}
let history =[];


document.addEventListener("keydown", function(e){
    if(e.keyCode==13){
      var command = terminal.value.split(">")[1].split(" ");
      if(window[command[0]]){
        //alert(`${command.join(" ")}\nsalomon`);
        //alert ((history.prototype))
        writeHistory(...command);
       
        
        
       // alert(line);
       
        
        window[command[0]](command[1]);
        
      }else{
        alert(`No existe la funcion ${command[0]}`);
        restartLine();
      }
    }
});

function init(pedo){
  //alert(pedo);
  writeHistory("engine started")
  restartLine()
}
function writeHistory(l){
  let date = new Date();
  
  history.push([`${date.getUTCHours()}:${date.getUTCMinutes()}-${date.getUTCMilliseconds()} ${l}\n`]);
  
  let hs = document.getElementById("historic");
  var line="";
  for(let h of history){
    //alert(h[0]);
    line +=h[0];
    
    
  }
  hs.value= line;
  hs.scrollTop=hs.scrollHeight;
  
  return true;
}

function comer(mierda){
  alert(mierda)
  restartLine()
}


menu.addEventListener("click" , abrirMenu);

function abrirMenu(){
  let menuList= document.getElementById("menuList");
  if (!menushowing){
    menuList.style.display = "block";
    menushowing=true;
  }else{
    menuList.style.display = "none";
    menushowing = false;
  }
}