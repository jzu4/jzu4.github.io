document.addEventListener('DOMContentLoaded', () => {
    const randomTexts = [
      'الظلام يقترب',
      'أصوات في الجدران',
      'هل سمعت ذلك؟',
      'شيء ما يتحرك في الظل',
      'انتبه خلفك',
      'لا تنظر إلى الظلام كثيراً',
      'الصمت يخفي الكثير',
      'الحقيقة موجودة في مكان ما',
      'اتبع الإشارات',
      'كل شيء مترابط',
      'الرسائل المخفية',
      'الكود الأخير',
      'النظام يراقب',
      'الواقع يتلاشى',
      'الزمن يتوقف',
      'الذاكرة تتلاشى',
      'الصدى يتردد',
      'الأرقام تتكلم',
      'الرموز تكشف',
      'البوابة تفتح',
      'SYSTEM_BREACH_DETECTED',
      'REALITY_MATRIX_UNSTABLE',
      'TIME_LOOP_DETECTED',
      'MEMORY_CORRUPTION',
      'ECHO_PROTOCOL_ACTIVE'
    ];
  
    const glitchVideos = [
      '',
      '',
      ''
    ];
  
    const glitchSounds = [
      '',
      '',
      '',
      'https://www.soundjay.com/mechanical/sounds/robot-movement-4.mp3'
    ];
  
    function createBackgroundText() {
      const container = document.querySelector('.background-text');
      container.innerHTML = '';
      for (let i = 0; i < 50; i++) {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = `${Math.random() * 100}%`;
        div.style.top = `${Math.random() * 100}%`;
        div.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
        div.style.fontSize = `${Math.random() * 8 + 6}px`;
        div.style.opacity = Math.random() * 0.3;
        div.textContent = Math.random() > 0.7 ? '01'.repeat(3) : randomTexts[Math.floor(Math.random() * randomTexts.length)];
        container.appendChild(div);
      }
    }
  
    function createRandomText() {
      if (document.querySelectorAll('.random-text > div').length >= 15) return;
  
      const container = document.querySelector('.random-text');
      const div = document.createElement('div');
      const text = randomTexts[Math.floor(Math.random() * randomTexts.length)];
      
      div.style.position = 'absolute';
      div.style.left = `${Math.random() * 80}%`;
      div.style.top = `${Math.random() * 80}%`;
      div.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
      div.style.fontSize = `${Math.random() * 12 + 10}px`;
      div.style.opacity = '0';
      div.style.transition = 'all 0.5s';
      
      requestAnimationFrame(() => {
        div.style.opacity = '0.7';
      });
  
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          div.textContent = text.slice(0, ++index);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            div.style.opacity = '0';
            setTimeout(() => div.remove(), 500);
          }, 2000);
        }
      }, 100);
  
      container.appendChild(div);
    }
  
    function playRandomSound() {
      const sound = new Audio(glitchSounds[Math.floor(Math.random() * glitchSounds.length)]);
      sound.volume = 0.3;
      sound.play().catch(() => {});
    }
  
    function showRandomVideo() {
      const videoContainer = document.querySelector('.video-glitch');
      const video = glitchVideos[Math.floor(Math.random() * glitchVideos.length)];
      
      videoContainer.style.backgroundImage = `url(${video})`;
      videoContainer.classList.add('active');
      
      setTimeout(() => {
        videoContainer.classList.remove('active');
      }, Math.random() * 300 + 200);
    }
  
    function randomGlitch() {
      if (Math.random() > 0.7) {
        showRandomVideo();
        playRandomSound();
      }
    }
  
    createBackgroundText();
    setInterval(createRandomText, 2000);
    setInterval(createBackgroundText, 10000);
    setInterval(randomGlitch, 5000);
    
    document.addEventListener('click', () => {
      playRandomSound();
      if (Math.random() > 0.5) {
        showRandomVideo();
      }
    });
  });