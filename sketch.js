var dog,happyDog,sadDog,database,foodS,foodStock;
var sadDogImg,happyDogImg;
var feedButton,addFoodButton;
var food;
var fedTime;
var readState,gameState;
var bedroomImg,gardenImg,washroomImg;
var currentTime;
var Dogname;
var input;

function preload()
{
  sadDogImg = loadImage("dogImg.png");
  happyDogImg = loadImage("dogImg1.png");
  bedroomImg = loadImage("Bed Room.png");
  washroomImg = loadImage("Wash Room.png");
  gardenImg = loadImage("Garden.png");
  livingRoomImg = loadImage("Living Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(900,500);
  dog = createSprite(850,250,15,15);
  dog.addImage(sadDogImg);
  dog.scale = 0.25;
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  food = new Food();
  fedTime = database.ref('fedTime');
  fedTime.on("value",function(data){
    fedTime = data.val();
  });
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState = data.val();
  });
  feedButton = createButton("Feed The Dog");
  feedButton.position(685,100);
  feedButton.mousePressed(feedDog);
  addFoodButton = createButton("Add Food");
  addFoodButton.position(795,100);
  addFoodButton.mousePressed(addFood);
  var input = createInput("Fill Your Dog's Name");
  input.position(1000,95);
  Dogname = input.value();
  var button = createButton("Submit");
  button.position(1000,150);
  button.mousePressed(function(){
    input.hide();
    button.hide();
  });  
  
}
function draw() 
{
  currentTime = hour();
  if(currentTime ==(fedTime+1))
  {
    update("Playing");
    food.garden();

  }
  else if(currentTime == (fedTime + 2))
  {
    update("Sleeping");
    food.bedroom();

  }
  else if(currentTime == (fedTime+3))
  {
    update("Bathing");
    food.washroom();
  }
  else if(currentTime == (fedTime+4))
  {
    update("Watching");
    food.livingRoom();

  }
  else
  {
    update("Hungry");
    food.display();

  }
  if(gameState!="Hungry")
  {
    feedButton.hide();
    addFoodButton.hide();
    dog.remove();
    food.hide();
  }
  else
  {
    feedButton.show();
    addFoodButton.show();
    dog.addImage(sadDogImg)
  }
  background(46,139,87);  
  food.display();
  drawSprites();  
  textSize(20);
  fill("white");
  text("Food Remaining: "+foodS,170,100);
  if(fedTime>=12)
        {
        fill("white");
        textSize(15); 
        text("Last Fed : "+ fedTime%12 + " PM", 350,30);
        }
        else if(fedTime==0)
        {
            fill("white");
            textSize(15); 
             text("Last Fed : 12 AM",350,30);
        }
        else
        {
            fill("white");
            textSize(15); 
            text("Last Fed : "+ fedTime + " AM", 350,30);
        }
  

}
function readStock(data)
{
  foodS = data.val();
  food.updateFoodStock(foodS);
}
function feedDog()
{
  dog.addImage(happyDogImg);
  foodS--;
  database.ref('/').update({
    Food : foodS
  })
  fedTime = hour();
}
function addFood()
{
  dog.addImage(sadDogImg);
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state)
{
  database.ref('/').update({
    gameState:state
  });
}