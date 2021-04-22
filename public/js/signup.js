console.log("all okk");
const submit= document.getElementById("submit");
function validation(){
    var name=document.getElementById("name").value.trim();
    var branchName=document.getElementById("BranchName").value.trim()
    var phoneNumber=document.getElementById("phoneNumber").value.trim()
    var password =document.getElementById("password").value.trim()
    var conform=document.getElementById("passwordConfirmation").value.trim()
    var email=document.getElementById("email").value.trim()
    var c=document.getElementById("checking")
    if(name ==="" && branchName==="" && phoneNumber==="" && password==="" && conform==="" && email===""){
        c.innerHTML="<b>Fill the form</b>";
        c.classList.add("alert-danger");
        return false;
    }
    if(name==="" || name.length<=2){
        c.innerHTML="<b>**Enter Your Name Correctly **</b>";
        c.classList.add("alert-danger");
        return false;
    }

    var letters = /^[ A-Za-z]+$/
    if(!name.match(letters)){
        c.innerHTML="<b>Correctly fill your name</b>";
        c.classList.add("alert-danger");
        return false;
    }

    if(branchName===""){
        c.innerHTML="<b>Enter Your branch Name </b>";
        c.classList.add("alert-danger");
        return false;
    }

    if(password===""){
        c.innerHTML="<b>** Enter Password</b>";
        c.classList.add("alert-danger");
        return false;
    }

    if(conform===""){
        c.innerHTML="<b>**Enter Conformation BOX**</b>";
        c.classList.add("alert-danger");
        return false;
    }

    if(isNaN(phoneNumber)==true){
        c.innerHTML="<b>Wrong NUMBER</b>";
        c.classList.add("alert-danger");
        return false;
    }

    if(phoneNumber==="" || phoneNumber.length!=10){
        c.innerHTML="<b>Enter your Number Correctly</b>";
        c.classList.add("alert-danger");
        return false;
    }

    if(password!=conform){
        c.innerHTML="<b>Check Your password</b>";
        c.classList.add("alert-danger");
        return false;
    }

    if(password.length<6){
        c.innerHTML="<b>Password is to Short</b>";
        c.classList.add("alert-danger");
        return false;
    }
    if(email===""){
        c.innerHTML="<b>Enter Your Email id </b>";
        c.classList.add("alert-danger");
        return false;
    }
    if(email.indexOf('@')<=0){
        c.innerHTML="<b>Invalid Email id</b>";
        c.classList.add("alert-danger");
        return false;
    }
    if((email.charAt((email.length-4))!='.') && (email.charAt((email.length-3))!='.')){
        c.innerHTML="<b>Invalid Email id</b>";
        c.classList.add("alert-danger");
        return false;
    }
    return true;
}
submit.addEventListener('click',(event)=>{
    event.preventDefault();
    if(validation()){
        swal("You have Successfully Register", "You clicked the button!", "success");  
        var name=document.getElementById("name").value=''
        var branchName=document.getElementById("BranchName").value=''
        var phoneNumber=document.getElementById("phoneNumber").value=''
        var password =document.getElementById("password").value=''
        var conform=document.getElementById("passwordConfirmation").value=''
        var email=document.getElementById("email").value=''
    }
})