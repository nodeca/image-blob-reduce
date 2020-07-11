'use strict';

var reducer = new (require('../../'))();

window.addEventListener('DOMContentLoaded', function () {
  document.getElementById('uploader').addEventListener('change', function () {
    reducer
      .to_blob(
        this.files[0],
        {
          max: 200,
          unsharpAmount: 80,
          unsharpRadius: 0.6,
          unsharpThreshold: 2
        }
      )
      .then(function (blob) {
        document.getElementById('result').src = URL.createObjectURL(blob);
      });
  });
});
