function success(data) {
  console.log(`received the following data: ${data}`);
}

function error(error) {
  console.log(`An error occured: ${error}`);
}

function fetchTestJson() {
  const url = 'http://bar.com/test.json';
  const options = {
    headers: {
      'X-BLAH-BLAH': 'this is a custom header',
    }
  };

  fetch(url, options).then(success, error);
}

document
  .getElementById('alpha')
  .addEventListener('click', fetchTestJson);
