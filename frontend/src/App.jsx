import React, { useState } from "react";
import { useEffect } from "react";
import { Moon, Sun, Plus } from "lucide-react";
import FryingLoader from "./components/FryingLoader";


export default function App() {
  const [ingredient, setIngredient] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const addIngredient = () => {
    if (ingredient && !ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
      setIngredient("");
    }
  };


  const [darkMode, setDarkMode] = useState(false);
  const availableFilters = ["Vegetarian", "Vegan", "Gluten-Free", "Under 30 Min", "High Protein"];
  const [activeFilters, setActiveFilters] = useState([]);

  const [showOnlyLiked, setShowOnlyLiked] = useState(false);

  const [likedRecipes, setLikedRecipes] = useState(() => {
    const saved = localStorage.getItem("likedRecipes");
    return saved ? JSON.parse(saved) : [];
  });
  const commonIngredients = [
    "egg", "cheese", "spinach", "milk", "onion", "tomato", "garlic",
    "chicken", "beef", "rice", "pasta", "potato", "carrot", "broccoli"
  ];

  useEffect(() => {
    localStorage.setItem("likedRecipes", JSON.stringify(likedRecipes));
  }, [likedRecipes]);

  const fetchRecipes = async () => {
    setRecipes([]);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/generate-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, filters: activeFilters }),
      });
      const data = await response.json();
      if (data.recipes) {
        setRecipes(data.recipes);
      } else {
        throw new Error("No recipes returned.");
      }
    } catch (err) {
      console.warn("API failed. Loading mock recipes instead.");
      setRecipes([
        {
          title: "Spinach Omelette",
          description: "A quick and healthy breakfast with eggs and spinach.",
          duration: "10 min",
          difficulty: "Easy",
          servings: 1,
          ingredients: ["eggs", "spinach", "cheese"],
          steps: [
            "Beat eggs in a bowl.",
            "Add chopped spinach and shredded cheese.",
            "Cook in a non-stick pan until done."
          ],
          notes: "Great with toast or avocado!",
          image_url: "https://source.unsplash.com/512x512/?omelette,food"
        },
        {
          title: "Cheesy Quesadilla",
          description: "Crispy tortillas stuffed with gooey cheese.",
          duration: "15 min",
          difficulty: "Medium",
          servings: 2,
          ingredients: ["tortilla", "cheese", "onions"],
          steps: [
            "Heat tortilla in a pan.",
            "Add cheese and onions, fold and grill.",
            "Slice and serve hot."
          ],
          notes: "Try dipping in salsa or sour cream.",
          image_url: "https://source.unsplash.com/512x512/?quesadilla,food"
        }
        
      ]);
    } finally {
      setLoading(false);
    }
  };
  const toggleLike = (title) => {
    setLikedRecipes((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };
  const toggleFilter = (filter) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredSuggestions = ingredient
    ? commonIngredients.filter(item =>
      item.toLowerCase().startsWith(ingredient.toLowerCase()) &&
      !ingredients.includes(item)
    )
    : [];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="font-sans text-base leading-relaxed tracking-tight">
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
          <div className="p-6 max-w-7xl mx-auto">
            <header className="flex items-center justify-between mb-10 relative">
              <div className="flex items-center gap-3">
                <img
                  src="/images/logo.svg"
                  alt="Snackhack logo"
                  className="w-100 h-20 object-contain"
                />
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-800 dark:text-white">
                  Snackhack
                </h1>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform"
                title="Toggle theme"
              >
                {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full border rounded-xl px-4 py-2 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Add an ingredient..."
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addIngredient()}
                />
                {filteredSuggestions.length > 0 && (
                  <ul className="absolute bg-white dark:bg-gray-800 border dark:border-gray-700 mt-1 rounded-lg shadow text-sm z-20 w-full max-w-xs">
                    {filteredSuggestions.map((suggestion, i) => (
                      <li
                        key={i}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          setIngredients([...ingredients, suggestion]);
                          setIngredient("");
                        }}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={addIngredient}
                className="bg-blue-600 text-white px-2 py-2 rounded-xl hover:bg-blue-700 transition"
                title="Add ingredient"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                onClick={fetchRecipes}
                className="bg-green-600 text-white px-5 py-2 text-sm rounded-xl font-medium"
              >
                Cook
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {ingredients.map((item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-full text-sm hover:bg-red-100 hover:text-red-700 transition cursor-pointer"
                  onClick={() => {setIngredients(ingredients.filter((ing) => ing !== item))
                  setRecipes([]);
                  }}
                  
                >
                  {item}
                  <span className="text-red-500 hover:text-red-700 font-bold text-xs">×</span>
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {availableFilters.map((filter, index) => (
                <button
                  key={index}
                  onClick={() => toggleFilter(filter)}
                  className={`px-4 py-1 rounded-full text-sm transition ${activeFilters.includes(filter)
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100"
                    }`}
                >
                  {filter}
                </button>
              ))}

              <button
                onClick={() => setShowOnlyLiked(!showOnlyLiked)}
                className={`ml-auto px-3 py-1 rounded-full text-sm transition ${showOnlyLiked
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                  }`}
                title="Toggle liked view"
              >
                Show Only Liked ❤️
              </button>
            </div>
            {loading && (
              <div className="flex flex-col items-center mt-6 space-y-2">
                <FryingLoader />
                <p className="text-sm text-gray-600 dark:text-gray-300 animate-pulse">Cooking up recipes...</p>
              </div>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-6">
              {recipes
                .filter((r) => !showOnlyLiked || likedRecipes.includes(r.title))
                .map((r, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedRecipe(r)}
                    className="relative cursor-pointer border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md transition-all duration-200 hover:scale-[1.015] hover:shadow-xl"
                  >
                    <img
                      src={r.image_url || "https://via.placeholder.com/512"}
                      alt={r.title}
                      className="w-full h-48 object-cover rounded-xl shadow-md"
                    />
                    <div className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(r.title);
                        }}
                        className="absolute top-2 right-2 z-10 bg-white/80 dark:bg-gray-900/80 rounded-full p-1 hover:bg-red-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={likedRecipes.includes(r.title) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`h-5 w-5 transition ${likedRecipes.includes(r.title)
                            ? "text-red-500"
                            : "text-gray-400"
                            }`}
                        >
                          <path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 4.02 13.44 5.58C13.97 4.02 15.64 3 17.38 3C20.46 3 22.88 5.42 22.88 8.5C22.88 13.5 15 21 15 21H12Z" />
                        </svg>
                      </button>
                      <h2 className="text-xl font-semibold">{r.title}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{r.description}</p>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ⏱️ {r.duration} • 🧑‍🍳 {r.difficulty}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {/* Modal */}
            {selectedRecipe && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 sm:p-8 relative animate-fadeIn">
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl transition"
                    onClick={() => setSelectedRecipe(null)}
                  >
                    ×
                  </button>
                  <h2 className="text-3xl font-bold mb-4">{selectedRecipe.title}</h2>
                  <img
                    src={selectedRecipe.image_url || "https://via.placeholder.com/512"}
                    alt={selectedRecipe.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />

                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{selectedRecipe.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300 mb-6">
                    <div><strong>⏱ Duration:</strong><br />{selectedRecipe.duration}</div>
                    <div><strong>🔥 Difficulty:</strong><br />{selectedRecipe.difficulty}</div>
                    <div><strong>🍽 Servings:</strong><br />{selectedRecipe.servings}</div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">🧾 Ingredients</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {selectedRecipe.ingredients?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">👨‍🍳 Steps</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      {selectedRecipe.steps?.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {selectedRecipe.notes && (
                    <p className="italic text-sm text-gray-500 dark:text-gray-400 mt-4">
                      💡 <strong>Tip:</strong> {selectedRecipe.notes}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

