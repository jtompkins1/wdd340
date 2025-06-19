//public/js/favorite.js

document.addEventListener('DOMContentLoaded', () => {
  const hearts = document.querySelectorAll('.favorite-heart');
  hearts.forEach(heart => {
    heart.addEventListener('click', async (event) => {
      const invId = heart.dataset.invId;
      const isFavorited = heart.classList.contains('favorited');
      const url = `/account/favorites${isFavorited ? '/remove' : ''}/${invId}`;
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          heart.classList.toggle('favorited');
          alert(data.message || (isFavorited ? 'Favorite removed' : 'Favorite added'));
        } else {
          alert(data.message || 'Failed to update favorite');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Please log in to manage favorites.');
      }
    });
  });
});