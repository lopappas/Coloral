import * as THREE from 'three'; //imports 3js
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'; //load fonts
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'; //load text geometry
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'; //CSS2D text import
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//
////Initialization
//

//Scene setup
const scene = new THREE.Scene();



////Background: png
const texture_loader = new THREE.TextureLoader();
let background_texture = texture_loader.load( 'textures/pixel sky.jpg' );
background_texture.colorSpace = THREE.SRGBColorSpace;
scene.background = background_texture;



//Camera setups
const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, .01, 1000 );
camera.position.x = 0;
camera.position.y = 6.6;
camera.position.z = 23;
camera.rotation.x = -16;
camera.rotation.x = 0;
camera.rotation.x = 0;



//Render setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



//Orbit controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();


//
////Creating 3D objects
//

//Create player plane
const G_grass_plane = new THREE.PlaneGeometry( 16, 30 );
const M_grass_plane = new THREE.MeshBasicMaterial( {color: "#B6FE80", side: THREE.DoubleSide} );
const SM_grass_plane = new THREE.Mesh( G_grass_plane, M_grass_plane );
SM_grass_plane.rotation.x = -1.5708;
scene.add( SM_grass_plane );



//Create player
//let objColor = "pink"
const g_player = new THREE.BoxGeometry( 1, 1, 1 );
let m_red = new THREE.MeshBasicMaterial( { color: "red" } );
let sm_player = new THREE.Mesh( g_player, m_red );
sm_player.position.set(0,.5,10);
scene.add( sm_player );




//Create wall
//let objColor = "green"
const g_wall = new THREE.BoxGeometry( 1, 1, 1 );
let m_green = new THREE.MeshBasicMaterial( { color: "green" } );
let sm_wall = new THREE.Mesh( g_wall, m_green );
sm_wall.position.set(0,.5,-10);
scene.add( sm_wall );



//3D mesh loader
const gltf_loader = new GLTFLoader();






////Create wall class

class Wall {
  constructor(name, safe, color) {

    const selectWall = getRandomMapElement(wallMap);
    const [key, value] = selectWall;
    wall_type = `${key}`;
    wall_safe = `${value}`;



    this.name = wall_type;
    this.safe = wall_safe;
    this.color = wall_mat;
  }

  bark() {
    console.log("Woof!");
  }
}








//helper function
function getRandomElem(arr) {
  
  if (arr.length === 0) {
    return undefined;
  }
  
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
  
}


//fix this!
function randomWallColor (wall) {
  const randomColor = getRandomElem(colors);
  console.log(randomColor);
  let wall_mat = new THREE.MeshBasicMaterial( { color: randomColor } );
  wall.material = new THREE.MeshBasicMaterial( { color: randomColor } );
  wall_color = true;

  return wall_mat;
  
}



function getRandomMapElement(map) {
  if (!map || map.size === 0) {
    return undefined; // Return undefined if the map is empty or invalid
  }

  const randomIndex = Math.floor(Math.random() * map.size);
  let currentIndex = 0;

  for (const entry of map) {
    if (currentIndex === randomIndex) {
      return entry; // Return the key-value pair as an array [key, value]
    }
    currentIndex++;
  }
}



//wallTypeArray = ["LLL_Wall","LL_Wall","L_Wall","Wall","R_Wall","RR_Wall","RRR_Wall"];
const wallMap = new Map([
  ['LLL_Wall', -6],
  ['LL_Wall', -4],
  ['L_Wall', -2],
  ['Base_Wall', 0],
  ['R_Wall', 2],
  ['RR_Wall', 4],
  ['RRR_Wall', 6]
  
]);



////Create Wall
let wallArray = [];
let wall_to_add = "";

