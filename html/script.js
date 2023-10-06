const urlBase = 'http://www.friendsbydaylight.xyz/api';
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



const contacts = [
// {
//     id: 1,
//     name: 'John Doe',
//     email: 'example@gmail.com',
//     phone: '0000000000'
// }, {
//     id: 2,
//     name: 'Jane Doe',
//     email: 'example2@gmail.com',
//     phone: '0000000000'
// }, {
//     id: 3,
//     name: 'Jack Doe',
//     email: 'example3@gmail.com',
//     phone: '0000000000'
// },
// {
//     id: 1,
//     name: 'John Doe',
//     email: 'example@gmail.com',
//     phone: '0000000000'
// }, {
//     id: 2,
//     name: 'Jane Doe',
//     email: 'example2@gmail.com',
//     phone: '0000000000'
// }, {
//     id: 3,
//     name: 'Jack Doe',
//     email: 'example3@gmail.com',
//     phone: '0000000000'
// },
// {
//     id: 1,
//     name: 'John Doe',
//     email: 'example@gmail.com',
//     phone: '0000000000'
// }, {
//     id: 2,
//     name: 'Jane Doe',
//     email: 'example2@gmail.com',
//     phone: '0000000000'
// }, {
//     id: 3,
//     name: 'Jack Doe',
//     email: 'example3@gmail.com',
//     phone: '0000000000'
// },
// {
//     id: 1,
//     name: 'John Doe',
//     email: 'example@gmail.com',
//     phone: '0000000000'
// }, {
//     id: 2,
//     name: 'Jane Doe',
//     email: 'example2@gmail.com',
//     phone: '0000000000'
// }, {
//     id: 3,
//     name: 'Jack Doe',
//     email: 'example3@gmail.com',
//     phone: '0000000000'
// },
// {
//     id: 1,
//     name: 'John Doe',
//     email: 'example@gmail.com',
//     phone: '0000000000'
// }, {
//     id: 2,
//     name: 'Jane Doe',
//     email: 'example2@gmail.com',
//     phone: '0000000000'
// }, {
//     id: 3,
//     name: 'Jack Doe',
//     email: 'example3@gmail.com',
//     phone: '0000000000'
// },
];

 const doLogin = () => {
    userId = 0;
    userFirstName = "";
    userLastName = "";
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const tmp = {login:email,password:password};
    let jsonPayload = JSON.stringify( tmp );
    const url = urlBase + '/login' + extension;
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

            }
        };
        xhr.send(jsonPayload);
    } catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}
const saveCookie = () => {
    const minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

const readCookie = () => {
    userId = -1;
    userFirstName = "";
    userLastName = "";
    const data = document.cookie;
    const splits = data.split(';');
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
    } else {
        document.getElementById("userName").innerHTML = "Logged in as " + userFirstName + " " + userLastName;
    }
}

const logout = () => {
    userId = 0;
    userFirstName = "";
    userLastName = "";
    document.cookie = "user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
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
    div.setAttribute('id', contact.id);
    
    div.innerHTML = `
        <p>${contact.name}</p>
        <p>${contact.email}</p>
        <p>${contact.phone}</p>
    `;
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    editBtn.classList.add('action-btn');
    editBtn.setAttribute('id', contact.id);
    editBtn.addEventListener('click', () => editContact(contact.id));
    div.appendChild(actionBtns);
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.classList.add('action-btn');
    delBtn.setAttribute('id', contact.id);
    delBtn.addEventListener('click', () => deleteContact(contact.id));
    actionBtns.appendChild(editBtn);
    actionBtns.appendChild(delBtn);
    container.appendChild(div);
}

const searchContacts = () => {
    const searchQuery = document.getElementById('search').value;
    const container = document.getElementById('contacts-container');
    const length = container.children.length;
    for(let i = 0; i < length; i++){
        container.children[0].remove();
    }
    contacts = [];
    //Send searchQuery to backend
    contacts = 
    console.log("searching for " + searchQuery);
   
     

}


const renderContacts = () => {
    contacts.forEach(contact => createContact(contact));
    }
const deleteContact = (id) => {
    const tmp = {contactId:id, userId:userId};
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
                let jsonObject = JSON.parse( xhr.responseText );
                if(jsonObject.error != "")
                {
                    document.getElementById("deleteResult").innerHTML = jsonObject.error;
                    return;
                }
                document.getElementById("deleteResult").innerHTML = "Contact has been deleted";
                deRenderContacts();
                fetchContacts(userId, search);
            }
        }

    } catch(err) {
        document.getElementById("deleteResult").innerHTML = err.message;
    }
    console.log("deleting " + id);
}
const editContact = (id) => {
    console.log("editing " + id);
}
const deRenderContacts = () => {
    const container = document.getElementById('contacts-container');
    const length = container.children.length;
    for(let i = 0; i < length; i++){
        container.children[0].remove();
    }
    contacts = [];
}
const fetchContacts = (user, searchParams) => {
    //fetch contacts from backend
    let tmp = {search:searchParams,userId:user};
	let jsonPayload = JSON.stringify( tmp );
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
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
                
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
                    const tmp = {
                        id: jsonObject.results[i].id,
                        name: jsonObject.results[i].firstName + " " + jsonObject.results[i].lastName,
                        email: jsonObject.results[i].email,
                        phone: jsonObject.results[i].phone
                    }
                    contacts.push(tmp);
	
				}
                renderContacts();
			}
            
		};
        xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
    
    renderContacts();

}
const doSignup = () => {
    const firstName = document.getElementById('signupFirst').value;
    const lastName = document.getElementById('signupLast').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const tmp = {firstName:firstName,lastName:lastName,email:email,password:password};
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
                    makeSuccessNotification("Account created");
                    window.location.href = "index.html";
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

const makeErrorNotification = (message) => {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.classList.add('error');
    notification.innerHTML = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

const makeSuccessNotification = (message) => {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.classList.add('success');
    notification.innerHTML = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}