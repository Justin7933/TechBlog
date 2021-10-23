// A function to edit a post
async function editFormHandler(event) {
    event.preventDefault();
  
    // Get post id from the url
    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
  
    const title = document.querySelector('input[name="post-title"]').value.trim();
    const content = document.querySelector('textarea[name="content"]').value;
  
    // Get post title and post text from the form
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title,
        content,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    // if the edit action is successful, redirect to the dashboard page. Else display the error
    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert(response.statusText);
    }
  }
  
  document
    .querySelector('.edit-post-form')
    .addEventListener('submit', editFormHandler);
  