function spawnWall() {

  const selectWall = getRandomMapElement(wallMap);

  let wall_type = "";
  let wall_safe = "";

  if (selectWall) {
    const [key, value] = selectWall;
    console.log(`Random element: Key - ${key}, Value - ${value}`);
    wall_type = `${key}`;
    wall_safe = `${value}`;
  } else {
    console.log("The map is empty.");
  }



let wall_model = "";
  gltf_loader.load( 'objs/' + wall_type + '.glb', function ( gltf ) {
    //console.log(gltf.scene.children);
    wall_model = gltf.scene.children[0]; 
    wall_model.position.set(0,1,-10);


    randomWallColor (wall_model);

    // let meshy_color = new THREE.MeshBasicMaterial( { color: "blue" } );
    // let meshy = new THREE.Mesh( gltf.scene.children[0], meshy_color );
    //scene.add( meshy);

    //gltf.scene.children[0].material = 
    
    console.log(gltf);
    console.log(typeof gltf);
    console.log(wall_model);
    scene.add( wall_model);
    wallArray.push(wall_model);
    //wall_to_add = gltf.scene.children[0];

    //return wall_to_add;
    // wallArray.push(gltf.scene.children[0]);
    // console.log(".type");
    // console.log(typeof wallArray[0]);

    //try this?

    //console.log(gltf.scene.children[0].isBufferGeometry);
    //console.log("name of wall");
    //console.log(gltf.scene.children[0].isObject3D);
    //gltf.scene.children[0].name = "lo";
    //console.log(gltf.scene.children[0]);
    //console.log(gltf.scene.children[0])
  }
  , undefined, function ( error ) {
    console.log("fail!");
    //console.error( error );
    console.log('objs/' + wall_type + '.glb');

  } );

  console.log("wall_to_add ");
  console.log(wall_model);



    

}






//
////Animation controls
//
// loop that runs every frame to render scene and camera
const clock = new THREE.Clock();
let time = 0;
let delta = 0;
const direction = new THREE.Vector3(0, 0, 1);
const speed = 2000; // units a second - 2 seconds
let off = false;
const first_wall_time = 5;
let wall_time_change = 5;
let wall_timer = 5;
let total_walls = 0;






//Animate function
function animate() {
  renderer.render( scene, camera );

  delta = clock.getDelta();
  time += delta;
  total_walls = wallArray.length;
  //wall_time += delta; //tracks time for wall. 


  //Create wall
  if (time > wall_timer) {
    wall_time_change -= .2;
    wall_timer =  first_wall_time + wall_time_change;
    spawnWall();

   }


  if (wallArray.length > 0) {
    console.log("Array is greater than 1");
    console.log(wallArray);
    // for (let element of wallArray) {
    //   element.position.z += 0.1;

    // }
    // if (element.podsition.z >= 11) {
    //   wallArray.shift();
    // }
    for (let i = 0; i < wallArray.length; i++) {
      wallArray[i].position.z += .05;
    }
    if (wallArray[0].position.z >= 11) {
      
      scene.remove(wallArray[0]);
      wallArray.shift();

    }

    // if (wallArray.length > 0) {
    //   wallArray[0].position.z += 3;
    //   console.log("wall array element");
    //   console.log(wallArray[0]);
    //   if wallArray[0]
    // }


    //console.log(wallArray[0])//.position.x +=0.01;
    //wallArray[0].position;
    //wallArray.shift();
  }

  console_text.innerHTML = sm_player.position.x;
  console_text.innerHTML += " " + time;
  //sm_player.rotation.x += 0.000;
  //sm_player.rotation.y += 0.000;
  //cube.position.x += 0.01;
  //sm_player.position.z += 0.01;
  //camera.
  //camera.position.z -= 0.005;
}
renderer.setAnimationLoop( animate );













// //old script
document.addEventListener("keyup", onDocumentKeyUp, false);
//let LLL_Wall = this.getObjectByName("LLL_Wall");
//let pill = this.getObjectByName("pill");
let wall_color = false;



document.addEventListener('keydown', function(event) {
  if (event.keyCode === 32 || event.key === " ") {
   if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
        event.preventDefault();
    }
    recognition.start();
    console.log("Ready to receive a color command.");
    console.log('Spacebar pressed');
  }
});



