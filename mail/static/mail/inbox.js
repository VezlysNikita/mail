document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#sendmail').addEventListener('click', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email(data) {

  console.log(data)

  if (data.recipients == undefined) {
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';

  }

  else {
    document.querySelector('#compose-recipients').value = data.sender;
    document.querySelector('#compose-subject').value = 'Re: ' + data.sender;
    document.querySelector('#compose-body').value = '';
  }

  // Show compose view and hide other views

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email').style.display = 'none';

  // Clear out composition fields

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch('/emails/'+ mailbox)
  .then(response => response.json())
  .then(emails => {

      // Print emails


      for (let i = 0; i < emails.length; i++) {
        const email_div = document.createElement('div');
        email_div.classList.add('email');

        email_div.innerHTML = `<div>Subject: ${emails[i].subject}</div><div>From: ${emails[i].sender}</div><div>Date: ${emails[i].timestamp}</div>`;

        document.querySelector('#emails-view').append(email_div);


        email_div.addEventListener('click', () => load_email(emails[i].id));
        
        if(emails[i].read == true) {

          email_div.style.backgroundColor = 'grey';
    
        }

        else {
          email_div.style.backgroundColor = 'white';
        }


        if (mailbox == 'inbox') {

        
          const archived_btn = document.createElement('input');

          archived_btn.setAttribute('type','submit')
          
          archived_btn.setAttribute('value','Archive')

          archived_btn.classList.add('archivedbtn');

          document.querySelector('#emails-view').append(archived_btn);

          archived_btn.addEventListener('click', () => {

            fetch(`emails/${emails[i].id}`,{
              method: 'PUT',

              body: JSON.stringify({
                archived: true
              })
            })
            location.reload();
          });
        }

        
        if (mailbox == 'archive') {
       
          const unarchived_btn = document.createElement('input');

          unarchived_btn.setAttribute('type','submit')
          
          unarchived_btn.setAttribute('value','Unarchive')

          unarchived_btn.classList.add('unarchivedbtn');

          document.querySelector('#emails-view').append(unarchived_btn);

          unarchived_btn.addEventListener('click', () => {
            fetch(`emails/${emails[i].id}`,{
              method: 'PUT',

              body: JSON.stringify({
                archived: false
              })
            })
            location.reload();
          });


        }
        
      }



  });

}


function load_email(id) {


  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';



  fetch(`emails/${id}`)
  .then(response => response.json())
  .then(emailas => {



    //const inemail_div = document.createElement('div');
    //inemail_div.classList.add('inemail');

    document.querySelector('#email').innerHTML = `<div>Subject: ${emailas.subject}</div><div>From: ${emailas.sender}</div><div>Date: ${emailas.timestamp}</div><div>${emailas.body}</div>`;
    //document.querySelector('#email').append(inemail_div);

    /*
    const replybtn = document.createElement('input');

    replybtn.setAttribute('type','submit')
    
    replybtn.setAttribute('value','Reply')

    replybtn.classList.add('reply');

    document.querySelector('#email').append(replybtn);

    
    */

    let reply = document.createElement("BUTTON");
    reply.innerHTML = "Reply";
    document.querySelector('#email').append(reply)
    reply.addEventListener('click', () => compose_email(emailas));

  });

  fetch(`emails/${id}`,{
    method: 'PUT',

    body: JSON.stringify({
      read: true
    })

  })
}

function send_email(e) {

  e.preventDefault()

  const recipient = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  console.log(recipient)
  console.log(subject)
  console.log(body)

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipient,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });


  
}