# Lightbox

This project involves hitting a public Flickr API using my personal account credentials to retrieve a set of photos, displaying those photos on the page, and displaying a lightbox of the photo when clicked, where you can click through all of the pictures in the album and leave the lightbox experience.

No frameworks of any kind were used in the source code - it consists of pure JavaScript (ES5), CSS3, and HTML5, and is functional in all modern browsers (Chrome, Firefox, Safari, and IE11). QUnit was used to write tests, and is hosted publicly, so viewing the /test/qunit.html file in any browser should give you the test results.

### Changing Photosets and Pages

This exercise is compatible with any public Flickr photoset, which can be found in the url of any photoset or album. I unfortunately did not have time to implement the UI for changing photosets or pages - to do so, you need to switch the PHOTOSET_ID, PAGE_SIZE, and/or PAGE_NUM (one-indexed) constants in application.js
