const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1920
canvas.height = 1080
let highlighted = false

let scale = 1

var background = new Image();
background.src = "home.png";


let cropLeft = 417
let cropRight = 186
let cropTop = 252
let cropBottom = 0


let isModalOpen = false
let modal = null


function drawCroppedImage(image, ctx, scaleFactor, cropLeft, cropRight, cropTop, cropBottom, ) {
  // Calculate the dimensions of the cropped image
  const sourceX = cropLeft;
  const sourceY = cropTop;
  const sourceWidth = image.width - cropLeft - cropRight;
  const sourceHeight = image.height - cropTop - cropBottom;

  // Calculate the dimensions of the scaled image
  const scaledWidth = sourceWidth * scaleFactor;
  const scaledHeight = sourceHeight * scaleFactor;


  // Clear the canvas
  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the cropped and scaled image on the canvas
  ctx.drawImage(
    image,    // Image object
    sourceX,  // Source x-coordinate (crop start point)
    sourceY,  // Source y-coordinate (crop start point)
    sourceWidth,   // Source width (crop width)
    sourceHeight,  // Source height (crop height)
    0,        // Destination x-coordinate (canvas start point)
    0,        // Destination y-coordinate (canvas start point)
    scaledWidth,   // Destination width (scaled width)
    scaledHeight  // Destination height (scaled height)
  );
}




let refreshBackground = (scale) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCroppedImage(background, ctx, scale, cropLeft, cropRight, cropTop, cropBottom)
}

// Make sure the image is loaded first otherwise nothing will draw.
background.onload = function(){

    openModal('about')
    handleResize()
    refreshBackground(scale)
  
  
}


let pageWidth = document.documentElement.clientWidth
scale = (pageWidth/ 3840) *1.15
console.log(pageWidth, scale)


function handleResize() {
  
  pageWidth = document.documentElement.clientWidth
  scale = (pageWidth/ background.width)*1.15

  

  canvas.width =  document.documentElement.clientWidth
  canvas.height =  background.height * scale * 0.8
  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ctx.drawImage(background,0,0, background.width*scale,background.height*scale );   



  refreshBackground(scale)
}


window.addEventListener('resize', handleResize);








let stuff = {
  books: {
    x:2885,
    y:635,
    width:428,
    height:265
  },
   camera: {
    x:2261,
    y:1349,
    width:136,
    height:543
  },
   door: {
    x:585,
    y:1126,
    width:241,
    height:643
  },
   electronics: {
    x:1160,
    y:968,
    width:285,
    height:148
  },
   guitars: {
    x:1883,
    y:695,
    width:303,
    height:500
  }, 

   mac: {
    x:2843,
    y: 1045,
    width:237,
    height:368
  },
  movies: {
    x:487,
    y:467,
    width:376,
    height:535
  },
   origami: {
    x:938,
    y:1186,
    width:247,
    height:220
  },
   pegboard: {
    x:3139,
    y: 1092,
    width: 360,
    height:424
  },
   piano: {
    x:2178,
    y:763,
    width:523,
    height:476
  },
   plants: {
    x:1800,
    y:451,
    width:523,
    height:183
  },
   whiteboard: {
    x:1309,
    y:515,
    width:453,
    height:335
  },
   switch: {
    x:2872,
    y:1531,
    width:190,
    height:92
  },
  
}

let modifiedStuff = Object.entries(stuff).map(  ([item, props]) => {


  
  let image = new Image()
  image.src = 'stuff/' + item + '.png'
  
  
  
  return {
  ...props,
  item: item,
  image: image
}


});


let findItemForPoint = (mouseX, mouseY, squaresWithItems, cropLeft, cropRight, cropTop, cropBottom, scaleFactor) => {
  // Adjust the coordinates and scale factor based on cropping
  

  // Find the square that contains the point
  let foundSquare = squaresWithItems.find(({ x, y, width, height }) => {
    const squareX = (x - cropLeft) * scaleFactor;
    const squareY = (y - cropTop) * scaleFactor;
    const squareWidth = (width ) * scaleFactor;
    const squareHeight = (height) * scaleFactor;

    

    // console.log( x, y, width, height)
    // console.log(squareX, squareY,squareWidth,squareHeight )

    return (
      mouseX >= squareX &&
      mouseX < squareX + squareWidth &&
      mouseY >= squareY &&
      mouseY < squareY + squareHeight
    );
  });

  return foundSquare ? foundSquare : null;
};



canvas.addEventListener("mousemove", function(event) {
  // Get the mouse position relative to the canvas
  var rect = canvas.getBoundingClientRect();
  var mouseX = event.clientX - rect.left;
  var mouseY = event.clientY - rect.top;

  let itemInSquare = findItemForPoint(mouseX, mouseY, modifiedStuff, cropLeft, cropRight, cropTop, cropBottom, scale)

  if(itemInSquare){
    
    drawCroppedImage(itemInSquare.image, ctx, scale, cropLeft, cropRight, cropTop, cropBottom)
    document.body.style.cursor = "pointer";
    
  } else {
      refreshBackground(scale)
      document.body.style.cursor = "auto";
  }
});


canvas.addEventListener("click", function(event){
  var rect = canvas.getBoundingClientRect();
  var mouseX = event.clientX - rect.left;
  var mouseY = event.clientY - rect.top;

  let itemInSquare = findItemForPoint(mouseX, mouseY, modifiedStuff, cropLeft, cropRight, cropTop, cropBottom, scale)



  if (itemInSquare) {
    
    openModal(itemInSquare.item)
  }

})



function openModal(item) {
  
  overlay = document.getElementById(item)
  overlay.style.display = 'block'

    modal = overlay.firstChild
    isModalOpen = true

  
    function closeOnOutsideClick(event) {
    
      if (isModalOpen) {
    
        const isClickedOutsideModal = !modal.contains(event.target);
  
        if (isClickedOutsideModal) {
          modal.parentElement.style.display = 'none';
          isModalOpen = false;
          modal = null
          // Remove the click event listener from the window object
          window.removeEventListener('click', closeOnOutsideClick, true);
        }
      }
    }
  
    window.addEventListener('click', closeOnOutsideClick, true);
}
