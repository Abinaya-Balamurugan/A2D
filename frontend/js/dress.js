const dresses=[

{
id:1,
name:"Blue Kurti",
price:"₹1499",
category:"Women",
image:"frontend/image/dress1.jpg"
},

{
id:2,
name:"Men Shirt",
price:"₹999",
category:"Men",
image:"frontend/image/dress2.jpg"
},

{
id:3,
name:"Saree",
price:"₹2999",
category:"Traditional",
image:"frontend/image/dress3.jpg"
},

{
id:4,
name:"Western Dress",
price:"₹1999",
category:"Western",
image:"images/dresses/dress4.jpg"
},

{
id:5,
name:"Lehenga",
price:"₹3999",
category:"Traditional",
image:"images/dresses/dress5.jpg"
},

{
id:6,
name:"T-Shirt",
price:"₹699",
category:"Men",
image:"images/dresses/dress6.jpg"
}

];

function display(data){

const container=document.getElementById("dressContainer");

container.innerHTML="";

data.forEach(d=>{

container.innerHTML+=`

<div class="card">

<img src="${d.image}">

<div class="info">

<h3>${d.name}</h3>

<p>${d.price}</p>

<button onclick="selectDress(${d.id})">

Try On

</button>

</div>

</div>

`;

});

}

display(dresses);

function filterDress(category){

if(category==="All"){

display(dresses);

return;

}

display(dresses.filter(d=>d.category===category));

}

document.getElementById("search").addEventListener("keyup",(e)=>{

const value=e.target.value.toLowerCase();

display(

dresses.filter(d=>

d.name.toLowerCase().includes(value)

)

);

});

function selectDress(id){

localStorage.setItem("dressID",id);

window.location.href="tryon.html";

}