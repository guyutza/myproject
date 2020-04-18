"use strict";

var gl;                 // The webgl context.

var a_coords_loc;       // Location of the a_coords attribute variable in the shader program.
var a_coords_buffer;    // Buffer to hold the values for a_coords.
var a_normal_loc;       // Location of a_normal attribute.
var a_normal_buffer;    // Buffer for a_normal.
var index_buffer;       // Buffer to hold vetex indices from model.

var u_diffuseColor;     // Locations of uniform variables in the shader program
var u_specularColor;
var u_specularExponent;
var u_lightPosition;
var u_modelview;
var u_projection;
var u_normalMatrix;    

var projection = mat4.create();          // projection matrix
var modelview;                           // modelview matrix; value comes from rotator
var normalMatrix = mat3.create();        // matrix, derived from model and view matrix, for transforming normal vectors
var rotator;                             // A TrackballRotator to implement rotation by mouse.

var lastTime = 0;
var colors = [  // RGB color arrays for diffuse and specular color values
    [1,1,1],
];

var theta = 0;
var alpha = 0;
var beta = 0;
var sun_x = 0;
var sun_z = 5;

var lightPositions = [  // values for light position
  [0,0,0,1],
];

var objects = [         // Objects for display
    cube(1),
    ring(0,2.1,64),ring(2.2,3.3,64),ring(3.4,4,64),
    uvCylinder(4,1,64),
    uvSphere(0.5),
    uvCylinder(0.1,0.4,64),
    uvCone(0.4,1,64),
    uvTorus(1,0.6,32,16),
];

var currentModelNumber;  // contains data for the current object

var colors = [
    1.0,  1.0,  1.0,  1.0,    // white
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0,    // blue
    0.0,  0.0,  0.0,  0.0,    // black
    0.5,  0.5,  0.5,  0.5,    // grey
  ];

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}


function perspective(p, fov, as, ne, fa){
    p = mat4.perspective(p, fov, as, ne, fa)
    return p;
}


function translate(mv1, mv2, vec){
    mat4.translate(mv1, mv1, vec); 
    return mv1;
}

function rotate(mv1, mv2, angle, vec){
    mat4.rotate(mv1, mv1, angle, vec);  
    return mv1;
}

function scale(mv1, mv2, vec){
    mat4.scale(mv1, mv1, vec);
    return mv1;
}

function tyres(loc){

    for(var i =0;i<6;i++){
        installModel(objects[4]);
        currentModelNumber = 4;

        translate(modelview, modelview, loc);
        rotate(modelview, modelview, degToRad(beta+60*i), [1,0,0]);
        scale(modelview, modelview, [0.005,0.005,0.4]);
        gl.uniform4f(u_diffuseColor, 1, 1, 0, 1);
        update_uniform(modelview,projection, 4);
        scale(modelview, modelview, [200,200,1/0.4]);
        rotate(modelview, modelview, degToRad(-(beta+60*i)), [1,0,0]);
        translate(modelview, modelview, [-loc[0],-loc[1],-loc[2]]);
    }


    installModel(objects[8]);
    currentModelNumber = 8;

    translate(modelview, modelview, loc);
    scale(modelview, modelview, [0.21,0.21,0.21]);
    rotate(modelview, modelview, degToRad(90), [0,1,0]);
    gl.uniform4f(u_diffuseColor, 0,0,1,1);
    update_uniform(modelview,projection, 8);
    rotate(modelview, modelview, degToRad(-90), [0,1,0]);
    scale(modelview, modelview, [1/0.21,1/0.21,1/0.21]);
    translate(modelview, modelview, [-loc[0],-loc[1],-loc[2]]);

}

