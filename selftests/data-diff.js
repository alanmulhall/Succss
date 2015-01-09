
/**
 * @file
 * 
 * This file, once ran with the 'succss check' command, will creates diff files 
 * against base screenshots from data.js and put them in the directory 
 * ./self-screenshots/data-diff/.
 *
 * Diff types:
 *
 * - Text (header #dynamic-line)
 * - Image (#click-here)
 * - Color (body bgColor)
 * - Movement (aside#colors)
 * 
 */

phantom.injectJs(fs.workingDirectory + '/selftests/data.js');

// Replaces bgColor 080 by 088
Succss.pages['advanced-selectors'].url.replace('bgColor=080', 'bgColor=088');
// Changing default headline (header #dynamic-line) to another one
Succss.pages['advanced-selectors'].url += '&headline=4';
// Removing before capture callbacks to keep movement and #click-here image.
for (var selector in Succss.pages['advanced-selectors'].captures) {
  Succss.pages['advanced-selectors'].captures[selector].before = undefined;
}

Succss.callback = function(capture) {

  if (capture.action == 'check') {

    casper.test.assertNotEquals(capture.filePath, capture.basePath, 'The updated capture was taken.');
    casper.test.assertNotEquals(fs.size(capture.filePath), fs.size(capture.basePath), 'Base and update are different in size.');
  }
}

Succss.options = {
  // Disabling default imagediff behavior (inverting the casper test).
  'imagediff':false,
  'resemble':true,
  'exitOnError':false,
  'pages':'advanced-selectors'
}

/*
 * Overrides the default imagediff function, changing imgDiffPath and assertion.
 */
Succss.diff = function(imgBase, imgCheck, capture) {

    phantom.injectJs('lib/imagediff.js');

    imgDiff = imagediff.diff(imgBase, imgCheck);
    var imagesMatch = imagediff.equal(imgBase, imgCheck, capture.options.tolerancePixels);

    if (!imagesMatch) {
      var filePath = capture.filePath.replace('.succss-tmp/', './selftests/diff-screenshots/');
      this.writeImgDiff(imgDiff, imgBase, imgCheck, filePath);
    }

    casper.test.assertFalse(imagesMatch, 'Capture is different to base screenshot (imagediff).');
    SuccssDataCommon.assertSuiteSuccess(capture.count);
}