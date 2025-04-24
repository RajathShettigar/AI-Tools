// Sample AI tools data - Replace with your own data
let aiTools = [
  {
    id: 1,
    name: "DALL-E",
    description:
      "An AI system that can create realistic images and art from a description in natural language.",
    category: "image",
    price: "paid",
    hasApi: "yes",
    link: "https://openai.com/dall-e-2",
    tags: ["Image Generation", "Art", "OpenAI"],
  },
  {
    id: 2,
    name: "ChatGPT",
    description:
      "A large language model that can engage in conversational dialogue and provide human-like responses.",
    category: "text",
    price: "freemium",
    hasApi: "yes",
    link: "https://chat.openai.com",
    tags: ["Text Generation", "OpenAI"],
  },
  {
    id: 3,
    name: "Midjourney",
    description:
      "An AI program that generates images from textual descriptions, similar to OpenAI's DALL-E.",
    category: "image",
    price: "paid",
    hasApi: "no",
    link: "https://www.midjourney.com",
    tags: ["Image Generation", "Art", "Discord"],
  },
  {
    id: 4,
    name: "Runway ML",
    description:
      "A toolkit that makes it easy to use machine learning models for creative purposes, including video generation.",
    category: "video",
    price: "freemium",
    hasApi: "yes",
    link: "https://runwayml.com",
    tags: ["Video Generation", "Creative", "ML"],
  },
  {
    id: 5,
    name: "GitHub Copilot",
    description:
      "An AI pair programmer that helps you write better code by offering suggestions based on comments and context.",
    category: "code",
    price: "paid",
    hasApi: "no",
    link: "https://github.com/features/copilot",
    tags: ["Code Generation", "Programming", "GitHub"],
  },
  {
    id: 7,
    name: "Jasper",
    description:
      "An AI content platform that helps you create marketing copy, social media posts, and more.",
    category: "text",
    price: "paid",
    hasApi: "yes",
    link: "https://www.jasper.ai",
    tags: ["Text Generation", "Marketing", "Content"],
  },
  {
    id: 10,
    name: "Synthesia",
    description:
      "An AI video generation platform that creates videos with virtual avatars from text.",
    category: "video",
    price: "paid",
    hasApi: "yes",
    link: "https://www.synthesia.io",
    tags: ["Video Generation", "Avatars", "Business"],
  },
  {
    id: 11,
    name: "Stable Diffusion",
    description:
      "An open-source text-to-image model that can generate detailed images based on text descriptions.",
    category: "image",
    price: "free",
    hasApi: "yes",
    link: "https://stability.ai",
    tags: ["Image Generation", "Open Source", "AI"],
  },
  {
    id: 15,
    name: "Tabnine",
    description:
      "AI code completion tool that helps developers write code faster with whole-line and full-function completions.",
    category: "code",
    price: "freemium",
    hasApi: "no",
    link: "https://www.tabnine.com",
    tags: ["Code Generation", "Programming", "IDE"],
  },
  {
    id: 16,
    name: "Claude",
    description:
      "An AI assistant by Anthropic designed to be helpful, harmless, and honest in its interactions.",
    category: "text",
    price: "freemium",
    hasApi: "yes",
    link: "https://www.anthropic.com/claude",
    tags: ["Text Generation", "Anthropic"],
  },
];

// DOM Elements
const toolsContainer = document.getElementById("toolsContainer");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const categoryFilter = document.getElementById("categoryFilter");
const resetFiltersButton = document.getElementById("resetFilters");
const categoryButtons = document.querySelectorAll(".category-btn");
const currentCategoryTitle = document.getElementById("currentCategory");
const addToolButton = document.getElementById("addToolButton");

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  displayTools(aiTools);
  setupEventListeners();

  // Initialize local storage if needed
  if (!localStorage.getItem("aiTools")) {
    localStorage.setItem("aiTools", JSON.stringify(aiTools));
  } else {
    // Load tools from local storage
    aiTools = JSON.parse(localStorage.getItem("aiTools"));
    displayTools(aiTools);
  }
});

// Display tools based on filters
function displayTools(tools) {
  toolsContainer.innerHTML = "";

  if (tools.length === 0) {
    toolsContainer.innerHTML = `
              <div class="no-results">
                  <h3>No AI tools found</h3>
                  <p>Try adjusting your filters or search criteria</p>
              </div>
          `;
    return;
  }

  tools.forEach((tool) => {
    const toolCard = createToolCard(tool);
    toolsContainer.appendChild(toolCard);
  });
}

// Create a card for each AI tool
function createToolCard(tool) {
  const card = document.createElement("div");
  card.className = "tool-card";

  let priceTagClass = "";
  if (tool.price === "free") priceTagClass = "free";
  else if (tool.price === "paid") priceTagClass = "paid";
  else if (tool.price === "freemium") priceTagClass = "freemium";

  card.innerHTML = `
          <div class="tool-content">
              <h3>${tool.name}</h3>
              <p>${tool.description}</p>
              <div class="tool-tags">
                  <span class="tool-tag ${priceTagClass}">${capitalizeFirstLetter(
    tool.price
  )}</span>
                  ${tool.tags
                    .map((tag) => `<span class="tool-tag">${tag}</span>`)
                    .join("")}
              </div>
              <a href="${
                tool.link
              }" class="tool-link" target="_blank">Visit Website</a>
          </div>
      `;

  return card;
}

