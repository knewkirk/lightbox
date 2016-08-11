/**
 * The object representing the lightbox and all of its functionality,
 * like opening, closing, and going to next, previous photos.
 * @param {Application} application
 * @returns {Lightbox}
 */
function Lightbox(application) {

    /*** PRIVATE ***/

    var photo = null;
    var photoEl = null;
    var photoIndex = 0;

    var lightboxEl = document.querySelector('.lightbox-content');
    var overlayEl = document.querySelector('.lightbox-overlay');
    var mainPhotoEl = lightboxEl.querySelector('.lightbox-photo-container');
    var photoTitleEl = lightboxEl.querySelector('.lightbox-photo-title');
    var nextBtnEl = lightboxEl.querySelector('.next-btn');
    var prevBtnEl = lightboxEl.querySelector('.prev-btn');

    /**
     * Checks the bounds of the current photo index to make sure
     * that there is a next and previous photo to go to, hides the
     * appropriate button if not.
     * @returns {void}
     */
    function checkBounds() {
        var numPhotos = application.collection.getNumPhotos();

        if (numPhotos === 1) {
            prevBtnEl.classList.add(CONSTANTS.HIDDEN_CLASS);
            nextBtnEl.classList.add(CONSTANTS.HIDDEN_CLASS);
            return;
        }

        if (photoIndex === 0) {
            prevBtnEl.classList.add(CONSTANTS.HIDDEN_CLASS);
        } else if (photoIndex + 1 === numPhotos) {
            nextBtnEl.classList.add(CONSTANTS.HIDDEN_CLASS);
        } else {
            prevBtnEl.classList.remove(CONSTANTS.HIDDEN_CLASS);
            nextBtnEl.classList.remove(CONSTANTS.HIDDEN_CLASS);
        }
    }

    /**
     * Loads the photo passed in by changing the url of the
     * lightbox img element. Additionally adds a loading state
     * and changes the photo title
     * @param {Object} photo
     * @returns {void}
     */
    function loadPhoto(photo) {
        photoEl.src = getPhotoUrl(photo, CONSTANTS.PHOTO_SIZE_LIGHTBOX);
        mainPhotoEl.classList.add(CONSTANTS.LOADING_CLASS);
        photoTitleEl.innerText = '"' + photo.title + '"';
        checkBounds();
    }

    /**
     * Shows the next photo in the collection
     * @returns {void}
     */
    function showNext() {
        photo = application.collection.getPhoto(++photoIndex);
        loadPhoto(photo);
    }

    /**
     * Shows the previous photo in the collection
     * @returns {void}
     */
    function showPrev() {
        photo = application.collection.getPhoto(--photoIndex);
        loadPhoto(photo);
    }

    /**
     * Hides the lightbox from view
     * @returns {void}
     */
    function hideLightbox() {
        lightboxEl.classList.remove(CONSTANTS.VISIBLE_CLASS);
        overlayEl.classList.remove(CONSTANTS.VISIBLE_CLASS);
    }

    /**
     * Helper function to determine if a click happened outside
     * of the main content, used to know whether to close the lightbox.
     * @returns {void}
     */
    function isClickOutside(target) {
        if (target.classList.contains('prev-btn')
            || target.classList.contains('next-btn')
            || target.classList.contains('title')
            || target.nodeName === 'IMG') {
            return false;
        }
        return true;
    }

    /**
     * Handles all click events inside of the lightbox
     * @param {MouseEvent} event
     * @returns {void}
     */
    function clickHandler(event) {
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
    }

    /*** PUBLIC ***/

    /**
     * Creates a main photo element if necessary and shows the photo
     * and lightbox.
     * @param {Object} photo The raw photo object returned in the responseText
     * @param {Number} index The index of the photo in the collection
     * @returns {void}
     */
    this.showLightbox = function(photo, index) {
        photo = photo;
        photoIndex = index;
        if (!photoEl) {
            photoEl = document.createElement('img');
            photoEl.addEventListener('load', function() {
                mainPhotoEl.classList.remove(CONSTANTS.LOADING_CLASS);
            });
            mainPhotoEl.appendChild(photoEl);
        }

        loadPhoto(photo);

        lightboxEl.classList.add(CONSTANTS.VISIBLE_CLASS);
        overlayEl.classList.add(CONSTANTS.VISIBLE_CLASS);
    };

    /*** INIT ***/

    lightboxEl.addEventListener('click', clickHandler);

}
