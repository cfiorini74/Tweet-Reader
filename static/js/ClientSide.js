
var list=[];
//Sets number of tweets to be shown on page
var count=0;
var max=20;
//Gets handle from page
function getHandle(){
    var handle= document.getElementById("handleType").value;
    return handle;
}
//Ajax's handle to server where it can be processed
function passHandle(){
    count=0;
    max=20;
    var handle=getHandle();
    var wait=document.getElementById("Waiting");
    if (wait.style.display == "none") {
        wait.style.display = "block";
    }
    var pass=JSON.stringify({"user":handle,
                            contentType:'Content-Type: application/json'});
   	// ajax the JSON to the server
    $.post({url: 'read', contentType: 'application/json', data: pass, success: function(data){
                                                                 recieveData(data,true);} });
}
//Recieves data from server. 
function recieveData(Content){
    list=Content;
    printList();
    if (list['author']=="INVALID_USERNAME"){//Checks if handle sent is valid
        $(usersTweets).empty();
        nameSpace=document.getElementById("nameSpace");
        nameSpace.innerHTML="Invalid Handle";
    }else{
        convertToTemplate();
    }
}
//Function to operate Date Button
function DateButton(){
    if (checkDatesSorted()==false){
        sortByDates();
        sortRev("Dates");
    }else{
        sortRev("Dates");
    }
    convertToTemplate();
}
//Function to operate Favorite Button
function FavButton(){
    if (checkFavSorted()==false){
        sortByFavorites();
        sortRev("Favorites");
    }else{
        sortRev("Favorites");
    }
    convertToTemplate();
}
//Function to operate Retweets Button
function RetweetsButton(){
    if (checkRetweetsSorted()==false){
        sortByRetweets();
        sortRev("Retweets");
    }else{
        sortRev("Retweets");
    }
    convertToTemplate();
}
//Function to sort by dates, done through insertion sort
function sortByDates(){
    var placeholder;
    var i=1;
    var r=1;
    var found=false;
    while (checkFavSorted()==false){
        for (i=1;i<list.length;i++){
            r=0;
            while (found==false&&r<=i){
                if (sortByDates(list[i].post_date, list[r].post_date)==1){
                    placeholder=list[i];
                    iterate=i-1;
                    while (iterate>=i-r){
                        list[iterate+1]=list[iterate];
                        iterate--;
                    }
                    list[i-r]=placeholder;
                    r=0;
                }
                else{
                    r++;
                }
            }
        }
    }
}
//Function to sort by favorites, done through insertion sort
function sortByFavorites(){
    var placeholder;
    var i=1;
    var r=1;
    var found=false;
    while (checkFavSorted()==false){
        for (i=1;i<list.length;i++){
            r=0;
            while (found==false&&r<=i){
                if (list[i-r].favorites>list[i].favorites){
                    placeholder=list[i];
                    iterate=i-1;
                    while (iterate>=i-r){
                        list[iterate+1]=list[iterate];
                        iterate--;
                    }
                    list[i-r]=placeholder;
                    r=0;
                }
                else{
                    r++;
                }
            }
        }
    }
}
//Function to sort by retweets, done through insertion sort
function sortByRetweets(){
    var placeholder;
    var i=1;
    var r=1;
    var found=false;
    while (checkRetweetsSorted()==false){
        for (i=1;i<list.length;i++){
            r=0;
            while (found==false&&r<=i){
                if (list[i-r].retweets>list[i].retweets){
                    placeholder=list[i];
                    iterate=i-1;
                    while (iterate>=i-r){
                        list[iterate+1]=list[iterate];
                        iterate--;
                    }
                    list[i-r]=placeholder;
                    r=0;
                }
                else{
                    r++;
                }
            }
        }
    }
}
//Reverses list
function sortRev(value){
    var placeholder;
    if (value!="Favorites"&&value!="Retweets"&&value!='Dates'){
        throw 'Specify data type to sort by';
    }
    if (value=="Favorites"&&checkFavSorted()==false){
        sortByFavorites();
    }
    if (value=="Retweets"&&checkRetweetsSorted()==false){
        sortByRetweets();
    }
    if (value=="Dates"&&checkDatesSorted()==false){
        sortByDates();
    }
    if(Array.isArray(list)){
        list.reverse();
    }
}
//Checks if favorites are sorted
function checkFavSorted(){
    if (list.length>1){
        for (var i=0; i<list.length-1; i++){
            if (list[i+1].favorites<list[i].favorites){
                return false;
            }
        }
    }   
    return true;
}
//Checks if retweets are sorted
function checkRetweetsSorted(){
    if (list.length>1){
        for (var i=0; i<list.length-1; i++){
            if (list[i+1].retweets<list[i].retweets){
                return false;
            }
        }
    }   
    return true;
}
//Checks if dates are sorted
function checkDatesSorted(){
    if (list.length>1){
        for (var i=0; i<list.length-1; i++){
            if (recentDate(list[i].post_date,list[i+1].post_date)==0
                ||recentDate(list[i].post_date,list[i+1].post_date)==-1){
                return false;
            }
        }
    }   
    return true;
}
//Prints list contents to console
function printList(){
    for (var i=0; i<list.length; i++){
        console.log(list[i]);
    }
}
//Replaces all @handle in text to links to actual twitter profile page
function replaceAts() {
    var replacer = function(match) {
      var id = match.substr(1);
  
      return`<a href="https://twitter.com/${id}" target="_blank">@${id}</a>`;
    };
  
    for (var i = 0; i < list.length; i++) {
      list[i].text = list[i].text.replace(/@\w+/g, replacer);
    }
  }
