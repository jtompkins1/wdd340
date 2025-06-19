//public/js/favorite.js

document.addEventListener('DOMContentLoaded', () => {
  const hearts = document.querySelectorAll('.favorite-heart');
  hearts.forEach(heart => {
    heart.addEventListener('click', async (event) => {
      const invId = heart.dataset.invId;
      const isFavorited = heart.classList.contains('favorited');
      const url = `/account/favorites/${isFavorited ? 'remove' : 'add'}/${invId}`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          heart.classList.toggle('favorited');
        } else {
          throw new Error('Failed to update favorite');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Please log in to manage favorites.');
      }
    });
  });
});