// Set up event listeners
function setupEventListeners() {
  // Search functionality
  searchButton.addEventListener("click", performSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  // Filter change events
  categoryFilter.addEventListener("change", applyFilters);

  // Reset filters
  resetFiltersButton.addEventListener("click", resetFilters);

  // Category buttons
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.getAttribute("data-category");
      filterByCategory(category);
    });
  });

  // Add Tool Button
  addToolButton.addEventListener("click", addNewTool);
}

// Perform search based on input
function performSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === "") {
    applyFilters(); // If search is empty, just apply other filters
    return;
  }

  const filteredTools = aiTools.filter((tool) => {
    return (
      tool.name.toLowerCase().includes(searchTerm) ||
      tool.description.toLowerCase().includes(searchTerm) ||
      tool.category.toLowerCase().includes(searchTerm) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  });

  // Apply other filters to search results
  const finalFilteredTools = applyCurrentFilters(filteredTools);
  displayTools(finalFilteredTools);
}

// Apply all current filters
function applyFilters() {
  const filteredTools = applyCurrentFilters(aiTools);
  displayTools(filteredTools);
}

// Apply current filter values to a set of tools
function applyCurrentFilters(tools) {
  const categoryValue = categoryFilter.value;

  return tools.filter((tool) => {
    const categoryMatch =
      categoryValue === "all" || tool.category === categoryValue;

    return categoryMatch;
  });
}

// Filter tools by category
function filterByCategory(category) {
  // Update the category title
  if (category === "all") {
    currentCategoryTitle.textContent = "All AI Tools";
  } else {
    currentCategoryTitle.textContent = `${capitalizeFirstLetter(
      category
    )} AI Tools`;
  }

  // Update the category dropdown to match
  categoryFilter.value = category;

  // Apply all filters
  applyFilters();
}

// Reset all filters and search
function resetFilters() {
  searchInput.value = "";
  categoryFilter.value = "all";

  // Reset category buttons
  categoryButtons.forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector('.category-btn[data-category="all"]')
    .classList.add("active");

  // Reset category title
  currentCategoryTitle.textContent = "All AI Tools";

  // Display all tools
  displayTools(aiTools);
}

// Add new tool from form
function addNewTool(e) {
  e.preventDefault();

  // Get form values
  const toolName = document.getElementById("toolName").value.trim();
  const toolDescription = document
    .getElementById("toolDescription")
    .value.trim();
  const toolCategory = document.getElementById("toolCategory").value;
  const toolLink = document.getElementById("toolLink").value.trim();
  const toolTagsInput = document.getElementById("toolTags").value.trim();

  // Form validation
  if (!toolName || !toolDescription || !toolLink) {
    alert("Please fill in all required fields");
    return;
  }

  // Process tags
  let toolTags = [];
  if (toolTagsInput) {
    toolTags = toolTagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");
  }

  // Add category name as a tag if not already present
  const categoryName = getCategoryDisplayName(toolCategory);
  if (!toolTags.includes(categoryName)) {
    toolTags.push(categoryName);
  }

  // Create new tool object
  const newTool = {
    id: generateUniqueId(),
    name: toolName,
    description: toolDescription,
    category: toolCategory,
    price: "free", // Default value
    hasApi: "no", // Default value
    link: toolLink,
    tags: toolTags,
  };

  // Add to tools array in alphabetical order
  addToolAlphabetically(newTool);

  // Save to local storage
  localStorage.setItem("aiTools", JSON.stringify(aiTools));

  // Refresh the display
  applyFilters();

  // Reset form
  resetAddToolForm();

  // Show success message
  alert(`"${toolName}" has been added successfully!`);
}

// Add a tool to the array in alphabetical order
function addToolAlphabetically(newTool) {
  // Find the right position
  let insertIndex = aiTools.length;

  for (let i = 0; i < aiTools.length; i++) {
    if (newTool.name.toLowerCase() < aiTools[i].name.toLowerCase()) {
      insertIndex = i;
      break;
    }
  }

  // Insert at the right position
  aiTools.splice(insertIndex, 0, newTool);
}

// Reset the add tool form
function resetAddToolForm() {
  document.getElementById("toolName").value = "";
  document.getElementById("toolDescription").value = "";
  document.getElementById("toolCategory").selectedIndex = 0;
  document.getElementById("toolLink").value = "";
  document.getElementById("toolTags").value = "";
}

// Generate a unique ID for new tools
function generateUniqueId() {
  return aiTools.length > 0
    ? Math.max(...aiTools.map((tool) => tool.id)) + 1
    : 1;
}

// Get display name for a category
function getCategoryDisplayName(category) {
  const categoryMap = {
    image: "Image Generation",
    video: "Video Generation",
    text: "Text Generation",
    code: "Code Generation",
  };

  return categoryMap[category] || capitalizeFirstLetter(category);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