//Renders name of twitter user using mustache template
function renderName(){
    nameSpace.style.display="block";
    var HeadTemplate= "{{author}} {{{br}}}";
    var attach= Mustache.render(HeadTemplate,list[0]);
    document.getElementById("name").innerHTML="";
    document.getElementById("name").append(attach);
    var url="https://twitter.com/"+list[0].author;
    document.getElementById("name").href=url;
    document.getElementById("name").target="_blank";
    var usersTweets=document.getElementById("usersTweets");
}
//Converts JSON data into visible format on page, 20 tweets at a time.
function convertToTemplate(){
    if(Array.isArray(list)==false){
        return;
    }
    var wait=document.getElementById("Waiting");
    var nameSpace=document.getElementById("nameSpace");
    renderName();

    $(usersTweets).empty();
    replaceAts();
    for (var i=0; i<max; i++){
        if (i<list.length){
        var ancestor= document.createElement("article");
        ancestor.className=("media");
        usersTweets.appendChild(ancestor);
        
        figure=document.createElement("figure");
        figure.className="media-left";
        p=document.createElement("p");
        p.className="image is-64x64";
        profilePic=document.createElement("img");
        profilePic.src=list[i].profile_picture;
        figure.appendChild(p);
        ancestor.appendChild(figure);
        p.appendChild(profilePic);        
        
        var textTemplate="{{text}}";

        attach= Mustache.render(textTemplate,list[i]);
        attach=document.createTextNode(attach);
        
        var textParent=document.createElement("div");
        textParent.className="media-content";
        var textChild=document.createElement("div");
        textChild.className="content";
        var textBox=document.createElement("p");
        
        var linkBox=document.createElement("a");
        linkBox.href="https://twitter.com/"+list[0].author+"/status/"+list[i].status_id;
        textBox.appendChild(linkBox);
        linkBox.innerText="@"+list[0].author;
        linkBox.appendChild(document.createElement("br"));
        linkBox.target="_blank";
        
        const doc = new DOMParser().parseFromString(attach.nodeValue, "text/html");
        attach=doc.documentElement.textContent;

        ancestor.appendChild(textParent);
        textChild.appendChild(textBox);
        textParent.appendChild(textChild);
        textBox.innerHTML+=attach;


        var statsChild=document.createElement("div");
        var statsParent=document.createElement("div");
        statsParent.className="level is-mobile";
        textParent.appendChild(statsParent);

        var statsTemplate="Date: {{post_date.date}} Favorites: {{favorites}} Retweets: {{retweets}}";
        attach= Mustache.render(statsTemplate,list[i]);
        attach=document.createTextNode(attach);
        statsParent.appendChild(statsChild);
        statsChild.appendChild(attach);
        statsChild.className="level-left";

        setImages(list[i],ancestor);
        }
    }
    count+=20;
    max+=20;
    if (count>list.length){
        document.getElementById("requestMore").style.display="none";
        var end=document.createTextNode("There are no more tweets left to display");
        end.id="end";
        document.getElementById("usersTweets").appendChild(end);
    }else{
        if (document.getElementById("requestMore").style.display=="none"){
            document.getElementById("requestMore").style.display=="block"
        }
        $(end).remove();
    }
    if (wait.style.display == "block") {
        wait.style.display = "none";
    }
}
//Checks if images were sent in JSON, and if so, inserts them into format
function setImages(element,ancestor){
    if (element.image_one!='NO_URL'){
        var header=document.createElement("header");
        ancestor.appendChild(header);
        var imgParent=document.createElement("div");
        var linkPiece=document.createElement("a");
        linkPiece.href=element.image_one;
        linkPiece.target="_blank";
        var imgPiece=document.createElement('img');
        imgPiece.src=element.image_one;
        header.appendChild(imgParent);
        imgParent.appendChild(linkPiece);
        linkPiece.appendChild(imgPiece);
    }
    if (element.image_two!='NO_URL'){
        var header=document.createElement("header");
        ancestor.appendChild(header);
        var imgParent=document.createElement("div");
        var linkPiece=document.createElement("a");
        linkPiece.href=element.image_two;
        linkPiece.target="_blank";
        var imgPiece=document.createElement('img');
        imgPiece.src=element.image_two;
        header.appendChild(imgParent);
        imgParent.appendChild(linkPiece);
        linkPiece.appendChild(imgPiece);
    }
    if (element.image_three!='NO_URL'){
        var header=document.createElement("header");
        ancestor.appendChild(header);
        var imgParent=document.createElement("div");
        var linkPiece=document.createElement("a");
        linkPiece.href=element.image_three;
        linkPiece.target="_blank";
        var imgPiece=document.createElement('img');
        imgPiece.src=element.image_three;
        header.appendChild(imgParent);
        imgParent.appendChild(linkPiece);
        linkPiece.appendChild(imgPiece);
    }
    if (element.image_four!='NO_URL'){
        var header=document.createElement("header");
        ancestor.appendChild(header);
        var imgParent=document.createElement("div");
        var linkPiece=document.createElement("a");
        linkPiece.href=element.image_four;
        linkPiece.target="_blank";
        var imgPiece=document.createElement('img');
        imgPiece.src=element.image_four;
        header.appendChild(imgParent);
        imgParent.appendChild(linkPiece);
        linkPiece.appendChild(imgPiece);
    }
}
//Determine which date parameter is the most recent (awful style but necessary)
function recentDate(date1, date2){
    if (date1.year>date2.year){
        return -1;
    }else if (date2.year>date1.year){
        return 1;
    }else{
        if (date1.month>date2.month){
            return -1;
        }
        if (date2.month>date1.month){
            return 1;
        }else{
            if (date1.day>date2.day){
                return -1;
            }
            if (date2.day>date1.day){
                return 1;
            }else{
                if (date1.hour>date2.hour){
                    return -1;
                }
                if (date2.hour>date1.hour){
                    return 1;
                }else{
                    if (date1.minute>date2.minute){
                        return -1;
                    }
                    if (date2.minute>date1.minute){
                        return 1;
                    }else{
                        if (date1.second>date2.second){
                            return -1;
                        }
                        if (date2.second>date1.second){
                            return 1;
                        }else{
                            return 0;
                        }
                    }
                }

            }
        }
    }
}

 