
var API_KEY = 'bf85b02743f27fd3522b110409be5d29';
var PHOTOSET_ID = '72157672198006585';
var USER_ID = '31786794%40N07';
var PAGE_SIZE = '20';

var PHOTO_SIZE_THUMB = 'm';
var PHOTO_SIZE_LIGHTBOX = 'b';

function getPhotoUrl(photo, size) {
    return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/'
        + photo.id + '_' + photo.secret + '_' + size + '.jpg';
}

function Collection(application, photosetResp) {

    document.querySelector('h1').innerText = photosetResp.title;
    document.querySelector('.author').innerText = 'by ' + photosetResp.ownername;

    var photos = photosetResp.photo;

    this.getPhoto = function(index) {
        return photos[index];
    };

    this.getNumPhotos = function() {
        return photos.length;
    };

    this.renderThumbs = function() {
        photos.forEach(function(photo, i) {
            var photoThumbEl = document.createElement('img');
            photoThumbEl.src = getPhotoUrl(photo, PHOTO_SIZE_THUMB);

            photoThumbEl.addEventListener('click', function() {
                application.lightbox.showLightbox(photo, i);
            });

            document.querySelector('.main-container').appendChild(photoThumbEl);
        });
    };

}

function Lightbox(application) {

    var lightboxEl = document.querySelector('.lightbox');
    var overlayEl = document.querySelector('.lightbox-overlay');
    var mainPhotoEl = document.querySelector('.photo-container');

    var photo = null;
    var photoEl = null;
    var photoIndex = 0;

    function checkBounds() {
        if (photoIndex === 0) {
            document.querySelector('.prev-btn').classList.add('is-hidden');
        } else if (photoIndex + 1 === application.collection.getNumPhotos()) {
            document.querySelector('.next-btn').classList.add('is-hidden');
        } else {
            document.querySelector('.prev-btn').classList.remove('is-hidden');
            document.querySelector('.next-btn').classList.remove('is-hidden');
        }
    }

    function showNext() {
        photo = application.collection.getPhoto(++photoIndex);
        photoEl.src = getPhotoUrl(photo, PHOTO_SIZE_LIGHTBOX);
        checkBounds();
    }

    function showPrev() {
        photo = application.collection.getPhoto(--photoIndex);
        photoEl.src = getPhotoUrl(photo, PHOTO_SIZE_LIGHTBOX);
        checkBounds();
    }

    function hideLightbox() {
        lightboxEl.classList.remove('is-visible');
        overlayEl.classList.remove('is-visible');
    }

    function isClickOutside(target) {
        if (target.classList.contains('prev-btn')
            || target.classList.contains('next-btn')
            || target.classList.contains('photo-container')) {
            return false;
        }
        return true;
    }

    this.showLightbox = function(photo, index) {
        photo = photo;
        photoIndex = index;
        if (!photoEl) {
            photoEl = document.createElement('img');
            mainPhotoEl.appendChild(photoEl);
        }
        photoEl.src = getPhotoUrl(photo, PHOTO_SIZE_LIGHTBOX);

        lightboxEl.classList.add('is-visible');
        overlayEl.classList.add('is-visible');
        checkBounds();
    };

    lightboxEl.addEventListener('click', function(event) {
        var target = event.target;

        if (isClickOutside(target)) {
            hideLightbox();
            return;
        }

        if (target.classList.contains('prev-btn')) {
            showPrev();
            return;
        }

        if (target.classList.contains('next-btn')) {
            showNext();
            return;
        }
    });

}

function Application(photoset) {
    this.lightbox = new Lightbox(this);
    this.collection = new Collection(this, photoset);
    this.collection.renderThumbs();
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

        var app = new Application(resp.photoset);
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
