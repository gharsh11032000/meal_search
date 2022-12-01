console.log("Js file is loaded");

const input = document.querySelector(".input");
const form = document.querySelector(".form");
const btnSubmit = document.querySelector(".btn_submit");
const btnRandom = document.querySelector(".btn-random");
const searchResultHeading = document.querySelector(".search_result-heading");
const searchMealsContainer = document.querySelector(".meals_results-container");
const mealDetails = document.querySelector(".meal_details");
const contentContainer = document.querySelector(".content_container");
const moreMeal = document.querySelector(".more_meal-text");

let searchedTerm;

// Meal fetch by search
const mealFetch = async function () {
  try {
    let mealName = input.value.trim();
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
    );

    const data = await response.json();

    if (mealName.length === 0) {
      mealName = "Random Search";
    }

    if (!data.meals) {
      return (searchResultHeading.innerHTML = `No search result found for "${mealName}"`);
    }

    const mealsArray = data.meals;

    searchResultHeading.innerHTML = `Search results for "${mealName}"`;
    moreMeal.innerHTML = "";

    searchedTerm = mealName;

    displaySearchedMeals(mealsArray);
  } catch (error) {
    errorMsg();
    console.log(error);
  }
};

// Display meals results
function displaySearchedMeals(mealsArray) {
  mealsArray.forEach((meal) => {
    const mealImg = meal.strMealThumb;
    searchMealsContainer.insertAdjacentHTML(
      "afterbegin",
      `
  <div class='meal' data-meal-name='${meal.strMeal}' id='${meal.idMeal}'>
  <img src='${mealImg}' alt='${meal.strMeal} Image' />
  </div>
  `
    );
  });
}

// Submit search form
form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchResultHeading.innerHTML = "Loading...";
  mealFetch();
  input.value = "";
  searchMealsContainer.innerHTML = "";
  mealDetails.innerHTML = "";
  moreMeal.innerHTML = "";
});

// Clicked on single meal
searchMealsContainer.addEventListener("click", async (e) => {
  try {
    if (!e.target.id) return;

    searchResultHeading.innerHTML = "Loading...";

    const mealId = e.target.id;

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );

    const data = await response.json();

    const meal = data.meals[0];

    mealDetailsFetch(meal);
    moreMeal.innerHTML = `More results`;
    searchResultHeading.innerHTML = `Search results for "${searchedTerm}"`;
  } catch (error) {
    errorMsg();
    console.log(error);
  }
});

// Display meal info to dom
function mealDetailsFetch(meal) {
  const { ingredientsArray, ingredientsQuantityArray } = addIngredients(meal);

  mealDetails.innerHTML = `
  <div class='meal_container'>
    <a href='${meal.strYoutube}' target="_blank" rel="noopener noreferrer">
    <div class='meal_image-main'>
      <img src='${meal.strMealThumb}' alt='${meal.strMeal} Image' />
    </div>
    </a>
    <div class='meal_details-container'>
      <h1>${meal.strMeal}</h1>
      <div class='meal_description'>
        <p class='meal_category' id='${meal.strCategory}'>${
    meal.strCategory
  }</p>
        <p class='meal_area' id='${meal.strArea}'>${meal.strArea}</p>
      </div>
      <div class='ingredients_container'>
        <h2>Ingredients</h2>
        <ul class='ingredients_list'>
        ${ingredientsQuantityArray
          .map(
            (ing, i) =>
              `<li class='ingredient' id='${ingredientsArray[i]}'>${ing}</li>`
          )
          .join("")}
        </ul>
      </div>
      <div class='instructions_container'>
        <h2>Instructions</h2>
        <p class='instructions'>${meal.strInstructions}</p>
      </div>
    </div>
  </div>
  `;

  scrollToTop();
}

// Fetch ingredients from meal array
function addIngredients(meal) {
  let ingredientsArray = [];
  let ingredientsQuantityArray = [];

  for (let i = 0; i < 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const quantity = meal[`strMeasure${i}`];
    if (ingredient) {
      ingredientsQuantityArray.push(`${ingredient} - ${quantity}`);
      ingredientsArray.push(ingredient);
    }
  }

  return { ingredientsArray, ingredientsQuantityArray };
}

btnRandom.addEventListener("click", () => {
  searchResultHeading.innerHTML = "Loading...";
  randomMealFetch();
  scrollToTop();
});

// Fetch meal random
async function randomMealFetch() {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await response.json();

    if (!data.meals) {
      return (searchResultHeading.innerHTML = `No search result found for "Random Search"`);
    }

    searchResultHeading.innerHTML = `Search result for "Random Search"`;
    moreMeal.innerHTML = "";

    const meal = data.meals;
    mealDetailsFetch(meal[0]);
    searchMealsContainer.innerHTML = "";
  } catch (error) {
    errorMsg();
    console.log(error);
  }
}

// Fetch meals from category
async function mealFetchCategory(category) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    const data = await response.json();

    if (!data.meals) {
      return (searchResultHeading.innerHTML = `No search result found for "${category}"`);
    }

    const mealsArray = data.meals;
    searchedTerm = category;
    searchResultHeading.innerHTML = `Search results for "${category}"`;
    searchMealsContainer.innerHTML = "";
    mealDetails.innerHTML = "";
    moreMeal.innerHTML = "";
    displaySearchedMeals(mealsArray);
  } catch (error) {
    errorMsg();
    console.log(error);
  }
}

// Fetch meals from area
async function mealFetchArea(area) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );
    const data = await response.json();

    const mealsArray = data.meals;

    if (!data.meals) {
      return (searchResultHeading.innerHTML = `No search result found for "${area}"`);
    }
    searchedTerm = area;

    searchResultHeading.innerHTML = `Search results for "${area}"`;
    searchMealsContainer.innerHTML = "";
    mealDetails.innerHTML = "";
    moreMeal.innerHTML = "";
    displaySearchedMeals(mealsArray);
  } catch (error) {
    errorMsg();
    console.log(error);
  }
}

// Fetch meals from ingredient
async function mealFetchIngredient(ing) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`
    );
    const data = await response.json();

    const mealsArray = data.meals;

    if (!data.meals) {
      return (searchResultHeading.innerHTML = `No search result found for "${ing}"`);
    }
    searchedTerm = ing;

    searchResultHeading.innerHTML = `Search results for "${ing}"`;
    searchMealsContainer.innerHTML = "";
    mealDetails.innerHTML = "";
    moreMeal.innerHTML = "";
    displaySearchedMeals(mealsArray);
  } catch (error) {
    errorMsg();
    console.log(error);
  }
}

// Clickes on category,area,ingredients
window.addEventListener("click", (e) => {
  if (e.target.classList.value === "meal_category") {
    searchResultHeading.innerHTML = "Loading...";
    const elId = e.target.id;
    mealFetchCategory(elId);
    scrollToTop();
  }

  if (e.target.classList.value === "meal_area") {
    searchResultHeading.innerHTML = "Loading...";
    const elId = e.target.id;
    mealFetchArea(elId);
    scrollToTop();
  }

  if (e.target.classList.value === "ingredient") {
    searchResultHeading.innerHTML = "Loading...";
    const elId = e.target.id;
    mealFetchIngredient(elId);
    scrollToTop();
  }
});

// Scroll top
function scrollToTop() {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
}

// Error message
function errorMsg(
  msg = "❌ Something went wrong. Please try again after sometime!"
) {
  searchResultHeading.innerHTML = msg;
}
