const urlBase = 'http://friendsbydaylight.xyz/api';
const extension = '.php';

let userFirstName = "";
let userLastName = "";
let userId = 0;
let user = {
    first: '',
    last: '',
    id: -1,
};


const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    }
    return user;
}



let contacts = [];

 const doLogin = () => {
    console.log("doLogin() called");
    userId = 0;
    userFirstName = "";
    userLastName = "";
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let tmp = {login:email,password:password};
    let jsonPayload = JSON.stringify( tmp );
    const url = urlBase + '/login' + extension;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            console.log(xhr.responseText);
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse( xhr.responseText );
                console.log(jsonObject);
                userId = jsonObject.id;
                if(userId < 1)
                {
                    console.log("User/Password combination incorrect");
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }
                userFirstName = jsonObject.firstName;
                userLastName = jsonObject.lastName;
                saveCookie();
                window.location.href = "contacts.html";
                makeSuccessNotification("Logged In Successfully")

            }
        };
        xhr.send(jsonPayload);
    } catch(err)
    {
        console.log(err.message);
        document.getElementById("loginResult").innerHTML = err.message;
    }
}
const saveCookie = () => {
    const minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + userFirstName + ",lastName=" + userLastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

const readCookie = () => {
    console.log("readCookie() called");
    userId = -1;
    userFirstName = "";
    userLastName = "";
    const data = document.cookie;
    console.log("data: " + data);
    const splits = data.split(',');
    for(let i = 0 ; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split('=');
        if( tokens[0] == "firstName" )
		{
			userFirstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			userLastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}

    }
    if(userId < 0) {
        window.location.href = "index.html";
        return false;
    } else {
        document.getElementById("userName").innerHTML = "Logged in as " + userFirstName + " " + userLastName;
        return true;
    }
}

const logout = () => {
    userId = 0;
    userFirstName = "";
    userLastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
    
}

const createContact = (contact) => {
    const container = document.getElementById('contact-container');
    const div = document.createElement('div');
    const delBtn = document.createElement('button');
    const editBtn = document.createElement('button');
    const actionBtns = document.createElement('div');
    actionBtns.classList.add('action-btns');
    div.classList.add('contact-list-item');
    div.setAttribute('id', contact.contactId);
    const name = contact.firstName + " " + contact.lastName
    
    div.innerHTML = `
        <p>${name}</p>
        <p>${contact.email}</p>
        <p>${contact.phone}</p>
        <p>${contact.date}</p>
    `;
    editBtn.innerHTML = `<i id=${contact.contactId} class="fa-solid fa-pen-to-square"></i>`;
    editBtn.classList.add('action-btn');
    editBtn.setAttribute('id', contact.id);
    editBtn.addEventListener('click', (e) => showEditContact(e.target.getAttribute("id")));
    div.appendChild(actionBtns);
    delBtn.innerHTML = `<i id=${contact.contactId}  class="fa-solid fa-trash"></i>`;
    delBtn.classList.add('action-btn');
    delBtn.setAttribute('id', contact.contactId);
    delBtn.addEventListener('click', (e) => deleteContact(e.target.getAttribute("id")));
    actionBtns.appendChild(editBtn);
    actionBtns.appendChild(delBtn);
    container.appendChild(div);
}

const searchContacts = () => {
    const search = document.getElementById('search')
    let searchQuery = ""
    if(!search.value == ""){
        searchQuery = document.getElementById('search').value;
    }
    const container = document.getElementById('contact-container');
    if(container.hasChildNodes()){
        const length = container.children.length;
        for(let i = 0; i < length; i++){
            container.children[0].remove();
        }

    }
    
    contacts = [];
    //Send searchQuery to backend
    fetchContacts(userId, searchQuery);
    console.log("searching for " + searchQuery);
   
     

}


const renderContacts = () => {
    contacts.forEach(contact => createContact(contact));
    }
const deleteContact = (id) => {
    const tmpid = parseInt(id)
    const tmp = {id:tmpid};
    console.log(tmp)
    const search = document.getElementById('search').value;
    let jsonPayload = JSON.stringify( tmp );
    const url = urlBase + '/delete' + extension;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {

                
                deRenderContacts();
                searchContacts();
                makeSuccessNotification("Contact Has Been Deleted")
            }
        }
        xhr.send(jsonPayload);
    } catch(err) {
        makeErrorNotification("Error Deleting Contact")
    }
    console.log("deleting " + id);
}
const editContact = () => {
    const first = document.getElementById("editfirstName").value;
    const last = document.getElementById("editlastName").value;
    const email = document.getElementById("editEmail").value;
    const phone = document.getElementById("editPhone").value;
    const idInput = document.getElementById("editContactId").value;
    if(first == "" || last== ""|| email == "" || phone == ""){
        makeErrorNotification("Cannot Submit Empty Value");
        return;
    }
    const tmp = {id:parseInt(idInput), firstName:first, lastName:last, email:email, phone:phone};
    let jsonPayload = JSON.stringify( tmp );
    console.log(jsonPayload)
    const url = urlBase + '/update' + extension;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                makeSuccessNotification("Contact Updated Successfully")
                showEditContact(0)
                searchContacts()
                

            }
        };
        xhr.send(jsonPayload);
    } catch(err)
    {
        makeErrorNotification(err.message);
    }
    
}
const deRenderContacts = () => {
    const container = document.getElementById('contact-container');
    const length = container.children.length;
    for(let i = 0; i < length; i++){
        container.children[0].remove();
    }
    contacts = [];
}
const fetchContacts = (user, searchParams) => {
    //fetch contacts from backend
    let tmp = {query:searchParams,id:user};
	let jsonPayload = JSON.stringify( tmp );
    console.log("userId: ", user)
    let returnData = [];

	let url = urlBase + '/search' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				contacts = JSON.parse(xhr.response);
                console.log(contacts);
                renderContacts();
			}
            
		};
        xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
    

}
const doSignup = () => {
    const firstName = document.getElementById('signupFirst').value;
    const lastName = document.getElementById('signupLast').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const tmp = {firstName:firstName,lastName:lastName,login:email,password:password};
    let jsonPayload = JSON.stringify( tmp );
    const url = urlBase + '/signup' + extension;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse( xhr.responseText );
                if(jsonObject.err != "")
                {
                    makeErrorNotification(jsonObject.err);
                } else {
                    makeSuccessNotification("Account created, Redirecting you");
                    setTimeout(() => {
                        location.reload();
                    }, 1500);
                    
                    
                }

            }
        };
        xhr.send(jsonPayload);
    } catch(err)
    {
        makeErrorNotification(err.message);
    }

}

