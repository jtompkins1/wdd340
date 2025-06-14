//public/js/favorite.js

document.addEventListener('DOMContentLoaded', () => {
  const hearts = document.querySelectorAll('.favorite-heart');

  hearts.forEach(heart => {
    heart.addEventListener('click', async () => {
      const invId = heart.dataset.invId; // Assuming the inventory ID is stored in a data attribute
      const isFavorited = heart.classList.contains('favorited');
      const url = `/account/favorites/${isFavorited ? 'remove' : 'add'}/${invId}`;

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Failed to update favorite');
        }

        // Toggle the 'favorited' class to change the heart’s appearance
        heart.classList.toggle('favorited');
      } catch (error) {
        console.error('Error:', error.message);
      }
    });
  });
});