var CONSTANTS = {
    LOADING_CLASS: 'is-loading'
};

function getPhotoUrl() {
    return 'http://foo.bar.org';
}

QUnit.test('getPhoto() returns the right photo at the index', function(assert) {
    var photo = { id: 5678 };
    var photoset = {
        photo: [ photo ]
    };

    var collection = new Collection({}, photoset);
    var ret = collection.getPhoto(0);

    assert.equal(photo, ret);
});

QUnit.test('getNumPhotos() returns the right number of photos', function(assert) {
    var photoset = {
        photo: [ { id: 123 }, { id: 456 }, { id: 789 } ]
    };

    var collection = new Collection({}, photoset);
    var ret = collection.getNumPhotos();

    assert.equal(3, ret);
});

QUnit.test('renderThumbs() renders the correct img elements', function(assert) {
    var photoset = {
        photo: [
            { id: 123, title: 'a' },
            { id: 456, title: 'b' },
            { id: 789, title: 'c' }
        ]
    };

    var collection = new Collection({}, photoset);
    collection.renderThumbs();

    assert.equal(3, document.querySelectorAll('img.thumb').length);
    assert.equal('1', document.querySelectorAll('img.thumb')[1].getAttribute('data-index'));
    assert.equal('c', document.querySelectorAll('img.thumb')[2].title);
});

QUnit.test('initThumbsView() when all images are loaded', function(assert) {
    var photoset = {
        photo: [
            { id: 123, title: 'a' },
            { id: 456, title: 'b' },
            { id: 789, title: 'c' }
        ]
    };

    var collection = new Collection({}, photoset);
    collection.renderThumbs();

    var thumbsContainerEl = document.querySelector('.thumbs-container');
    thumbsContainerEl.classList.add('is-loading');

    document.querySelectorAll('img.thumb').forEach(function(el) {
        var evt = document.createEvent('Event');
        evt.initEvent('load', false, false);
        el.dispatchEvent(evt);
    });

    assert.notOk(thumbsContainerEl.classList.contains('is-loading'));
});

QUnit.test('clickHandler() opens lightbox if thumb', function(assert) {
    var photoset = {
        photo: [ { id: 123 }, { id: 456 }, { id: 789 } ]
    };
    var application = {
        lightbox: {
            showLightbox: sinon.mock().once().withArgs({ id: 456 }, 1)
        }
    };

    var collection = new Collection(application, photoset);
    collection.renderThumbs();

    var thumbEl = document.querySelectorAll('img.thumb')[1];
    var evt = document.createEvent('Event');
    evt.initEvent('click', false, false);
    thumbEl.dispatchEvent(evt);

    assert.ok(true);
});

QUnit.test('clickHandler() does nothing if not thumb', function(assert) {
    var photoset = {
        photo: [ { id: 123 }, { id: 456 }, { id: 789 } ]
    };
    var application = {
        lightbox: {
            showLightbox: sinon.mock().never()
        }
    };

    var collection = new Collection(application, photoset);
    collection.renderThumbs();

    var albumTitleEl = document.querySelector('.album-title');
    var evt = document.createEvent('Event');
    evt.initEvent('click', false, false);
    albumTitleEl.dispatchEvent(evt);

    assert.ok(true);
});