function car(){

    //car body
    installModel(objects[0]);
    currentModelNumber = 0;

    scale(modelview, modelview, [1,2,0.25]);
    translate(modelview, modelview, [0,0,1]);
    gl.uniform4f(u_diffuseColor, 1, 0, 0, 1);
    update_uniform(modelview,projection, 0);
    translate(modelview, modelview, [0,0,-1]);
    scale(modelview, modelview, [1,0.5,4]);

    installModel(objects[0]);
    currentModelNumber = 0;

    scale(modelview, modelview, [0.8,0.8,0.25]);
    translate(modelview, modelview, [0,0.25,2]);
    gl.uniform4f(u_diffuseColor, 1, 0, 0, 1);
    update_uniform(modelview,projection, 0);
    translate(modelview, modelview, [0,-0.25,-2]);
    scale(modelview, modelview, [1.25,1.25,4]);


    //car lamp
    installModel(objects[5]);
    currentModelNumber = 5;

    translate(modelview, modelview, [0.35,-1,0.25]);
    scale(modelview, modelview, [0.1,0.1,0.1]);
    gl.uniform4f(u_diffuseColor, 1, 1, 0, 1);
    update_uniform(modelview,projection, 5);
    scale(modelview, modelview, [10,10,10]);
    translate(modelview, modelview, [-0.35,1,-0.25]);

    installModel(objects[5]);
    currentModelNumber = 5;

    translate(modelview, modelview, [-0.35,-1,0.25]);
    scale(modelview, modelview, [0.1,0.1,0.1]);
    gl.uniform4f(u_diffuseColor, 1, 1, 0, 1);
    update_uniform(modelview,projection, 5);
    scale(modelview, modelview, [10,10,10]);
    translate(modelview, modelview, [0.35,1,-0.25]);

    //car axles
    installModel(objects[4]);
    currentModelNumber = 4;

    translate(modelview, modelview, [0,0.8,0.16]);
    rotate(modelview, modelview, degToRad(90), [0,1,0]);
    scale(modelview, modelview, [0.005,0.005,1.2]);
    gl.uniform4f(u_diffuseColor, 1, 1, 0, 1);
    update_uniform(modelview,projection, 4);
    scale(modelview, modelview, [200,200,1/1.2]);
    rotate(modelview, modelview, degToRad(-90), [0,1,0]);
    translate(modelview, modelview, [-0,-0.8,-0.16]);

    installModel(objects[4]);
    currentModelNumber = 4;

    translate(modelview, modelview, [0,-0.8,0.16]);
    rotate(modelview, modelview, degToRad(90), [0,1,0]);
    scale(modelview, modelview, [0.005,0.005,1.2]);
    gl.uniform4f(u_diffuseColor, 1, 1, 0, 1);
    update_uniform(modelview,projection, 4);
    scale(modelview, modelview, [200,200,1/1.2]);
    rotate(modelview, modelview, degToRad(-90), [0,1,0]);
    translate(modelview, modelview, [-0,0.8,-0.16]);

    //[-0.6,-0.8,-0.2]
    tyres([-0.6,0.9,0.2]);
    tyres([-0.6,-0.9,0.2]);
    tyres([0.6,0.9,0.2]);
    tyres([0.6,-0.9,0.2]);
}

function platform(){
    installModel(objects[1]);
    currentModelNumber = 1;
    gl.uniform4f(u_diffuseColor, 0, 1, 0, 1);
    update_uniform(modelview,projection, 1);

    installModel(objects[2]);
    currentModelNumber = 2;
    gl.uniform4f(u_diffuseColor, 0.5, 0.5, 0.5, 1);
    update_uniform(modelview,projection, 2);
    

    installModel(objects[3]);
    currentModelNumber = 3;
    gl.uniform4f(u_diffuseColor, 0, 1, 0, 1);
    update_uniform(modelview,projection, 3);

    installModel(objects[4]);
    currentModelNumber = 4;
    translate(modelview, modelview, [0,0,-1]);
    gl.uniform4f(u_diffuseColor, 0.1875,0.5,0.078125,1);
    update_uniform(modelview,projection, 4);
    translate(modelview, modelview, [0,0,1]);
}

function sun(){
    installModel(objects[5]);
    currentModelNumber = 5;

    gl.uniform4f(u_diffuseColor, 1,1,0,1);
    update_uniform(modelview,projection, 5);
}

