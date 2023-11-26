const slotImages = [
    'logo/barce.png',
    'logo/bayren.png',
    'logo/psg.png',
    'logo/united.png',
    'logo/rome.png',
    'logo/real.png',
    'logo/dor.png',
    'logo/city.png',
    'logo/atltico.png',
  ];
  
  const spinImageElements = Array.from(document.getElementsByClassName('spin-image'));
  const resultImageElements = Array.from(document.getElementsByClassName('result-image'));
  const prizeImageElement = document.querySelector('.prize-image');
  const msgElement = document.getElementById('msg');
  const creditElement = document.getElementById('cred');
  let credits = 1000;
  const spinCost = 100;
  
  let spinning = false;
  
  const slotIndexes = new Array(9);
  
  function spin() {
    if (spinning) {
      return;
    }
  
    spinning = true;
  
    for (let i = 0; i < 9; i++) {
      let randImageIndex = Math.floor(Math.random() * slotImages.length);
      spinImageElements[i].style.backgroundImage = 'url(' + slotImages[randImageIndex] + ')';
    }
  
    const spinDuration = 3000;
    let startTime;
  
    function animate() {
      const elapsedTime = Date.now() - startTime;
  
      if (elapsedTime < spinDuration) {
        // Rotate the images
        for (let i = 0; i < spinImageElements.length; i++) {
          const index = Math.floor(Math.random() * slotImages.length);
          spinImageElements[i].style.backgroundImage = `url(${slotImages[index]})`;
        }
        requestAnimationFrame(animate);
      } else {
        handleResult();
      }
    }
  
    credits -= spinCost;
    if (credits < 0) {
      alert('Insufficient credits!');
      return;
    }
  
    creditElement.textContent = `Credits: ${credits}`;
    msgElement.textContent = 'Spinning...';
  
    startTime = Date.now();
    requestAnimationFrame(animate);
  }
  
  function checkWinningRow() {
    const rows = [
        [0, 3, 6], // First column
        [1, 4, 7], // Second column
        [2, 5, 8], // Third column
    ];
  
    for (let i = 0; i < rows.length; i++) {
      const [a, b, c] = rows[i];
  
      console.log('Row:', i + 1);
      console.log('Images:', slotIndexes[a], slotIndexes[b], slotIndexes[c]);
  
      if (
        slotIndexes[a] === slotIndexes[b] &&
        slotIndexes[b] === slotIndexes[c]
      ) {
        return true;
      }
    }
  
    return false;
  }
  
  function handleResult() {
    spinning = false;
    const prizeIndex = Math.floor(Math.random() * slotImages.length);
      prizeImageElement.style.backgroundImage = `url(${slotImages[prizeIndex]})`;
      prizeImageElement.style.display = 'block'; // Show the lucky draw image
  
    for (let i = 0; i < spinImageElements.length; i++) {
      resultImageElements[i].style.backgroundImage = spinImageElements[i].style.backgroundImage;
      spinImageElements[i].style.display = 'block';
      resultImageElements[i].style.display = 'none';
    }
  
    for (let i = 0; i < 9; i++) {
      let imageUrl = resultImageElements[i].style.backgroundImage.slice(5, -2); // Extract URL
      slotIndexes[i] = imageUrl; // Store image URLs in the slotIndexes array
    }
  
    const win = checkWinningRow();
  
    if (win) {
        credits += 500;
        creditElement.textContent = `Credits: ${credits}`;
        alert('JackPot! You just won 500 credits!');
        
      }
    
      
    }
    
  
  
    window.startSlotMachine = function(initialCredits) {
        credits = initialCredits;
        creditElement.textContent = `Credits: ${credits}`;
        document.querySelector('.frame').style.display = 'block'; // Assuming '.frame' is your slot machine game container
    }
    
    window.closeSlotMachine = function() {
        document.querySelector('.frame').style.display = 'none';
    }
    
    // Here, the code waits until the DOM has fully loaded before attaching the event listener to the leave button
    document.addEventListener('DOMContentLoaded', function() {
        const leaveButton = document.getElementById('leaveBtn');
        
        if (leaveButton) {
            leaveButton.addEventListener('click', function() {
                window.parent.postMessage('hide', '*');
            });
        } else {
            console.error("Could not find the 'leaveBtn' element.");
        }
    });

    window.startSlotMachine = function(initialCredits) {
    credits = initialCredits;
    creditElement.textContent = `Credits: ${credits}`;
    document.querySelector('.frame').style.display = 'block'; // Assuming '.frame' is your slot machine game container
}

window.closeSlotMachine = function() {
    document.querySelector('.frame').style.display = 'none';
}

// Here, the code waits until the DOM has fully loaded before attaching the event listener to the leave button
document.addEventListener('DOMContentLoaded', function() {
    const leaveButton = document.getElementById('leaveBtn');
    
    if (leaveButton) {
        leaveButton.addEventListener('click', function() {
            window.parent.postMessage('hide', '*');
        });
    } else {
        console.error("Could not find the 'leaveBtn' element.");
    }
});

    