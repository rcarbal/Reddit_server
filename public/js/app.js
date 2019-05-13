function setupToggleAndClicklistener() {
  console.log("CALLED setupToggleAndClickListener");
  $(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

  $(document).ready(function () {
    $('#side-menu-btn').on('click', function () {
      toggleSidebar();
      $(this).blur();
      console.log('tooltips setup')
    });

  });

  $(document).ready(function () {
    $('#side-close').on('click', function () {
      toggleSidebar();
      console.log("tooltip for sidebar clicklistener setup")
    });

  });

  function toggleSidebar() {
    $('.sidebar').toggleClass('sidebar--not_active');
    $('.content').toggleClass('content--active_sidebar');
  }
}


// GET THE REDDIT RESPONSE
function loadDoc() {
  console.log("CALLED JSON")
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      convertToJSON(this.responseText);
    }
  };
  xhttp.open("GET", "/index/json", true);
  xhttp.send();
}



//CONVERT RESPONSE TO JSON
function convertToJSON(response) {
  let json = JSON.parse(response);
  parseJsonToArray(json);

}

//RETRIVES THE POST OBJECT FROM JSON RESPONSE
function parseJsonToArray(jsonObject) {
  console.log("CALLED parseJsonToArray");
  let returnArr = [];
  for (let i = 0; i < jsonObject.length; i++) {
    let post = {};
    post.author = jsonObject[i]["author"];
    post._id = jsonObject[i]["_id"];
    post.created = jsonObject[i]["created"];
    post.subreddit_name_prefixed = jsonObject[i]["subreddit_prefix"];
    post.url = jsonObject[i]["url"];
    post.title = jsonObject[i]["title"];
    post.hint = jsonObject[i]["hint"];
    post.thumbnail = jsonObject[i]["thumbnail"];
    if (checkJsonProperty(jsonObject[i], "fallback")) {
      post.fallback_url = jsonObject[i]["fallback"];
    }

    returnArr.push(post);
  }

  appendPostToList(returnArr);
}

function appendPostToList(arr) {
  console.log("INSIDE APPEND");
  let list = document.querySelector(".post-list");
  for (let i = 0; i < arr.length; i++) {
    let post = createPostElement();
    let vote = createPostVote()
    let postInfo = createPostInfoSection(arr[i])
    let postBody = createPostBody(arr[i]);
    let postFooter = createPostFooter(arr[i]["_id"])

    post.appendChild(vote);
    post.appendChild(postInfo);
    postInfo.appendChild(postBody);
    postInfo.appendChild(postFooter);
    list.appendChild(post);
  }


}

function createPostElement() {
  //FULL Container
  let postCont = document.createElement("li");
  postCont.className = "post-list__post";

  return postCont;
}

function createPostVote() {
  //Vote container
  let vote = document.createElement("div");
  vote.className = "post-list__post__post-vote";

  //Vote up
  let voteUp = document.createElement("div");
  voteUp.className = "post-list__post__post-vote__up-vote";
  let upImg = document.createElement("li");
  upImg.className = "fas fa-arrow-up";

  voteUp.appendChild(upImg);
  vote.appendChild(voteUp);

  //Vote count
  let voteCount = document.createElement("div");
  voteCount.className = "post-list__post__post-vote__up-vote";
  voteCount.innerText = " 20.4K";

  vote.appendChild(voteCount);

  //Vote down
  let voteDown = document.createElement("div");
  voteDown.className = "post-list__post__post-vote__down-vote";
  let downImg = document.createElement("li");
  downImg.className = "fas fa-arrow-down";
  voteDown.append(downImg);

  vote.appendChild(voteDown);

  return vote;
}

function createPostInfoSection(postInfo) {

  //Post Section
  let postSection = document.createElement("div");
  postSection.className = "post-list_post__post-container"

  // Post Header
  let header = createPostHeader(postInfo);
  postSection.appendChild(header);
  //post body

  //post footer
  return postSection;

}

function createPostHeader(postInfo) {
  let header = document.createElement("div");
  header.className = "post-list_post__post-container__header post-list_post__post-container--padding";

  //Reddit image
  let reditPic = document.createElement("span");
  let reditImg = document.createElement("img");
  reditImg.src = "https://styles.redditmedia.com/t5_2qh1i/styles/communityIcon_tijjpyw1qe201.png";
  reditImg.className = "post-list_post__post-container__header__img pr-2";
  reditPic.appendChild(reditImg);
  header.appendChild(reditPic);

  //Reddit Section
  let redditSection = document.createElement("span");
  redditSection.className = "font-weight-bold pr-2";
  redditSection.innerText = postInfo["subreddit_name_prefixed"];
  header.appendChild(redditSection);

  // Posted Text
  let redditPostedText = document.createElement("span");
  redditPostedText.innerText = "Posted by";
  redditPostedText.classNamem = "pr-2";
  header.appendChild(redditPostedText);

  //Post Author
  let postAuthor = document.createElement("span");
  postAuthor.innerText = postInfo["author"];
  postAuthor.className = "pr-2";
  header.appendChild(postAuthor);

  //Posted time
  let redditPostedTime = document.createElement("span");
  redditPostedTime.innerText = postInfo["created"];
  redditPostedTime.className = "pr-2";
  header.appendChild(redditPostedTime);

  //Join Button
  let joinButton = document.createElement("button");
  joinButton.className = "btn btn-primary btn-sm float-right pr-3";
  joinButton.innerText = " + JOIN";
  header.appendChild(joinButton);

  return header;
}

