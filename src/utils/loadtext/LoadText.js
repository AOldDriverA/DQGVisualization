function loadText(filePath) {
  let request = new XMLHttpRequest();
  request.open('GET', filePath, false);
  request.send();
  return request.responseText;
}

export default loadText;