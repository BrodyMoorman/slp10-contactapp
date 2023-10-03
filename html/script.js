const urlBase = 'http://friendsbydaylight.xyz/api';
const extention = '.php';

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



const contacts = [{
    id: 1,
    name: 'John Doe',
    email: 'example@gmail.com',
    phone: '0000000000'
}, {
    id: 2,
    name: 'Jane Doe',
    email: 'example2@gmail.com',
    phone: '0000000000'
}, {
    id: 3,
    name: 'Jack Doe',
    email: 'example3@gmail.com',
    phone: '0000000000'
},
];



const createContact = (contact) => {
    const container = document.getElementById('contacts-container');
    const div = document.createElement('div');
    const delBtn = document.createElement('button');
    const editBtn = document.createElement('button');
    const actionBtns = document.createElement('div');
    actionBtns.classList.add('action-btns');
    div.classList.add('contact');
    div.setAttribute('id', contact.id);
    div.innerHTML = `
        <h2>${contact.name}</h2>
        <p>${contact.email}</p>
        <p>${contact.phone}</p>
    `;
    editBtn.innerHTML = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.setAttribute('id', contact.id);
    editBtn.addEventListener('click', () => editContact(contact.id));
    div.appendChild(actionBtns);
    delBtn.innerHTML = 'Delete';
    delBtn.classList.add('del-btn');
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

	let url = urlBase + '/Search.' + extension;
	
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
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
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