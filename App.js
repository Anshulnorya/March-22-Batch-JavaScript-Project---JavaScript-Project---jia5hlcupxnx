
const canvas = document.querySelector("canvas");
const toolBtns= document.querySelectorAll('.tool');
const fillColor= document.querySelector('#fill-color');
const sizeSlider= document.querySelector('#size-slider');
const colorBtns= document.querySelectorAll('.color .option');
const colorPicker= document.querySelector('#color-picker');
const clearCanvas= document.querySelector('.clear-canvas');
const saveImg= document.querySelector('.save-img');
const ctx=canvas.getContext("2d");


let prevMouseX, prevMouseY, snapShot;
isDrawing=false;
selectedTool='brush',
brushWidth=1;
selectedColor="000";
const setCanvasBackground =()=>{
  ctx.fillStyle="#fff";
  ctx.fillRect(0,0, canvas.width, canvas.height);
}

window.addEventListener("load",()=>{

  //canvas ki height width set hori hai   offsetheight...width   or ye dikhne waaali height width dega element ki
  canvas.width=canvas.offsetWidth;
  canvas.height=canvas.offsetHeight;
  setCanvasBackground();
});
const drawRect=(e)=>{
  if(!fillColor.checked){
   return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  }
  ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  }
const drawCircle=(e)=>{
  ctx.beginPath();
  let radius =Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  ctx.stroke();
  if(fillColor.checked){
    ctx.fill();
  }else{
    ctx.stroke();
  }
}

const drawTriangle=(e)=>{
ctx.beginPath();
ctx.moveTo(prevMouseX, prevMouseY);
ctx.lineTo(e.offsetX,e.offsetY);
ctx.lineTo(prevMouseX*2 - e.offsetX,e.offsetY);
ctx.closePath();
ctx.stroke();
if(fillColor.checked){
  ctx.fill();
}else{
  ctx.stroke();
}
}

const startDraw =(e)=>{
  isDrawing=true;
  prevMouseX= e.offsetX;
  prevMouseY= e.offsetY;
  ctx.beginPath(); // naya pathbna raha hai drwaing k liye
  ctx.lineWidth=brushWidth;
  snapShot=ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle=selectedColor;
  ctx.fillStyle=selectedColor;
}

const drawing =(e)=>{
  if(!isDrawing){
    return;   // agar is drawing false hai to yaha se return
  }
  ctx.putImageData(snapShot, 0, 0)
  if(selectedTool=="brush" || selectedTool==="eraser"){
      if(selectedTool==="eraser"){
        ctx.strokeStyle="#fff";
    } else{
      ctx.strokeStyle=selectedColor;
    }
    
      

    ctx.lineTo(e.offsetX, e.offsetY); // jaha mouse jaara hai vaha line bana raha hai 
    ctx.stroke();  //drwaing bna raha hai isse
  }else if(selectedTool=="rectangle"){
    drawRect(e);
  }else if(selectedTool=="circle"){
    drawCircle(e);
  }else{
    drawTriangle(e);
  }
  }

toolBtns.forEach(btn=>{
  btn.addEventListener('click',()=>{ // tool pe click k liye

    //active class hatane k liye
    document.querySelector('.options .active').classList.remove('active');
    btn.classList.add('active');
    selectedTool=btn.id;
    
  });
});

sizeSlider.addEventListener('change', ()=> brushWidth=sizeSlider.value);
colorBtns.forEach(btn =>{
  btn.addEventListener('click',()=>{
    document.querySelector('.options .selected').classList.remove('selected');
    btn.classList.add('selected');
     selectedColor= (window.getComputedStyle(btn).getPropertyValue('background-color'));
  });
})

colorPicker.addEventListener('change',()=>{
  colorPicker.parentElement.style.background=colorPicker.value;
  colorPicker.parentElement.click();
});


clearCanvas.addEventListener('click',()=>{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
})

saveImg.addEventListener('click',()=>{
  const link = document.createElement("a");
  link.download=`${Date.now()}.jpg`;
  link.href=canvas.toDataURL();
  link.click();
})

canvas.addEventListener("mousedown",startDraw)
canvas.addEventListener("mousemove",drawing);
canvas.addEventListener("mouseup",()=> isDrawing=false);
