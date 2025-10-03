var title = document.querySelector("h1");
title.innerHTML = "This is another title from code.js!";

var button = document.querySelector("#CV");
button.addEventListener("click", myfunction);

function myfunction(){
    alert("Let me tell you more about me!");
}

var mynode = document.createElement("div");
mynode.id = "work1_intro";
mynode.innerHTML = "The work is an exhibition";
mynode.style.color = "blue";

mynode.addEventListener("click", welcomeToWork1);

document.querySelector("#my_work1").appendChild(mynode);

function welcomeToWork1(){
    mynode.innerHTML = "Thank you for your interest in my work!";
}