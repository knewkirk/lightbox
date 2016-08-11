var CONSTANTS = {
    LOADING_CLASS: 'is-loading',
    HIDDEN_CLASS: 'is-hidden',
    VISIBLE_CLASS: 'is-visible',
};

function getPhotoUrl() {
    return 'http://foo.bar.org';
}

QUnit.test('showLightbox() returns creates new photo element', function(assert) {
    var photo = { id: 5678, title: 'title' };

    var lightbox = new Lightbox({
        collection: {
            getNumPhotos: sinon.stub().returns(6)
        }
    });
    lightbox.showLightbox(photo, 0);

    var photoContainerEl = document.querySelector('.lightbox-photo-container');

    var photoTitleEl = document.querySelector('.lightbox-photo-title');
    assert.equal('"title"', photoTitleEl.innerText);
    assert.ok(photoContainerEl.querySelector('img'));
    assert.ok(photoContainerEl.classList.contains('is-loading'));
    assert.ok(document.querySelector('.lightbox-overlay').classList.contains('is-visible'));
    assert.ok(document.querySelector('.lightbox-content').classList.contains('is-visible'));
});

QUnit.test('LOADING_CLASS removed after photo element loads', function(assert) {
    var lightbox = new Lightbox({
        collection: {
            getNumPhotos: sinon.stub().returns(6)
        }
    });
    lightbox.showLightbox({}, 0);

    var photoContainerEl = document.querySelector('.lightbox-photo-container');
    photoContainerEl.classList.add('is-loading');
    var photoEl = photoContainerEl.querySelector('img');

    var evt = document.createEvent('Event');
    evt.initEvent('load', false, false);
    photoEl.dispatchEvent(evt);

    assert.notOk(photoContainerEl.classList.contains('is-loading'));
});

QUnit.test('next and prev buttons should not show if only one image', function(assert) {
    var lightbox = new Lightbox({
        collection: {
            getNumPhotos: sinon.stub().returns(1)
        }
    });
    lightbox.showLightbox({}, 0);

    assert.ok(document.querySelector('.prev-btn').classList.contains('is-hidden'));
    assert.ok(document.querySelector('.next-btn').classList.contains('is-hidden'));
});

QUnit.test('next button should not show if last image', function(assert) {
    var lightbox = new Lightbox({
        collection: {
            getNumPhotos: sinon.stub().returns(3)
        }
    });
    lightbox.showLightbox({}, 2);

    assert.notOk(document.querySelector('.prev-btn').classList.contains('is-hidden'));
    assert.ok(document.querySelector('.next-btn').classList.contains('is-hidden'));
});

QUnit.test('prev button should not show if first image', function(assert) {
    var lightbox = new Lightbox({
        collection: {
            getNumPhotos: sinon.stub().returns(3)
        }
    });
    lightbox.showLightbox({}, 0);

    assert.ok(document.querySelector('.prev-btn').classList.contains('is-hidden'));
    assert.notOk(document.querySelector('.next-btn').classList.contains('is-hidden'));
});

QUnit.test('clicking prev button should show the previous image', function(assert) {
    var photo = { title: 'previous' };
    var lightbox = new Lightbox({
        collection: {
            getNumPhotos: sinon.stub().returns(3),
            getPhoto: sinon.stub().returns(photo)

        }
    });
    lightbox.showLightbox({}, 2);

    var evt = document.createEvent('Event');
    evt.initEvent('click', false, false);
    document.querySelector('.prev-btn').click();

    assert.equal('"previous"', document.querySelector('.lightbox-photo-title').innerText)
});

QUnit.test('clicking next button should show the next image', function(assert) {
    var photo = { title: 'previous' };
    var lightbox = new Lightbox({
        collection: {
            getNumPhotos: sinon.stub().returns(3),
            getPhoto: sinon.stub().returns(photo)

        }
    });
    lightbox.showLightbox({}, 2);

    var evt = document.createEvent('Event');
    evt.initEvent('click', false, false);
    document.querySelector('.next-btn').click();

    assert.equal('"previous"', document.querySelector('.lightbox-photo-title').innerText)
});

QUnit.test('clicking outside should hide the lightbox', function(assert) {
    var lightbox = new Lightbox({
        collection: {
            getNumPhotos: sinon.stub().returns(3),
        }
    });
    lightbox.showLightbox({}, 2);

    var evt = document.createEvent('Event');
    evt.initEvent('click', false, false);
    document.querySelector('.close-lightbox-btn').click();

    assert.notOk(document.querySelector('.lightbox-overlay').classList.contains('is-visible'));
    assert.notOk(document.querySelector('.lightbox-content').classList.contains('is-visible'));
});
