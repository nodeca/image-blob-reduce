'use strict';

var reducer = new (require('../../'))();

window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('uploader').addEventListener('change', function () {
    reducer.to_blob(this.files[0], { max: 100 }).then(function (blob) {
      document.getElementById('result').src = URL.createObjectURL(blob);
    });
  });
});
