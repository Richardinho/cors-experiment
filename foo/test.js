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
    }
  };

  fetch(url, options).then(success, error);
}

document
  .getElementById('alpha')
  .addEventListener('click', fetchTestJson);
