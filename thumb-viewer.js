var XHR_STATE_DONE = 4;
var HTTP_STATUS_OK = 200;

var API_KEY = 'bf85b02743f27fd3522b110409be5d29';
var PHOTOSET_ID = '72157672198006585';
var USER_ID = '31786794%40N07';
var PAGE_SIZE = '50';

var PHOTO_SIZE_THUMB = 'm';
var PHOTO_SIZE_LIGHTBOX = 'h';

var LOADING_CLASS = 'is-loading';
var HIDDEN_CLASS = 'is-hidden';
var VISIBLE_CLASS = 'is-visible';

function getPhotoUrl(photo, size) {
    return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/'
        + photo.id + '_' + photo.secret + '_' + size + '.jpg';
}

function Collection(application, photosetResp) {

    var photos = photosetResp.photo;
    var collectionEl = document.querySelector('.thumb-collection');
    var albumTitleEl = collectionEl.querySelector('.album-title');
    var albumAuthorEl = collectionEl.querySelector('.album-author');
    var thumbsContainerEl = collectionEl.querySelector('.thumbs-container');

    function initThumbsView() {
        albumTitleEl.classList.remove(LOADING_CLASS);
        albumTitleEl.innerText = '\u201C' + photosetResp.title + '\u201D';
        albumAuthorEl.innerText = 'by ' + photosetResp.ownername;
        thumbsContainerEl.classList.remove(LOADING_CLASS);
    }

    this.getPhoto = function(index) {
        return photos[index];
    };

    this.getNumPhotos = function() {
        return photos.length;
    };

    this.renderThumbs = function() {

        var photosToLoad = photos.length;
        photos.forEach(function(photo, i) {
            var photoThumbEl = document.createElement('img');
            photoThumbEl.src = getPhotoUrl(photo, PHOTO_SIZE_THUMB);
            photoThumbEl.className = 'thumb';
            photoThumbEl.title = photo.title;

            photoThumbEl.addEventListener('click', function() {
                application.lightbox.showLightbox(photo, i);
            });

            photoThumbEl.addEventListener('load', function() {
                if (--photosToLoad === 0) {
                    initThumbsView();
                }
            });

            thumbsContainerEl.appendChild(photoThumbEl);
        });

    };

}

function Lightbox(application) {

    var lightboxEl = document.querySelector('.lightbox-content');
    var overlayEl = document.querySelector('.lightbox-overlay');
    var mainPhotoEl = lightboxEl.querySelector('.lightbox-photo-container');
    var photoTitleEl = lightboxEl.querySelector('.lightbox-photo-title');
    var nextBtnEl = lightboxEl.querySelector('.next-btn');
    var prevBtnEl = lightboxEl.querySelector('.prev-btn');

    var photo = null;
    var photoEl = null;
    var photoIndex = 0;

    function checkBounds() {
        if (photoIndex === 0) {
            prevBtnEl.classList.add(HIDDEN_CLASS);
        } else if (photoIndex + 1 === application.collection.getNumPhotos()) {
            nextBtnEl.classList.add(HIDDEN_CLASS);
        } else {
            prevBtnEl.classList.remove(HIDDEN_CLASS);
            nextBtnEl.classList.remove(HIDDEN_CLASS);
        }
    }

    function showPhoto(photo) {
        photoEl.src = getPhotoUrl(photo, PHOTO_SIZE_LIGHTBOX);
        mainPhotoEl.classList.add(LOADING_CLASS);
        photoTitleEl.innerText = '"' + photo.title + '"';
        checkBounds();
    }

    function showNext() {
        photo = application.collection.getPhoto(++photoIndex);
        showPhoto(photo);
    }

    function showPrev() {
        photo = application.collection.getPhoto(--photoIndex);
        showPhoto(photo);
    }

    function hideLightbox() {
        lightboxEl.classList.remove(VISIBLE_CLASS);
        overlayEl.classList.remove(VISIBLE_CLASS);
    }

    function isClickOutside(target) {
        if (target.classList.contains('prev-btn')
            || target.classList.contains('next-btn')
            || target.classList.contains('title')
            || target.nodeName === 'IMG') {
            return false;
        }
        return true;
    }

    this.showLightbox = function(photo, index) {
        photo = photo;
        photoIndex = index;
        if (!photoEl) {
            photoEl = document.createElement('img');
            photoEl.addEventListener('load', function() {
                mainPhotoEl.classList.remove(LOADING_CLASS);
            });
            mainPhotoEl.appendChild(photoEl);
        }

        showPhoto(photo);

        lightboxEl.classList.add(VISIBLE_CLASS);
        overlayEl.classList.add(VISIBLE_CLASS);
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
    if (xhttp.readyState == XHR_STATE_DONE && xhttp.status == HTTP_STATUS_OK) {
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
