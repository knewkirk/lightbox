
var API_KEY = 'bf85b02743f27fd3522b110409be5d29';
var PHOTOSET_ID = '72157672198006585';
var USER_ID = '31786794%40N07';
var PAGE_SIZE = '20';

var lightboxEl = document.querySelector('.lightbox');
var overlayEl = document.querySelector('.lightbox-overlay');
var mainPhotoEl = document.querySelector('.photo-container');


function showLightbox(photo) {
    var mainPhoto = document.createElement('img');
    mainPhoto.src = photo.getUrl('b');

    mainPhotoEl.appendChild(mainPhoto);
    lightboxEl.classList.add('is-visible');
    overlayEl.classList.add('is-visible');
};

function hideLightbox() {
    lightboxEl.classList.remove('is-visible');
    overlayEl.classList.remove('is-visible');
    mainPhotoEl.innerHTML = '';
};

var closeLightboxBtn = document.querySelector('.close-lightbox');
closeLightboxBtn.addEventListener('click', function(e) {
    hideLightbox();
});

function Photo(rawPhotoObj, index) {

    this.index = index;
    this.farm = rawPhotoObj.farm;
    this.server = rawPhotoObj.server;
    this.id = rawPhotoObj.id;
    this.secret = rawPhotoObj.secret;

    this.getUrl = function(size) {
        return 'https://farm' + this.farm + '.staticflickr.com/' + this.server + '/'
            + this.id + '_' + this.secret + '_' + size + '.jpg';
    }.bind(this);

    this.getThumbEl = function() {
        var imgEl = document.createElement('img');
        imgEl.className = 'thumb';
        imgEl.src = this.getUrl('m');

        imgEl.addEventListener('click', function(e) {
            showLightbox(this);
        }.bind(this));

        return imgEl;
    }.bind(this);

}

function Collection(rawPhotosResp) {

    this.photos = rawPhotosResp.map(function(rawPhotoObj, i) {
        return new Photo(rawPhotoObj, i);
    });

    this.renderThumbs = function() {
        this.photos.forEach(function(photo) {
            var photoThumbEl = photo.getThumbEl();
            document.querySelector('.main-container').appendChild(photoThumbEl);
        });
    }.bind(this);

    this.getPhoto = function(index) {
        return this.photos[index];
    }.bind(this);

}

var xhttp = new XMLHttpRequest();
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
        document.querySelector('.author').innerText = 'by ' + photoset.ownername;

        var photos = photoset.photo;
        var collection = new Collection(photos);
        collection.renderThumbs();
    }
};

var url = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos' +
    '&api_key=' + API_KEY +
    '&photoset_id=' + PHOTOSET_ID +
    '&user_id=' + USER_ID +
    '&per_page=' + PAGE_SIZE +
    '&format=json' +
    '&nojsoncallback=1';

xhttp.open("GET", url, true);
xhttp.send();
