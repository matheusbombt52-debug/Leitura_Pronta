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
        slides.forEach(function(s, idx){ s.classList.toggle('active', idx === i); });
      }

      setActive(0);

      function goToSlide(i){
        var slide = slides[i];
        var target = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
        track.scrollTo({left: target, behavior: 'smooth'});
      }

      // Keep dots/highlight in sync with whichever slide is nearest the center,
      // even on wide screens where several slides can be visible at once.
      function updateActiveFromScroll(){
        var trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
        var closestIdx = 0;
        var closestDist = Infinity;
        slides.forEach(function(s, idx){
          var r = s.getBoundingClientRect();
          var dist = Math.abs((r.left + r.width / 2) - trackCenter);
          if (dist < closestDist){
            closestDist = dist;
            closestIdx = idx;
          }
        });
        setActive(closestIdx);
      }

      var scrollRaf = null;
      track.addEventListener('scroll', function(){
        if (scrollRaf) cancelAnimationFrame(scrollRaf);
        scrollRaf = requestAnimationFrame(updateActiveFromScroll);
      }, {passive:true});

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

      var prevBtn = document.createElement('button');
      prevBtn.className = 'carousel-arrow carousel-arrow-prev';
      prevBtn.type = 'button';
      prevBtn.setAttribute('aria-label', 'Slide anterior');
      prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
      prevBtn.addEventListener('click', function(){
        goToSlide((activeIndex - 1 + slides.length) % slides.length);
        pauseThenResume();
      });
      carousel.appendChild(prevBtn);

      var nextBtn = document.createElement('button');
      nextBtn.className = 'carousel-arrow carousel-arrow-next';
      nextBtn.type = 'button';
      nextBtn.setAttribute('aria-label', 'Próximo slide');
      nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
      nextBtn.addEventListener('click', function(){
        goToSlide((activeIndex + 1) % slides.length);
        pauseThenResume();
      });
      carousel.appendChild(nextBtn);

      startAutoplay();
    });
  
