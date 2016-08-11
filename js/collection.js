/**
 * The object representing the collection of photos
 * received in the response to the original request
 * @param {Application} application
 * @param {Object} photosetResponse
 * @returns {Collection}
 */
function Collection(application, photosetResponse) {

    /*** PRIVATE ***/

    var photos = photosetResponse.photo;
    var photosToLoad = photos.length;
    var collectionEl = document.querySelector('.thumb-collection');
    var albumTitleEl = collectionEl.querySelector('.album-title');
    var albumAuthorEl = collectionEl.querySelector('.album-author');
    var thumbsContainerEl = collectionEl.querySelector('.thumbs-container');

    /**
     * Initializes the thumbnail collections view by setting appropriate
     * text elements to the related photoset attributes after the album
     * is finished loading.
     * @returns {void}
     */
    function initThumbsView() {
        albumTitleEl.classList.remove(CONSTANTS.LOADING_CLASS);
        albumTitleEl.innerText = '\u201C' + photosetResponse.title + '\u201D';
        albumAuthorEl.innerText = 'by ' + photosetResponse.ownername;
        thumbsContainerEl.classList.remove(CONSTANTS.LOADING_CLASS);
    }

    /**
     * @param {Object} photo The raw photo object
     * @param {Number} index The index of the photo in the collection
     * @returns {HTMLElement} The photo thumbnail img element
     */
    function createThumbElement(photo, index) {
        var photoThumbEl = document.createElement('img');
        photoThumbEl.src = getPhotoUrl(photo, CONSTANTS.PHOTO_SIZE_THUMB);
        photoThumbEl.className = 'thumb';
        photoThumbEl.title = photo.title;
        photoThumbEl.setAttribute('data-index', index);
        photoThumbEl.addEventListener('load', function() {
            if (--photosToLoad === 0) {
                initThumbsView();
            }
        });

        return photoThumbEl;
    }

    /**
     * Handles all click events for the Collection
     * @param {MouseEvent} event The click event
     * @returns {void}
     */
    function clickHandler(event) {
        if (!event.target) {
            return;
        }

        if (event.target.classList.contains('thumb')) {
            var photoIndex = parseInt(event.target.getAttribute('data-index'), 10);
            application.lightbox.showLightbox(this.getPhoto(photoIndex), photoIndex);
        }
    }


    /*** PUBLIC ***/

    /**
     * Get the photo with the specified index in the collection
     * @param {Number} index The index in the collection of the desired photo
     * @return {Object} The raw photo object
     */
    this.getPhoto = function(index) {
        return photos[index];
    };

    /**
     * Get the number of photos in the collection
     * @returns {Number} The number of photos
     */
    this.getNumPhotos = function() {
        return photos.length;
    };

    /**
     * Renders the thumbnails in the collection passed to the constructor.
     *  This could be called while initializing the object, but I think
     *  it's nice to explicitly call it from the Application level,
     *  and it's easier to add pagination later.
     * @returns {void}
     */
    this.renderThumbs = function() {

        photos.forEach(function(photo, i) {
            var photoThumbEl = createThumbElement(photo, i);
            thumbsContainerEl.appendChild(photoThumbEl);
        });

    };


    /*** INIT ***/

    collectionEl.addEventListener('click', clickHandler.bind(this));

}
