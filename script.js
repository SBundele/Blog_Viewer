const wrapper = document.getElementById("wrapper");
const dropdown = document.getElementById('users');
const commentContainer = document.getElementById('comments');
const asc_btn = document.getElementById("asc");
const des_btn = document.getElementById("des");

let api_url = "https://jsonplaceholder.typicode.com/posts";
let user_api_url = "https://jsonplaceholder.typicode.com/users";

function card(post){
    let div = document.createElement("div");
    let h2 = document.createElement("h2");
    let p = document.createElement("p");

    div.classList.add("card", "px-4", "py-3", 'col-lg-3', "bg-dark", "text-white")
    div.setAttribute("data-id", post.id);
    div.setAttribute("data-user-id", post.userId);
    h2.innerText = post.title;
    p.innerText = post.body;

    div.append(h2, p)

    return div
}


function createCommentBox(comment){
    let div = document.createElement('div');
    let name_p = document.createElement('p');
    let email_p = document.createElement('p');
    let body_p = document.createElement('p');

    name_p.innerText = "Name: " + comment.name;
    email_p.innerText = "Email: " + comment.email;
    body_p.innerText = "Comment: " + comment.body;

    div.append(name_p, email_p, body_p)
    div.classList.add("border", "px-3", "py-2", "w-50")

    return div
}

function renderComments(comments){
    let p = document.createElement('p')
    p.innerText = "Comments:"
    p.classList.add("fw-bold")
    commentContainer.append(p)
    comments.forEach((comment) => {
      let commentBox = createCommentBox(comment);
      commentContainer.append(commentBox);
    });
}

async function fetchComments(url){
    try {
       let res = await fetch(url);
       let data = await res.json();
       renderComments(data)  
    } catch (error) {
        console.log(error);
    }
}

function createCards(posts){
    wrapper.innerHTML = ""
    posts.forEach((post) => {
        let cardDiv = card(post)
        wrapper.append(cardDiv);

        cardDiv.addEventListener('click', () => {
            wrapper.innerHTML = "";
            let post_card = card(post)
            wrapper.append(post_card);
            fetchComments(`${api_url}/${post.id}/comments`)
        })
    })
}

function createDropdown(users){
    users.forEach((user) => {
        let option = document.createElement("option");
        option.value = user.id;
        option.innerText = user.name;
        dropdown.append(option);
    })
}

async function fetchPosts(url){
    try{
        let res = await fetch(url);
        let data = await res.json();
        localStorage.setItem("posts", JSON.stringify(data))
        createCards(data)
    } catch (Error) {
        console.log(Error)
    }
}

async function fetchUsers(url){
    try{
        let res = await fetch(url);
        let data = await res.json();
        createDropdown(data)
    } catch (Error) {
        console.log(Error)
    }
}

fetchUsers(user_api_url)
fetchPosts(api_url)

dropdown.addEventListener("change", (e) => {
    let user_id =  e.target.value;
    if (user_id === 'selected') {
        fetchPosts(`${api_url}`);
    } else {
        fetchPosts(`${api_url}?userId=${user_id}`)
    }
})

asc_btn.addEventListener("click", () => {
    let current_posts = JSON.parse(localStorage.getItem("posts"))
    current_posts.sort((a,b) => {
      if (a.title < b.title) {
        return -1;
      } else {
        return 1;
      }
    })
    createCards(current_posts)
})

des_btn.addEventListener("click", () => {
  let current_posts = JSON.parse(localStorage.getItem("posts"));
  current_posts.sort((a, b) => {
    if (a.title > b.title){
        return -1
    } else {
        return 1
    }
  });
  createCards(current_posts);
});