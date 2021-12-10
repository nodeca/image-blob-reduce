(function () {
  'use strict';

  var reducer = new window.ImageBlobReduce({
    pica: window.ImageBlobReduce.pica({ features: [ 'js', 'wasm', 'ww' ] })
  });

  window.addEventListener('DOMContentLoaded', function () {
    document.getElementById('uploader').addEventListener('change', function () {
      reducer
        .toBlob(
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

})();