const openContactModal = () => {
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    const modal = document.createElement('div');
    const form = document.createElement('form');
    form.setAttribute('id', 'add-contact-form');
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = 'X';
    closeBtn.classList.add('close-btn');
    closeBtn.addEventListener('click', () => {
        backdrop.remove();
        modal.remove();
    });
    const modalTitle = document.createElement('h2');
    modalTitle.innerHTML = 'Add Contact';
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeBtn);
    modal.appendChild(modalHeader);
    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');
    formContainer.innerHTML = `
    <input type="text" id="name" placeholder="Name">
    <input type="text" id="email" placeholder="Email">
    <input type="text" id="phone" placeholder="Phone">
    <button id="add-btn">Add</button>
`;


    modal.classList.add('modal');
    modal.appendChild(formContainer);

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);
}

const addContact = () => {
    
    const first = document.getElementById('addfirstName').value;
    const last = document.getElementById('addlastName').value;
    const email = document.getElementById('addEmail').value;
    const phone = document.getElementById('addPhone').value;
    if(first == "" || last== ""|| email == "" || phone == ""){
        makeErrorNotification("Cannot Submit Empty Value");
        return;
    }
    showAddContact();
    const tmp = {firstName:first,lastName:last,email:email,phone:phone,id:userId};
    let jsonPayload = JSON.stringify( tmp );
    const url = urlBase + '/create' + extension;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {

                    makeSuccessNotification("Contact created");
                    searchContacts();


            }
        };
        xhr.send(jsonPayload);
    } catch(err)
    {
        makeErrorNotification(err.message);
    }
    
}

const populateEdit = (id) => {
    
    const first = document.getElementById("editfirstName");
    const last = document.getElementById("editlastName");
    const email = document.getElementById("editEmail");
    const phone = document.getElementById("editPhone");
    const idInput = document.getElementById("editContactId");
    if(id == 0) {
        first.value = ""
        last.value = ""
        email.value = ""
        phone.value = ""
        idInput.value = ""
        return;
    }
    const tmp = {id:id};
    let jsonPayload = JSON.stringify( tmp );
    const url = urlBase + '/getcontact' + extension;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {

                    jsonObject = JSON.parse(xhr.responseText)

                    first.value = jsonObject.firstName
                    last.value = jsonObject.lastName
                    email.value = jsonObject.email
                    phone.value = jsonObject.phone
                    idInput.value = jsonObject.id

            }
        };
        xhr.send(jsonPayload);
    } catch(err)
    {
        makeErrorNotification(err.message);
    }



}








const makeErrorNotification = (message) => {
    const notificationContainer = document.getElementById("noti")
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.classList.add('error');
    notification.innerHTML = message;
    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

const makeSuccessNotification = (message) => {
    const notificationContainer = document.getElementById("noti")
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.classList.add('success');
    notification.innerHTML = message;
    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
