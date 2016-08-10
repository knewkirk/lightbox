
var API_KEY = 'bf85b02743f27fd3522b110409be5d29';
var PHOTOSET_ID = '72157672198006585';
var USER_ID = '31786794%40N07';
var PAGE_SIZE = '20';


function getPhotoUrl(photo, size) {
    return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/'
        + photo.id + '_' + photo.secret + '_' + size + '.jpg';
}

function Collection(rawPhotosResp) {

    var lightboxEl = document.querySelector('.lightbox');
    var overlayEl = document.querySelector('.lightbox-overlay');
    var mainPhotoEl = document.querySelector('.photo-container');

    this.photos = rawPhotosResp;
    this.lightboxPhoto = null;
    this.lightboxPhotoEl = null;

    this.getPhoto = function(index) {
        return this.photos[index];
    }.bind(this);

    this.renderThumbs = function() {
        this.photos.forEach(function(photo) {
            var photoThumbEl = document.createElement('img');
            photoThumbEl.src = getPhotoUrl(photo, 'm');

            photoThumbEl.addEventListener('click', function() {
                this.showLightbox(photo);
            }.bind(this));

            document.querySelector('.main-container').appendChild(photoThumbEl);
        }.bind(this));
    }.bind(this);

    this.showNext = function() {
        var photoIndex = this.photos.indexOf(this.lightboxPhoto);
        this.lightboxPhoto = this.getPhoto(photoIndex + 1);
        this.lightboxPhotoEl.src = getPhotoUrl(this.lightboxPhoto, 'b');
    }.bind(this);

    this.showPrev = function() {
        var photoIndex = this.photos.indexOf(this.lightboxPhoto);
        this.lightboxPhoto = this.getPhoto(photoIndex - 1);
        this.lightboxPhotoEl.src = getPhotoUrl(this.lightboxPhoto, 'b');
    }.bind(this);

    this.showLightbox = function(photo) {
        this.lightboxPhoto = photo;
        if (!this.lightboxPhotoEl) {
            this.lightboxPhotoEl = document.createElement('img');
            mainPhotoEl.appendChild(this.lightboxPhotoEl);
        }
        this.lightboxPhotoEl.src = getPhotoUrl(photo, 'b');

        lightboxEl.classList.add('is-visible');
        overlayEl.classList.add('is-visible');
    }.bind(this);

    this.hideLightbox = function() {
        lightboxEl.classList.remove('is-visible');
        overlayEl.classList.remove('is-visible');
    };

    function isClickOutside(target) {
        if (target.classList.contains('prev-btn')
            || target.classList.contains('next-btn')
            || target.classList.contains('photo-container')) {
            return false;
        }
        return true;
    }

    lightboxEl.addEventListener('click', function(event) {
        var target = event.target;

        if (isClickOutside(target)) {
            this.hideLightbox();
            return;
        }

        if (target.classList.contains('prev-btn')) {
            this.showPrev();
            return;
        }

        if (target.classList.contains('next-btn')) {
            this.showNext();
            return;
        }

    }.bind(this));

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