function tree(size, loc){
    translate(modelview, modelview, [loc[0],loc[1],0]);
    scale(modelview, modelview, [size,size,size]);

    installModel(objects[6]);
    currentModelNumber = 6;

    translate(modelview, modelview, [0,0,0.2]);
    gl.uniform4f(u_diffuseColor, 0.44921,0.28906,0.109375,1);

    update_uniform(modelview,projection, 6);
    translate(modelview, modelview, [0,0,-0.2]);

    installModel(objects[7]);
    currentModelNumber = 7;
    translate(modelview, modelview, [0,0,0.9]);
    gl.uniform4f(u_diffuseColor, 0.1875,0.5,0.078125,1);
    update_uniform(modelview,projection, 7);
    translate(modelview, modelview, [0,0,-0.9]);

    scale(modelview, modelview, [1/size,1/size,1/size]);
    translate(modelview, modelview, [-loc[0],-loc[1],0]);
}

function forest(){
    tree(1, [2.6,2.6]);
    tree(0.7, [-0.9,0.8]);
    tree(1.2, [0.8,0]);
    tree(1.1, [-0.9,-1.2]);
    tree(0.4, [-0.5,-3.5]);
    tree(0.6, [-1.2,3.5]);
    tree(0.6, [3.8,0]);
    tree(0.4, [3.6,0.3]);
    tree(0.4, [3.7,-0.3]);
}

function lamp(){
    installModel(objects[5]);
    currentModelNumber = 5;

    translate(modelview, modelview, [0,0,1.2]);
    scale(modelview, modelview, [0.3,0.3,0.3]);
    gl.uniform4f(u_diffuseColor, 0.16016,0.140625,0.12890625,1);
    update_uniform(modelview,projection, 5);
    scale(modelview, modelview, [10/3,10/3,10/3]);
    translate(modelview, modelview, [0,0,-1.2]);

    installModel(objects[6]);
    currentModelNumber = 6;
    translate(modelview, modelview, [0,0,0.6]);
    scale(modelview, modelview, [0.5,0.5,3]);
    gl.uniform4f(u_diffuseColor, 0.5,0.53906,0.52734,1);
    update_uniform(modelview,projection, 6);
    scale(modelview, modelview, [2,2,1/3]);
    translate(modelview, modelview, [0,0,-0.6]);


}