// movement - please calibrate these values
const xSpeed = 1.0;
//var ySpeed = 0.5;


function onDocumentKeyUp(event) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code) > -1) {
        console.log(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(event.code))
        event.preventDefault();
    }
    let keyCode = event.which;

    //a key
    if (keyCode == 65) 
    {
      sm_player.position.x -= xSpeed;
    
    } 

    //d key
    else if (keyCode == 68) 
    {
      sm_player.position.x += xSpeed;
    }

};





// function update (event) {
//   if(wall_color == false)
//   {
//     randomWallColor(LLL_Wall)
//   }
//   LLL_Wall.position.z += .06;

  
// }




//speech recognition
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
  window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
  window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;



//Recognized colors
const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
  "chocolate",
  "pink"
  // …
];


const grammar = "#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | pink;";//[":#JSGF V1.0; grammar colors; public <color> = " + colors].join(" | ") + "};";
console.log("grammar");
console.log(grammar);

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);


recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;


//const diagnostic = document.querySelector(".output");
//const bg = document.querySelector("html");
//const hints = document.querySelector(".hints");


let colorHTML = "";
colors.forEach((color, i) => {
  console.log(color, i);
  colorHTML += `<span style="background-color:${color};"> ${color} </span>`;
  console.log(colorHTML);
});

//hints.innerHTML = `Tap or click then say a color to change the background color of the app. Try ${colorHTML}.`;

// document.body.onclick = () => {
//   recognition.start();
//   console.log("Ready to receive a color command.");
// };


recognition.onresult = (event) => {
  const color = event.results[0][0].transcript;
  console.log("color");
  console.log(color);
  if (!colors.includes(color)) {
    console.log("I didn't recognize that color.");
    return;
  }


  //diagnostic.textContent = `Result received: ${color}.`;
  //bg.style.backgroundColor = color; //adjust background color
  //objColor = color;
  if (color == "mosaic") {
    const loader = new THREE.TextureLoader();
  const texture = loader.load( 'public/textures/mosaic.png' );
  texture.colorSpace = THREE.SRGBColorSpace;
   
  cube.material = new THREE.MeshBasicMaterial({
    map: texture
  });
  } else {
    sm_player.material = new THREE.MeshBasicMaterial( { color: color } );
  }
  
  //new THREE.MeshBasicMaterial( { color: objColor } );
  console.log(`Confidence: ${event.results[0][0].confidence}`);
  console.log(color);
};



recognition.onspeechend = () => {
  recognition.stop();
};

recognition.onnomatch = (event) => {
  console.log("I didn't recognize that color.");
};



recognition.onerror = (event) => {
  console.log(`Error occurred in recognition: ${event.error}`);
};





//
////GUI code
//

//score & console
let score = 0;
score_board.innerHTML += score;

// console_text.innerHTML = sm_player.position.x














//
////backups
//


////Background: Equirectangular
// const equirectangular = new THREE.TextureLoader().load('textures/pixel sky.jpg');
// equirectangular.mapping = THREE.EquirectangularReflectionMapping;
// equirectangular.colorSpace = THREE.SRGBColorSpace;
// scene.background = equirectangular;




//Load 3d model
// gltf_loader.load( 'objs/LLL_Wall.glb', function ( gltf ) {
//   console.log(gltf.scene.children);
//   scene.add( gltf.scene.children[0]);

// }, undefined, function ( error ) {

//   console.error( error );

// } );






// AUDIO
// const stream = '/audio/lux_hotel.mp3'
// const audioLoader = new THREE.AudioLoader();
// const listener = new THREE.AudioListener();
// const audio = new THREE.Audio(listener);
// audioLoader.load(stream, function(buffer) {
//     audio.setBuffer(buffer);
//     audio.setLoop(true);
//     audio.play();
// });


