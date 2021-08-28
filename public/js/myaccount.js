window.onload=function(){


    let following = document.getElementById('following').textContent
    following = Number(following)
    let followers = document.getElementById('followers').textContent
    followers = Number(followers)
    let answered = document.getElementById('answered').textContent
    answered = Number(answered);
    let asked = document.getElementById('asked').textContent
    asked = Number(asked);

    
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['followers' ,'following', 'Answered', 'Asked'],
            datasets: [{
                label: '# of Actions',
                data: [followers,following ,answered ,asked ],
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            tooltips: {
                enabled: false,
            },
            animation:{
                duration: 1000,
                easing:'easeInOutCubic',
            },
            title : {
                display: true,
                text: "your activity",
            }
        },
    });
    document.querySelector('input[type=file]').addEventListener('change', function(){
    this.form.submit();
    });
    
    const showFollowing = document.getElementById("showfollowing");
    const showFollowers = document.getElementById("showfollowers");
    
    showFollowing.addEventListener("click" ,()=>{
         fetch('https://collegegeeks.herokuapp.com/mynetwork')
        .then((response)=>{
            return response.json();
        })
        .then((data)=>{

            document.getElementById("exampleModalLabel").innerHTML ="Following"
            // console.log(data.network.followings)
            const length = data.network.followings.length;
            data.network.followings.forEach(element => {
                console.log(element);
                let tag = document.createElement(`a`)
                let text = document.createTextNode(`${element.name}`);
                tag.appendChild(text);
                tag.title = `${element.name}`;
                console.log(element._id);
                tag.href = `/PublicProfile?userId=${element._id}`
                tag.classList.add("list-group-item")
                document.getElementById("following_name").appendChild (tag);
            });
            //
            console.log(data);
        })
        .catch((error)=>{
            console.log(error);
        })
    })
    let button = document.getElementById("close_button");
    button.addEventListener("click", ()=>{
        document.getElementById("following_name").remove();
        const id = document.createElement('div');
        id.setAttribute('id',"following_name");
        document.getElementById("modal_element").appendChild(id);
    })

    showFollowers.addEventListener("click" ,()=>{
        fetch('https://collegegeeks.herokuapp.com/mynetwork')
        .then((response)=>{
            return response.json();
        })
        .then((data)=>{
            // console.log(data.network.followings)
            const length = data.network.followers.length;
            data.network.followers.forEach(element => {
                //console.log(element);
                let tag = document.createElement(`a`)
                let text = document.createTextNode(`${element.name}`);
                tag.appendChild(text);
                tag.title = `${element.name}`;
                console.log(element._id);
                tag.href = `/PublicProfile?userId=${element._id}`
                tag.classList.add("list-group-item")
                document.getElementById("followers_name").appendChild (tag);
            });
            // 
            console.log(data);
        })
        .catch((error)=>{
            console.log(error);
        })
    })
    let button2 = document.getElementById("close_button2");
    button2.addEventListener("click", ()=>{
        document.getElementById("followers_name").remove();
        const id = document.createElement('div');
        id.setAttribute('id',"followers_name");
        document.getElementById("modal_element2").appendChild(id);
    })

}