function draw() { 
    gl.clearColor(0.15,0.15,0.3,1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(projection,Math.PI/5,1,10,20);   
    modelview = rotator.getViewMatrix();

    //car model
    rotate(modelview, modelview, degToRad(-theta), [0,0,1]);
    translate(modelview, modelview, [2.65,0,0]);
    scale(modelview, modelview, [0.8,0.8,1]);
    car();
    scale(modelview, modelview, [1.25,1.25,1]);
    translate(modelview, modelview, [-2.65,0,0]);
    rotate(modelview, modelview, degToRad(theta), [0,0,1]);
    
    //sun model
    rotate(modelview, modelview, degToRad(-alpha), [0,1,0]);
    translate(modelview, modelview, [0,0,5]);
    sun();
    translate(modelview, modelview, [0,0,-5]);
    rotate(modelview, modelview, degToRad(alpha), [0,1,0]);

    gl.uniform4f(u_lightPosition, 0, sun_x, sun_z, 1);
    console.log(sun_x, ' ', sun_z);


    //lamp model
    lamp();


    //platform model
    platform();
    forest();


}

function update_uniform(modelview,projection,currentModelNumber){

    mat3.normalFromMat4(normalMatrix, modelview);
    
    gl.uniformMatrix3fv(u_normalMatrix, false, normalMatrix);
    gl.uniformMatrix4fv(u_modelview, false, modelview );
    gl.uniformMatrix4fv(u_projection, false, projection );   
    gl.drawElements(gl.TRIANGLES, objects[currentModelNumber].indices.length, gl.UNSIGNED_SHORT, 0);
}

function installModel(modelData) {
     gl.bindBuffer(gl.ARRAY_BUFFER, a_coords_buffer);
     gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
     gl.vertexAttribPointer(a_coords_loc, 3, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(a_coords_loc);

     gl.bindBuffer(gl.ARRAY_BUFFER, a_normal_buffer);
     gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);
     gl.vertexAttribPointer(a_normal_loc, 3, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(a_normal_loc);

     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,index_buffer);
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
}


function initGL() {
    var prog = createProgram(gl,"vshader-source","fshader-source");
    gl.useProgram(prog);
    a_coords_loc =  gl.getAttribLocation(prog, "a_coords");
    a_normal_loc =  gl.getAttribLocation(prog, "a_normal");
    u_modelview = gl.getUniformLocation(prog, "modelview");
    u_projection = gl.getUniformLocation(prog, "projection");
    u_normalMatrix =  gl.getUniformLocation(prog, "normalMatrix");
    u_lightPosition=  gl.getUniformLocation(prog, "lightPosition");
    u_diffuseColor =  gl.getUniformLocation(prog, "diffuseColor");
    u_specularColor =  gl.getUniformLocation(prog, "specularColor");
    u_specularExponent = gl.getUniformLocation(prog, "specularExponent");
    a_coords_buffer = gl.createBuffer();
    a_normal_buffer = gl.createBuffer();
    index_buffer = gl.createBuffer();
    gl.enable(gl.DEPTH_TEST);
    gl.uniform3f(u_specularColor, 0.5, 0.5, 0.5);
    gl.uniform4f(u_diffuseColor, 0, 0, 0, 1);
    gl.uniform1f(u_specularExponent, 4);
    //gl.uniform4f(u_lightPosition, 0, 0, 0, 1);
}

function createProgram(gl, vertexShaderID, fragmentShaderID) {
    function getTextContent( elementID ) {
            
        var element = document.getElementById(elementID);
        var node = element.firstChild;
        var str = "";
        while (node) {
            if (node.nodeType == 3)
                str += node.textContent;
            node = node.nextSibling;
        }
        return str;
    }
    try {
        var vertexShaderSource = getTextContent( vertexShaderID );
        var fragmentShaderSource = getTextContent( fragmentShaderID );
    }
    catch (e) {
        throw "Error: Could not get shader source code from script elements.";
    }
    var vsh = gl.createShader( gl.VERTEX_SHADER );
    gl.shaderSource(vsh,vertexShaderSource);
    gl.compileShader(vsh);
    if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
        throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
     }
    var fsh = gl.createShader( gl.FRAGMENT_SHADER );
    gl.shaderSource(fsh, fragmentShaderSource);
    gl.compileShader(fsh);
    if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
       throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
    }
    var prog = gl.createProgram();
    gl.attachShader(prog,vsh);
    gl.attachShader(prog, fsh);
    gl.linkProgram(prog);
    if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
       throw "Link error in program:  " + gl.getProgramInfoLog(prog);
    }
    return prog;
}

function init() {
    try {
        var canvas = document.getElementById("myGLCanvas");
        gl = canvas.getContext("webgl") || 
                         canvas.getContext("experimental-webgl");
        if ( ! gl ) {
            throw "Browser does not support WebGL";
        }
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not get a WebGL graphics context.</p>";
        return;
    }

    try {
        initGL();
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML =
            "<p>Sorry, could not initialize the WebGL graphics context:" + e + "</p>";
        return;
    }

    rotator = new TrackballRotator(canvas, draw, 15);

    //change view angle
    //rotate(modelview, modelview, degToRad(20), [0,1,0]);


    draw();
    document.getElementById("my_gl").checked = false;
    document.getElementById("my_gl").onchange = tick;
    tick();
    
}

function tick() {
	if(document.getElementById("my_gl").checked){

    requestAnimFrame(tick);

    theta += 1;
    theta %= 360;
    //console.log(theta);

    beta += 10;
    beta %= 360;

    alpha += 1;
    alpha %= 360;

    sun_x = 5*Math.sin(degToRad(alpha-270));
    sun_z = 5*Math.cos(degToRad(alpha-270));
    //rotate(modelview, modelview, degToRad(20), [0,1,0]);
    draw();
    //animate();
}
}






