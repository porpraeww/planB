function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
  }
  
  function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
  }

var newone=[]
var newtwo=[]
var newthree=[]
var newfour=[]

function add(){

var one=document.getElementById('one').value
var two=document.getElementById('two').value
var three=document.getElementById('three').value
var four=document.getElementById('four').value
newone.push(one);
newtwo.push(two);
newthree.push(three);
newfour.push(four);
listshow();
}

function listshow(){
var list=""
for(var i=0;i<newone.length;i++){
list+= "<tr><td>"+(i+1)+"</td>"+"<td>"+newone[i]+"</td>"+"<td>"+newtwo[i]+"</td>"+"<td>"+newthree[i]+"</td>"+"<td>"+newfour[i]+"</td>"+"<td>"+"<button onclick='edt("+i+")'>แก้ไข</button> <button onclick='del("+i+")'>ลบ</button>"+"</td></tr>"
}
document.getElementById('data').innerHTML=list

}

var load=""
function edt(edit){
load=edit
document.getElementById('one').value=newone[edit]
document.getElementById('two').value=newtwo[edit]
document.getElementById('three').value=newthree[edit]
document.getElementById('four').value=newfour[edit]

}

function update(){
newone[load]=document.getElementById('one').value
newtwo[load]=document.getElementById('two').value
newthree[load]=document.getElementById('three').value
newfour[load]=document.getElementById('four').value
listshow();

}

function del(dok){
newone.splice(dok,1)
newtwo.splice(dok,1)
newthree.splice(dok,1)
newfour.splice(dok,1)
listshow();
}

$('u').click(function(e){
  var result = confirm("คุณแน่ใจว่าต้องการลบ");
  if(!result) {
      e.preventDefault();
  }
});