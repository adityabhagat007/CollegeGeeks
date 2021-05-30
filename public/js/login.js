console.log("all okk");

const submit=document.getElementById('submit');
function validation(){

    var email=document.getElementById('email').value.trim();
    var password= document.getElementById('password').value.trim();
    var c=document.getElementById("checking");
    if(email==="" && password===""){
        alert("Fill the form")
        return false;
    }
    if(email===""){
        alert("Enter the email");
        return false;
    }
    if(password === ""){
        alert("enter the password");
        return false;
    }
    if(email.indexOf('@')<=0){
        alert("Enter your email id correctly")
        return false;
    }
    if((email.charAt((email.length-4))!='.') && (email.charAt((email.length-3))!='.')){
        alert("Invalid Id")
        return false;
    }
};
