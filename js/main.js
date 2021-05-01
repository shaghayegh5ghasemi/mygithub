function showprofile(){
    let username = document.getElementsByClassName("input-name")[0].value
    //if the username was not in the localstorage fetch the data
    if(localStorage.getItem(username) == null){
        fetch("https://api.github.com/users/" + username)
        .then(response => response.json())
        .then(data => {
            if(data.message == "Not Found") {
                remove("not-found")
                remove("disconnected")
                // if the desired username does not exist, create a paragraph to inform 
                var x = document.createElement("p")
                var t = document.createTextNode("<<The username you entered does not exist!>>")
                x.className = "not-found"
                x.appendChild(t)
                document.body.appendChild(x)
            }
            else{
                remove("not-found")
                remove("disconnected")
                updateInfo(data)
                localStorage.setItem(username, JSON.stringify(data))
            }
        })
        .catch(error => {
            // check if the internet is connected or not  
            remove("not-found")
            remove("disconnected")
            // if internet is disconnected, create a paragraph to inform 
            var x = document.createElement("p")
            var t = document.createTextNode("<<No Internet Connection!>>")
            x.className = "disconnected"
            x.appendChild(t)
            document.body.appendChild(x)
        })
    }
    //otherwise use the data in localstorage
    else{
        let data = localStorage.getItem(username)
        data = JSON.parse(data)
        remove("not-found")
        remove("disconnected")
        updateInfo(data)
    }
}

//update the info box from given information
function updateInfo(data){
    // change the profile photo and set the width
    if (data.avatar_url) document.getElementsByClassName("photo")[0].src = data.avatar_url
    // change the username
    if (data.login) document.getElementsByClassName("username")[0].innerHTML = data.login
    else document.getElementsByClassName("username")[0].innerHTML = "Usernam is not set"
    // change the blog
    if (data.blog) document.getElementsByClassName("blog")[0].innerHTML = data.blog
    else {document.getElementsByClassName("blog")[0].innerHTML = "Blog is not set"}
    // change the location
    if (data.location) document.getElementsByClassName("location")[0].innerHTML = data.location
    else document.getElementsByClassName("location")[0].innerHTML = "Location is not set"
    // change the bio
    if (data.bio) document.getElementsByClassName("bio")[0].innerHTML = reshapeBio(data.bio)
    else document.getElementsByClassName("bio")[0].innerHTML = "Bio is empty!"
    // favorite programming language
    getRepositories(data.repos_url, fav_language => {
        if(fav_language) document.getElementsByClassName("language")[0].innerHTML = fav_language
        else document.getElementsByClassName("language")[0].innerHTML = "Repository is empty"
    }) 
}

//for entering new username delete the previous result
function remove(name){
    var element = document.getElementsByClassName(name)[0];
    if(element != undefined){
        element.parentNode.removeChild(element);
    }
}

//reshape the bio string with it's newline
function reshapeBio(bio){
    let res = bio.split("\r\n")
    let i
    let text = ""
    for (i = 0; i < res.length; i++) {
        text += res[i] + "<br />"
    }
    return text
}

//The highest repetition of an language in last 5 repositories is the language with highest score
function getRepositories(repos_url, callback){
    var fav_language
    var pls = []
    fetch(repos_url + "?sort=pushed")
        .then(response => response.json())
        .then(data => {
            if(data.length >= 5){
                let i
                for (i = 0; i < 5; i++) {
                    if(data[i].language) pls.push(data[i].language)
                }
                fav_language = max_score(pls)
                callback(fav_language)
            }
            else{
                //if the repos contain less than 5 projects
                let i
                for (i = 0; i < data.length; i++) {
                    if(data[i].language) pls.push(data[i].language)
                }
                fav_language = max_score(pls)
                callback(fav_language)
            }
    })
}

//and this func returns the element with highest repetition
function max_score(arr1){
    var mf = 1;
    var m = 0;
    var item;
    for (var i = 0; i < arr1.length; i++){
        for (var j = i; j < arr1.length; j++){
            if (arr1[i] == arr1[j]) m++;
            if (mf <= m){
                mf = m; 
                item = arr1[i];
            }
        }
        m=0;
    }
    return item
 }