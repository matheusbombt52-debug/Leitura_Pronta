    document.querySelectorAll('.carousel').forEach(function(carousel){
      var track = carousel.querySelector('.carousel-track');
      var dotsWrap = carousel.querySelector('.carousel-dots');
      var slides = Array.prototype.slice.call(track.children);
      var activeIndex = 0;
      var autoplayDelay = parseInt(carousel.dataset.autoplay, 10) || 3000;
      var autoplayTimer = null;
      var resumeTimer = null;

      var dots = slides.map(function(_, i){
        var dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Ir para o item ' + (i + 1));
        dot.addEventListener('click', function(){
          goToSlide(i);
          pauseThenResume();
        });
        dotsWrap.appendChild(dot);
        return dot;
      });

      function setActive(i){
        activeIndex = i;
        dots.forEach(function(d, idx){ d.classList.toggle('active', idx === i); });
      }

      function goToSlide(i){
        var slide = slides[i];
        var target = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
        track.scrollTo({left: target, behavior: 'smooth'});
      }

      // Keep dots in sync when the user swipes manually
      var observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting && entry.intersectionRatio > 0.6){
            setActive(slides.indexOf(entry.target));
          }
        });
      }, {root: track, threshold: [0.6]});
      slides.forEach(function(s){ observer.observe(s); });

      function startAutoplay(){
        stopAutoplay();
        autoplayTimer = setInterval(function(){
          var next = (activeIndex + 1) % slides.length;
          goToSlide(next);
        }, autoplayDelay);
      }

      function stopAutoplay(){
        if (autoplayTimer) clearInterval(autoplayTimer);
      }

      function pauseThenResume(){
        stopAutoplay();
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(startAutoplay, 4000);
      }

      track.addEventListener('pointerdown', pauseThenResume, {passive:true});
      track.addEventListener('touchstart', pauseThenResume, {passive:true});

      startAutoplay();
    });
  
