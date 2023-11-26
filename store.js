
let items = [
    { name: 'ball', price: '2', image: 'player/ball.png', width: '100px', height: '110px', isBought: false },
    { name: 'ball2', price: '5', image: 'player/ball2.png', width: '100px', height: '115px', isBought: false },
    { name: 'ball3', price: '50', image: 'player/ball3.png', width: '100px', height: '100px', isBought: false },
    { name: 'ball4', price: '100', image: 'player/ball4.png', width: '81px', height: '90px', isBought: false },
    { name: 'ball5', price: '200', image: 'player/ball5.png', width: '90px', height: '100px', isBought: false },
    { name: 'ball6', price: '500', image: 'player/ball6.png', width: '90px', height: '100px', isBought: false },
    { name: 'ball7', price: '1000', image: 'player/ball7.png', width: '90px', height: '100px', isBought: false },
    { name: 'ball8', price: '5000', image: 'player/ball8.png', width: '108px', height: '102px', isBought: false },
];

  console.log(player.money);
  let selectedRow = 0;
  
  function initStore() {
    let storeTable = document.getElementById('store-table');
    
    items.forEach((item, index) => {
      let row = document.createElement('tr');
      row.classList.add('store-row');
      if (index === 0) row.classList.add('selected');
  
      let priceCell = document.createElement('td');
      priceCell.textContent = `${item.price} \u20BF`;  // Bitcoin symbol added here
      row.appendChild(priceCell);

      let statusCell = document.createElement('td');
      statusCell.textContent = item.isBought ? '✔' : '';  // If the item is bought, show a checkmark
      row.appendChild(statusCell);
  
      let imageCell = document.createElement('td');
      let img = document.createElement('img');
      img.src = item.image;
      img.style.width = item.width;  // setting width from item
      img.style.height = item.height; // setting height from item
      img.classList.add('item-image');
      imageCell.appendChild(img);
      row.appendChild(imageCell);
  
      storeTable.appendChild(row);
    });
  
    document.addEventListener('keydown', navigateStore);
}


  function navigateStore(event) {

    let storeElement = document.getElementById('store');
  
    // Check if the store is hidden
    if (storeElement.classList.contains('store-hidden')) {
        // If the store is hidden, return without doing anything
        return;
    }
    let storeRows = document.getElementsByClassName('store-row');
    let storeViewport = document.getElementById('store-viewport');
  
    if (event.key === 'ArrowUp' && selectedRow > 0) {
      storeRows[selectedRow].classList.remove('selected');
      selectedRow--;
      storeRows[selectedRow].classList.add('selected');
    } else if (event.key === 'ArrowDown' && selectedRow < storeRows.length - 1) {
      storeRows[selectedRow].classList.remove('selected');
      selectedRow++;
      storeRows[selectedRow].classList.add('selected');
    } else if (event.key === 'Enter') {

        // need to add a check to see if the item is bought or not

        let selectedPrice = parseInt(storeRows[selectedRow].getElementsByTagName('td')[0].textContent);
        let selectedImage = items[selectedRow].image;
        if (player.money >= selectedPrice) {
          // Deduct price from player's money
          player.money -= selectedPrice;

          selectedBall = selectedImage.split('/')[1].split('.')[0]; 
          console.log(selectedBall);
          document.getElementById('money-value').innerText = player.money;
      
          // Mark the item as bought
          items[selectedRow].isBought = true;
      
          // Update the store row to indicate the item is bought
          storeRows[selectedRow].getElementsByTagName('td')[1].textContent = '✔';
      
          console.log('You bought an item that costs ' + selectedPrice + '. You now have ' + player.money + ' left.');
        } else {
          console.log('You do not have enough money to buy this item.');
        }
      }
      
  
    // Scroll the viewport to the selected row
    storeViewport.scrollTop = storeRows[selectedRow].offsetTop;
  }
  
  
  initStore(); // Initialize the store when the file is loaded
  