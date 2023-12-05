document.addEventListener('DOMContentLoaded', function () {
    loadCategories();

    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', searchMeals);
});

function loadCategories() {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            displayCategories(data.categories);
        })
        .catch(error => console.error('Error fetching categories:', error));
}

function displayCategories(categories) {
    const categoryContainer = document.getElementById('categoryContainer');
    categoryContainer.innerHTML = ''; 

    if (categories) {
        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.classList.add('category-item');
            categoryItem.innerHTML = `<p>${category.strCategory}</p>`;
            categoryItem.addEventListener('click', function () {
                searchMeals(category.strCategory);
            });

            categoryContainer.appendChild(categoryItem);
        });
    } else {
        categoryContainer.innerHTML = '<p>No categories found</p>';
    }
}

function searchMeals(category = '') {
    const searchInput = document.getElementById('searchInput').value;

    let apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInput}`;
    if (category) {
        apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayResults(data.meals);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayResults(meals) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; 

    if (meals) {
        meals.slice(0, 5).forEach(meal => {
            const mealItem = document.createElement('div');
            mealItem.classList.add('meal-item');
            mealItem.innerHTML = `<h3>${meal.strMeal}</h3>
                                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                  <p>${meal.strInstructions}</p>
                                  <button onclick="getMealDetails('${meal.idMeal}')">Details</button>`;
            resultsContainer.appendChild(mealItem);
        });
    } else {
        resultsContainer.innerHTML = '<p>No results found</p>';
    }
}

function getMealDetails(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            displayMealDetails(data.meals[0]);
        })
        .catch(error => console.error('Error fetching meal details:', error));
}

function displayMealDetails(meal) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; 

    const mealDetailsContainer = document.createElement('div');
    mealDetailsContainer.classList.add('meal-details');

    mealDetailsContainer.innerHTML = `<h2>${meal.strMeal}</h2>
                                      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                      <p>${meal.strInstructions}</p>
                                      <p><strong>Category:</strong> ${meal.strCategory}</p>
                                      <p><strong>Area:</strong> ${meal.strArea}</p>
                                      <p><strong>Tags:</strong> ${meal.strTags}</p>
                                      <button onclick="searchMeals()">Back to Results</button>`;

    resultsContainer.appendChild(mealDetailsContainer);
}
