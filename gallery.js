(function() {

	"use strict";

	var images,
		countImages,
		jsonLink,
		page_param,
		json,
		gallery,
		page_id,
		arrayCompileImage = [],
		afterImage,
		name,
		image,
		posBlockDiv,
		realSizeImages,
		posElementImage,
		currentPosImage,
		id_block;

		gallery = $('#gallery');
		afterImage = '<div class="mask"><a href="#" class="info" title="Full Image">Full Image</a></div><div class="text"></div>';


		page_param = '?PAGEN_1=';
		jsonLink = 'http://uspeshnyy.ru/bitrix/templates/.default/components/bitrix/news.list/gallery/get_json_gallery.php';

		function getJson(callback, page_id) {
			if(page_id === undefined) page_id = 1;
			$.ajax({
				url: jsonLink + page_param + page_id,
				dataType: 'json',
				success: function (data) {                            
					if(typeof callback === "function") callback(data);
			}
			});
		}

		getJson(function(data)
		{
			json = data;
			realSizeImages= json.length - 1;
			countImages = json[realSizeImages]['count_element'];

			id_block = json[realSizeImages]['ID_BLOCK'];

						//	Function for generate block_images
						//	Block_one, Block_two, Block_three

						//	1. Init
						//	2. Block for generate html mockup
						//	3. Getting current value element [for init function]
						//	4. Getting image for block_images
						//	5. getPosBlock [Part function for getCurrentPos]
						//	6. getPosImage - [Part function for getCurrentPos]
						//	7. Info - [Debug function]

						function getBlockImage(_posBlockDiv, _posElementImage, _idElement) {

							var currentPosBlockDiv,
								currentPosImage;

							// Init block

								if (_posBlockDiv === undefined && _posElementImage === undefined) {

										getCurrentPos();
										info();

								}

							// Block for generate html mockup

								if (posBlockDiv === 'two') {

									if (posElementImage === 'two') {

										getImage();
										gallery.prepend('<div class="block_' + posBlockDiv + '">' + arrayCompileImage.join('\n') + '</div>');
										arrayCompileImage = [];
										getPosBlock();
										posElementImage = 'one';

									} else {

										getImage();
										getPosImage();

									}

								} else {

										if (posElementImage === 'three') {

											getImage();
											gallery.prepend('<div class="block_' + posBlockDiv + '">' + arrayCompileImage.join('\n') + '</div>');
											arrayCompileImage = [];
											getPosBlock();
											getPosImage();

										} else {

											getImage();
											getPosImage();

										}

									}
								
							//	Getting current value element [For init block]
							//	one, two, three

								function getCurrentPos() {
										currentPosBlockDiv = getPosBlock();
										currentPosImage = getPosImage();
								}

							// Getting image for block_images

								function getImage() {

										var elementImage;

										elementImage  = '<div id="' + _idElement + '" class="image ' + posElementImage + ' second-effect" href="' + image + '" title="' + name + '" style="background-image: url(' + image + ')">' + afterImage + '</div>';
										arrayCompileImage.push(elementImage);

										// console.log('Element image : ' + elementImage);

								}

							// Part function for getCurrentPos

								function getPosBlock() {

									switch (posBlockDiv) {
									case 'one':
										posBlockDiv = 'two';
										break;
									case 'two':
										posBlockDiv = 'three';
										break;
									case 'three':
										posBlockDiv = 'one';
										break;
									default:
										posBlockDiv = 'one';
									}
									return posBlockDiv;
									
								}

							// Part function for getCurrentPos

								function getPosImage() {
								
									switch (posElementImage) {
									case 'one':
										posElementImage = 'two';
										break;
									case 'two':
										posElementImage = 'three';
										break;
									case 'three':
										posElementImage = 'one';
										break;
									default:
										posElementImage = 'one';
									}
									return posElementImage;
									
								}

							// Debug function

								function info() {
									console.log('posBlockDiv: ' + currentPosBlockDiv + '\n' + 'posElementImage: ' + currentPosImage + '\n');
								}

						}

						// Generate html

						for(var i = 0; i < realSizeImages; i=i+1)
							{
								name = json[i]['name'];
								image = json[i]['image'];

								getBlockImage(posBlockDiv, posElementImage, i);
							}

						// Other plygin for gallery

						$('.image').magnificPopup({
							removalDelay: 1000,
							mainClass: 'mfp-fade',
							overflowY: 'hidden',
							type: 'image',
							alignTop: true,
							tLoading: '',
							image: {
								titleSrc: 'data-title'
							},
							gallery: {
								enabled: true,
								arrowMarkup: ''
							},
							callbacks: {
								open: function() {
									// getRandomImage(id_block); // Get ajax image for element
									console.log('Popup is opened');
								},
								change: function() {
									console.log('Content changed');
									var magnificPopup = $.magnificPopup.instance;
									console.log(magnificPopup.currItem); // Direct reference to your popup element
									// getRandomImage(id_block); // Get ajax image for element
								}
							}
						});

						gallery.smoothDivScroll({
							mousewheelScrolling: "allDirections",
							// manualContinuousScrolling: true
						});
		});
})();