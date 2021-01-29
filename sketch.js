//Create variables here
var dog, happyDog, database, foodS, foodStock;
var dogSprite;
var feedPet, addFood;
var fedTime, lastFed;
var input;
var foodObj;//for Food class

var changeGS, readGS;
var bedroomimg, gardenimg, washroomimg;
var sadDog;



function preload()
{
  //load images here
  dog=loadImage("images/dogImg.png");
  dog.scale= 0.4;
  happyDog=loadImage("images/dogImg1.png");

  bedroomimg = loadImage("images/Bed Room.png");
  gardenimg = loadImage ("images/Garden.png");
  washroomimg = loadImage ("images/Wash Room.png");
  sadDog = loadImage ("images/Lazy.png");
}

function setup() {
	createCanvas(1600, 800);
  dogSprite=createSprite(800, 400, 10, 10);
  dogSprite.addImage(dog);

  database=firebase.database();

  foodStock=database.ref("Food");
  foodStock.on("value", readStock);

  feedPet=createButton("Feed the Dog");
  feedPet.position(700, 105);
  feedPet.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(500, 105);
  addFood.mousePressed(foodStock);

  input = createInput("Name",900, 100);
  input.position(100, displayHeight/2- 60);

  var button = createButton("Submit");
  button.position(100, displayHeight/2-30);

  button.mousePressed(
    ()=>{
      input.hide();
      button.hide();
      var greetingdog = createElement('h2');
      greetingdog.html("Hello my Friend " + input.value());
      greetingdog.position(displayWidth/2-70, displayHeight/4);
    }
  )

  //read game State from db
  readGS=database.ref("gameState");
  readGS.on("value", function(data){
    gameState=data.val();
  });
}


function draw() {  
  background(46, 139, 87);

  currentTime=hour();
  if(currentTime===(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime===(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2)&&currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  if(gameState!="Humgry"){
    feedPet.hide();
    addFood.hide();
    dog.remove();
  }else{
    feedPet.show();
    addFood.show();
    dogSprite.addImage(sadDog);
  }


  fill(255);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : " + lastFed%12 + "PM", 350, 30);
  }else if(lastFed==0){
      text("Last Feed : 12 AM", 350, 30);
  }else{
    text("Last Feed :  " + lastFed + "AM", 350, 30);
  }
  drawSprites();
  
  //add styles here

}
//To show the last fed time in the correct format


function update(state){
  database.ref("/").update({
    gameState : state
  });
}


function readStock(data){
foodS=data.val();
}

fedTime=database.ref("FeedTime");
fedTime.on("value", function(data){
  lastFed=data.val();
});

function writeStock(x){

  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  database.ref("/").update({
    Food : x
  });
  Food.display();
}

function feedDog(){
  dogSprite.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}


function Addfood(){
  foodS++;
  database.ref("/").update({
    Food : foodS
  })
}
