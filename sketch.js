var dog, dog2
var database
var foodS, foodstock
var feedPet, addFood
var fedTime, lastFed
var foodObj, fedTime
var gameState
var bedroom, garden, washroom, saddog

function preload()
{
	dog= loadImage("dogimg/dogImg.png")
  dog2= loadImage("dogimg/dogImg1.png")
  bedroom= loadImage("images/Bed Room.png")
  garden= loadImage("images/Garden.png")
  washroom= loadImage("images/Wash Room.png")
  saddog= loadImage("dogimg/deadDog.png")
}

function setup() {
	createCanvas(900, 500);
  
  database = firebase.database();
  foodObj = new Food()
  feedPet=createButton("Feed the pet");
  feedPet.position(700,95);
  feedPet.mousePressed(dogFeed);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  dogb = createSprite(500,400,10,10);
	dogb.addImage(dog)
  dogb.scale= 0.15;
  foodStock=database.ref('Food');
  foodStock.on("value", readStock);

  database.ref("gameState").on("value", function(data){
    gameState=data.val()
  })
  
}


function draw() {  
  background(46, 139, 87)

  fill(255,255,254);
  textSize(15);
  
  database.ref('lastFed').on('value',function(data){
    fedTime = data.val();
  }) 

  if(fedTime>=12){
    text("Last Feed : "+ fedTime%12 +" PM",350,60);
  }else if(fedTime==0){
    text("Last Feed : "+ "12 AM" ,350,60);
  }else{
    text("Last Feed : "+ fedTime +" AM",350,60);
  }
  
  textSize(15);
  fill("black");
  text("Score = "+ foodS, 50,100);
  
  if(gameState!="hungry"){
    feedPet.hide();
    addFood.hide();
    //dogb.remove();
  }else{
    feedPet.show();
    addFood.show(); 
    dogb.addImage(saddog);
  }

  if(fedTime==dogFeed+1){
    foodObj.Garden();
    updateGS("playing");
  }else if(fedTime>(dogFeed+2)&&fedTime<=(dogFeed+4)){
    foodObj.Washroom();
    updateGS("bathing");
  }else if(fedTime==(dogFeed+2)){
    foodObj.Bedroom();
    updateGS("sleeping");
  }else{
    foodObj.display();
    updateGS("hungry");
  }

  
  drawSprites();
}
function readStock(data){
  foodS = data.val()
  foodObj.updateFoodStock(foodS);
}

function addFoods(){
  foodS= foodS+1
  database.ref('/').update({Food:foodS})
}

function dogFeed(){
  dogb.addImage(dog2);
  if(foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0)
  }else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  }
  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    lastFed: hour()
  })
}

function updateGS(state){
  database.ref('/').update({
    gameState: state
  })
}

