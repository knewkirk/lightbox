var xhttp = new XMLHttpRequest();

var url = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos' +
    '&api_key=bf85b02743f27fd3522b110409be5d29' +
    '&photoset_id=72157672198006585' +
    '&user_id=31786794%40N07' +
    '&per_page=10' +
    '&format=json' +
    '&nojsoncallback=1';

function formatPicUrl(farmID, serverID, picID, secret, size) {
    return 'https://farm' + farmID + '.staticflickr.com/' + serverID + '/' + picID + '_' + secret + '_' + size + '.jpg';
}

xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        var resp = xhttp.responseText;
        if (!resp) {
            return;
        }

        resp = JSON.parse(resp);
        if (!resp || !resp.photoset) {
            return;
        }
        var photoset = resp.photoset;

        document.querySelector('h1').innerText = photoset.title;

        var photos = photoset.photo;
        photos.forEach(function(pic) {
            var img = document.createElement('img');
            img.src = formatPicUrl(pic.farm, pic.server, pic.id, pic.secret, 'm');

            document.querySelector('.main-container').appendChild(img);
        });
    }
};

xhttp.open("GET", url, true);
xhttp.send();
