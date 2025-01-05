const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("search-results");
const resetButton = document.getElementById("reset-btn");

async function fetchData() {
    try {
        const response = await fetch('./travel_recommendation_api.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

searchButton.addEventListener('click', async () => {
    const query = searchInput.value.toLowerCase();
    const apiData = await fetchData();

    if (!apiData) {
        resultsContainer.innerHTML = "<p>Failed to load data.</p>";
        return;
    }

    const filteredData = filterData(apiData, query);
    displayResults(filteredData);
});

resetButton.addEventListener('click', () => {
    searchInput.value = "";
    resultsContainer.innerHTML = "";
});

function filterData(apiData, query) {
    let results = [];

    // Check "countries" category
    if (query === "country" || query === "countries") {
        apiData.countries.forEach(country => {
            country.cities.forEach(city => {
                results.push({
                    name: city.name,
                    img: city.imageUrl,
                    description: city.description,
                });
            });
        });
    }

    // Check "temples" category
    if (query === "temple" || query === "temples") {
        results.push(
            ...apiData.temples.map(temple => ({
                name: temple.name,
                img: temple.imageUrl,
                description: temple.description,
            }))
        );
    }

    // Check "beaches" category
    if (query === "beach" || query === "beaches") {
        results.push(
            ...apiData.beaches.map(beach => ({
                name: beach.name,
                img: beach.imageUrl,
                description: beach.description,
            }))
        );
    }

    return results;
}


function displayResults(data) {
    resultsContainer.innerHTML = "";

    if (data.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
        return;
    }

    data.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("result-item");
        div.innerHTML = `
            <h3>${item.name}</h3>
            <img src="${item.img}" alt="${item.name}" style="width: 100%; max-width: 300px;">
            <p>${item.description}</p>
        `;
        resultsContainer.appendChild(div);
    });
}

