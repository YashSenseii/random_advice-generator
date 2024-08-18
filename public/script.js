let selectedCategory = 'Productivity'; // Default category

// Function to set the selected category and fetch advice
function selectCategory(category) {
  selectedCategory = category;
  fetchAdvice();
}

// Function to fetch and display advice with a preloader
async function fetchAdvice() {
  const adviceElement = document.getElementById('advice-text');
  const preloader = document.getElementById('preloader');
  
  // Show preloader
  preloader.classList.remove('hidden');
  adviceElement.textContent = ''; // Clear previous advice

  try {
    const response = await fetch(`/advice/${selectedCategory}`);
    const data = await response.json();
    if (data && data.advice) {
      adviceElement.textContent = data.advice;
    } else {
      adviceElement.textContent = 'No advice found for this category.';
    }
  } catch (error) {
    console.error('Error fetching advice:', error);
    adviceElement.textContent = 'Failed to fetch advice. Please try again later.';
  } finally {
    // Hide preloader
    preloader.classList.add('hidden');
  }
}