function createPostBody(postInfo) {
  let textContainer = document.createElement("div");
  textContainer.className = "post-list_post__post-container__body post-list_post__post-container--padding";
  let text = document.createElement("span");
  text.innerText = postInfo["title"];
  text.className = "font-weight-bold";
  textContainer.appendChild(text);

  //If media is image
  if (checkPostHint(postInfo) === "image") {
    //URL 
    let img = document.createElement("img");
    img.src = postInfo = postInfo["url"];
    img.className = "img-fluid";
    img.alt = "Responsive image";

    textContainer.appendChild(img);
  } else if (checkPostHint(postInfo) === "link") {
    //Set Thumbnail
    let thumbnail = document.createElement("img");
    thumbnail.className = "rounded float-right";
    thumbnail.src = postInfo["thumbnail"];

    //Set link
    let link = document.createElement("a");
    link.href = postInfo["url"];
    link.className = "d-block";
    link.text = "CLICK";

    textContainer.appendChild(thumbnail);
    textContainer.appendChild(link);
  }
  else if (checkPostHint(postInfo) === "hosted:video") {
    //REMOVE THIS
    let textPlaceholder = document.createElement("div");
    textPlaceholder.innerText = " VIDEO_PLACEHOLDER";
    textContainer.appendChild(textPlaceholder);

    if (checkFallbackUrl(postInfo)) {
      let video = document.createElement("iframe");
      // let videoSource = document.createElement("source");
      video.src = postInfo["fallback_url"];
      // video.appendChild(videoSource);


      textContainer.appendChild(video);
    }


  }

  return textContainer;

}

function createPostFooter(id) {
  //Footer container
  let footer = document.createElement("div");
  footer.className="post-list_post__post-container__footer post-list_post__post-container--padding";
  
  let userInput = document.createElement("span");
  userInput.className="share-section";

  // COMMENT SECTION
  let commentSpan = document.createElement("span");
  let commentIconSpan = document.createElement("span");
  commentIconSpan.className = "mr-2";

  let commentIcon = document.createElement("i");
  commentIcon.className = "fas fa-comment-alt"

  let commentText = document.createElement("span");
  commentText.innerText = "3.2k";
  commentText.className ="mr-1"

  let commentString = document.createElement("span");
  commentString.innerText = "Comments"

  // SHARED SECTION
  let shareSection = document.createElement("span");
  let shareSpan = document.createElement("span");
  shareSpan.className = "ml-2";

  let shareIcon = document.createElement("i");
  shareIcon.className = "fas fa-share";

  let shareString =document.createElement("span");
  shareString.innerText= "Share";
  shareString.className = "ml-1";

  //SAVE SECTION
  let saveSection = document.createElement("span");
  let saveSpan = document.createElement("span");
  let saveIcon = document.createElement("i");
  let saveString = document.createElement("span");

  saveSection.className ="ml-2";
  saveIcon.className ="far fa-bookmark";
  saveString.innerText = "Save";
  saveString.className ="ml-1";

  //Edit post
  let editBtn = document.createElement("a");
  editBtn.setAttribute('href', `/index/${id}/edit`);
  editBtn.className = "btn btn-primary btn-sm float-right pr-3";
  editBtn.innerText = "Edit";
  

  //Delete post
  let delBtn = document.createElement("a");
  delBtn.setAttribute('href', `/index/${id}/delete`);
  delBtn.className = "btn btn-danger btn-sm float-right ml-3";
  delBtn.innerText = "delete";
  
  

  //Append Comment section
  commentIconSpan.appendChild(commentIcon);
  commentSpan.appendChild(commentIconSpan);
  commentSpan.appendChild(commentText);
  commentSpan.appendChild(commentString);
  userInput.appendChild(commentSpan);

  //Append share section
  shareSpan.appendChild(shareIcon);
  shareSection.appendChild(shareSpan);
  shareSection.appendChild(shareString);
  userInput.appendChild(shareSection);

  //Apend share icon
  saveSpan.appendChild(saveIcon);
  saveSection.appendChild(saveSpan)
  saveSection.appendChild(saveString);
  userInput.appendChild(saveSection);

  //Append Edit/delete
  footer.appendChild(delBtn)
  footer.appendChild(editBtn)
  

  footer.appendChild(userInput);
  return footer


}

function checkPostHint(postInfo) {
  return postInfo["hint"];
}

function checkJsonProperty(item, property, subproperty1, subproperty2) {
  if (item.hasOwnProperty(property) && item[property] !== null) {
    return true;
  }
  return false;
}

function checkFallbackUrl(postInfo) {
  if (postInfo.hasOwnProperty("fallback_url")) {
    return true;
  }
}

setupToggleAndClicklistener();
loadDoc();



