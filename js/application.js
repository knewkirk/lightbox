/*
 * This is the main application entry point
 *  - it makes the initial request to get the photoset
 *  - creates a new Application instance, consisting of
 *    both a Collection and a Lightbox.
 *  - tells the Collection to render the thumbnails
 */

var CONSTANTS = {
    XHR_STATE_DONE: 4,
    HTTP_STATUS_OK: 200,

    API_KEY: 'bf85b02743f27fd3522b110409be5d29',
    PHOTOSET_ID: '72157672198006585',
    PAGE_SIZE: '50',
    PAGE_NUM: '1',

    PHOTO_SIZE_THUMB: 'm',
    PHOTO_SIZE_LIGHTBOX: 'h',

    LOADING_CLASS: 'is-loading',
    HIDDEN_CLASS: 'is-hidden',
    VISIBLE_CLASS: 'is-visible',
};

/**
 * Get the url in the format needed to retrieve the image from Flickr
 * @see https://www.flickr.com/services/api/misc.urls.html
 * @param {Object} photo A raw photo object from the original responseText
 * @param {string} size The desired size
 * @return {string} The url
 */
function getPhotoUrl(photo, size) {
    return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/'
        + photo.id + '_' + photo.secret + '_' + size + '.jpg';
}

/**
 * Displays the error message on the page
 * @returns {void}
 */
function showErrMessage() {
    document.querySelector('.err-apology').classList.remove(CONSTANTS.HIDDEN_CLASS);
}

/**
 * The Application, consisting of a Lightbox and a Collection
 * We tell the collection to render the thumbs here to make it
 * explicit how the app starts up.
 * @param {Object} photoset The photoset response from the Flickr API
 * @return {Application} The application
 */
function Application(photoset) {
    this.lightbox = new Lightbox(this);
    this.collection = new Collection(this, photoset);
    this.collection.renderThumbs();
}

(function() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == CONSTANTS.XHR_STATE_DONE
            && xhttp.status == CONSTANTS.HTTP_STATUS_OK) {

            var resp = xhttp.responseText;
            if (!resp) {
                showErrMessage();
                return;
            }

            resp = JSON.parse(resp);
            if (!resp || !resp.photoset) {
                showErrMessage();
                return;
            }

            window.application = new Application(resp.photoset);
        }
    };

    var url = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos' +
        '&api_key=' + CONSTANTS.API_KEY +
        '&photoset_id=' + CONSTANTS.PHOTOSET_ID +
        '&per_page=' + CONSTANTS.PAGE_SIZE +
        '&page=' + CONSTANTS.PAGE_NUM +
        '&format=json' +
        '&nojsoncallback=1';

    xhttp.open("GET", url, true);
    xhttp.send();
})();
