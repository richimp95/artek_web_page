$(document).ready(function() {


    var userFeed = new Instafeed({
        get: 'user',
        userId: '7218826757',
        limit: 12,
        resolution: 'standard_resolution',
        accessToken: '***REMOVED***',
        sortBy: 'most-recent',
        template: '<div class="col-12 col-sm-6 col-lg-3 single_gallery_item mb-30 wow fadeInUp" data-wow-delay="700ms"><div class="single-portfolio-content"><img src="{{image}}" alt="{{caption}}" class="img-fluid" style="object-fit: cover; width: 300px; height: 300px;"/><div class="hover-content"><a href="{{image}}" title="{{caption}}" target="_blank" class="portfolio-img">+</a></div></div></div>',
    });


    userFeed.run();

    
    // This will create a single gallery from all elements that have class "gallery-item"
    $('.gallery').magnificPopup({
        type: 'image',
        delegate: 'a',
        gallery: {
            enabled: true
        }
    });
    


});
